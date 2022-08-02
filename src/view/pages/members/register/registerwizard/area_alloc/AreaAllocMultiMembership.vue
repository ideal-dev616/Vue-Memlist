<template>
  <div>
    <b-card v-if="!success && !failure">
      <div class="d-flex justify-content-center mb-3">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </b-card>
    
    <!-- checkboxar -->

    <!-- when member enters his region, we suggest the region based on area alloc BUT we show all other companies as well -->

    <!-- SELECTED COMPANY BY REGION, will display its SUBCOMPANIES, so that member MUST select subcompany to the selected REGION company -->

    <!-- ALSO show studentföreningar -->

    <!-- Aktivera flerstegsmedlemskap -->

    <!-- region company selection -->
    <b-card v-if="success">
      <b-alert show variant="secondary">Välj regionsförening</b-alert>
      <div class="checkbox-list">
        <template v-for="(company, i) of regions">
          <div :key="i">
            <div class="d-flex align-items-center mb-6">
              <label class="radio radio-outline radio-success mr-5">
                <input type="radio" v-model="selectedRegionCompanyId" name="selectedRegionCompany" :value="company.company_id" checked="checked">
                <span class='mr-2'></span>{{ company.name }}
              </label>
            </div>
          </div>
        </template>
      </div>
    </b-card>

    <!-- commune/local company selection -->
    <b-card v-if="success && selectedRegionCompanyId !== null" class="mt-4">
      <b-alert show variant="secondary">Välj lokalförening</b-alert>
      
      <div class="checkbox-list">
        <template v-for="(company, i) of locals[selectedRegionCompanyId]">
          <div :key="i">
            <div class="d-flex align-items-center mb-6">
              <label class="radio radio-outline radio-success mr-5">
                <input type="radio" v-model="selectedCommuneCompanyId" name="selectedCommuneCompany" :value="company.company_id" checked="checked">
                <span class='mr-2'></span>{{ company.name }}
              </label>
            </div>  
          </div>
        </template>
      </div>
    </b-card>

    <!-- extra companies -->
    <b-card v-if="success && extras.length > 0" class="mt-4">
      <b-alert show variant="secondary">Du kan även gå med i dessa föreningar</b-alert>
      <div class="checkbox-list">
        <template v-for="(company, i) of extras">
          <div :key="i">
            <div class="d-flex align-items-center">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input
                type="checkbox"
                v-model="extraCompanyIds"
                :value="company.company_id"
                />
            <span></span>
            </label>
            <span class="ml-3 cursor-pointer mb-4">{{ company.name }}</span>
            </div>
            
          </div>
        </template>
      </div>
    </b-card>

  </div>
</template>


<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';

export default {
  name: 'area-alloc-multi-membership-page',
  props: ['page', 'region_code', 'commune_code', 'company_id', 'registration'],
  components: {},
  data() {
    return {
      extras: [],
      regions: [],
      locals: {},

      company_ids: [], // <- the selected companies

      selectedRegionCompanyId: null,

      selectedCommuneCompanyId: null,

      extraCompanyIds: [],

      success: false,
      failure: false,

      cooldown: false
    };
  },
  mounted() {
    console.log('AreaAllocMultiMembership.vue mounted');
    this.loadCompanies(this.company_id, this.region_code, this.commune_code);
  },
  watch: {
    /*region_code(newValue, oldValue) {
      this.loadAllocLater();
    },*/

    commune_code(newValue, oldValue) {
      this.loadAllocLater();
    },

    selectedCommuneCompanyId(newValue, oldValue) {
      this.setCompanies();
    },
    selectedRegionCompanyId(newValue, oldValue) {
      this.setCompanies();
    },
    extraCompanyIds(newValue, oldValue) {
      this.setCompanies();
    }
  },
  methods: {
    loadAllocLater() {
      if (this.cooldown) {
        return;
      }

      this.success = false;

      var that = this;
      that.cooldown = true;

      setTimeout(function(){
        that.cooldown = false;

        that.loadCompanies(that.company_id, that.region_code, that.commune_code);
      }, 1000);
    },

    getData() {
      return this.company_ids;
    },

    setCompanies() {
      this.company_ids = [];

      if (this.selectedRegionCompanyId !== null) {
        this.company_ids.push(this.selectedRegionCompanyId);
      }

      if (this.selectedCommuneCompanyId !== null) {
        this.company_ids.push(this.selectedCommuneCompanyId);
      }

      for (const cid of this.extraCompanyIds) {
        this.company_ids.push(cid);
      }

      this.validate();

      this.$emit('setCompanyIds', this.company_ids);

    },

    loadCompanies(company_id, region_code, commune_code) {
      this.success = false;
      this.failure = false;

      axios
        .get(`/company/register_multi?company_id=${company_id}&region_code=${region_code}&commune_code=${commune_code}`)
        .then(res => {
          
          this.extras = res.data.companies.extras;
          this.regions = res.data.companies.regions;
          this.locals = res.data.companies.locals;

          if (res.data.companies.matched_region_company !== null) {
            //this.company_ids.push(res.data.companies.matched_region_company.company_id);
            this.selectedRegionCompanyId = res.data.companies.matched_region_company.company_id;
          }

          if (res.data.companies.matched_commune_company !== null) {
            //this.company_ids.push(res.data.companies.matched_commune_company.company_id);

            this.selectedCommuneCompanyId = res.data.companies.matched_commune_company.company_id;
          }
          
          this.success = true;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta lista på föreningar');
          this.failure = true;
        });
    },
    

    validate() {

      this.$emit('isValid', this.selectedRegionCompanyId !== null && this.selectedCommuneCompanyId !== null && this.company_ids.length > 0 , this.page.id);
    },

    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
