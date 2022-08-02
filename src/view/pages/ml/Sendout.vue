<template>
  <div class="px-5" id="page-sendouts">
    <h5 class="mb-6 ml-2">Utskickshanterare</h5>
    <Confirm
      title="Bekräfta start"
      message="Är du säker på att du vill starta utskicket? Samtliga medlemmar i urvalet kommer att ta emot utskicket"
      ref="confirmModal"
      @cancel="cancelConfirmStart"
      @confirm="confirmStart"
    />

    <SendoutTable
        :items="sendouts"
        @showHistoryToggled="showHistoryToggled"
        @createSendoutClicked="createSendout"
        @selectSendoutClicked="selectSendout"
        @deleteSendoutClicked="deleteSendout"
        @startSendout="startSendout"
        @toastr="toastr"
    />

    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-sendout-container"
      ref="edit-sendout"
      id="edit-sendout"
      hide-footer
      v-if="creating || editing"
    >
    <div>
          <b-form
            class="mt-8"
            @submit.prevent="saveSendout()"
          >
              <b-form-group
              id="input-group-sendout_id"
              label="ID"
              label-for="input-sendout_id"
              >
              <b-form-input
                  id="input-sendout_id"
                  v-model="form.sendout_id"
                  type="text"
                  disabled
              ></b-form-input>
            </b-form-group>

              <b-row>
                <b-col md="5">
                  <b-form-group
                          id="input-group-1"
                          label="Namn på utskicket"
                          label-for="input-1"
                          class='flex-fill mr-4'
                  >
                    <b-form-input
                            id="input-1"
                            v-model="form.name"
                            type="text"
                            placeholder="Namn på utskicket"
                    ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group
                          id="input-group-type"
                          label="Typ"
                          label-for="input-type"
                          class='flex-fill mr-4'
                  >
                    <b-form-select :options="types" v-model="type">
                    </b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="5">
                  <b-form-group
                          id="input-prio"
                          label="Prioritering"
                          label-for="prio"
                          class='flex-fill'
                  >
                    <b-form-select v-model="form.prio" :options='PRIO_OPTIONS'>
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>

              <b-card class="mb-8">
                <template #header>
                  <p class="h5 mb-1"><b-icon class="mr-2" icon="check-circle" font-scale="1.3" :variant="senderOK?'success':'secondary'"></b-icon>  Ange namn</p>
                </template>
                <b-row>
                  <b-col>
                    <b-row>
                      <b-col align="start">
                        <label for="sender-name">Namn</label>
                      </b-col>
                      <b-col align="end">
                        <label for="sender-name">{{97 - (form.overrides.from_name? form.overrides.from_name.length : 0)}} Tocken</label>
                      </b-col>
                    </b-row>
                    <b-form-group>
                      <b-form-input
                        id="sender-name"
                        v-model="form.overrides.from_name"
                        type="text"
                        maxLength="98"
                        required
                      />
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group>
                      <b-row>
                        <b-col align="start">
                          <label for="sender-email">Epostadress</label>
                        </b-col>
                        <b-col align="end">
                          <label for="sender-email">{{255 - (form.overrides.reply_to? form.overrides.reply_to.length : 0)}} Tocken</label>
                        </b-col>
                      </b-row>
                      <b-form-input
                        id="sender-email"
                        v-model="form.overrides.reply_to"
                        type="email"
                        maxLength="255"
                        required
                      />
                    </b-form-group>
                  </b-col>

                </b-row>
              </b-card>

              <b-card class="mb-8">
                <template #header>
                  <p class="h5 mb-1"><b-icon class="mr-2" icon="check-circle" font-scale="1.3" :variant="subjectOK? 'success' :'secondary'"></b-icon>  Sätt ämne</p>
                </template>

                <b-row>
                  <b-col>
                    <b-row>
                      <b-col align="start">
                        <label for="input-subject">Ämne</label>
                      </b-col>
                      <b-col align="end">
                        <label for="input-subject">{{78 - (form.overrides.subject ? form.overrides.subject.length : 0)}} Tecken</label>
                      </b-col>
                    </b-row>
                    <b-form-group>
                      <b-form-input
                              id="input-subject"
                              maxlength="150"
                              type="text"
                              required
                              v-model="form.overrides.subject"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group>
                      <b-row>
                        <b-col align="start">
                          <label for="input-prevText">Förhandsvisningstext</label>
                        </b-col>
                        <b-col align="end">
                          <label for="input-prevText">{{130 - (form.overrides.preview? form.overrides.preview : 0)}} Tecken</label>
                        </b-col>
                      </b-row>
                      <b-form-input
                              id="input-prevText"
                              maxlength="150"
                              v-model="form.overrides.preview"

                      />
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-card>

              <SearchOptions
                ref="searchOptions"
                :regions="regions"
                :countries="countries"
                :genders="genders"
                :periods="periods"
                :payments="payments"
                :ladoks="ladoks"
                :num-clients="numClients"
                :showEvents="true"
                :no-permission="noPermission"
                :query-ok="queryOk"
                show-num-clients
                @onSearch="onSearch"
                @queryCreated="queryCreated"
                @querySelected="querySelected"
                @eventSelected="eventSelected"
                class="mb-8"
              />

            <b-alert :show="!budgetOK" :variant="'warning'">Ni har inte tillräcklig budget för körningen, gå till <router-link :to="{name: 'ml-billing'}">Kostnader</router-link> och ställ in en högre budget</b-alert>

            <!--Begin:: template selection-->
            <b-card class="mb-8">
              <template #header>
                <p class="h5 mb-1"><b-icon class="mr-2" icon="check-circle" font-scale="1.3" :variant="template_id?'success':'secondary'"> </b-icon>  Skapa meddelande</p>
              </template>

              <b-form-group id="template_id-group" :label="type === 'email'? 'E-postmall' : 'SMS mall'" label-for="template_id">
                <b-row>
                  <b-col md="9">
                    <b-form-select
                            id="template_id"
                            v-model="template_id"
                            :options="type === 'email' ? emailTemplatesOptions: smsTemplatesOptions"
                    ></b-form-select>
                  </b-col>
                  <b-col>
                    <b-row align-h="end">
                      <b-col md="auto"> <b-button variant="primary" @click="selectTemplate" :disabled="isTmpReview">GRANSKA</b-button></b-col>
                      <b-col md="auto"> <b-button variant="primary" @click="createTemplate($event)">SKAPA MALL</b-button></b-col>
                    </b-row>
                  </b-col>
                </b-row>
                <b-alert class="mt-5" v-show="!templateOk" show variant="danger">En utskicksmall måste väljas</b-alert>
              </b-form-group>
            </b-card>

            <b-modal size="lg" scrollable v-model="template_review" hide-footer>
              <div v-html="template_html">
              </div>
            </b-modal>
            <!--End:: template selection-->

            <!--            <b-form-group class="mb-8">-->
