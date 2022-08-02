<template>
  <div class="px-5" id="page-advanced-search">
    <h5 class="mb-6 ml-2">Snabbsök</h5>
    <b-card no-body>
      <div class="create-member">
        <b-button class="mr-2" variant="success" @click="createMember">Skapa ny medlem</b-button>
        <span class="">Snabbsök efter medlem i alla föreningar och perioder</span>
      </div>
    </b-card>
    <create-member
      v-if="showNew"
      class="mt-4"
      :regions="regions"
      :countries="countries"
      :genders="genders"
      :isNew="client_id === null"
      :client_id="client_id"
      :constreq="constreq"
      @onClose="createMember"
      @onDelete="deleteMember"
    ></create-member>

    <b-row class="justify-content-center">
      <b-col class="align-self-center col-12">
        <b-form @submit.prevent="submitSearch($event)">
          <b-card title="" class="mb-12 mt-12" hide-footer>
            <b-input-group>
              <b-form-input
                v-model="text"
                placeholder="Förnamn, Efternamn, E-post, Personnummer, Telefonnummer..."
              ></b-form-input>
              <b-input-group-append>
                <b-button variant="outline-success" type="submit" :disabled="disablebutton">Sök</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-card>
        </b-form>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="col-12">
        <b-card>
          <template #header>
            <div class="d-flex justify-content-between align-items-center">
                <h5>&nbsp;</h5>
                <b-dropdown text="Exportera" variant="outline-success">
                <b-dropdown-item><fa-icon :icon="['fas', 'file-excel']" class="mr-2" size="lg" />Excel</b-dropdown-item>
                <b-dropdown-item><fa-icon :icon="['fas', 'file-csv']" class="mr-2" size="lg" />CSV</b-dropdown-item>
                </b-dropdown>
            </div>
          </template>
          <div class="p-6">
            <search-result class="search-results" :clients="clients" @clientSelected="clientSelected" />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<style lang="scss" scoped>
#page-advanced-search {
  .create-member {
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
}
</style>

<script>
import axios from 'axios';
import createMember from '@/view/components/createMember.vue';
import searchResult from '@/view/components/searchResult.vue';
import { mapGetters } from 'vuex';
import moment from "moment";
export default {
  name: 'quickSearch',
  components: {
    createMember,
    searchResult
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
  },
  data() {
    return {
      client_id: null,
      text: '',
      showNew: false,
      disablebutton: false,
      regions: [],
      countries: [],
      genders: [],
      payments: [],
      ladoks: [],
      lgenders: {
        'M': 'Man',
        'F': 'Kvinna',
        'O': 'Annat',
        'U': 'Okänt'
      },
      lpayments: {
        'Y': 'Betalat',
        'N': 'Ej Betalat'
      },
      lladoks: {
        'OK': 'Aktiv Student',
        'NO': 'Ej Student',
        'S': 'Väntar',
        'N': 'Saknas'
      },
      clients: [],
      constreq:[]
    };
  },
  async mounted() {
    const loader = this.$loading.show();
    for (var k in this.lgenders) {
      this.genders.push({ value: k, text: this.lgenders[k] });
    }

    for (var k in this.lpayments) {
      this.payments.push({ value: k, text: this.lpayments[k] });
    }

    for (var k in this.lladoks) {
      this.ladoks.push({ value: k, text: this.lladoks[k] });
    }

    this.client_id = parseInt(this.$route.params.id);
    if (this.client_id === null || this.client_id === undefined || isNaN(this.client_id)) {
      this.showNew = false;
    }
    else {
      this.showNew = true;
    }

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
    // get constreq
    const res2 = await axios.get(`/company?company_id=${this.currentCompanyId}`);
    if (res2.status === 200){
      this.constreq = res2.data.company.constreq;
    } else {}
    loader.hide();
  },
  watch:{
    // text(newVal, oldVal){
    //   if (newVal.length > 3)
    //     this.concatSearch(newVal)
    // }
  },
  methods: {
    submitSearch(e) {
      e.preventDefault();

      this.concatSearch(this.text);
    },
    clientSelected(client) {
      this.client_id = client.client_id;
      this.showNew = true;
      this.scrollToClassName('form-create-member');
    },
    concatSearch(str) {
      const loader = this.$loading.show();
      str = str + '';
      str = str.toUpperCase();
      this.disablebutton = true;
      axios
        .get(
          `/client/concat_search?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}&str=${str}`
        )
        .then(res => {
          this.disablebutton = false;
          const clients = res.data.clients;
          this.clients = clients.map(item => {
            item.period = (Object.keys(res.data.periods).length > 0 && res.data.periods[item.period_id]) ? res.data.periods[item.period_id].name : '';
            item.company = item.current_company_id
                    ? res.data.companies[item.current_company_id]
                    : res.data.companies[item.company_id];
            item.rdt = moment(item.rdt).format('YYYY-MM-DD')
            return item;
          });

          // populate_payments(data.payments);
          this.scrollToClassName('search-results');
          loader.hide();
        })
        .catch(err => {
          this.disablebutton = false;
          loader.hide();
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte söka efter medlem');
        });
    },
    scrollToClassName(classname) {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName(classname)[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
    createMember(){
      this.showNew = !this.showNew
      this.client_id = null
    },
    deleteMember(){
      axios.delete(`/client?client_id=${this.client_id}`).then(res => {
        if (res.status === 200) {
          this.toastr('success', 'Radera', 'Medlem suppgifterna har raderats.');
          this.clients = this.clients.filter(item => this.client_id !== item.client_id);
          this.createMember();
          this.scrollToClassName('search-result-scrollto');
        } else {
          this.toastr('danger', 'Serverfel', 'Det gick inte att radera medlem.');
        }
      }).catch(err => {
        console.log(err);
        this.toastr('danger', 'Serverfel', 'Det gick inte att radera medlem.');
      })
    },
  }
};
</script>
