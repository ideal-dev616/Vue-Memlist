<template>
  <div class="px-5 mt-8" id="page-bank">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card title="" class="mb-2 mx-auto mt-8" hide-footer>
          <div>
            <b-form class="mt-8" @submit="saveData">
              <b-form-group id="input-group-bg" label="Bankgiro" label-for="input-bg">
                <b-form-input id="input-bg" v-model="form.bg" type="text"></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-pg" label="Plusgiro" label-for="input-pg">
                <b-form-input id="input-pg" v-model="form.pg" type="text"></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-clearing_no"
                label="Clearing"
                label-for="input-clearing_no"
              >
                <b-form-input
                  id="input-clearing_no"
                  v-model="form.clearing_no"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-account_no"
                label="Bankkonto nummer"
                label-for="input-account_no"
              >
                <b-form-input
                  id="input-account_no"
                  v-model="form.account_no"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-bank_name" label="Bank" label-for="input-bank_name">
                <b-form-input
                  id="input-bank_name"
                  v-model="form.bank_name"
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
  name: 'bank-settings',
  components: {},
  props: ['company'],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      form: {
        company_id: '',
        bg: '',
        pg: '',
        clearing_no: '',
        account_no: '',
        bank_name: ''
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

      this.form.company_id = this.currentCompanyId;

      axios
        .put('/company', this.form)
        .then(res => {
          if (res.status === 204) {
            this.toastr('success', 'OK', 'Inställningar uppdaterad');
            this.loadUsers();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera inställningar');
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
