<template>
  <div class="wizard-body mx-auto bg-white shadow-sm">
    
    <b-card v-if="created" title="Medlemskonto skapat!" hide-footer class="mb-2 mt-2 ">
      <b-alert variant="success" show
        >Ditt konto har skapats och en aktiveringslänk har skickats till din angivna
        e-postadress</b-alert
      >
    </b-card>

    <b-card v-if="error" title="Ett fel uppstod" hide-footer class="mb-2 mt-2 bg-white">
      <b-alert variant="danger" show
        >Ditt konto blev inte skapat. Försök igen senare.</b-alert
      >
    </b-card>

    <!-- End: Member Type-->
    <b-card v-if="!created" title="" class="wizard-body mb-5 pt-5 bg-white" hide-footer>
      <!--begin: Wizard-->

      <b-card v-if="pages === null || pages.length === 0">
        <div class="d-flex justify-content-center mb-3">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </b-card>

      <!--begin: Wizard Body-->
      <div class="h-100 d-flex align-items-center justify-content-center">
        <div class="col-xl-12 col-xxl-10">

          <!--begin: Wizard Form-->
          <form class="form" id="kt_form" @submit.prevent="createAccount">

            <template v-for="(page, i) in pages">
              <!-- Begin: Area Alloc --->
              <div class="fade-in-up-enter-to" :key="i" v-if="page.type === 'area_alloc'">
                <AreaAllocPage
                  v-show="renderPage.id === page.id"
                  ref="areaAllocPage"
                  :registration="registration"
                  :page="page"
                  :company_id="company_id"
                  :region_code="region_code"
                  :commune_code="commune_code"
                  @isValid="isValid"
                  @setData="setData"
                />
              </div>
              <!-- End: Area Alloc --->

              <!-- Begin: Personnr -->
              <div class="fade-in-up-enter-to" :key="i" v-else-if="page.type === 'personnr'">
                <PersonnrPage
                  v-show="renderPage.id === page.id"
                  ref="personnrPage"
                  :page="page"
                  @isValid="isValid"
                  @setData="setData"
                  @doSparLookup="doSparLookup"
                />
              </div>
              <!-- End: Personnr -->

              <!-- Begin: Details -->
              <div class="fade-in-up-enter-to" :key="i" v-else-if="page.type === 'details'">
                <DetailsPage
                  v-show="renderPage.id === page.id"
                  ref="detailsPage"
                  :spar="spar"
                  :page="page"
                  @isValid="isValid"
                  @setData="setData"
                />
              </div>

              <!-- End: Details -->

              <!-- Begin: Register Family -->
              <div class="fade-in-up-enter-to" :key="i" v-else-if="page.type === 'reg_family'">
                <RegisterFamily
                  v-show="renderPage.id === page.id"
                  ref="regFamilyPage"
                  :company_id="company_id"
                  :page="page"
                  @isValid="isValid"
                  @setData="setData"
                />
              </div>

              <!-- End: Register Family -->

              <!-- Begin: Properties -->
              <div class="fade-in-up-enter-to" :key="i" v-else-if="page.type === 'properties'">
                <PropertyPage
                  v-show="renderPage.id === page.id"
                  ref="propertyPage"
                  :company_id="company_id"
                  :page="page"
                  @isValid="isValid"
                  @setData="setData"
                />
              </div>
              <!-- End: Properties -->

              <!-- Begin: Parents -->
              <div class="pb-5 fade-in-up-enter-to" :key="i" v-else-if="page.type === 'parents' && age < company.registration.age_max_parent">
                <ParentsPage
                  v-show="renderPage.id === page.id"
                  ref="parentsPage"
                  :age="age"
                  :age-max-parent="company.registration.age_max_parent"
                  :page="page"
                  @isValid="isValid"
                  @setData="setData"
                />
              </div>
              <!-- End: Parents -->

              <!-- Begin: Shop -->
              <div class="fade-in-up-enter-to" :key="i" v-else-if="page.type === 'shop'">
                <ShopMembershipSelect
                  v-show="renderPage.id === page.id"
                  ref="shopPage"
                  :memberships="memberships"
                  :extras="extras"
                  :page="page"
                  :age="age"
                  @membershipClicked="membershipClicked"
                  @shopItemsUpdated="shopItemsUpdated"
                  @isValid="isValid"
                  @setData="setData"
                />
              </div>
              <!-- End: Shop -->

               <!-- Begin: Final confirm step -->
                <div class="fade-in-up-enter-to" :key="i" v-else-if="page.type === 'confirm'">
                  <ConfirmPage
                    v-show="renderPage.id === page.id"
                    ref="confirmPage"
                    :page="page"
                    :regdata="regdata"
                    :company="company"
                    @isValid="isValid"
                    @isAllPolicyChecked="isAllPolicyChecked"
                    @setData="setData"
                  />
                </div>
                <!-- End: Final confirm step -->

            </template>

            <!--begin: Wizard Actions -->
            <div class="d-flex justify-content-between border-top pt-10">
              <div class="mr-2" v-show="renderPage && !renderPage.first">
                <button
                  class="btn btn-light-primary font-weight-bold text-uppercase px-9 py-4"
                  v-on:click="previousPage($event)"
                >
                  Föregående
                </button>
              </div>
              <div v-show="!lastPage && showNext">
                <button
                  class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                  @click.stop="nextPage"
                >
                  Nästa steg
                </button>
              </div>

              <div v-show="lastPage && showNext">
                <button
                  class="btn btn-primary font-weight-bold text-uppercase px-9 py-4"
                  type="submit"
                >
                  Skapa konto
                </button>
              </div>
            </div>
            <!--end: Wizard Actions -->
          </form>
        </div>
      </div>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.wizard-body {
  max-width: 1000px;
  width: 100%;
}


