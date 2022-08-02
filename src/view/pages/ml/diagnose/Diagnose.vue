<template>
  <div id="page-diagnose">
    <b-modal ref="resultModal" hide-footer>

      <div v-if="waiting" class="d-flex justify-content-center mt-10 mb-10">
        <b-spinner
          class="mx-auto text-center align-center"
          type="grow"
          label="Loading..."
        ></b-spinner>
      </div>

      <h5 v-if="!waiting && numErrors > 0">Följande fel hittades</h5>
      <h5 v-if="!waiting && numErrors === 0">Inga fel hittades</h5>

      <template v-for="(item, i) in errors">
        <b-alert v-bind:key="i" show variant="secondary">{{ item }}</b-alert>
      </template>

    </b-modal>

    <b-card no-body>
      <div class="diagnose">
        <b-button variant="danger" @click="diagnoseClicked" :disabled="disabledDiagnose" >Diagnostisera</b-button>
        <span class="ml-8">Systemet söker efter fel kontinuerligt, men ibland kan vissa djupa tekniska fel existera som den vanliga felsökningen inte hittar. Diagnostiera gör en tidskrävande djupsökning i hela databasen som försöker hitta djupare tekniska fel.</span>
      </div>
    </b-card>

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

export default {
  name: 'diagnose',
  components: {

  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'companies'])
  },
  mounted() {
    //this.loadDiagnostic();
  },
  data() {
    return {
      waiting: false,
      numErrors: 0,
      errors: [],
      intervalId: null,
      disabledDiagnose: false,
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        if (this.disabledDiagnose)
          this.loadDiagnostic();
      }
    }
  },
  methods: {
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.loadDiagnostic();
    },
    loadDiagnostic() {
      console.log("loadDiagnostic");
      this.disabledDiagnose = true;

      this.stopDiagnosticPoll();
      this.startPolling();
    },
    stopDiagnosticPoll() {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }
    },
    setDiagnoseResult(diag) {
      if (!diag) {
        return;
      }

      this.waiting = false;
      this.numErrors = diag.errors.length;
      this.errors = diag.errors;
      this.$refs['resultModal'].show();

    },
    startPolling() {
      this.$refs['resultModal'].show();
      this.waiting = true;

      console.log('setting interval');

      this.intervalId = setInterval(this.pollDiagnostic, 500);
    },
    pollDiagnostic() {
      console.log('setting interval');

      axios
        .get(`/company/diagnose?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.data.diag.done) {
            clearInterval(this.intervalId);
            this.disabledDiagnose = false;

            this.setDiagnoseResult(res.data.diag);
          }
          else {
            this.disabledDiagnose = true;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte kontrollera diagnosstatus');
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
    diagnoseClicked() {
      axios
        .post('/company/diagnose', { company_id: this.currentCompanyId })
        .then(res => {
          this.disabledDiagnose = true;
          this.waiting = true;
          this.$refs['resultModal'].show();

          this.loadDiagnostic();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte starta diagnos');
        });
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 500,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
