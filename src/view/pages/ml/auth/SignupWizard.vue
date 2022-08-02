<template>
  <div class="px-5 mb-8 bg-white" style="height: 100%;" id="page-periods">
    <h4 class="mb-8 ml-2 mt-8">Registrering</h4>
    <b-card v-if="created" title="Föreningen har skapats" hide-footer class="mb-2 mt-2">
        <b-alert variant="success" show>En inbjudningslänk har skickats till alla angivna administratörer. Klicka på länken i mailet för att få tillgång till föreningen.</b-alert>
    </b-card>
    <b-card v-if="!created" title="" class="mb-2 shadow-sm" hide-footer>
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
            <div class="wizard-step" data-wizard-type="step" data-wizard-state="current">
              <div class="wizard-label">
                <h3 class="wizard-title">
                  <span>1</span> Uppgifter
                </h3>
                <div class="wizard-bar"></div>
              </div>
            </div>

            <div class="wizard-step" data-wizard-type="step" data-wizard-state="pending">
              <div class="wizard-label">
                <h3 class="wizard-title">
                  <span>2</span> Säte
                </h3>
                <div class="wizard-bar"></div>
              </div>
            </div>

            <div class="wizard-step" data-wizard-type="step" data-wizard-state="pending">
              <div class="wizard-label">
                <h3 class="wizard-title">
                  <span>3</span> Föreningstyp
                </h3>
                <div class="wizard-bar"></div>
              </div>
            </div>

            <div class="wizard-step" data-wizard-type="step" data-wizard-state="pending">
              <div class="wizard-label">
                <h3 class="wizard-title">
                  <span>4</span> Administratörskonton
                </h3>
                <div class="wizard-bar"></div>
              </div>
            </div>

            <div class="wizard-step" data-wizard-type="step" data-wizard-state="pending">
              <div class="wizard-label">
                <h3 class="wizard-title">
                  <span>5</span> Medlemskrav
                </h3>
                <div class="wizard-bar"></div>
              </div>
            </div>

            <div class="wizard-step" data-wizard-type="step" data-wizard-state="pending">
              <div class="wizard-label">
                <h3 class="wizard-title">
                  <span>6</span> Kontrollera
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
              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="current">
                <b-alert
                  show
                  variant="light"
                  >{{ isStandalone ? 'Du registrerar en förening som saknar moderförening' : ('Du registrerar en förening som är under ' + this.parent_company.name) }} </b-alert>
                
                <OrgNumber
                  ref="org_number"
                  :page="pages[0]"
                  :index="0"
                  @isValid="isValid"
                />
              </div>

              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <Address
                  ref="address"
                  :page="pages[1]"
                  :index="1"
                  @isValid="isValid"
                />
              </div>

              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <CompanyType
                  :isStandalone="isStandalone"
                  ref="type"
                  :page="pages[2]"
                  :index="2"
                  @isValid="isValid"
                />
              </div>

              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <UserAccounts
                  ref="users"
                  :page="pages[3]"
                  :index="3"
                  @isValid="isValid"
                />
              </div>

              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <MembershipRequirements
                  ref="requirements"
                  :page="pages[4]"
                  :index="4"
                  @isValid="isValid"
                />
              </div>

              <div class="pb-5" data-wizard-type="step-content" data-wizard-state="pending">
                <Confirm
                  ref="confirm"
                  :page="pages[5]"
                  :regdata="regdata"
                  :index="5"
                  @isValid="isValid"
                />
              </div>

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
                    class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                    data-wizard-type="action-next"
                    :disabled="disabledNextButton"
                    v-on:click="nextPage($event)"
                  >
                    Nästa steg
                  </button>
                </div>

                <div>
                  <button
                    class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                    data-ktwizard-type="action-submit"
                    @click.prevent="createCompany"
                    v-if="lastPage"
                  >
                    Skapa konto
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


import messageParent from '@/core/services/messageParent';
import axios from 'axios';
import { mapGetters } from 'vuex';
import Address from '@/view/pages/ml/auth/SignupPages/Address.vue';
import CompanyType from '@/view/pages/ml/auth/SignupPages/CompanyType.vue';
import Confirm from '@/view/pages/ml/auth/SignupPages/Confirm.vue';
import MembershipRequirements from '@/view/pages/ml/auth/SignupPages/MembershipRequirements.vue';
import OrgNumber from '@/view/pages/ml/auth/SignupPages/OrgNumber.vue';
import UserAccounts from '@/view/pages/ml/auth/SignupPages/UserAccounts.vue';

import KTUtil from '@/assets/js/components/util';
import KTWizard from '@/assets/js/components/wizard';

