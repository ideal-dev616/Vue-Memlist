<template>
  <div>    
    <div>
      <div v-html="page.html"></div>

      <b-row>
        <b-col lg="6">
          <b-form-group id="parent1-firstname-group" label="Förnamn" label-for="parent1-firstname">
            <b-form-input
              id="parent1-firstname"
              v-model="firstname"
              placeholder="Målsman förnamn"
              :state="firstnameValid"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="parent1-lastname-group" label="Efternamn" label-for="parent1-lastname">
            <b-form-input
              id="parent1-lastname"
              v-model="lastname"
              placeholder="Målsman efternamn"
              :state="lastnameValid"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="parent1-personnr-group" label="Personnummer" label-for="parent1-personnr">
            <b-form-input
              id="parent1-personnr"
              v-model="personnr"
              placeholder="ÅÅÅÅMMDD1234"
              :state="personnrValid"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="parent1-phone-group" label="Telefon" label-for="parent1-phone">
            <b-form-input
              id="parent1-phone"
              v-model="phone"
              placeholder="07XXXXXXXX"
            ></b-form-input>
          </b-form-group>
          <b-form-group id="parent1-email-group" label="E-post" label-for="parent1-email">
            <b-form-input
              id="parent1-email"
              v-model="email"
              placeholder="test@test.com"
              :state="emailValid"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col lg="6"></b-col>
      </b-row>
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
import moment from 'moment';
import validate_pers_number from '@/core/services/personnr';

export default {
  name: 'parents-page',
  props: ['page','age', 'ageMaxParent'],
  components: {},
  computed: {
    textMaxAge(){
      if (this.ageMaxParent) return `äldre än ${this.ageMaxParent} år`;
    }
  },
  data() {
    return {
      form: {
        personnr: ''
      },
      parentAge: 0,
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      personnr: '',
      fmt_personnr: '',
      valid: false,
      skipPersonnr: false,
      personnrValid: false,
      firstnameValid: false,
      lastnameValid: false,
      emailValid: false
    };
  },
  mounted() {
    this.$emit('isValid', false, this.page.id)
  },
  watch: {
    firstname(newValue, oldValue) {
      this.form.firstname = newValue;
      this.validate();
    },
    lastname(newValue, oldValue) {
      this.form.lastname = newValue;
      this.validate();
    },
    email(newValue, oldValue) {
      this.form.email = newValue;
      this.validate();
    },
    phone(newValue, oldValue) {
      this.form.phone = newValue;
      this.validate();
    },
    personnr(newValue, oldValue) {
      this.form.personnr = newValue;
      
      this.validate();
    },
  },
  methods: {
    validate() {
      this.valid = true;

      if (!this.is_ok(this.form.firstname)) {
        this.valid = false;
        this.firstnameValid = false;
      }
      else {
        this.firstnameValid = true;
      }

      if (!this.is_ok(this.form.lastname)) {
        this.valid = false;
        this.lastnameValid = false;
      }
      else {
        this.lastnameValid = true;
      }

      if (!this.is_ok(this.form.phone)) {
        this.valid = false;
        this.phoneValid = false;
      }
      else {
        this.phoneValid = true;
      }

      if (!this.is_ok(this.form.email)) {
        this.valid = false;
        this.emailValid = false;
      }
      else {
        this.emailValid = true;
      }

      var result = validate_pers_number(this.form.personnr);

      if (result.success) {
        console.log(result);
        console.log('parents calc age: ' + result.formatted.substr(0,8));
        this.parentAge = moment().diff(result.formatted.substr(0,8), 'years');

        if (result.valid) {
          this.personnrValid = true;
        }
        else {
          this.personnrValid = false;
        }
      }
  
      if (this.parentAge < 18) {
        this.valid = false;
      }

      this.$emit('isValid', this.valid, this.page.id);
      this.$emit('setData', this.form, this.page.id);
    },

    getData() {
      return this.form;
    },
    is_ok(field) {
      return field !== null && field !== undefined && field.length > 1;
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
    
  }
};
</script>
