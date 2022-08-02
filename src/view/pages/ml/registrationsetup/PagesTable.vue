<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">&nbsp;</span>
      </h3>
      <div class="card-toolbar">
          <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createPageClicked"
            ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny Sida</a>
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 table-responsive">
      <b-table
        id="template-table"
        :fields="headers"
        :items="items"
        head-variant="light"
        class="mh-100"
        sticky-header
      >
        <template #cell(type)="row">
          <span class="d-block font-size-lg">{{ getTypeString(row.item.type) }}</span>
        </template>
        <template #cell(id)="row">
          <div class='justify-content-end d-flex'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mr-3"
              @click="moveUpClicked(row.item.id)"
            >
              <fa-icon :icon="['fas', 'arrow-up']" size="lg" />
            </a>

            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mr-3"
              @click="moveDownClicked(row.item.id)"
            >
              <fa-icon :icon="['fas', 'arrow-down']" size="lg" />
            </a>

            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mr-3"
              @click="selectPageClicked(row.item.id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mr-3"
              @click="deletePageClicked(row.item.id)"
              v-if='row.item.type != "confirm"'
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>

            <a v-if="row.item.type === 'confirm'" href="#" class="btn btn-icon btn-light btn-sm mr-3" >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <!--end::Svg Icon-->
              </span>
            </a>
          </div>
        </template>
      </b-table>
    </div>

    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <!-- <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th>Namn</th>
              <th>Typ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in items">
              <PagesTableRow
                v-bind:key="i"
                :page="item"
                :types="types"
                :currentCompanyId="currentCompanyId"
                @moveUpClicked="moveUpClicked"
                @moveDownClicked="moveDownClicked"
                @selectPageClicked="selectPageClicked"
                @deletePageClicked="deletePageClicked"
                @toastr="toastr"
              />
            </template>
          </tbody>
        </table>
      </div> -->
      <!--end::Table-->
    </div>
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
import PagesTableRow from '@/view/pages/ml/registrationsetup/PagesTableRow.vue';

export default {
  name: 'pages-table',
  props: ['items', 'currentCompanyId', 'types'],
  components: {
    PagesTableRow
  },
  watch: {
    show_history(newcheck, oldcheck) {
      this.$emit('showHistoryToggled', newcheck);
    }
  },
  methods: {
    createPageClicked() {
      this.$emit('createPageClicked');
    },
    selectPageClicked(id) {
      this.$emit('selectPageClicked', id);
    },
    deletePageClicked(id) {
      this.$emit('deletePageClicked', id);
    },
    moveUpClicked(id) {
      this.$emit('moveUpClicked', id);
    },
    moveDownClicked(id) {
      this.$emit('moveDownClicked', id);
    },
    getTypeString(type) {
      console.log(type, ":Type");
      return this.types[type];
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      show_history: false,
      headers: [
        {
          key: 'name',
          label: 'Namn',
          sortable: true,
          thClass: 'pl-7',
          tdClass: 'pl-7'
        },
        {
          key: 'type',
          label: 'Typ',
          thClass: 'w-165px',
          tdClass: 'w-165px',
          sortable: true
        },
        {
          key: 'id',
          label: '',
          thClass: 'w-110px text-right pr-6 ',
        },
      ],
      list: []
    };
  }
};
</script>
