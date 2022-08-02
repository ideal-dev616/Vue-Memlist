<template>
  <div class="px-5 mt-8" id="page-links">
    <b-row>

      <b-col lg="12">
          <v-list>
            <v-list-item
                v-for="item in links"
                :key="item.title"
            >
                <v-list-item-content>
                <a :href="item.url"><v-list-item-title v-text="item.title"></v-list-item-title></a>
                </v-list-item-content>

            </v-list-item>
          </v-list>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="css" scoped>

.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'links-settings',
  components: {},
  computed: {
    ...mapGetters(['currentPeriodId','currentCompanyId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      top: {},
      links: [],
    };
  },
  watch: {
    currentCompanyId(newValue, oldValue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    loadData() {
      axios
        .get(`/company/top?company_id=${this.currentCompanyId}`)
        .then(res => {
          this.top = res.data.company;

          this.links = [
            { title: 'Registreringssidan för medlemmar', url: '/register/'+this.currentCompanyId },
            { title: 'Registreringssidan för underföreningar', url: '/signup/'+this.currentCompanyId },
            { title: 'Loginsida för medlemmar', url: '/login/'+this.currentCompanyId },
            { title: 'Loginsida för användare', url: '/ml-login' },
            { title: 'Publik evenemangslista', url: '/events/'+this.currentCompanyId },
            { title: 'Loginsida medlemmar samtliga org.', url: '/login/'+this.top.company_id }
          ];
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Serverfel', 'Kunde inte hitta moderförening');
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
