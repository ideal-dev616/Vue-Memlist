<template>
  <div class="px-5" id="page-stickprovs">
    <h5 class="mb-6 ml-2">Stickprover</h5>

    <StickprovWizard
      class="scroll-to-wizard"
      v-if="creating"
      :stickprovs='stickprovs'
      @stickprovCreated="stickprovCreated"
    />

    <StickprovTable
        :items="stickprovs"
        @showHistoryToggled="showHistoryToggled"
        @createStickprovClicked="createStickprovClicked"
        @selectStickprovClicked="selectStickprovClicked"
        @deleteStickprovClicked="deleteStickprovClicked"
        @startEvent="startEvent"
        @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-stickprov-container"
      ref="edit-stickprov"
      id="edit-stickprov"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form
          class="mt-8"
          @submit="saveStickprov"
        >
          <!--<b-form-group
            id="input-group-stickprov_id"
            label="ID"
            label-for="input-stickprov_id"
            >
            <b-form-input
                id="input-stickprov_id"
                v-model="form.stickprov_id"
                type="text"
                disabled
            ></b-form-input>
          </b-form-group>-->

          <b-row>
            <b-col lg="12">
              <ClientTable
                class="search-results"
                :stickprov="stickprov"
                :clients="clients"
                @clientSelected="clientSelected"
                @confirm="confirm"
                @reject="reject"
              />
            </b-col>
          </b-row>
        </b-form>
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
import Editor from '@tinymce/tinymce-vue';
import axios from 'axios';
import moment from 'moment';
import { mapGetters } from 'vuex';
import StickprovTable from '@/view/pages/ml/stickprov/StickprovTable.vue';
import StickprovWizard from '@/view/pages/ml/stickprov/StickprovWizard.vue';
import ClientTable from '@/view/pages/ml/stickprov/ClientTable.vue';