<!--              <b-button type="button" class="mr-2" variant="outline-primary" @click="createTemplate($event)">Skapa mall</b-button>-->
<!--              <b-button v-if="form.template_id !== ''" type="button" variant="outline-primary" @click="editTemplate($event)">Editera mall</b-button>-->
<!--            </b-form-group>-->

            <budget-view @showBudgetStatus="showBudgetStatus" :num-to-send="numClients" :isSMS="type === 'sms'" />

            <b-alert v-show="templateOk && queryOk" show variant="success">Utskicket är nu giltigt. Spara utskicket genom att klicka på "Spara". Efter detta kan du starta utskicket genom att klicka på "Starta" knappen längst upp på sidan</b-alert>


            <b-button type="submit" variant="primary">Spara</b-button>
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
import SendoutTable from '@/view/pages/ml/sendout/SendoutTable.vue';
import SearchOptions from '@/view/components/searchOptions.vue';
import Confirm from '@/view/components/Confirm.vue';
import BudgetView from "../../components/BudgetView";

export default {
  name: 'sendouts',
  components: {
    SendoutTable,
    editor: Editor,
    SearchOptions,
    Confirm,
      BudgetView
  },
  data() {
    return {
        numClients: null,
        company: {},
        showHistory: false,
        hasGoogleMaps: false,
        types: [
          {value: 'email', text: 'Mail'},
          // {value: 'sms', text: 'SMS'}
        ],
        selectedType: 'email',
        type: 'email',
        queryOptions: [],
        form: {
            prio: 'imp',
            sendout_id: '',
            company_id:     '',

            // num_to_send:            0,
            // num_sent_ok:            0,
            // num_return_nok:         0,
            // num_opens:              0,
            // num_clicks:             0,
            status:                 '', // todo, list status types
            created_at:             '2020-01-01',
            template_id:            '',
            query_id:               '',
            type:                   'email', // todo, list type types
            name:                   '',
            meta:                   { renew_date: '' },
            client_ids:             [],
          overrides: {
            subject: '',
            preview: '',
            from_name: '',
            reply_to: '',
          }
        },
        SENDOUT_STATUS: {
            DRAFT: 'DRAFT',
            RUNNING: 'RUNNING',
            PAUSED: 'PAUSED',
            FINISHED: 'FINISHED',
        },
        PRIO_OPTIONS: {
          imp: 'Viktigt',
          sys: 'System',
          def: 'Vanligt/Information'
        },
        isTmpReview: false,
        template_review: false,
        noPermission:false,
        budgetOK: true,
        queryOk: false,
        templateOk: false,
        creating: false,
        editing: false,
        sendouts: [],
        templates: [],
        emailTemplatesOptions: [],
        smsTemplatesOptions: [],
        regions: [],
        countries: [],
        template_id: null,
        template_html: '',
        sendout_id: {},
        genders: [
            { value: 'M', text: 'Man' },
            { value: 'F', text: 'Kvinna' },
            { value: 'O', text: 'Annat' },
            { value: 'U', text: 'Okänt' }
        ],
        payments: [
            { value: 'Y', text: 'Betalat' },
            { value: 'N', text: 'Ej Betalat' }
        ],
        ladoks: [
            { value: 'OK', text: 'Aktiv Student' },
            { value: 'NO', text: 'Ej Student' },
            { value: 'S', text: 'Väntar' },
            { value: 'N', text: 'Saknas' }
        ],


    };
  },
  watch: {
    template_id(newValue, oldValue) {
      if (newValue) {
        this.form.template_id = newValue;
        this.templateOk = true;
      }
    },
    template_review(newVal){
      if(!newVal) this.isTmpReview = newVal;
    },
    type(newValue, oldValue) {
      this.template_id = '';
      this.form.template_id = '';
      this.templateOk = false;
    },
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadSendouts();
      }
    },
    currentPeriodId(newValue, oldvalue) {
      if (newValue) {
        this.loadSendouts();
      }
    }
  },
    computed: {
        ...mapGetters(['currentCompanyId', 'currentPeriodId','periods']),
      senderOK(){
          return this.form.overrides.from_name !== '' && this.form.overrides.from_name !== undefined && this.form.overrides.from_name !== null
                  && this.form.overrides.reply_to !== '' && this.form.overrides.reply_to !== undefined && this.form.overrides.reply_to !== null;
      },
      subjectOK(){
          return this.form.overrides.subject !== '' && this.form.overrides.subject !== undefined && this.form.overrides.subject !== null;
      }
    },

  methods: {
      showBudgetStatus(budget_status){
        this.budgetOK = budget_status
      },
      eventSelected(event_ids){
        if (event_ids.length == 0)
          this.numClients = null
        else {
          axios.post(`/client_event/events`, {event_ids:event_ids})
          .then(res => {
              if (res.status === 200){
                  this.calcParticipants(res.data.events);
              }
          }). catch(err => {
              console.log(err);
          })
        }
      },
      calcParticipants(events){
          let length = 0;
          Object.values(events).filter(event => {
              length += event.length;
          });
         if (length)this.numClients = length;
         else  this.toastr('warning', 'medlemmar i händelse', 'Utvalda händelser innehåller inte medlemmar.');

      },
      selectTemplate() {
        if(template_id){
          this.isTmpReview = true;
          axios
            .get(`/template?template_id=${this.template_id}&company_id=${this.currentCompanyId}`)
            .then(res => {
              if (res.status === 200){
                this.template_html = res.data.template.template;
                this.template_review= true
              }
            })
            .catch(err => {
              console.error(err);
              this.toastr('danger', 'Server Fel', 'Kunde inte hämta mallar');
            });
        } else
          this.template_html = '';
          this.template_review = false;
      },
      querySelected(query_id) {
          if (query_id) {
            axios.get(`/search/count?company_id=${this.currentCompanyId}&query_id=${query_id}`).then(res=>{
              this.noPermission = res.status === 403;
              this.queryOk = res.status === 200;
              if (res.status === 200) {
                this.numClients = res.data.count;
                this.form.query_id = query_id;
              }}).catch(err=> {
              console.log(err);
              this.toastr('danger', 'Server Fel', 'Det valda valet kunde inte hittas.');
            });
          }
          else {
              this.noPermission = false;
              this.queryOk = false;
              this.numClients = null;
          }
      },
      /**
       * To create new template.
       * template_id = -1
       * editing = 0
       */
      createTemplate(e){
          e.preventDefault();
          this.saveSendout();
          this.$router.push(`/ml-templates/${this.form.sendout_id}/0/-1`);
      },

      /**
       * To edit new template.
       * editing = 1
       */
    editTemplate(e) {
      e.preventDefault();
      this.$router.push(`/ml-templates/${this.form.sendout_id}/1/${this.form.template_id}`);
    },
    async loadRegions() {
      // get regions
      const res = await axios.get('/location/regions');
      if (res.status === 200) {
        // region load
        for (const [k, region] of Object.entries(res.data.regions)) {
          const communes = [];
          for (const [key, comm] of Object.entries(region.communes)) {
            communes.push({ value: key, text: comm.commune });
          }

          this.regions.push({
            text: region.region,
            value: region.region_code,
            communes: communes
          });
        }
      } else {
        // no region found
      }

      // country
      const res1 = await axios.get('/location/countries');

      if (res1.status === 200) {
        this.countries = res1.data.countries;
      } else {

      }
    },
    showHistoryToggled(show) {
      this.showHistory = show;

      this.loadSendouts();
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.loadSettings();
      this.loadTemplates();
      this.loadSendouts();
      this.loadRegions();
    },
    loadSettings() {
      axios
        .get(`/company?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.company = res.data.company;
          }

          this.queryOptions = [];

          for (var i = 0; i < this.company.settings.search_queries.length; ++i) {
            this.queryOptions.push({ value: this.company.settings.search_queries[i].id, text: this.company.settings.search_queries[i].name });
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta föreningsinställningar');
        });
    },
    createSendout() {
      this.resetFields();
      axios
        .post('/sendout', { name: 'Utskick skapat ' + moment().format('YYYY-MM-DD HH:mm:ss'), company_id: this.currentCompanyId, period_id: this.currentPeriodId })
        .then(res => {
          this.selectSendout(res.data.sendout.sendout_id);
          this.sendouts.push(res.data.sendout);
          // this.loadSendouts();

          this.toastr('success', 'OK', 'Ett tomt utskick har skapats');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa utskick');
        });

      this.scrollToEditSendout();

    },
    deleteSendout(sendout_id) {

      axios
        .delete(`/sendout?sendout_id=${sendout_id}&company_id=${this.currentCompanyId}`)
        .then(res => {

          this.sendouts = this.sendouts.filter(item => item.sendout_id !== sendout_id)

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Utskicket togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort utskick');
        })
    },
    selectSendout(sendout_id) {
      axios
        .get(`/sendout?sendout_id=${sendout_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.form = res.data.sendout;
          this.creating = false;
          this.editing = true;
          this.online = this.form.type === 'ONL';
          this.template_id = this.form.template_id;
          if (this.form.num_to_send > 0)
            this.numClients = this.form.num_to_send;
          this.scrollToEditSendout();
          var that = this;

          setTimeout(function(){
            that.$refs['searchOptions'].selectQuery(that.form.query_id);
          }, 200);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta utskick');
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
    loadSendouts() {

      this.sendouts = [];
      axios
        //.get(`/company/listsendouts?company_id=${this.currentCompanyId}`)
        .get(`/sendout/list?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`)
        .then(res => {
          if (res.status === 200) {
            this.sendouts = res.data.sendouts;
            /*var now = moment();

            for (var k in sendouts.companies) {
              var comp = sendouts.companies[k];

              for (var i = 0; i < comp.length; ++i) {

                var sendoutdt = moment(comp[i].from_datetime);

                if (!this.showHistory && sendoutdt < now) {
                  continue;
                }

                //check sendout date
                this.sendouts.push(comp[i]);
              }
            }*/
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista utskick');
        });
    },
    onSearch(query) {
      axios
        .post('/search/direct', query)
        .then(res => {
          this.noPermission = res.status === 403;
          if(res.status === 200){
            const clients = [...res.data.clients, ...res.data.users];
            this.numClients = clients.length;

            let client_ids = [];
            clients.filter(client => {
              client_ids.push(client.client_id);
            });
            this.form.client_ids = client_ids;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server fel', 'Kunde inte söka');
        });
    },
    loadTemplates() {
      this.templates = [];
      this.smsTemplatesOptions = [];
      this.emailTemplatesOptions = [];

      axios
        .get(`/template/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.templates = res.data.templates.filter(template => template.company_id === this.currentCompanyId);
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
          this.toastr('danger', 'Server Fel', 'Kunde inte lista utskick');
        });
    },
    scrollToEditSendout() {
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
      queryCreated(query) {
        console.log('Query created', query);
          //this.searchHistory.push({ value: query.id, text: query.name });
      },
    startSendout(sendout_id) {
      this.sendout_id = sendout_id;
      this.$refs['confirmModal'].show();
    },
    cancelConfirmStart() {

    },
    confirmStart() {
      axios
        .post('/sendout/run', { sendout_id: this.sendout_id})
        .then(res => {
          if (res.status === 200){
            this.sendouts.map(item => {
              if(item.sendout_id === this.sendout_id){
                item.status = 'RUNNING';
                item.num_sent_ok = res.data.num_emails;
              }
            })
            this.toastr('success', 'OK', 'Utskicket har startats');
          } else {
            this.toastr('danger', 'Server Fel', 'Kunde inte starta utskicket');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte starta utskicket');
        });
    },
    saveSendout() {
      this.form.company_id = this.currentCompanyId;
      this.form.num_to_send = this.numClients;
      this.form.type = this.online ? 'ONL' : 'PHY';
      delete this.form.num_sent_ok;
      axios
        .put('/sendout', this.form)
        .then(res => {
          if (res.status === 200) {
            this.toastr('success', 'OK', 'Utskicket uppdaterades');
            this.creating = false;
            this.editing = false;
            this.sendouts = this.sendouts.map(item => {
                if (parseInt(item.sendout_id) === res.data.sendout.sendout_id){
                    return res.data.sendout;
                } else {
                    return item;
                }
            })
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera utskicket');
        });
    },
      resetFields(){
          this.numClients = null;
          this.creating = true;
          this.editing = false;
          this.queryOk = false;
          this.templateOk = false;
      },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type,
      })
    }
  },
    mounted() {
        this.loadData();
        let id = this.$route.params.id;
        id !== undefined && this.selectSendout(id);
    },
};
</script>
