<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">&nbsp;</span>
      </h3>
      <div class="card-toolbar">

            <div class="d-flex align-items-center mr-12">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
              <input type="checkbox" name="" v-model="show_history" @click="show_history = !show_history" />
              <span></span>
            </label>
            <span class="ml-3 cursor-pointer">Visa Tidigare Stickprover</span>
          </div>

          <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createStickprovClicked"
            ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Nytt Stickprov</a>

      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <!--begin::Table-->

    <div class="card-body pt-0">
      <b-table
        id="stickprov-table"
        :fields="headers"
        :items="items"
        head-variant="light"
        class='w-100 mh-100'
        sticky-header
      >
        <template #cell(stickprov_id)="row">
          <div class='justify-content-end d-flex'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="startEvent(row.item.stickprov_id, true)"
              :hidden="!Boolean(row.item.is_stopped)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <i class="fas fa-play" style="color:#3699FF"></i>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="startEvent(row.item.stickprov_id, false)"
              :hidden="Boolean(row.item.is_stopped)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <i class="fas fa-stop" style="color:#e63113"></i>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mr-3"
              @click="selectStickprovClicked(row.item.stickprov_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm"
              @click="deleteStickprovClicked(row.item.stickprov_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
          </div>
        </template>
      </b-table>
      <!--end::Table-->
    </div>

    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <!-- <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-75">Förening</span>
              </th>
              <th>Deadline</th>
              <th>Medlemmar</th>
              <th>Svar</th>
              <th>Ja</th>
              <th>Nej</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in items">
              <StickprovTableRow
                v-bind:key="i"
                :stickprov="item"
                :currentCompanyId="currentCompanyId"
                @selectStickprovClicked="selectStickprovClicked"
                @deleteStickprovClicked="deleteStickprovClicked"
                @startEvent="startEvent"
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
import StickprovTableRow from '@/view/pages/ml/stickprov/StickprovTableRow.vue';

export default {
  name: 'stickprovs-table',
  props: ['items', 'currentCompanyId'],
  components: {
    StickprovTableRow
  },
  watch: {
    show_history(newcheck, oldcheck) {
      this.$emit('showHistoryToggled', newcheck);
    }
  },
  methods: {
    createStickprovClicked() {
      this.$emit('createStickprovClicked');
    },
    selectStickprovClicked(stickprov_id) {
      this.$emit('selectStickprovClicked', stickprov_id);
    },
    deleteStickprovClicked(stickprov_id) {
      this.$emit('deleteStickprovClicked', stickprov_id);
    },
    startEvent(stickprov_id, status) {
      this.$emit("startEvent", stickprov_id, status);
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
          key: 'company_name',
          label: 'Förening',
          sortable: true,
          thClass: 'pl-7',
          tdClass: 'pl-7'
        },
        {
          key: 'deadline',
          label: 'Deadline',
          thClass: 'w-110px',
          tdClass: 'w-110px',
          sortable: true
        },
        {
          key: 'num_clients',
          label: 'Medlemmar',
          thClass: 'w-120px',
          sortable: true
        },
        {
          key: 'num_answers',
          label: 'Svar',
          thClass: 'w-50px'
        },
        {
          key: 'num_confirm',
          label: 'Ja',
          thClass: 'w-50px'
        },
        {
          key: 'num_reject',
          label: 'Nej',
          thClass: 'w-45px',
        },
        {
          key: 'stickprov_id',
          label: '',
          thClass: 'w-140px pl-0',
          tdClass: 'w-140px pl-0',
        },
      ],
      list: []
    };
  }
};
</script>
