<template>
  <div class="px-5" id="page-errors">
    <h5 class="mb-6 ml-2">Felrapportering</h5>

    <!--<Diagnose class="mb-8" />-->

    <b-card class="mb-4">
      <h5>Validera databasen</h5>
      <p>Här kan du validera er databas ifall ni har gjort uppdateringar på valideringsregler. Detta gör att alla medlemmar beräknas om utifrån valideringsreglerna.</p>
      <b-button v-if="!loading" class="mt-5" variant="primary" size="sm" @click="validateMembers">Validera</b-button>

      <div v-if="loading" class="d-flex justify-content-center mt-10 mb-10">
        <b-spinner
          class="mx-auto text-center align-center"
          type="grow"
          label="Loading..."
        ></b-spinner>
      </div>

    </b-card>

    <ErrorTable
      :items="errorCompanies"
      @selectErrorClicked="selectError"
      @showSubcompaniesToggle="showSubcompaniesToggle"
      @toastr="toastr"
    />

    <ErrorDetailTable v-if="show_details" :items="selected" @toastr="toastr" />
  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.diagnose {
    padding: 25px;
    display: flex;
    flex: 1;
    span {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import Diagnose from '@/view/pages/ml/diagnose/Diagnose.vue';
import ErrorTable from '@/view/pages/ml/errors/ErrorTable.vue';
import ErrorDetailTable from '@/view/pages/ml/errors/ErrorDetailTable.vue';

export default {
  name: 'errors',
  components: {
    ErrorTable,
    ErrorDetailTable,
    Diagnose
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'companies'])
  },
  mounted() {

    this.loadErrors();
  },
  data() {
    return {
      loading: false,
      errorCompanies: [],
      intervalId: null,
      disabledDiagnose: false,
      selected: [],
      show_details: false,
      show_subcompany: false,
      creating: false,
      editing: false,
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadErrors();
      }
    }
  },
  methods: {
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.loadErrors();
    },
    validateMembers() {
      this.loading = true;

      axios 
        .post('/client/validate', { company_id: this.currentCompanyId })
        .then(res => {
          window.location.reload();
          //this.loadErrors();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Gick inte att validera medlemmarna');
        });
    },
    loadErrors() {
      axios
        .get(
          `/company/errors?period_id=${this.currentPeriodId}&company_id=${this.currentCompanyId}`
        )
        .then(res => {
          this.errorCompanies = res.data.companies;

          for (var i = 0; i < this.errorCompanies.length; ++i) {
            var counts = this.countType(this.errorCompanies[i].entities);

            if (this.errorCompanies[i].name.length < 1) {
              this.errorCompanies[i].name = '(Namn ej satt)';
            }

            this.errorCompanies[i].counts = counts;
            this.errorCompanies[i].show =
              this.errorCompanies[i].id === this.currentCompanyId || this.show_subcompany ? true : false;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta lista över fel');
        });
    },
    countType(entites) {
      var types = { user: 0, company: 0, client: 0 };

      for (var i = 0; i < entites.length; ++i) {
        types[entites[i].type]++;
      }

      return types;
    },
    showSubcompaniesToggle(show) {
      this.show_subcompany = show;

      for (var i = 0; i < this.errorCompanies.length; ++i) {
        this.errorCompanies[i].show =
          this.errorCompanies[i].id === this.currentCompanyId || show ? true : false;
      }
    },
    selectError(company_id) {
      for (var i = 0; i < this.errorCompanies.length; ++i) {
        if (this.errorCompanies[i].id === company_id) {
          this.selected = this.errorCompanies[i].entities;
          this.show_details = true;
          this.scrollToEditUser();
        }
      }
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    scrollToEditUser() {
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
    diagnoseClicked() {
      axios
        .post('/company/diagnose', { company_id: this.currentCompanyId })
        .then(res => {
          this.disabledDiagnose = true;


        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte starta diagnos');
        });
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
