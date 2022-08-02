<template>
  <div class="px-5 mt-8" id="page-bank">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card title="" class="mb-2 mt-8" hide-footer>
          <div>
            <b-alert show variant="info">För att er hemsida ska kunna få tillgång till systemets API tjänster behöver ni lägga
              till era domäner som ska ha tillgång till systemet. Glöm inte att lägga till https://
              eller http://</b-alert>

            <b-form class="mt-8" @submit="saveData">
              <b-input-group>
                <b-form-input v-model="text" placeholder="https://exempel.se"></b-form-input>
                <b-input-group-append>
                  <b-button variant="outline-success" type="submit">Lägg till</b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form>

            <APIConnectionTable :domains="domains" @deleteDomainClicked="deleteDomain" />
            
          </div>
        </b-card></b-col
      >
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

import APIConnectionTable from '@/view/pages/ml/settings/apiconnection/APIConnectionTable.vue';

export default {
  name: 'api-connection-settings',
  components: {
    APIConnectionTable
  },
  props: ['domains'],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      text: '',
      form: {}
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

      this.domains.push(this.text);

      axios
        .post('/company/origin', { company_id: this.currentCompanyId, origin: this.text })
        .then(res => {
          if (res.status === 204) {
            this.toastr('success', 'OK', 'Lade till domän');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lägga till domän');
        });
    },
    deleteDomain(domain) {
      axios
        .delete(`/company/origin?origin=${domain}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.domains = this.domains.filter(item => item !== domain);

          this.toastr('success', 'OK', 'Domänen togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort domän');
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
