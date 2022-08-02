<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <!--  begin::checkbox  -->
    <!--  end::checkbox  -->

    <div class="card-header border-0 py-5 ml-2">
      <h3 class="card-title align-items-start flex-column">
        <!-- <span class="card-label font-weight-bolder text-dark">Alla Mallar</span>
        <span class="text-muted mt-3 font-weight-bold font-size-sm">Nedanstående mallar används inom föreningen</span> -->
      </h3>
      <div class='d-flex justify-content-end'>
        <div v-if="isTalongAdmin" class="card-header border-0 py-5">
          <div class="d-flex align-items-center">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
              <input
                type="checkbox"
                v-model="showAll"
                name=""
              />
              <span></span>
            </label>
            <span class="ml-3 cursor-pointer font-size-lg font-weight-bolder">Visa alla</span>
          </div>
        </div>
        <div class="card-toolbar">

          <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createTemplateClicked"
            ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny Mall</a
          >
        </div>
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-header border-0 py-5 m-1">
      <div>
        <b-select v-model="perPage" :options="options"></b-select>
      </div>
      <b-pagination
        class="ml-auto mb-0"
        v-model="currentPage"
        :total-rows="list.length"
        :per-page="perPage"
        aria-controls="template-table"
        first-number
        last-number
      ></b-pagination>
    </div>

    <div class="card-body pt-0">
      <b-table
        id="template-table"
        :fields="headers"
        :items="list"
        :per-page="perPage"
        :current-page="currentPage"
        head-variant="light"
        class="mh-100"
        sticky-header
      >
        <template #cell(is_email_stickprov)="row">
          <div class="d-flex align-items-center">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
              <input
                type="checkbox"
                name=""
                :checked="Boolean(row.item.is_email_stickprov)"
                disabled
              />
              <span></span>
            </label>
            <span class="ml-3 cursor-pointer"></span>
          </div>
        </template>
        <template #cell(is_sms_stickprov)="row">
          <div class="d-flex align-items-center">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
              <input
                type="checkbox"
                name=""
                :checked="Boolean(row.item.is_sms_stickprov)"
                disabled
              />
              <span></span>
            </label>
            <span class="ml-3 cursor-pointer"></span>
          </div>
        </template>
        <template #cell(is_system)="row">
          <div class="d-flex align-items-center" v-if="isTalongAdmin">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
              <input
                type="checkbox"
                name=""
                v-model='row.item.is_system'
                @change.prevent='changeSystem(row.item)'
              />
              <span></span>
            </label>
            <span class="ml-3 cursor-pointer"></span>
          </div>
        </template>
        <template #cell(template_id)="row">
          <div class='justify-content-end d-flex'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm"
              @click.prevent="copyTemplateClicked(row.item)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <i class="far fa-copy" style="color:#3699FF"></i>
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="selectTemplateClicked(row.item.template_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
              </span>
            </a>
            <a href="#" class="btn btn-icon btn-light btn-sm" @click="deleteTemplateClicked(row.item.template_id)">
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
              </span>
            </a>
          </div>
        </template>
      </b-table>
    </div>

      <!--end::Table-->
    <!--end::Body-->
  </div>
  <!--end::Advance Table Widget 9-->
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import TemplateTableRow from "@/view/pages/ml/templates/TemplateTableRow.vue";

export default {
  name: "templates-table",
  props: ["items", "titles", "currentCompanyId"],
  components: {
    TemplateTableRow,
    vSelect,
  },
  watch: {
    showAll() {
      this.showList();
    },
    items() {
      this.showList();
    },
  },
  computed:{
    ...mapGetters(['isTalongAdmin']),
  },
  mounted() {
    this.showList();
    if (!this.isTalongAdmin)
      this.headers.splice(5, 1);
  },
  methods: {
    showList() {
      let lists = this.showAll ? this.items : this.items.filter(item => {
        return item.company_id === this.currentCompanyId;
      });
      this.list = lists;
    },
    createTemplateClicked() {
      this.$emit('createTemplateClicked');
    },
    copyTemplateClicked(template) {
      const data = template;
      this.$emit('copyTemplateClicked', data, this.showAll);
    },
    selectTemplateClicked(template_id) {
      this.$emit('selectTemplateClicked', template_id);
    },
    deleteTemplateClicked(template_id) {
      this.$emit('deleteTemplateClicked', template_id);
    },
    changeSystem(template) {
      this.$emit('changeSystem', template);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    getTitle(title_id) {
      this.titles.forEach(t => {

        if (t.id == title_id) {
          return t.name;
        }
      });

      return "";
    },
  },
  data() {
    return {
      showAll: false,
      currentPage: 1,
      perPage: 25,
      options: [
        25, 50, 100
      ],
      headers: [
        {
          key: 'name',
          label: 'Namn',
          sortable: true,
          thClass: 'pl-7 align-middle',
          tdClass: 'pl-7 align-middle'
        },
        {
          key: 'created_at',
          label: 'Skapat',
          thClass: 'w-165px align-middle',
          tdClass: 'w-165px align-middle',
          sortable: true
        },
        {
          key: 'updated_at',
          label: 'Uppdaterat',
          thClass: 'w-165px align-middle',
          tdClass: 'w-165px align-middle',
          sortable: true
        },
        {
          key: 'is_email_stickprov',
          label: 'E-post',
          thClass: 'w-80px align-middle',
          tdClass: 'align-middle',
        },
        {
          key: 'is_sms_stickprov',
          label: 'SMS',
          thClass: 'w-50px align-middle',
          tdClass: 'align-middle',
        },
        {
          key: 'is_system',
          label: 'System',
          thClass: 'w-50px align-middle',
          tdClass: 'pl-8 align-middle'
        },
        {
          key: 'template_id',
          label: 'Hantera',
          thClass: 'w-120px text-right pr-12 align-middle',
        },
      ],
      list: []
    };
  }
};
</script>
