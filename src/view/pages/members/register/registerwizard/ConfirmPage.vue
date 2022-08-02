<template>
  <div>
    <h4 class="mb-10 font-weight-bold text-dark">Kontrollera/Betala</h4>
    <b-row>
    <b-form-group class="col-6" id="company-group" label="Förening" label-for="company">
      <b-form-input id="company" v-model="company.name" placeholder="" disabled></b-form-input>
    </b-form-group>
    </b-row>

    <div v-if="regdata.details">
      <b-row>
        <b-form-group class="col-6" id="firstname-group" label="Förnamn" label-for="firstname">
          <b-form-input
            id="firstname"
            v-model="regdata.details.firstname"
            placeholder="Förnamn"
            disabled
          ></b-form-input>
        </b-form-group>

        <b-form-group class="col-6" id="lastname-group" label="Efternamn" label-for="lastname">
          <b-form-input
            id="lastname"
            v-model="regdata.details.lastname"
            placeholder="Efternamn"
            disabled
          ></b-form-input>
        </b-form-group>
      </b-row>

      <b-row>
        <b-form-group class="col-6" id="phone-group" label="Telefon" label-for="phone">
          <b-form-input
            id="phone"
            v-model="regdata.details.phone"
            placeholder="Telefon"
            disabled
          ></b-form-input>
        </b-form-group>

        <b-form-group class="col-6" id="email-group" label="E-post" label-for="email">
          <b-form-input
            id="email"
            v-model="regdata.details.email"
            placeholder="E-post"
            disabled
          ></b-form-input>
        </b-form-group>
      </b-row>

      <b-row>
        <b-form-group class="col-6" id="birthdate-group" label="Födelsedag" label-for="birthdate">
          <b-form-input
            id="birthdate"
            v-model="regdata.details.birthdate"
            placeholder=""
            disabled
          ></b-form-input>
        </b-form-group>
      </b-row>

      <b-row>
        <b-form-group class="col-6" id="address-group" label="Gatuadress" label-for="address">
          <b-form-input
            id="address"
            v-model="regdata.details.address"
            placeholder="Gatuadress"
            disabled
          ></b-form-input>
        </b-form-group>

        <b-form-group class="col-6" id="zipcode-group" label="Postkod" label-for="zipcode">
          <b-form-input
            id="zipcode"
            v-model="regdata.details.zipcode"
            placeholder="00000"
            disabled
          ></b-form-input>
        </b-form-group>
      </b-row>

      <b-row>
        <b-form-group class="col-6" id="region-group" label="Region" label-for="region">
          <b-form-input
            id="region"
            v-model="regdata.details.region"
            placeholder=""
            disabled
          ></b-form-input>
        </b-form-group>

        <b-form-group class="col-6" id="commune-group" label="Kommun" label-for="commune">
          <b-form-input
            id="commune"
            v-model="regdata.details.commune"
            placeholder=""
            disabled
          ></b-form-input>
        </b-form-group>
      
      </b-row>
    </div>

    <b-row v-if="regdata.personnr && regdata.personnr.formatted">
    
      <b-form-group class="col-6" id="personnr-group" label="Personnummer" label-for="personnr">
        <b-form-input
          id="personnr"
          v-model="regdata.personnr.formatted.formatted"
          placeholder=""
          disabled
        ></b-form-input>
      </b-form-group>
    
    </b-row>

    <div v-if="regdata.shop && regdata.shop.mustpay">
      <b-row>
        <b-col lg="6">
          <p>För att registreringen ska bli avklarad behöver du i detta steg utföra betalning</p>
          <p>Total: {{ regdata.shop.total_price }} kr</p>
        </b-col>
      </b-row>
      <b-row class="mb-8">
        <b-col lg="6">
          <b-button href="#" variant="success" @click="gotoPayment($event, 'swish')"
            >Betala med Swish</b-button
          >
        </b-col>
      </b-row>
      <b-row class="mb-8">
        <b-col lg="6">
          <b-button href="#" variant="success" @click="gotoPayment($event, 'creditcard')"
            >Betala med Kreditkort</b-button
          >
        </b-col>
      </b-row>
      <b-row class="mb-8">
        <b-col lg="6">
          <b-button href="#" variant="success" @click="gotoPayment($event, 'bankgiro')"
            >Betala med Bankgiro</b-button
          >
        </b-col>
      </b-row>
    </div>

    
    <template v-for="(term, i) in terms">
      <TermsCheckbox
        class="mb-4"
        v-bind:key="i"
        :term="term"
        @selected="termAccepted"
        @showTerm="showTerm"
      />
    </template>
  
    <b-modal ref="show-term" size="lg" :title="selected_term.name">
      <p class="my-4" :html="selected_term.template" v-html="selected_term.template"></p>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
@media (min-width: 992px) {
 .modal-lg {
    max-width: auto !important;
   }
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: auto !important;
  }
}
</style>
<script>
import axios from 'axios';
import AdvancedSearch from '../../../ml/AdvancedSearch.vue';
import TermsCheckbox from './terms/TermsCheckbox.vue';

export default {
  name: 'confirm-page',
  props: ['company', 'regdata', 'order', 'page'],
  components: {
    AdvancedSearch,
    TermsCheckbox
  },
  watch: {
    
  },
  data() {
    return {
      accepted: [],
      terms: [],
      selected: [],
      visable_modal: false,
      current_policy: {},
      selected_term: {
        name: 'none',
        template: ''
      }
    };
  },
  mounted() {
    this.$emit('isValid', false, this.page.id);
    this.loadTerms();
  },
  methods: {
    loadTerms() {
      axios
        .get(`/company/terms?company_id=${this.company.company_id}`)
        .then(res => {
          this.terms = res.data.terms;

          for (const t of this.terms) {
            this.accepted.push({ id: t.id, isAccepted: false, mandatory: t.mandatory });
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte hämta villkor')
        });
    },

    gotoPayment(e, method) {
      e.preventDefault();
    },

    onClick($event) {
      this.$emit('isAllPolicyChecked', this.selected.length == this.terms.length);
    },

    termAccepted(id, isAccepted) {

      for (let i = 0; i < this.accepted.length; ++i) {
        if (this.accepted[i].id === id) {
          this.accepted[i].isAccepted = isAccepted;
          break;
        }
      }

      let valid = true;

      for (const t of this.accepted) {
        if (t.mandatory) {
          if (!t.isAccepted) {
            valid = false;
            break;
          }
        }
      }

      console.log('confirm page emit isValid: ' + valid);

      this.$emit('isValid', valid, this.page.id);
    },

    showTerm(id) {
      for (const t of this.terms) {
        if (t.id === id) {
          this.showModal(t);
          break;
        }
      }
    },

    showModal(term) {
      console.log('showmodal:');
      console.log(term);
      this.selected_term = term;
      
      this.$refs['show-term'].show();
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
