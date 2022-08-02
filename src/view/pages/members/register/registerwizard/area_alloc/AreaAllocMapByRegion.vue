<template>
  <div>
    <!-- when map_by_region is true -->

    <!-- radiobox on top with suggestion -->

    <b-card v-if="!success && !failure">
      <div class="d-flex justify-content-center mb-3">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </b-card>

    <b-card v-if="success">
    
    <b-row>
      <b-col>
        <h5 class="mb-4">Följande förening har valts baserat på din adress</h5>
        
        <label class="radio radio-outline radio-success mr-5">
          <input type="radio" v-model="selectedCompanyId" name="selectedCompany" :value="selectedOption.company_id" checked="checked">
          <span class='mr-2'></span>{{ selectedOption.name }}
        </label>

      </b-col>
    </b-row>

    <!-- ALL Other companies, as options to choose from -->

    <b-row class="mt-8">
      <b-col>
        
        <h5 class="mb-4">Vill du gå med i en annan förening istället?</h5>
        <div class="radio-list">
          <template v-for="(option, i) of otherOptions">
        
            <label :key="i" class="radio radio-outline radio-success mr-5">
              <input type="radio" v-model="selectedCompanyId" :value="option.company_id" name="selectedCompany" checked="checked">
              <span class='mr-2'></span>{{ option.name }}
            </label>
          </template>
        </div>

      </b-col>
    </b-row>

    </b-card>

    <b-card v-if="failure">
    
      <b-row>
        <b-col>
        
        <h5 class="mb-4">Välj förening i listan nedan</h5>
        <div class="radio-list">
          <template v-for="(option, i) of otherOptions">
        
            <label :key="i" class="radio radio-outline radio-success mr-5">
              <input type="radio" v-model="selectedCompanyId" :value="option.company_id" name="selectedCompany" checked="checked">
              <span class='mr-2'></span>{{ option.name }}
            </label>
          </template>
        </div>

      </b-col>
    </b-row>
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
  name: 'arealloc-page',
  props: ['page', 'region_code', 'commune_code', 'company_id', 'registration'],
  components: {},
  data() {
    return {
      selectedOption: { company_id: '', name: '' },

      otherOptions: [],

      selectedCompanyId: '',

      success: false,
      failure: false
    };
  },
  mounted() {
    console.log('AreaAllocMapByRegion.vue mounted');
    this.loadCompanies(this.company_id);
  },
  watch: {
    selectedCompanyId(newValue, oldValue) {
      this.$emit('setCompanyIds', [ newValue ]);

      this.validate();
    },

    /*region_code(newValue, oldValue) {
      this.runMatchAll();
    },*/

    commune_code(newValue, oldValue) {
      this.runMatchAll();
    }
  },
  methods: {
    getData() {
      return this.form;
    },

    loadData() {
      this.loadCompanies(this.company_id);
    },

    runMatchAll() {
      var that = this;
      this.success = false;
      this.failure = false;

      console.log('running matchAll');

      this.loadAreaAllocMatchAll(this.company_id, this.region_code, this.commune_code, function(ok, company_ids) {
        if (!ok) {
            that.failure = true;
            that.otherOptions = that.companies;
            return;
        }

        if (company_ids.length === 0) {
            console.log('unable to match company');
            that.otherOptions = that.companies;
            that.failure = true;
            return;
        }

        const found = that.companies.filter(item => item.company_id === company_ids[0]);

        that.selectedOption = { company_id: found[0].company_id, name: found[0].name };
        that.selectedCompanyId = that.selectedOption.company_id;

        that.otherOptions = that.companies.filter(item => item.company_id !== company_ids[0]);

        that.failure = false;
        that.success = true;
        that.validate();

      });
    },

    loadCompanies(company_id) {
      axios
        .get(`/company/public?company_id=${company_id}`)
        .then(res => {
          this.companies = res.data.company.companies;

          this.companies = this.companies.filter(item => item.allow_reg);
          this.runMatchAll();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta lista på föreningar');
        });
    },

    loadAreaAllocMatchAll(company_id, region_code, commune_code, callback) {
      axios 
        .get(`/area_alloc/matchall?company_id=${company_id}&region_code=${region_code}&commune_code=${commune_code}`)
        .then(res => {
          callback(res.status === 200, res.data.company_ids);
        })
        .catch(err => {
          console.error(err);
          callback(false, []);
          this.toastr('danger', 'Server Fel', 'Kunde inte mappa förening för region');
        });
    },

    validate() {
      console.log('validating AreaAllocMapByRegion: ' + this.selectedCompanyId + ' page id: ' + this.page.id)

      this.$emit('isValid', this.selectedCompanyId !== '' && this.selectedCompanyId !== undefined && this.selectedCompanyId !== null, this.page.id);
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