export default {
  name: 'registerwizard',
  components: {
    Address,
    CompanyType,
    Confirm,
    MembershipRequirements,
    OrgNumber,
    UserAccounts,
  },
  mounted: function () {
    this.parent_company_id = this.$route.params.id;

    if (this.parent_company_id === undefined) {
      this.parent_company_id = this.$route.query.id;
    }

    if (this.parent_company_id === undefined) {
      this.isStandalone = true;
    }
    else {
      this.isStandalone = false;
      this.loadParentCompany(this.parent_company_id);
    }

    
    this.createWizard();
  },
  data() {
    return {
      parent_company: {},
      isStandalone: true,
      lastPage: false,
      disabledNextButton: true,
      parent_company_id: null,
      showNext: true,
      currentPage: 0,
      wizard: null,
      order: {},
      pages: [
        { html: '', index: 0, id: 0, name: 'org_number', valid: false, state: 'current' },
        { html: '', index: 1, id: 1, name: 'address', valid: false, state: 'pending' },
        { html: '', index: 2, id: 2, name: 'type', valid: false, state: 'pending' },
        { html: '', index: 3, id: 3, name: 'users', valid: false, state: 'pending' },
        { html: '', index: 4, id: 4, name: 'requirements', valid: false, state: 'pending' },
        { html: '', index: 5, id: 5, name: 'confirm', valid: false, state: 'pending' },
      ],
      created: false,
      error: false,
      regdata: {},
      form: {}
    };
  },
  watch: {
    showNext(newVal, oldVal) {

    },
  },
  methods: {
    loadData() {},
    loadParentCompany(company_id) {
      axios 
        .get(`/company/public?company_id=${company_id}`)
        .then(res => {
          this.parent_company = res.data.company;
        })
        .catch(err => {
          console.error(err);
        });
    },
    getData() {
      var d = {};

      if (this.$refs.org_number !== undefined) {
        d.org_number = this.$refs.org_number.getData();
      }

      if (this.$refs.address !== undefined) {
        d.address = this.$refs.address.getData();
      }

      if (this.$refs.type !== undefined) {
        d.type = this.$refs.type.getData();
      }

      if (this.$refs.requirements !== undefined) {
        d.requirements = this.$refs.requirements.getData();
      }

      if (this.$refs.users !== undefined) {
        d.admins = this.$refs.users.getData();
      }

      d.company_data = {
        pc_id:          this.parent_company_id,
        standalone:     this.isStandalone,
        name:           d.address.name,
        org_number:     d.org_number.fmt_org_number,
        zipcode:        d.address.zipcode,
        address:        d.address.address,
        co:             d.address.co,
        post:           d.address.post, // not filled
        region_code:    d.address.region_code,
        commune_code:   d.address.commune_code,
        country:        d.address.country, // not filled
        type:           d.type.type
      }

      this.regdata = d;

      return d;
    },
    setData(data, index) {
      this.form[index] = data;
    },
    nextPage(e) {
      e.preventDefault();

      // make sure that the next button is properly disabled when clicking on next
      this.disabledNextButton = !this.pages[this.wizard.getStep()].valid;

      if (this.pages.length === this.wizard.getStep()) {
        this.lastPage = true;
      }

      this.regdata = this.getData();

      setTimeout(function(){
        messageParent(JSON.stringify({ height: document.body.scrollHeight }));
      }, 300);
    },
    isValid(valid, index) {
      var currentStep = 0;

      if (this.wizard !== undefined && this.wizard !== null) {
        currentStep = this.wizard.getStep() - 1;
      }

      if (index == currentStep) {
        this.showNext = valid;
        this.disabledNextButton = !valid;
        this.lastPage = this.pages[index].name == 'confirm';
      }
      else {
        console.log('not showing next');
      }

      if (this.pages.length > index) {
        this.pages[index].valid = valid;
      }

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

          that.$refs[that.pages[that.currentPage-1].name].doValidation();

          if ((that.currentPage-1) === that.pages.length) {
            console.log('last page');
          }
        }, 200);
      });

      that.showNext = false;

      setTimeout(function(){
        messageParent(JSON.stringify({ height: document.body.scrollHeight }));
      }, 300);
    },
    createCompany() {
      var data = this.getData();

      axios
        .post('/company/signup', data)
        .then(res => {
          if (res.status === 201) {
            this.created = true;
            this.error = false;
          }
          else {
            this.created = false;
            this.error = true;
            this.toastr('danger', 'Fel', 'Kunde inte skapa förening');
          }
          
        })
        .catch(err => {
          this.error = true;
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa förening');
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
