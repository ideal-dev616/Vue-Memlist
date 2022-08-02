<template>
  <div>
    <div class='d-flex justify-content-between m-2 m-sm-0'>
      <b-dropdown :text="period.name" variant="outline-success" class="dropdown-year flex-fill" menu-class='w-275px w-lg-auto'>
        <b-dropdown-item v-for="(p, i) in periods" :key="`year-${i}`" @click="onSelectPeriod(p)" :active="period.name === p.name">{{
          p.name
        }}</b-dropdown-item>
      </b-dropdown>
      <b-dropdown :text="company.name" variant="outline-success" class="ml-4 dropdown-company flex-fill" menu-class='w-275px w-lg-auto'>
        <b-dropdown-text tag="div" class="topnav-company-list-wrapper">
          <b-form-input v-model="filterText" @keydown="filterCompany" placeholder="Filtrera" />
          <span class="ml-4">Filtrera på org. eller namn</span>
        </b-dropdown-text>
        <b-dropdown-form class="topnav-company-list">
          <b-dropdown-item
            v-for="(c, i) in filtered"
            :key="`company-${i}`"
            @click="onSelectCompany(c)"
            :active="company.company_id === c.company_id"
          >
            <fa-icon :icon="['fas', 'network-wired']" class="mr-3" />
            {{ c.name }}
          </b-dropdown-item>
        </b-dropdown-form>
      </b-dropdown>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.topnav-company-list-wrapper {
  min-width: 250px;
  span {
    font-size: 0.8rem;
  }
}
.topnav-company-list {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}
ul {
  transform: translate3d(-121px, 36px, 0px) !important;
  background-color: red;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { SET_COMPANY, SET_PERIOD, SET_PERIODS, SET_TITLES, SET_COMPANIES } from '@/core/services/store/common.module';
import { SET_ACCESS, SET_TALONGADMIN, LOGOUT } from '@/core/services/store/auth.module';
export default {
  name: 'KTMenu',
  data() {
    return {
      periods: [],
      period: {},
      company: {},
      filterText: '',
      filtered: [],
      initialized: false
    };
  },
  props: {
    company_id: { type: String, default: '' },
    period_id: { type: String, default: '' }
  },
  computed: {
    ...mapGetters(['companies','currentUserId','currentUser','isTalongAdmin','currentCompanyId'])
  },
  mounted() {
    // load companies
    axios
      .get('/company/list')
      .then(res => {
        if (res.status === 200) {
          console.log('dispatching SET_COMPANIES');
          this.$store.dispatch(SET_COMPANIES, res.data.companies);
        }
      })
      .catch(err => {
        console.error(err);
      });

    axios
      .get(`/user?user_id=${this.currentUser.user_id}`)
      .then(res => {

        if (res.data.user === null || res.data.user === undefined) {
          console.log('GOT UNDEFINED USER -> Redirect to login');
          this.$store.dispatch(LOGOUT);
          this.$router.push({ name: 'ml-login' });
          return;
        }

        if (res.status === 200) {
          this.$store.dispatch(SET_TALONGADMIN, res.data.user.talongadmin);
          this.$store.dispatch(SET_ACCESS, res.data.acl.acl);

          console.log('acl');
          console.log(res.data.acl);
        }
      })
      .catch(err => {
        console.error('error getting my user');
        console.error(err);
      });
  },
  watch: {
    companies(newValue, oldValue) {
      console.log('Menu.vue, companies mutated');
      this.setCompanyList(newValue);
    }
  },
  methods: {
    setCompanyList(companies) {

      var comp = [];

      companies.forEach(c => {
        comp.push(c);
      });

      if (comp.length > 0) {
        if (this.company_id) {
          const c = comp.find(x => x.id === this.company_id);

          if (c) {
            this.onSelectCompany(c);
          } else {
            this.onSelectCompany(comp[0]);
          }

        } else {
          this.onSelectCompany(comp[0]);
        }
      }

      this.filtered = comp;
    },
    async onSelectCompany(c) {

      const res = await axios.put('/user/current_company', { company_id: c.id });
      if (res.status === 200 || res.status === 204) {
        this.company = c;
        this.$store.dispatch(SET_PERIOD, '');
        this.$store.dispatch(SET_COMPANY, c.id);
        // update period
        this.periods = [];
        this.company.periods.forEach(p => {
          this.periods.push({
            id: p.id,
            name: p.name,
            from: p.from,
            to: p.to,
            selected: false
          });
        });
        this.$store.dispatch(SET_PERIODS, this.periods);
        this.$store.dispatch(SET_TITLES, this.company.settings.titles);

        if (this.period_id) {
          const p = this.periods.find(x => x.id === this.period_id);
          if (p) {
            this.onSelectPeriod(p);
          } else {
            this.onSelectPeriod(this.periods[0]);
          }
        } else if (this.periods.length > 0) {
          this.onSelectPeriod(this.periods[0]);
        }

        //window.location.reload();
      }
    },
    async onSelectPeriod(p) {
      const res = await axios.put('/user/selected_period', {
        period_id: p.id
      });
      if (res.status === 200 || res.status === 204) {
        this.period = p;
        this.$store.dispatch(SET_PERIOD, p.id);

        if (this.initialized) {
          window.location.reload();
        }

        this.initialized = true;
      }
    },
    filterCompany(e) {
      if (this.filterText === '' || this.filterText === ' ') {
        this.filtered = this.companies;
      } else {
        this.filtered = this.companies.filter(x =>
          x.name.toUpperCase().includes(this.filterText.toUpperCase())
        );
      }
    }
  }
};
</script>
