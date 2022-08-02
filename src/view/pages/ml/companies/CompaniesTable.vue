<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <!--<div class="card-toolbar">
        <a
          href="#"
          class="btn btn-primary font-weight-bolder font-size-sm"
          @click="createCompanyClicked"
        >
          <i class="menu-icon flaticon2-plus" style="font-size: 1em"></i>Ny förening
        </a>
      </div>-->
    </div>
    <!--end::Header-->

    <!--begin::Body-->
      <b-card style="overflow-x: scroll">
        <div class='d-md-flex justify-content-between'>
          <div class='w-100 mr-md-10 mb-md-0 mb-4'>
            <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Sök förening"
            ></b-form-input>
          </div>
          <div class='d-flex justify-content-end align-items-center'>
            <v-select
              class='mr-sm-2'
              style='width: 200px'
              v-model="perPage"
              :options="[25, 50, 100]"
              :clearable="false"
              :searchable="false"
            ></v-select>
            <b-pagination
              class="ml-auto mb-0"
              v-model="currentPage"
              :total-rows="companies.length"
              :per-page="perPage"
              aria-controls="search-result-table"
            ></b-pagination>
          </div>
        </div>

        <b-table
          id="search-result-table"
          class="mt-3 cursor mh-100"
          :filter="filter"
          :items="companies"
          :fields="showFields"
          :per-page="perPage"
          :current-page="currentPage"
          head-variant="light"
          sticky-header
        >
          <template #cell(actions) ="data">
            <div class='d-flex justify-content-end'>
              <a
                href="#"
                class="btn btn-icon btn-light btn-sm mx-3"
                @click="selectCompanyClicked(data.item.id)"
              >
                <span class="svg-icon svg-icon-md svg-icon-primary">
                  <!--begin::Svg Icon-->
                  <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                  <!--end::Svg Icon-->
                </span>
              </a>
              <a href="#" class="btn btn-icon btn-light btn-sm" @click="deleteCompanyClicked(data.item.id)">
                <span class="svg-icon svg-icon-md svg-icon-primary">
                  <!--begin::Svg Icon-->
                  <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                  <!--end::Svg Icon-->
                </span>
              </a>
            </div>
          </template>
        </b-table>
      </b-card>

    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <!-- <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th style="min-width: 110px">Förening</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in companies">
              <CompaniesTableRow
                v-bind:key="i"
                :company="item"
                @selectCompanyClicked="selectCompanyClicked"
                @deleteCompanyClicked="deleteCompanyClicked"
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
import CompaniesTableRow from '@/view/pages/ml/companies/CompaniesTableRow.vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { mapGetters } from 'vuex';

export default {
  name: 'companies-table',
  components: {
    CompaniesTableRow,
    vSelect
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'companies'])
  },
  watch: {
    companies(newValue, oldvalue) {
      console.log('companies changed');
    }
  },
  mounted() {

  },
  methods: {
    createCompanyClicked() {},
    selectCompanyClicked(company_id) {
      this.$emit('selectCompanyClicked', company_id);
    },
    deleteCompanyClicked(company_id) {
      this.$emit('deleteCompanyClicked', company_id);
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  },
  data() {
    return {
      list: [],
      perPage: 20,
      currentPage: 1,
      options: [20, 50, 100],
      showFields: [
        { key: 'name', label: 'Förening', show: true, sortable: true, thClass: 'pl-7', tdClass: 'pl-7'},
        { key: 'actions', label: '', show: true, sortable: false, thClass:'w-100'}
      ],
      filter: ''
    };
  }
};
</script>