export default {
  name: 'stickprovs',
  components: {
    StickprovTable,
    editor: Editor,
    StickprovWizard,
    ClientTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
        stickprov: null,
        clients: [],
        showHistory: false,
        form: {
            stickprov_id: '',
            is_stopped:     0,
            is_finished:    0,
            num_sent_rounds: 0,
            num_target_rounds: 0,
            deadline:       '2020-01-01',
            company_id:     '',
            sms_template_id: '',
            email_template_id: '',
            call_only:      0,
            num_answers:    0,
            num_sms_sent:   0,
            num_email_sent: 0,
            pct_clients:    0,
            num_clients:    0,
            period_id:      '',
            num_reject:     0,
            send_email:     0,
            send_sms:       0,
            executing:      0,
            next_execution: '2020-01-01'
        },
        online: false,
        creating: false,
        editing: false,
        stickprovs: [],
        templates: [],
        emailTemplatesOptions: [],
        smsTemplatesOptions: [],
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadStickprovs();
      }
    },
    stickprovs(newValue, oldValue) {
      if (newValue) {
      }
    }
  },
  methods: {
    confirm(client_id) {
      axios
        .post('/client/stickprov', { client_id: client_id, answer: 'confirm', stickprov_id: this.form.stickprov_id })
        .then(res => {
          for (var i = 0; i < this.clients.length; ++i) {
            if (this.clients[i].client_id === client_id) {
              this.clients[i].st_conf = 1;
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte svara ja');
        });
    },
    reject(client_id) {
      axios
        .post('/client/stickprov', { client_id: client_id, answer: 'reject', stickprov_id: this.form.stickprov_id })
        .then(res => {
          for (var i = 0; i < this.clients.length; ++i) {
            if (this.clients[i].client_id === client_id) {
              this.clients[i].st_rej = 1;
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte svara nej');
        });
    },
    loadClients(stickprov_id) {
      axios
        .get(`/client_stickprov/list?stickprov_id=${stickprov_id}`)
        .then(res => {
          this.clients = res.data.clients;

          console.log(this.clients);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista medlemmar');
        });
    },
    clientSelected(client) {
      console.log('selected client');
      console.log(client);
    },
    showHistoryToggled(show) {
      this.showHistory = show;

      this.loadStickprovs();
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.loadTemplates();
      this.loadStickprovs();
    },
    createStickprovClicked() {
      this.createStickprov();
    },
    createStickprov() {
      this.creating = true;
      this.editing = true;

      //this.scrollToEditStickprov();
      this.scrollToWizard();
    },
    deleteStickprovClicked(stickprov_id) {
      axios
        .delete(`/stickprov?stickprov_id=${stickprov_id}&company_id=${this.currentCompanyId}`)
        .then(res => {

          this.stickprovs = this.stickprovs.filter(item => item.stickprov_id !== stickprov_id)

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Stickprovet togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort stickprov');
        })
    },
    selectStickprovClicked(stickprov_id) {
      axios
        .get(`/stickprov?stickprov_id=${stickprov_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.form = res.data.stickprov;
          this.creating = false;
          this.editing = true;
          this.stickprov = this.form;

          this.loadClients(this.form.stickprov_id);

          this.scrollToEditStickprov();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta stickprov');
        })
    },
    startEvent(stickprov_id, status) {
      if (status)
        axios
          .put(`/stickprov/start`, { stickprov_id: stickprov_id })
          .then(res => {
            let index = this.stickprovs.findIndex(item => item.stickprov_id == stickprov_id);
            if (index > -1) {
              this.stickprovs[index].is_stopped = res.data.stickprov.is_stopped;
              this.toastr('success', 'OK', 'Stickprovet startades');
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte starta stickprov');
          })
      else
        axios
          .put(`/stickprov/stop`, { stickprov_id: stickprov_id })
          .then(res => {
            let index = this.stickprovs.findIndex(item => item.stickprov_id == stickprov_id);
            if (index > -1) {
              this.stickprovs[index].is_stopped = res.data.stickprov.is_stopped;
              this.toastr('success', 'OK', 'Stickprovet stoppades');
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte stoppa stickprov');
          })
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    loadStickprovs() {

      this.stickprovs = [];
      axios
        //.get(`/company/liststickprovs?company_id=${this.currentCompanyId}`)
        .get(`/stickprov/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            var stickprovs = res.data.stickprovlist;

            var now = moment();

            for (var i = 0; i < stickprovs.length; ++i) {
              var stickprov = stickprovs[i];

              var stickprovdt = moment(stickprov.deadline);

              if ((stickprovdt < now && this.showHistory) || stickprovdt >= now) {
                //check stickprov date
                this.stickprovs.push(stickprov);
              }
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista stickprov');
        });
    },
    stickprovCreated(stickprov) {
      this.stickprovs.push(stickprov);
      this.creating = false;

      this.loadClients(stickprov.stickprov_id);

      console.log('Got back signal from wizard');
    },
    loadTemplates() {
      this.templates = [];
      this.smsTemplatesOptions = [];
      this.emailTemplatesOptions = [];

      axios
        .get(`/template/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.templates = res.data.templates;
          }

          for (var i = 0; i < this.templates.length; ++i) {
            /*if (this.templates[i].type === 'email') {
              this.emailTemplatesOptions.push(this.templates[i]);
            }
            else {
              this.smsTemplatesOptions.push(this.templates[i]);
            }*/
            if (this.templates[i].is_sms === 0) {
              this.emailTemplatesOptions.push({ value: this.templates[i].template_id, text: this.templates[i].name });
            }
            else {
              this.smsTemplatesOptions.push({ value: this.templates[i].template_id, text: this.templates[i].name });
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista mallar');
        });
    },
    scrollToEditStickprov() {
      var that = this;
      setTimeout(function(){

        const el = that.$el.getElementsByClassName('scroll-to-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 100);
    },
    scrollToWizard() {
      var that = this;
      setTimeout(function(){

        const el = that.$el.getElementsByClassName('scroll-to-wizard')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 100);
    },
    saveStickprov(e) {
      if (e !== undefined) {
        e.prstickprovDefault();
      }

      this.form.company_id = this.currentCompanyId;

      this.form.type = this.online ? 'ONL' : 'PHY';

      axios
        .put('/stickprov', this.form)
        .then(res => {
          if (res.status === 200) {

            this.toastr('success', 'OK', 'Stickprovet uppdaterades');
            this.loadStickprovs();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera stickprovet');
        });
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type,
      })
    }
  }
};
</script>
