<template>
  <div class="px-5" id="page-periods">
    <h5 class="mb-6 ml-2">Föreningsinställningar</h5>

    <b-card title="" class="mb-2" hide-footer>
      <v-tabs background-color="white" color="deep-purple accent-4" right>
        <v-tab>Offentligt</v-tab>
        <v-tab>Länkar</v-tab>
        <v-tab>Registrering</v-tab>
        <v-tab>Titlar</v-tab>
        <v-tab>Bank</v-tab>
        <v-tab>Medlemskrav</v-tab>
        <v-tab>Medlemsprofil</v-tab>
        <v-tab>E-post</v-tab>
        <!--<v-tab>Swish</v-tab>-->
        <v-tab>Dintero</v-tab>
        <v-tab>Fortnox</v-tab>
        <v-tab>API Koppling</v-tab>
        <v-tab>Evenemang</v-tab>
        <v-tab v-if="company.sid === company.company_id">Extra Data</v-tab>

        <v-tab-item>
          <Basic
            :creating="false"
            :company="company"
            :regions="regions"
            :extras="extras"
            @selectRegion1="selectRegion1"
          />
        </v-tab-item>

        <v-tab-item>
          <Links />
        </v-tab-item>

        <v-tab-item>
          <Registration
            :regions="regions"
            :company="company"
            @updateRegistration="updateRegistration"
            @selectRegion="selectRegion2"
          />
        </v-tab-item>

        <v-tab-item>
          <Titles :settings="company.settings" @updateSettings="updateTitleSettings" />
        </v-tab-item>

        <v-tab-item>
          <Bank />
        </v-tab-item>

        <v-tab-item>
          <Requirements :company="company" />
        </v-tab-item>

        <v-tab-item>
          <MemberProfile :company="company" />
        </v-tab-item>

        <v-tab-item>
          <Email :smtp="company.smtp" @updateSettings="updateEmailSettings" />
        </v-tab-item>

        <!--<v-tab-item>
          <Swish :settings="company.settings" @updateSettings="updateSwishSettings" />
        </v-tab-item>-->

        <v-tab-item>
          <CreditCard :settings="company.settings" />
        </v-tab-item>

        <v-tab-item>
          <Fortnox :settings="company.settings"  />
        </v-tab-item>

        <v-tab-item>
          <APIConnection :domains="company.origins" />
        </v-tab-item>

        <v-tab-item>
          <Evenemang :settings="company.settings" />
        </v-tab-item>


        <v-tab-item v-if="company.sid === company.company_id">
          <ExtraData />
        </v-tab-item>

      </v-tabs>
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
import APIConnection from '@/view/pages/ml/settings/APIConnection.vue';
import Evenemang from '@/view/pages/ml/settings/Evenemang.vue';
import Fortnox from '@/view/pages/ml/settings/Fortnox.vue';
import CreditCard from '@/view/pages/ml/settings/CreditCard.vue';
import Swish from '@/view/pages/ml/settings/Swish.vue';
//import Pricing from '@/view/pages/ml/settings/Pricing.vue';
import Email from '@/view/pages/ml/settings/Email.vue';
import Requirements from '@/view/pages/ml/settings/Requirements.vue';
import Bank from '@/view/pages/ml/settings/Bank.vue';
import Titles from '@/view/pages/ml/settings/Titles.vue';
import Registration from '@/view/pages/ml/settings/Registration.vue';
import Basic from '@/view/pages/ml/settings/Basic.vue';
import ExtraData from '@/view/pages/ml/settings/ExtraData.vue';
import Links from '@/view/pages/ml/settings/Links.vue';
import MemberProfile from '@/view/pages/ml/settings/MemberProfile.vue';
import { SET_COMPANY } from '../../../core/services/store/common.module';

export default {
  name: 'periods',
  components: {
    Evenemang,
    APIConnection,
    Fortnox,
    CreditCard,
    Swish,
    //Pricing,
    Email,
    Requirements,
    Bank,
    Titles,
    Registration,
    Basic,
    Links,
    MemberProfile,
    ExtraData
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  async mounted() {
    this.company_id = this.$route.params.id;
    this.loadData();
  },
  data() {
    return {
      extras: [],
      regions: {},
      regionOptions: [],
      sourceRegions: [],
      cmmuneOptions: [],
      communeOptions1: [],
      communeOptions2: [],
      company_id: null,
      company: {
        origins: '',
        smtp: {
          use_custom: false,
          memlist_prefix: '',
          from: '',
          password: '',
          server: '',
          port: 0,
          security: ''
        },
        settings: {

        }
      }
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    },
    currentPeriodId(newValue, oldValue) {
      if (this.currentCompanyId)
        this.loadData();
    }
  },
  methods: {
    updateTitleSettings(titles) {
      this.company.settings.titles = titles;

      this.updateSettings(this.company.settings);
    },
    updateEmailSettings(email) {
      this.company.smtp = email;

      this.postCompany({ company_id: this.currentCompanyId, smtp: email });
    },
    putCompany(data) {
      axios
        .put('/company', data)
        .then(res => {
          if (res.status === 204) {
            this.toastr('success', 'OK', 'Inställningar uppdaterad');
            this.loadData();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera inställningar');
        });
    },
    updateRegistration(registration) {
      this.putCompany({ company_id: this.currentCompanyId, registration: registration });
    },
    updateSettings(settings) {
      this.putCompany({ company_id: this.currentCompanyId, settings: settings });
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
    selectRegion1(region_code) {
      this.loadCommunes(region_code, 1);
    },
    selectRegion2(region_codes) {
      this.communeOptions2 = [];

      for (var i = 0; i < region_codes.length; ++i) {
        var comm = this.getCommunes(region_codes[i].code);

        for (var c = 0; c < comm.length; ++c) {
          this.communeOptions2.push({ code: comm[c].value, text: comm[c].text });
        }
      }
    },
    getCommunes(region_code) {
      var comm = [];

      var communes = this.regions[region_code].communes;

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
      console.log('selected region: ' + selectedRegion);
      this.communeOptions = [];

      var communes = this.regions[selectedRegion].communes;

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
    },
    loadData() {
      this.loadRegions();
      let id = this.currentCompanyId;
      if (this.company_id !== '' && this.company_id !== null && this.company_id !== undefined) {
        id = this.company_id;
      }
      axios
        .get(`/company?company_id=${id}`)
        .then(res => {
          if (res.status === 200) {
            this.company = res.data.company;
            this.extras = res.data.extras;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta föreningsinställningar');
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
