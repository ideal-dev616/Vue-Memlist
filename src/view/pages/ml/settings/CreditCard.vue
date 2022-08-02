<template>
  <div class="px-5 mt-8" id="page-creditcard">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card title="" class="mb-2 mt-8" hide-footer>
          <div>
            <b-form class="mt-8" @submit="saveData">
              <b-form-group
                id="input-group-profile_id"
                label="Dintero Profil ID"
                label-for="input-profile_id"
              >
                <b-form-input
                  id="input-profile_id"
                  v-model="profile_id"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-button type="submit" variant="primary">Spara</b-button>
            </b-form>
          </div>
        </b-card>
      </b-col>
    </b-row>
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

export default {
  name: 'creditcard-settings',
  components: {},
  props: ['company', 'settings'],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      profile_id: '',
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      axios 
        .get(`/company/apikey?company_id=${this.currentCompanyId}&service=dintero`)
        .then(res => {
          this.profile_id = res.data.api_key.service_id;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte hämta Dintero profil');
        });
    },

    setDinteroAPIKey() {
      axios 
        .post('/company/apikey', {
          company_id: this.currentCompanyId,
          service: 'dintero',
          service_id: this.profile_id
        })
        .then(res => {
          this.toastr('success', 'OK', 'Dintero profil uppdaterad');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte sätta dintero profil');
        });
    },

    saveData(e) {
      e.preventDefault();

      this.setDinteroAPIKey();
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
