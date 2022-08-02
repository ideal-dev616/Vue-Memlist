<template>
  <div class="px-5 mb-8" id="page-stickprovwizard">

    <b-modal ref="previewModal" hide-footer>
      <div v-html="previewContent" />
    </b-modal>

    <h4 class="mb-8 ml-2 mt-8">Skapa nytt stickprov</h4>

    <b-card v-if="created" title="Stickprovet skapat!" hide-footer class="mb-2 mt-2">
      <b-alert variant="success" show>Stickprovet har skapats</b-alert>
    </b-card>

    <b-card v-if="!created" title="" class="mb-2" hide-footer>
      <!--begin: Wizard-->
      <div
        class="wizard wizard-3"
        id="kt_wizard_v3"
        data-wizard-state="step-first"
        data-wizard-clickable="true"
      >
        <!--begin: Wizard Nav -->
        <div class="wizard-nav border-bottom mb-1 mb-lg-5">
          <div class="wizard-steps px-8 py-8 px-lg-15 py-lg-3">
            <div
                class="wizard-step"
                data-wizard-type="step"
                data-wizard-state="current"
              >
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    <span>1</span> Introduktion
                  </h3>
                  <div class="wizard-bar"></div>
                </div>
            </div>

            <div
                class="wizard-step"
                data-wizard-type="step"
                data-wizard-state="pending"
              >
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    <span>2</span> Föreningsval
                  </h3>
                  <div class="wizard-bar"></div>
                </div>
            </div>

            <div
                class="wizard-step"
                data-wizard-type="step"
                data-wizard-state="pending"
              >
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    <span>3</span> Urvalsgrupp
                  </h3>
                  <div class="wizard-bar"></div>
                </div>
            </div>

            <div
                class="wizard-step"
                data-wizard-type="step"
                data-wizard-state="pending"
              >
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    <span>4</span> Alternativ
                  </h3>
                  <div class="wizard-bar"></div>
                </div>
            </div>

            <div
                class="wizard-step"
                data-wizard-type="step"
                data-wizard-state="pending"
              >
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    <span>5</span> Slutdatum
                  </h3>
                  <div class="wizard-bar"></div>
                </div>
            </div>

            <div
                class="wizard-step"
                data-wizard-type="step"
                data-wizard-state="pending"
              >
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    <span>6</span> Mallar
                  </h3>
                  <div class="wizard-bar"></div>
                </div>
            </div>

            <div
                class="wizard-step"
                data-wizard-type="step"
                data-wizard-state="pending"
              >
                <div class="wizard-label">
                  <h3 class="wizard-title">
                    <span>7</span> Bekräfta
                  </h3>
                  <div class="wizard-bar"></div>
                </div>
            </div>

          </div>
        </div>
        <!--end: Wizard Nav -->

        <!--begin: Wizard Body-->
        <div class="row justify-content-center py-12 px-8 py-lg-15 px-lg-10">
          <div class="col-xl-12 col-xxl-7">
            <!--begin: Wizard Form-->
            <form class="form" id="kt_form">
              <!--Begin: Introduction page -->
              <div
                  class="pb-5"
                  data-wizard-type="step-content"
                  data-wizard-state="current"
              >
                <b-alert show variant="secondary">Du kommer nu att skapa ett nytt stickprov. Följ guiden och fyll i allt som behövs. Stickprovet kommer inte vara igång förrän det har skapats OCH du har valt att starta stickprovet.</b-alert>
              </div>
              <!--End: Introduction page -->


              <!--Begin: select companies page -->
              <div
                  class="pb-5"
                  data-wizard-type="step-content"
                  data-wizard-state="pending"
              >
                <b-alert show variant="secondary">Välj vilja föreningar som ska ingå i stickprovet. Du kan även ange att varje förening ska få ett eget individuellt stickprov skapat åt sig.</b-alert>

                <div class="form-group">
                    <div class="radio-list">

                        <label class="radio radio-outline radio-success mb-4">
                            <input type="radio" v-model="createOption" value="split" name="createOption" />
                            <span></span>
                            Alla markerade föreningar får egna stickprover
                        </label>

                        <label class="radio radio-outline radio-success mb-4">
                            <input type="radio" v-model="createOption" value="combine" name="createOption" />
                            <span></span>
                            Skapa endast stickprovet på {{ company.name }} men med medlemmar från alla markerade föreningar
                        </label>
                    </div>
                </div>

                <CompanySelectTable
                  :filterIds='filterCompanies'
                  :onlySubCompanies='true'
                  @onSelectionChanged="onCompanySelectionChanged"
                />
              </div>
              <!--End: select companies page -->

              <!--Begin: urvalsgrupp -->
              <div
                  class="pb-5"
                  data-wizard-type="step-content"
                  data-wizard-state="pending"
              >
                <b-alert show variant="secondary">Ange hur stor andel (i procent) av medlemmar som ska ingå i stickprovet</b-alert>

                <div class="form-group">
                    <b-form-input type="range" min="1" max="100" v-model="pct_members"></b-form-input>
                </div>

                <b-row>
                  <b-col lg="4">
                    <b-form-group id="input-group-2" label="Procent av medlemmar" label-for="input-2">
                      <b-form-input type="text" id="input-2" v-model="pct_members_text" class="mb-2" disabled> </b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col lg="4">
                    <b-form-group id="input-group-3" label="Antal medlemmar" label-for="input-3">
                      <b-form-input type="text" id="input-3" v-model="num_members_text" class="mb-2" disabled> </b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
              </div>
              <!--End: urvalsgrupp -->

              <!--Begin: Alternativ -->
              <div
                  class="pb-5"
                  data-wizard-type="step-content"
                  data-wizard-state="pending"
              >
                <b-alert show variant="secondary">Medlemmar som innefattas av stickprovet kommer att få en länk skickad till sig där man bekräftar sitt medlemskap. Ange hur du vill att systemet ska skicka ut dessa länkar<br>Ifall du väljer SMS och/eller E-post så kommer 3 påminnelser att skickas ut till varje medlem som inte svarar, därefter kan du göra manuell uppringning på kvarvarande medlemmar</b-alert>

                <div class="form-group">
                    <div class="check-list">
                        <div class="d-flex align-items-center mb-4">
                            <label
                            class="checkbox checkbox-lg checkbox-outline checkbox-success"
                            >
                            <input
                                type="checkbox"
                                v-model="call_only"
                                @click="call_only = !call_only"
                            />
                            <span></span>
                            </label>
                            <span class="ml-3 cursor-pointer">Endast manuell uppringning</span>
                        </div>


                        <div class="d-flex align-items-center mb-4">
                            <label
                            class="checkbox checkbox-lg checkbox-outline checkbox-success"
                            >
                            <input
                                type="checkbox"
                                v-model="sendoutOptions"
                                value="email"
                                :disabled="emailDisabled"
                            />
                            <span></span>
                            </label>
                            <span class="ml-3 cursor-pointer">E-post</span>
                        </div>

                        <div class="d-flex align-items-center mb-4">
                            <label
                            class="checkbox checkbox-lg checkbox-outline checkbox-success"
                            >
                            <input
                                type="checkbox"
                                v-model="sendoutOptions"
                                value="sms"
                                :disabled="smsDisabled"
                            />
                            <span></span>
                            </label>
                            <span class="ml-3 cursor-pointer">SMS</span>
                        </div>

                    </div>
                </div>
              </div>
              <!--End: Alternativ -->

              <!--Begin: Slutdatum -->
              <div
                  class="pb-5"
                  data-wizard-type="step-content"
                  data-wizard-state="pending"
              >
                <b-alert show variant="secondary">Ange sista datum för stickprovet. När detta datum inträffar så kommer inga utskick längre att ske.</b-alert>

                <b-form-group id="input-group-datepicker" label="Slutdatum" label-for="input-datepicker">
                  <b-form-datepicker id="input-datepicker" v-model="form.deadline" class="mb-2"> </b-form-datepicker>
                </b-form-group>

              </div>
              <!--End: Slutdatum -->

              <!--Begin: Mallar -->
              <div
                  class="pb-5"
                  data-wizard-type="step-content"
                  data-wizard-state="pending"
              >
                <h5>Mallar för utskick</h5>

                <div v-if="sendEmail">
                  <b-alert show variant="secondary">I stickprovet har det angetts att e-post skall skickas, välj vilken mall som ska skickas ut till medlemmarna.</b-alert>

                  <b-row>
                    <b-col lg="8">
                      <b-form-group id="email_template_id-group" label="E-postmall att skicka ut" label-for="email_template_id">
                        <b-form-select
                          id="email_template_id"
                          v-model="email_template_id"
                          :options="emailTemplatesOptions"
                        ></b-form-select>
                      </b-form-group>
                    </b-col>
                    <b-col lg="4">
                      <b-button v-if="showPreviewEmail" type="button" variant="outline-secondary" style="margin-top: 26px;" @click="previewEmailClicked($event)">Förhandsgranska</b-button>
                    </b-col>
                  </b-row>

                </div>

                <div v-if="sendSMS">
                  <b-alert show variant="secondary">I stickprovet har det angetts att SMS skall skickas, välj vilken mall som ska skickas ut till medlemmarna.</b-alert>

                  <b-row>
                    <b-col lg="8">
                      <b-form-group id="sms_template_id-group" label="SMS att skicka ut" label-for="sms_template_id">
                        <b-form-select
                          id="sms_template_id"
                          v-model="sms_template_id"
                          :options="smsTemplatesOptions"
                        ></b-form-select>
                      </b-form-group>
                    </b-col>
                    <b-col lg="4">
                      <b-button v-if="showPreviewSms" type="button" variant="outline-secondary" style="margin-top: 26px;" @click="previewSmsClicked($event)">Förhandsgranska</b-button>
                    </b-col>
                  </b-row>
                </div>

              </div>
              <!--End: Mallar -->

              <!--Begin: Bekräfta -->
              <div
                  class="pb-5"
                  data-wizard-type="step-content"
                  data-wizard-state="pending"
              >
                <b-alert show variant="secondary">Stickprovet kommer att skapas när du klickar på "Skapa stickprov". Notera att de automatiska utskicken ej kommer att starta förrän du har aktivt valt att "Starta" stickprovet.</b-alert>
              </div>
              <!--End: Bekräfta -->

              <!--begin: Wizard Actions -->
              <div class="d-flex justify-content-between border-top pt-10">
                <div class="mr-2">
                  <button
                    class="btn btn-light-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-prev"
                  >
                    Föregående
                  </button>
                </div>
                <div>
                  <button
                    class="btn btn-primary font-weight-bold text-uppercase px-9 py-4 text-right"
                    data-wizard-type="action-next"
                    :disabled="disabledNextButton"
                    v-on:click="nextPage"
                  >
                    Nästa steg
                  </button>
                </div>

                <div>
                  <button
                    class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                    data-ktwizard-type="action-submit"
                    v-on:click="createStickprov"
                    v-if="currentPage === 7"
                  >
                    Skapa stickprov
                  </button>
                </div>
              </div>
              <!--end: Wizard Actions -->
            </form>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/sass/pages/wizard/wizard-3.scss';

