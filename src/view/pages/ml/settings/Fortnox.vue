<template>
  <div class="px-5 mt-8" id="page-bank">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card title="" class="mb-2 mt-8" hide-footer>
          <div>
            <b-form class="mt-8" @submit="saveData">
              
              <div v-if="fortnoxAPIKeyIsSet">
                <b-alert show variant="success">Fortnox är kopplat till denna förening</b-alert>
                <b-button type="button" variant="outline-danger" @click="deleteFortnox" class="mb-8 mt-8">Ta bort koppling</b-button>
              </div>

              <div v-if="!fortnoxAPIKeyIsSet">
                    <b-alert show variant="light"
                    >Fortnox har EJ kopplats till denna förening. Klicka på knappen nedan för att ta dig vidare till Fortnox inloggningen och sedan lägga till appen direkt.</b-alert
                    >

                    <b-button type="button" variant="outline-primary" @click="gotoFortnox" class="mb-8">Till Fortnox</b-button>
                    
                    <b-alert show variant="light"
                    >Ifall ni blivit ombedda att skriva in ett Publikt ID så gör ni det i denna textruta och klicka sedan på "Spara"</b-alert
                    >

                    <b-form-group id="input-group-public_token" label="Publikt ID" label-for="input-public_token">
                      <b-form-input
                        id="input-public_token"
                        v-model="public_token"
                        type="text"
                      ></b-form-input>
                    </b-form-group>

                    <b-button type="submit" variant="primary">Spara</b-button>
              </div>
            </b-form>
          </div>
        </b-card>
      </b-col>
    </b-row>
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

export default {
  name: 'swish-settings',
  components: {},
  props: ['company', 'settings'],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      fortnoxAPIKeyIsSet: false,
      public_token: '',
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    gotoFortnox() {
      location.href = 'https://www.fortnox.se/kopplingar/applikation/thinkinghatstudios-ab/memlist/';
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      axios 
        .get(`/company/apikey?company_id=${this.currentCompanyId}&service=fortnox`)
        .then(res => {

          if (res.status === 404) {
            this.fortnoxAPIKeyIsSet = false;
          }
          else {
            this.fortnoxAPIKeyIsSet = true;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte kontrollera Fortnox API uppgifter');
        });
    },
    deleteFortnox() {
      axios 
        .delete(`/company/apikey?company_id=${this.currentCompanyId}&service=fortnox`)
        .then(res => {
          this.fortnoxAPIKeyIsSet = false;

          this.toastr('success', 'OK', 'Fortnox kopplades bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte ta bort API koppling');
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
    saveData(e) {
      e.preventDefault();

      axios 
        .post('/company/connectapi', {
          company_id: this.currentCompanyId,
          service: 'fortnox',
          public_token: this.public_token
        })
        .then(res => {
          if (res.status === 200) {
            this.fortnoxAPIKeyIsSet = true;
          }
          else {
            this.toastr('danger', 'Fel', 'Kunde inte uppdatera API koppling')
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('success', 'OK', 'API koppling uppdaterad');
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
