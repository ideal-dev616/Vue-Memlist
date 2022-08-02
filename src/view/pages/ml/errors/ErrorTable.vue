<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-body border-0 py-5 d-flex justify-content-end">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">&nbsp;</span>
      </h3>
      <div class="card-toolbar">
        <div class="d-flex align-items-center">
          <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
            <input type="checkbox" name="" v-model="show_subcompany" @click="show_subcompany = !show_subcompany" />
            <span></span>
          </label>
          <span class="ml-3 cursor-pointer">Visa Underföreningar</span>
        </div>
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 table-responsive">
      <b-table
        id="stickprov-table"
        :fields="headers"
        :items="list"
        head-variant="light"
        class='w-100 mh-100'
        sticky-header
      >
        <template #cell(client)='row'>
          {{ row.item.counts.client }}
        </template>
        <template #cell(user)='row'>
          {{ row.item.counts.user }}
        </template>
        <template #cell(company)='row'>
          {{ row.item.counts.company }}
        </template>
        <template #cell(action)="row">
          <div class='justify-content-end d-flex'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="selectErrorClicked(row.item.id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
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
              <th style="min-width: 40px; width:60%" class="pl-7">
                <span class="text-dark-75">Namn</span>
              </th>
              <th>Medlemsfel</th>
              <th>Användarfel</th>
              <th>Föreningsfel</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in items">
              <ErrorTableRow
                v-bind:key="i"
                v-if="item.show"
                :error="item"
                :currentCompanyId="currentCompanyId"
                @selectErrorClicked="selectErrorClicked"
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
import ErrorTableRow from '@/view/pages/ml/errors/ErrorTableRow.vue';

export default {
  name: 'errors-table',
  props: ['items', 'currentCompanyId'],
  components: {
    ErrorTableRow
  },
  watch: {
    show_subcompany(newcheck, oldcheck) {
      this.$emit('showSubcompaniesToggle', newcheck);
      this.list = this.items.filter(item => item.show);
    },
    items(newValue, oldValue) {
      this.list = newValue.filter(item => item.show);
    }
  },
  methods: {
    selectErrorClicked(company_id) {
      this.$emit('selectErrorClicked', company_id);
    },
    filterTable(row) {
      console.log(row);
      return row.show;
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      show_subcompany: false,
      headers: [
        {
          key: 'name',
          label: 'Namn',
          sortable: true,
          thClass: 'pl-7',
          tdClass: 'pl-7'
        },
        {
          key: 'client',
          label: 'Medlemsfel',
          sortable: true,
          thClass: 'w-165px',
          tdClass: 'w-165px',
        },
        {
          key: 'user',
          label: 'Användarfel',
          sortable: true,
          thClass: 'w-110px',
          tdClass: 'w-110px',
        },
        {
          key: 'company',
          label: 'Föreningsfel',
          sortable: true,
          thClass: 'w-110px',
        },
        {
          key: 'action',
          label: '',
          thClass: 'w-110px',
        },
      ],
      list: []
    };
  },
};
</script>