</style>

<script>



///import AreaAllocMapByRegion from '@/view/pages/members/register/registerwizard/area_alloc/AreaAllocMapByRegion.vue';
import AreaAllocMultiMembership from '@/view/pages/members/register/registerwizard/area_alloc/AreaAllocMultiMembership.vue';

import messageParent from '@/core/services/messageParent';
import axios from 'axios';
import { mapGetters } from 'vuex';

import RegisterWizardPage from '@/view/pages/members/register/registerwizard/RegisterWizardPage.vue';
import RegisterWizardHeader from '@/view/pages/members/register/registerwizard/RegisterWizardHeader.vue';
import ShopMembershipSelect from '@/view/pages/members/register/registerwizard/ShopMembershipSelect.vue';
import ConfirmPage from '@/view/pages/members/register/registerwizard/ConfirmPage.vue';
import PropertyPage from '@/view/pages/members/register/registerwizard/PropertyPage.vue';
import PersonnrPage from '@/view/pages/members/register/registerwizard/PersonnrPage.vue';
import ParentsPage from '@/view/pages/members/register/registerwizard/ParentsPage.vue';
import DetailsPage from '@/view/pages/members/register/registerwizard/DetailsPage.vue';
import AreaAllocPage from '@/view/pages/members/register/registerwizard/AreaAllocPage.vue';
//import DinteroPayment from '@/view/pages/members/register/registerwizard/DinteroPayment.vue';
import MemberTypePage from '@/view/pages/members/register/registerwizard/MemberTypePage.vue';
import RegisterFamily from "./registerwizard/RegisterFamily";
import KTUtil from '@/assets/js/components/util';


