<template>
  <div class="px-5" id="page-member-manager">
    <h5 class="mb-6 ml-2">Medlemshantering</h5>
    <!-- <b-card class="mt-4" v-if="showNew"> </b-card> -->
    <b-row class="mt-4">
      <b-col lg="12">
        <search-options
          class="mt-4"
          :countries="countries"
          :periods="periods"
          :genders="genders"
          :payments="payments"
          :ladoks="ladoks"
          @onSearch="onSearch"
        ></search-options>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="12">
        <b-card>
          <template #header>
            <div class="d-sm-flex justify-content-between align-items-center">
              <h5>&nbsp;</h5>
              <b-dropdown text="Hantera markerade medlemmar" variant="outline-success">
                <b-dropdown-item @click="onShowRenew"
                  ><fa-icon :icon="['fas', 'angle-double-right']" class="mr-2" size="lg" />Förnya medlemskap</b-dropdown-item
                >
                <!--<b-dropdown-item
                  ><fa-icon :icon="['fas', 'band-aid']" class="mr-2" size="lg" />Uppdatera
                  värden</b-dropdown-item
                >-->
              </b-dropdown>
            </div>
          </template>
          <div>
            <search-result class="search-results" :clients="clients" @clientSelected="clientSelected" />
          </div>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="12" v-if='showNew'>
        <Renewal
          class="renew-container"
          :clients="clients"
        />

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
import searchOptions from '@/view/components/searchOptions.vue';
import searchResult from '@/view/components/searchResult.vue';
import { mapGetters } from 'vuex';
import Renewal from '@/view/pages/ml/membermanager/Renewal.vue';

export default {
  name: 'membersManager',
  components: {
    createMember,
    searchOptions,
    searchResult,
    Renewal
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
  },
  watch: {

  },
  data() {
    return {
      showNew: false,
      selectedSearch: null,
      clients:[],
      searchHistory: [{ value: null, text: 'Välj sparad sökning' }],
      regions: [],
      countries: [],
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
      ]
    };
  },
  async mounted() {


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

    // periods
  },
  methods: {
    clientSelected(client) {
      this.client_id = client.client_id;
      this.$router.push(`/ml-quicksearch/${this.client_id}`)
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
    onRenew() {
      // const client_ids = this.clients.map((item) => {
      //   return item.client_id;
      // });
      // axios.post(`/client/sendrenews`, {client_ids: client_ids})
      //   .then(res => {
      //     this.toastr('success', 'förnyelse', 'Förnyelse-länken har skickats via e-post.')
      //   })
      //   .catch(err => {
      //     this.toastr('danger', 'Serverfel', 'kunde inte maila');
      //   });
    },
    onShowRenew() {
      this.showNew = true;
      this.scrollToClassName('renew-container');
      // // const client_ids = this.clients.values('client_id');
      // const client_ids = this.clients.map((item) => {
      //   return item.client_id;
      // });
      // axios.post(`/client/sendrenews`, {client_ids: client_ids})
      //   .then(res => {
      //     this.toastr('success', 'förnyelse', 'Förnyelse-länken har skickats via e-post.')
      //   })
      //   .catch(err => {
      //     this.toastr('danger', 'Serverfel', 'kunde inte maila');
      //   });
    },
    onSearch(query) {
      axios
        .post('/search', query)
        .then(res => {
          console.log(res);
          this.scrollToClassName('search-results');

          this.clients = res.data.clients;

          for (var i = 0; i < this.clients.length; ++i) {
            this.clients[i].period = res.data.periods[this.clients[i].period_id].name;
            this.clients[i].company = res.data.companies[this.clients[i].company_id];
          }

        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server fel', 'Kunde inte söka');
        });
    }
  }
};
</script>