.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import CompanySelectTable from '@/view/pages/ml/stickprov/CompanySelectTable.vue';

import KTUtil from '@/assets/js/components/util';
import KTWizard from '@/assets/js/components/wizard';

export default {
  name: 'stickprovwizard',
  components: {
    CompanySelectTable
  },
  props: ["stickprovs"],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'companies', 'periods']),
    disabledNextButton(){
      if (this.wizard){
        switch (this.wizard.currentStep) {
          case 2:
            if (Object.keys(this.counts).length > 0)
              return this.createOption === null || Object.keys(this.counts.counts).length === 0;
            else
              return true;
          case 3:
            return this.pct_members === 0;
          case 4:
            return !this.call_only && this.sendoutOptions.length === 0;
          case 5:
            return !this.form.deadline;
          default:
            return false;
        }
      } else return false;
    },
  },
  mounted: function () {
    console.log(this.periods);
    this.loadData();

    for (var i = 0; i < this.companies.length; ++i) {
      if (this.companies[i].id === this.currentCompanyId) {
        this.company = { id: this.currentCompanyId, name: this.companies[i].name };
        break;
      }
    }

    this.createWizard();
  },
  data() {
    return {
      smsDisabled: false,
      emailDisabled: false,
      call_only: false,
      previewContent: '',
      sendEmail: false,
      sendSMS: false,
      sms_template_id: '',
      email_template_id: '',
      smsTemplatesOptions: [],
      emailTemplatesOptions: [],
      templates: [],
      created: false,
      sendoutOptions: [],
      form: {},
      showNext: true,
      currentPage: 0,
      wizard: null,
      createOption: null,
      companySelection: [],
      company: { id: '', name: '' },
      pct_members: 0,
      pct_members_text: '0 %',
      num_members_text: 0,
      num_members_total: 30000,
      showPreviewSms: false,
      showPreviewEmail: false,
      filterCompanies: [],
      counts: {},
    };
  },
  watch: {
    call_only(newValue, oldVal) {
      if (newValue) {
        this.sendoutOptions = [];
        this.emailDisabled = true;
        this.smsDisabled =  true;
      }
      else {
        this.emailDisabled = false;
        this.smsDisabled = false;
      }
    },
    sms_template_id(newVal, oldVal) {
      if (!newVal || newVal === '') {
        this.showPreviewSms = false;
      }
      else {
        this.showPreviewSms = true;
      }
    },
    email_template_id(newVal, oldVal) {
      if (!newVal || newVal === '') {
        this.showPreviewEmail = false;
      }
      else {
        this.showPreviewEmail = true;
      }
    },
    pct_members(newVal, oldVal) {
      this.form.pct_members = newVal;

      this.pct_members_text = newVal + " %";
      this.num_members_text = Math.floor(this.num_members_total * (newVal / 100.0));
    },
    sendoutOptions(newVal, oldVal) {
      this.sendEmail = false;
      this.sendSMS = false;

      for (var i = 0; i < newVal.length; ++i) {
        if (newVal[i] === 'email') {
          this.sendEmail = true;
        }
        else if (newVal[i] === 'sms') {
          this.sendSMS = true;
        }
      }
    },
    showNext(newVal, oldVal) {
      console.log('showNext changed: ' + newVal);
    },
  },
  methods: {
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
    loadFilter() {
      const loader = this.$loading.show();
      axios
        .get(`/stickprov/companies?period_id=${this.currentPeriodId}&company_id=${this.currentCompanyId}`)
        .then(res => {
          if (Array.isArray(res.data))
            this.filterCompanies = res.data;
          else
            this.filterCompanies = [];
          loader.hide();
        })
        .catch(err => {
          console.log(err);
          loader.hide();
        });
    },
    previewEmailClicked(e) {
      e.preventDefault();

      var that = this;

      this.getTemplate(this.email_template_id, function(data){
        that.previewContent = data.template;

        that.$refs['previewModal'].show();
      });
    },
    previewSmsClicked(e) {
      e.preventDefault();

      var that = this;

      this.getTemplate(this.sms_template_id, function(data){
        that.previewContent = data.template;

        that.$refs['previewModal'].show();
      });
    },
    getTemplate(template_id, callback) {
      axios
        .get(`/template?template_id=${template_id}`)
        .then(res => {
          callback(res.data.template);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta malldata');
        });
    },
    nextPage() {
      // make sure that the next button is properly disabled when clicking on next
      // this.wizard.getStep()
      if (this.wizard.currentStep === 1 && this.filterCompanies.length === 0) {
        this.loadFilter();
      }
    },
    onCompanySelectionChanged(companyList) {
      this.companySelection = companyList;
      // fetch the client count

      var date = this.getCurrentPeriodDate();

      axios
        .post('/client/count', { date: date, company_ids: this.companySelection })
        .then(res => {
          this.counts = res.data;
          this.num_members_total = this.counts.total;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte beräkna antal medlemmar');
        });
    },
    getCurrentPeriodDate() {
      for (var i = 0; i < this.periods.length; ++i) {
        if (this.periods[i].id === this.currentPeriodId) {
          return this.periods[i].from;
        }
      }

      return '';
    },
    createWizard() {
      var that = this;

      that.showNext = true;

      // Initialize form wizard
      that.wizard = new KTWizard('kt_wizard_v3', {
        startStep: 1, // initial active step number
        clickableSteps: true // allow step clicking
      });

      // Validation before going to next page
      that.wizard.on('beforeNext', function (/*wizardObj*/) {
        // validate the form and use below function to stop the wizard's step
        // wizardObj.stop();
      });

      // Change event
      that.wizard.on('change', function (/*wizardObj*/) {
        setTimeout(() => {
          KTUtil.scrollTop();

          that.currentPage = that.wizard.currentStep;

          // if (that.currentPage === 2 && that.createOption === null) {
          //   that.disabledNextButton = true;
          // }

        }, 200);
      });

      that.showNext = false;
    },
    countMembers(company_ids) {
      axios
        .post('/client/count', { company_ids: company_ids })
        .then(res => {
          this.num_members_total = res.data.total;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte beräkna medlemmar');
        });
    },
    createStickprov(e) {

      e.preventDefault();

      var data = {
        company_id:         this.currentCompanyId,
        period_id:          this.currentPeriodId,
        company_ids:        this.companySelection,
        company_option:     this.createOption,
        deadline:           this.form.deadline,
        email_template_id:  this.email_template_id,
        sms_template_id:    this.sms_template_id,
        send_email:         this.sendEmail ? 1 : 0,
        send_sms:           this.sendSMS ? 1 : 0,
        pct_clients:        this.form.pct_members,
        company_name:       this.company.name,
        call_only:          this.call_only ? 1 : 0
      };

      axios
        .post('/stickprov', data)
        .then(res => {
          this.toastr('success', 'OK', 'Stickprovet har skapats');

          if (res.data.hasOwnProperty('stickprovs')) {
            for (var i = 0; i < res.data.stickprovs.length; ++i) {
              this.$emit('stickprovCreated', res.data.stickprovs[i]);
            }
          }
          else {
            this.$emit('stickprovCreated', res.data.stickprov);
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa stickprov');
        });
    },
    async loadData() {
      await this.loadTemplates();
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