export default {
  name: 'registerwizard',
  components: {
    
    AreaAllocMultiMembership,
    RegisterWizardPage,
    RegisterWizardHeader,
    ShopMembershipSelect,
    ConfirmPage,
    PropertyPage,
    PersonnrPage,
    ParentsPage,
    DetailsPage,
    AreaAllocPage,
    //DinteroPayment,
    MemberTypePage,
    RegisterFamily
  },
  mounted: function() {
    messageParent(JSON.stringify({ message: 'this is a message from the child iframe' }));

    this.loadData();
  },
  data() {
    return {
      spar: null,
      registration: null,
      lastPage: false,
      form: {},
      memberships: [],
      extras: [],
      company: {},
      regdata: {},
      accept_terms: false,
      age: 0,
      groups: [],
      region_code: '',
      commune_code: '',
      regions: [],
      communes: [],
      regionOptions: [],
      communeOptions: [],
      showNext: false,
      currentPage: 0,
      wizard: null,
      order: {},
      pages: [],
      confirmPage: {
        settings: {
          terms: []
        }
      },
      created: false,
      error: false,
      show: '',
      show_list: [],
      personNr: {},
      isMemberTypePage: true,
      renderPage: null,
    };
  },
  watch: {
    age(newVal, oldVal) {
      // find min age we allow without parent
      if (newVal > this.registration.age_max_parent) {
        this.pages = this.pages.filter(p => p.type !== 'parents');
      }
    },
    commune_code(newVal, oldVal) {
      if (!newVal) {
        return;
      }
      if (this.region_code in this.regions && newVal in this.regions[this.region_code].communes) {
        this.form.commune = this.regions[this.region_code].communes[newVal].commune;
      }
    },
    region_code(newVal, oldVal) {
      if (!newVal) {
        return;
      }

      if (newVal in this.regions) {
        this.form.region = this.regions[newVal].region;
      }
    },
    showNext(newVal, oldVal) {},
  },
  methods: {
    setMemberType(type){
      
      if (type === 'normal'){
        this.pages = this.pages.filter(page => {
          return page.type !== 'reg_family';
        });
        this.show_list = this.show_list.filter(item => {
          return item !== 'reg_family';
        })
      }
      this.isMemberTypePage = false;
    },
    getPersonNumberData() {
      if (this.$refs.personnrPage && this.$refs.personnrPage.length > 0)
        return this.$refs.personnrPage[0].getData();
      return null;
    },
    getData() {
      var d = {};

      if (this.$refs.personnrPage !== undefined && this.$refs.personnrPage.length > 0) {
        d.personnr = this.$refs.personnrPage[0].getData();
      }

      if (this.$refs.detailsPage !== undefined && this.$refs.detailsPage.length > 0) {
        d.details = this.$refs.detailsPage[0].getData();

        this.region_code = d.details.region_code;
        this.commune_code = d.details.commune_code;

        if (d.personnr !== null && d.personnr !== undefined) {
          this.age = d.personnr.age;
          d.details.age = this.age;
        }
      }

      if (this.$refs.propertyPage !== undefined && this.$refs.propertyPage.length > 0) {
        d.properties = this.$refs.propertyPage[0].getData();

        if (d.properties === null || d.properties === undefined) {
          d.properties = [];
        }
      }
      else {
        d.properties = [];
      }

      if (this.$refs.areaAllocPage !== undefined && this.$refs.areaAllocPage.length > 0) {
        d.area_alloc = this.$refs.areaAllocPage[0].getData();
      }

      if (this.$refs.parentsPage !== undefined && this.$refs.parentsPage.length > 0) {
        d.parents = this.$refs.parentsPage[0].getData();
      }

      if (this.$refs.shopPage !== undefined && this.$refs.shopPage.length > 0) {
        d.shop = this.$refs.shopPage[0].getData();
      }
      d.company_id = this.company_id;
      
      if (!d.hasOwnProperty('area_alloc')) {
        d.area_alloc = { company_ids: [ this.company_id ] };
      }
      else if (!d.area_alloc.hasOwnProperty('company_ids')) {
        d.area_alloc = { company_ids: [ this.company_id ] };
      }

      return d;
    },
    setData(data, id) {
      
      for (var i = 0; i < this.form.length; ++i) {
        if (this.form[i].id === id) {
          this.form[i] = data;
        }
      }
      
    },
    nextPage(e) {
      // debugger;
      e.preventDefault();

      this.showNext = false;
      
      let data = this.getData();

      if (data.hasOwnProperty('details') && data.hasOwnProperty('personnr')) {
        if (data.personnr.valid) {
          this.$refs.detailsPage[0].setBirthdate(
            data.personnr.formatted.year +
            data.personnr.formatted.month +
            data.personnr.formatted.day
          );
          this.age = data.personnr.age;
        }
      } else if (data.hasOwnProperty('details')) {
        this.age = data.details.age;
      } else if (data.hasOwnProperty('personnr')) {
        if (data.personnr.valid) {
          this.age = data.personnr.age;
        }
      }

      var next_index = 0;

      for(var i = 0; i < this.pages.length; ++i) {
        if (this.renderPage.id === this.pages[i].id) {
          next_index = i + 1;
          break;
        }
      }

      if (this.pages.length === next_index) {
        // bad...
        console.error('next page will be beyond the pages length');
      }
      else {
        this.renderPage = this.pages[next_index];
      }

      this.regdata = this.getData();

      if (this.renderPage.valid) {
        this.showNext = true;
      }

      setTimeout(function(){
        messageParent(JSON.stringify({ height: document.body.scrollHeight }));
      }, 300);

    },
    previousPage(e) {
      
      e.preventDefault();
      
      if (this.renderPage === null || this.renderPage === undefined) {
        return;
      }

      for (let i = 0; i < this.pages.length; ++i) {
        if (this.pages[i].id === this.renderPage.id) {
          
          if (i-1 < 0) {
            return;
          }

          this.renderPage = this.pages[i-1];

          this.showNext = true;

          setTimeout(function(){
            messageParent(JSON.stringify({ height: document.body.scrollHeight }));
          }, 300);

          return;
        }
      }
    },
    isIdCurrentPage(id) {
      

      return this.renderPage !== null && this.renderPage !== undefined && this.renderPage.id === id;
    },

    isAllPolicyChecked(isChecked) {
      
      this.accept_terms = isChecked;
    },
    isValid(valid, id) {
      

      if (this.isIdCurrentPage(id)) {
        this.showNext = valid;
      }
      
      console.log('Main.isValid: valid: ' + valid + ' id: ' + id + ' showNext: ' + this.showNext + ' currentPage: ' + this.isIdCurrentPage(id));

      for (var i = 0; i < this.pages.length; ++i) {
        if (this.pages[i].id === id) {
          this.pages[i].valid = valid;
        }
      }

      let allValid = true;

      // check if all is valid
      for (const p of this.pages) {
        if (!p.valid) {
          allValid = false;
          break;
        }
      }

      if (allValid) {
        console.log('Main.isValid: all is valid');
        if (this.pages[this.pages.length-1].id === this.renderPage.id) {
          this.showNext = true;
          this.lastPage = true;
        }
        else {
          this.showNext = true;
          this.lastPage = false;
        }
      }
    },
    doSparLookup(personnr) {
      console.log('doing personnr lookup');
      console.log(personnr);

      axios 
        .get(`/client/spar_personnr?company_id=${this.company_id}&in_personnr=${personnr}`)
        .then(res => {
          if (res.status === 200) {
            this.spar = res.data;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'OK', 'Kunde inte göra SPAR uppslag');
        });
    },
    membershipClicked(membershipId) {
      this.showNext = true;
    },
    shopItemsUpdated(obj) {
      
    },
    submit() {
      
    },
    async loadData() {
      

      this.company_id = this.$route.params.id;

      this.loadRegistration(this.company_id);
      this.loadRegions();
    },
    loadRegistration(company_id) {
      
      axios
        .get(`/company/public?company_id=${company_id}`)
        .then(res => {
          this.company = res.data.company;
          this.memberships = [];
          this.extras = [];
          this.company.shop_items.filter(item => {
            if (item.meta.is_member_fee === 1 && Boolean(item.is_active)) this.memberships.push(item);
            if (item.meta.is_member_fee === 0 && Boolean(item.is_active)) this.extras.push(item);
          })
          
          this.accept_terms = false;

          this.registration = res.data.company.registration;

          var that = this;
          this.pages = this.registration.pages;

          this.pages[0].state = 'current';
          
          for (var i = 0; i < this.pages.length; ++i) {
            this.pages[i].first = false;
          }
          this.pages[0].first = true;

          for (var i = 1; i < this.pages.length; ++i) {
            this.pages[i].state = 'pending';
          }

          /*this.pages.push({
            id: 'confirmpage',
            index: this.pages.length,
            type: 'confirm',
            state: 'pending',
            valid: false,
            html: '',
            settings: {}
          });*/

          //this.show = this.show_list[this.show_index];

          this.renderPage = this.pages[0];

          setTimeout(function(){
            messageParent(JSON.stringify({ height: document.body.scrollHeight }));
          }, 300);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta registreringswizard');
        });
    },
    createAccount() {
      
      var data = this.getData();
      axios
        .post('/client/public', data)
        .then(res => {
          if (res.status === 201) {
            this.created = true;
            messageParent(JSON.stringify({ register: true, client_id: res.data.client.client_id, token: res.data.token }));

            if (res.data.order !== null) {
              console.log('there is a order needed payment');

              this.$router.push('/payment/' + res.data.client.client_id);
            }
            else {
              console.log('No payment order, were finished');
            }
          }
          else {
            this.error = true;
             messageParent(JSON.stringify({ register: false }));
          }
        })
        .catch(err => {
          messageParent(JSON.stringify({ register: false }));

          this.error = true;
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa medlemskonto');
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
    loadRegions() {
      
      axios
        .get('/location/regions')
        .then(res => {
          this.regions = res.data.regions;
          this.regionOptions = [];

          for (var k in this.regions) {
            this.regionOptions.push({ value: k, text: this.regions[k].region });
          }

          this.regionOptions.sort(function(a, b) {
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
    selectRegion(region_code) {
      
      this.loadCommunes(region_code, 1);
    },
    getCommunes(region_code) {
      var comm = [];

      var communes = this.regions[region_code].communes;
      this.communes = communes;

      for (var k in communes) {
        comm.push({ value: k, text: communes[k].commune });
      }

      comm.sort(function(a, b) {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      });

      return comm;
    },
    loadCommunes(selectedRegion, option) {
      
      this.communeOptions = [];

      var communes = this.regions[selectedRegion].communes;
      this.communes = communes;

      for (var k in communes) {
        this.communeOptions.push({ value: k, text: communes[k].commune });
      }

      this.communeOptions.sort(function(a, b) {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      });

      if (option == 1) {
        this.communeOptions1 = this.communeOptions;
      } else {
        this.communeOptions2 = this.communeOptions;
      }
    }
  }
};
</script>
