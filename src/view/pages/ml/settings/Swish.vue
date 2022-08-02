<template>
  <div class="px-5 mt-8" id="page-bank">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card title="" class="mb-2 mt-8" hide-footer>
          <div>
            <b-form class="mt-8" @submit="saveData">
              <div class="d-flex align-items-center mb-8">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="swish.active"
                    @click="swish.active = !swish.active"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Aktivera Swish betalningar för medlemmar</span>
              </div>

              <div class="d-flex align-items-center mb-8">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="swish.accept_terms"
                    @click="swish.accept_terms = !swish.accept_terms"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                  >Föreningen har läst och godkänt Swish användarvillkor och godkänner dessa</span
                >
              </div>

              <b-form-group id="input-group-swish_id" label="Swish ID" label-for="input-swish_id">
                <b-form-input
                  id="input-swish_id"
                  v-model="swish.swish_id"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-p12_filepath"
                label="P12 Fil"
                label-for="input-p12_filepath"
              >
                <b-form-input
                  id="input-p12_filepath"
                  v-model="swish.p12_filepath"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-password"
                label="Swish Lösenord"
                label-for="input-password"
              >
                <b-form-input
                  id="input-password"
                  v-model="swish.password"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-pct_per_transaction"
                label="% per transaktion"
                label-for="input-pct_per_transaction"
              >
                <b-form-input
                  id="input-pct_per_transaction"
                  v-model="swish.pct_per_transaction"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-sek_per_transaction"
                label="SEK per transaktion"
                label-for="input-sek_per_transaction"
              >
                <b-form-input
                  id="input-sek_per_transaction"
                  v-model="swish.sek_per_transaction"
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
  name: 'swish-settings',
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
      swish: {
        swish_id: '',
        p12_filepath: '',
        password: '',
        active: false,
        accept_terms: false,
        pct_per_transaction: 0.3,
        sek_per_transaction: 5
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

      this.$emit('updateSettings', this.swish);
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
