<template>
  <div>
    <div v-if="regdata.address">
      <b-form-group class="col-6" id="name-group" label="Föreningsnamn" label-for="name">
        <b-form-input id="name" v-model="regdata.address.name" placeholder="Föreningsnamn" disabled></b-form-input>
      </b-form-group>

      <b-form-group class="col-6" id="address-group" label="Gatuadress" label-for="address">
        <b-form-input id="address" v-model="regdata.address.address" placeholder="Gatuadress" disabled></b-form-input>
      </b-form-group>


      <b-form-group class="col-6" id="address-group" label="C/O" label-for="co">
        <b-form-input id="address" v-model="regdata.address.address" placeholder="C/O" disabled></b-form-input>
      </b-form-group>

      <b-form-group class="col-6" id="zipcode-group" label="Postkod" label-for="zipcode">
        <b-form-input id="zipcode" v-model="regdata.address.zipcode" placeholder="00000" disabled></b-form-input>
      </b-form-group>


      <b-form-group class="col-6" id="region-group" label="Region" label-for="region">
        <b-form-input id="region" v-model="regdata.address.region" placeholder="" disabled></b-form-input>
      </b-form-group>

      <b-form-group class="col-6" id="commune-group" label="Kommun" label-for="commune">
        <b-form-input id="commune" v-model="regdata.address.commune" placeholder="" disabled></b-form-input>
      </b-form-group>


      <div v-if="regdata.org_number">
        <b-form-group class="col-6" id="personnr-group" label="Organisationsnummer" label-for="personnr">
          <b-form-input id="personnr" v-model="regdata.org_number.formatted.formatted" placeholder="" disabled></b-form-input>
        </b-form-group>
      </div>

      <div class="d-flex align-items-center mb-6">
        <label
          class="checkbox checkbox-lg checkbox-outline checkbox-success"
        >
          <input
            type="checkbox"
            name=""
          />
          <span></span>
        </label>
        <span class="ml-3 cursor-pointer"
          >Jag har läst igenom de allmänna villkoren för användande och brukande av tjänsten och accepterar dessa</span
        >
      </div>
      
    </div>
  </div>
</template>

<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'confirm-page',
  props: ['regdata','index', 'page'],
  components: {

  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  data() {
    return {
      accepted: true
    };
  },
  mounted() {
    this.$emit('isValid', true, this.index)
  },
  watch: {

  },
  methods: {
    doValidation() {
      console.log(this.regdata, ": Formatted");
      this.$emit('isValid', this.accepted, this.page.index);
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
