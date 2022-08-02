<template>
  <div class="px-5" id="page-support">
    <h5 class="mb-6 ml-2">API Nycklar</h5>

    <APIKeysTable
      :items="apiKeys"
      @createApiKeyClicked="createApiKeyClicked"
      @selectApiKeyClicked="selectApiKeyClicked"
      @deleteApiKeyClicked="deleteApiKeyClicked"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>

    <!-- Creating Todo  -->
    <b-card
      title=""
      class="mb-2 edit-apikey-container"
      ref="edit-apikey"
      id="edit-apikey"
      hide-footer
      v-if="creating || editing"
    >
      <b-form class='d-flex flex-column' @submit="saveApiKey($event)">

        <b-card
          title="API Nyckeldata"
        >
          <b-form-group label="Huvudförening" label-for="input-company_id">
            <b-form-select id="input-company_id" placeholder="Välj förening" v-model="form.company_id" :options="companyOptions">
            </b-form-select>
          </b-form-group>

          <b-form-group label="API Tjänst" label-for="input-service">
            <b-form-select id="input-service" placeholder="Välj tjänst" v-model="form.service" :options="serviceOptions">
            </b-form-select>
          </b-form-group>

          <b-card
            v-if="form.service==='fortnox'"
            title="Fortnox Inställningar"
            class="mb-8"
            >

            <div v-if="form.status === 'UNCLAIMED'">
              <b-alert show variant="warning">Skriv in den publika nyckeln för att koppla fortnox</b-alert>
              <b-form-group label="Publikt ID" label-for="input-public_token">
                <b-form-input type="text" v-model="form.public_token" />
              </b-form-group>

              <b-button @click="connectFortnox" variant="primary">Koppla</b-button>

            </div>

            <div v-else-if="form.status === 'CLAIMED'">
              <b-alert show variant="success">Fortnox är kopplat till denna förening.</b-alert>
            </div>

            <div v-else>
              <b-alert show variant="danger">Du måste logga in på fortnox och koppla memlist via fortnox-market. Leta efter "memlist".</b-alert>
            </div>

          </b-card>

          <b-card
            v-if="form.service==='spar'"
            title="SPAR Inställningar"
            class="mb-8"
            >
            <b-form-group label="KundNrLeveransMottagare" label-for="input-KundNrLeveransMottagare">
                <b-form-input type="text" v-model="form.external_data.KundNrLeveransMottagare" />
            </b-form-group>

            <b-form-group label="KundNrSlutkund" label-for="input-KundNrSlutkund">
                <b-form-input type="text" v-model="form.external_data.KundNrSlutkund" />
            </b-form-group>

            <b-form-group label="Organisationsnummer" label-for="input-orgNr">
                <b-form-input type="text" v-model="form.external_data.orgNr" :state="validOrgNr" required/>
            </b-form-group>

            <b-form-group label="slutAnvandarId" label-for="input-slutAnvandarId">
                <b-form-input type="text" v-model="form.external_data.slutAnvandarId" />
            </b-form-group>

            <b-form-group label="Client-ID" label-for="input-client_id">
              <b-form-input type="text" v-model="form.client_id" />
            </b-form-group>

            <b-form-group label="Client-Secret" label-for="input-client_secret">
              <b-form-input type="text" v-model="form.client_secret" />
            </b-form-group>

            <b-button type="submit" variant="primary" :disabled="disabledSave">Spara</b-button>
          </b-card>

          <b-card
            v-if="form.service==='dintero'"
            title="Dintero inställningar"
            class="mb-8">

            <b-form-group label="Dintero Payment Profile ID" label-for="input-service_id">
              <b-form-input type="text" v-model="form.service_id" />
            </b-form-group>

            <!--
          <b-form-group label="Status" label-for="input-status">
            <b-form-select id="input-status" placeholder="Välj status" v-model="form.status" :options="statusOptions">
            </b-form-select>
          </b-form-group>

            -->

            <b-button type="submit" variant="primary" >Spara</b-button>

          </b-card>



        </b-card>

      </b-form>
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
import moment from 'moment';
import { mapGetters } from 'vuex';
import Editor from '@tinymce/tinymce-vue';
import APIKeysTable from '@/view/pages/ml/apikeys/APIKeysTable.vue';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'apikeys',
  components: {
    editor: Editor,
    APIKeysTable,
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'currentUserId', 'currentUser']),
    disabledSave(){
      return !this.validOrgNr;
    }
  },
  mounted() {
    this.loadData();
  },
  validations: {

  },
  data() {
    return {
      companyOptions: [],
      statusOptions: [
        { value: 'CLAIMED', text: 'Aktivt' },
        { value: 'UNCLAIMED', text: 'Väntar' },
        { value: 'REVOKED', text: 'Spärrat' },
      ],
      serviceOptions: [
        { value: 'fortnox', text: 'Fortnox' },
        { value: 'spar', text: 'SPAR' },
        { value: 'dintero', text: 'Dintero' },
      ],
      form: {
        id: '',
        company_id: '',
        external_data: {},
        created_at: '',
        updated_at: '',
        status: '',
        public_token: '',
        access_token: '',
        service: '',
      },
      creating: false,
      editing: false,
      apiKeys: [],
      validOrgNr: null
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadApiKeys();
      }
    },
    'form.external_data.orgNr': function (newVal, oldVal) {
      this.validOrgNr = !newVal ? null : this.validate_orgNr(newVal);
    }
  },
  methods: {

    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      this.listSid();
      this.loadApiKeys();
    },

    validate_orgNr(val){
      switch (val.length) {
        case 10:
          const re = /^\+?\d*$/;
          return re.test(val);
        case 11:
          return (val.includes('-') && val.indexOf('-') === 6 );
        default:
          return false;
      }
    },

    createApiKeyClicked() {
      this.resetForm()
      this.creating = true;
      this.editing = false;

      this.scrollToEditApiKey();
    },

    connectFortnox() {
      axios
        .post('/api_key/connectapi', {
          company_id: this.form.company_id,
          service: 'fortnox',
          public_token: this.form.public_token
        })
        .then(res => {
          if (res.status === 200) {
            this.toastr('success', 'OK', 'Fortnox har kopplats');


          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte koppla fortnox');
        });
    },

    createApiKey() {
      axios
        .post('/api_key', this.form )
        .then(res => {
          if (res.status === 201) {
            this.apiKeys.push(res.data.api_key);
            this.toastr('success', 'OK', 'Api nyckeln har skapats');
          }
          else if (res.status === 406) {
            this.toastr('danger', 'Fel', 'Det finns redan en API nyckel för den tjänsten och föreningen');
          }
          else {
            this.toastr('danger', 'Fel', 'Kunde inte skapa Api nyckel');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa Api nyckeln');
        });
    },

    deleteApiKeyClicked(id) {
      axios
        .delete(`/api_key?id=${id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.apiKeys = this.apiKeys.filter(item => item.id !== id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Api nyckeln togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort Api nyckel');
        });
    },

    selectApiKeyClicked(id) {

      axios
        .get(`/api_key?id=${id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.apiKeySelected = res.data;
          this.form = res.data;
          this.editing = true;
          this.scrollToEditApiKey(true);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta Api nyckel');
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

    loadApiKeys() {

      this.apiKeys = [];
      axios
        .get(`/api_key/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.apiKeys = res.data;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista ärenden');
        });
    },

    scrollToEditApiKey(withId = false) {
      var that = this;
      setTimeout(function () {
        const el = withId ? document.getElementById('support-task-table') : that.$el.getElementsByClassName('scroll-to-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    },

    listSid() {
      axios
        .get(`/company/listsid`)
        .then(res => {
          this.companyOptions = [];

          var companies = res.data;

          companies.sort(function(a, b) {
            if (a.name < b.name) {
              return -1;
            }

            return 1;
          });

          for (const c of companies) {
            this.companyOptions.push({ value: c.company_id, text: c.name });
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte lista huvudföreningar');
        });
    },

    saveApiKey(e) {
      if (e !== undefined) {
        e.preventDefault();
      }
      let orgNr = this.form.external_data.orgNr;
      this.form.external_data.orgNr = orgNr.includes('-') && orgNr.indexOf('-') === 6 ? orgNr.replace('-','') : orgNr;
      if (this.creating) {
        this.createApiKey();
      }
      else {
        axios
        .put('/api_key', this.form)
        .then(res => {
          if (res.status === 204) {
            this.toastr('success', 'OK', 'Api nyckel uppdaterades');
            this.creating = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera Api nyckel');
        });
      }
    },

    resetForm(){
      this.form = {
          id: '',
          company_id: '',
          service: '',
          access_token: '',
          public_token: '',
          external_data: {},
          status: ''
      }
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
