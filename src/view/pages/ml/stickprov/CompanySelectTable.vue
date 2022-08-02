<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">Föreningar att ingå i stickprov</span>
      </h3>
      <div class="card-toolbar">

      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th class="">
                <div class="d-flex align-items-center">
                    <label
                        class="checkbox checkbox-lg checkbox-single"
                        >
                        <input
                            type="checkbox"
                            v-model="allSelected"
                            @click="allSelected = !allSelected"
                        />
                        <span></span>
                    </label>
                    <span class="ml-3 cursor-pointer"></span>
                </div>
              </th>
              <th>Förening</th>
              <th>Medlemmar</th>
            </tr>
          </thead>
          <tbody v-if="!onlySubCompanies">
            <template v-for="(item, i) in companies">
              <CompanySelectTableRow
                v-bind:key="i"
                :companyselect="item"
                :currentCompanyId="currentCompanyId"
                :available="isEnable(item)"
                :allSelected="allSelected"
                @companySelected="companySelected"
                @toastr="toastr"
              />
            </template>
          </tbody>

          <tbody v-if="onlySubCompanies">
            <template v-for="(item, i) in subCompanies">
              <CompanySelectTableRow
                v-bind:key="i"
                :companyselect="item"
                :currentCompanyId="currentCompanyId"
                :available="isEnable(item)"
                :allSelected="allSelected"
                @companySelected="companySelected"
                @toastr="toastr"
              />
            </template>
          </tbody>
        </table>
      </div>
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
import { mapGetters } from 'vuex';
import CompanySelectTableRow from '@/view/pages/ml/stickprov/CompanySelectTableRow.vue';

export default {
  name: 'companyselects-table',
  components: {
    CompanySelectTableRow
  },
  props:{
    filterIds : { type: Array, default: [] },
    onlySubCompanies: {type: Boolean, default: false},
    },
  computed: {
    ...mapGetters(['companies', 'currentCompanyId'])
  },
  mounted() {
    this.loadCompanies();
  },
  watch: {
    currentCompanyId(newValue, oldValue) {
      if (this.onlySubCompanies)
        this.loadCompanies();
    },
    filterIds(newValue, oldValue) {
    }
  },
  methods: {
    companySelected(company_id, selected) {
      if (selected) {
        this.selectedCompanies.push(company_id);
      }
      else {
        this.selectedCompanies = this.selectedCompanies.filter(item => item !== company_id);
      }

      this.$emit('onSelectionChanged', this.selectedCompanies);
    },
    loadCompanies() {
      axios
        .get(`/company/publiclist?company_id=${this.currentCompanyId}`)
        .then(res => {
          console.log(res);
          this.subCompanies = res.data.companies;
        })
        .catch(err => {
          console.log(err);
        });
    },
    isEnable(item) {
      return this.filterIds.find(value => item.id == value.id) == undefined;
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      allSelected: false,
      show_history: false,
      selectedCompanies: [],
      subCompanies: [],
    };
  }
};
</script>
