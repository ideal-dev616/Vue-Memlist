<template>
  <div class="px-5" id="page-companies">
    <h5 class="mb-6 ml-2">Alla föreningar i systemet</h5>

    <Confirm
      title="Bekräfta borttagning"
      message="Är du säker på att du vill ta bort föreningen?"
      ref="confirmModal"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />

    <CompaniesTable
      @createCompanyClicked="createCompanyClicked"
      @selectCompanyClicked="selectCompanyClicked"
      @deleteCompanyClicked="deleteCompanyClicked"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-company-container"
      ref="edit-company"
      id="edit-company"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <Basic 
          :company_id="company_id"
          :company="company"
          :regions="regions"
          :creating="creating"
        />
      </div>
    </b-card>
  </div>
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
import CompaniesTable from '@/view/pages/ml/companies/CompaniesTable.vue';
import Basic from '@/view/pages/ml/settings/Basic.vue';
import Confirm from '@/view/components/Confirm.vue';
import { DELETE_COMPANY } from '@/core/services/store/common.module';

export default {
  name: 'companies',
  components: {
    CompaniesTable,
    Basic,
    Confirm
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
  },
  mounted() {
    this.loadRegions();
  },
  data() {
    return {
      form: {
        company_id:      '',
        name: 	        '',
      },
      company_id: null,
      company: {},
      regions: {},
      creating: false,
      editing: false,
      regionOptions: []
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      
    }
  },
  methods: {
    createCompanyClicked() {},
    selectCompanyClicked(company_id) {
      this.company_id = company_id;
      
      axios 
        .get(`/company?company_id=${this.company_id}`)
        .then(res => {
          this.company = res.data.company;
          this.editing = true;

          this.scrollToEditCompany();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta förening');
        });
    },
    deleteCompanyClicked(company_id) {
      axios 
        .delete(`/company?company_id=${company_id}`)
        .then(res => {
          this.$store.dispatch(DELETE_COMPANY, company_id);

          this.toastr('success', 'OK', 'Föreningen togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte radera förening');
        });
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    scrollToEditCompany() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('scroll-to-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    },
    cancelDelete() {

    },
    confirmDelete() {

    },
    loadRegions() {
      axios
        .get('/location/regions')
        .then(res => {
          this.regions = res.data.regions;
          this.regionOptions = [];

          for (var k in this.regions) {
            this.regionOptions.push({ value: k, text: this.regions[k].region });
          }

          this.regionOptions.sort(function (a, b) {
            if (a.text < b.text) {
              return -1;
            }
            if (a.text > b.text) {
              return 1;
            }
            return 0;
          });
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta regioner');
        });
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
  }
};
</script>
