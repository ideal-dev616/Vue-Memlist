<template>
  <div class="px-5 mt-8" id="page-pricing">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card title="" class="mb-2" hide-footer>
          <div>
            <b-form class="mt-8" @submit="saveData">
              <b-form-group
                id="input-group-pricing_id"
                label="Prissättning ID"
                label-for="input-pricing_id"
              >
                <b-form-input
                  id="input-pricing_id"
                  v-model="pricing.pricing_id"
                  type="text"
                  disabled
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-sek_per_spar"
                label="SEK per SPAR"
                label-for="input-sek_per_spar"
              >
                <b-form-input
                  id="input-sek_per_spar"
                  v-model="pricing.sek_per_spar"
                  type="text"
                  disabled
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-sek_per_sms"
                label="SEK per SMS"
                label-for="input-sek_per_sms"
              >
                <b-form-input
                  id="input-sek_per_sms"
                  v-model="pricing.sek_per_sms"
                  type="text"
                  disabled
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
  name: 'pricing-settings',
  components: {},
  props: ['company', 'pricingId'],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      pricing: {
        company_id: '',
        pricing_id: '',
        sek_per_spar: 0.3,
        sek_per_sms: 0.6
      }
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
      if (!this.pricingId) {
        return;
      }

      this.pricing.pricing_id = this.pricingId;
      this.pricing.company_id = this.currentCompanyId;

      axios
        .get(`/pricing?pricing_id=${this.pricingId}`)
        .then(res => {
          this.pricing = res.data.pricing;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta prissättning');
        });
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    saveData(e) {
      e.preventDefault();

      this.pricing.company_id = this.currentCompanyId;

      axios
        .put('/pricing', this.pricing)
        .then(res => {
          if (res.status === 204) {
            this.toastr('success', 'OK', 'Prissättning uppdaterad');
            this.loadUsers();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera prissättning');
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
