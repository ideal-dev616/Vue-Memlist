<template>
  <div>
    <div v-html="page.html"></div>

    <b-row>
      <b-form-group class="col-6" id="firstname-group" label="Förnamn" label-for="firstname">
        <b-form-input
          v-on:input="doValidation"
          id="firstname"
          v-model="form.firstname"
          :state="states['firstname']"
          placeholder="Förnamn"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="col-6" id="lastname-group" label="Efternamn" label-for="lastname">
        <b-form-input
          v-on:input="doValidation"
          id="lastname"
          v-model="form.lastname"
          :state="states['lastname']"
          placeholder="Efternamn"
        ></b-form-input>
      </b-form-group>
    </b-row>

    <b-row v-if="page.settings.company_name">
      <b-form-group class="col-6" id="company_name-group" label="Eventuellt företagsnamn" label-for="company_name">
        <b-form-input
          v-on:input="doValidation"
          id="company_name"
          v-model="form.company_name"
        ></b-form-input>
      </b-form-group>
    </b-row>

    <b-row v-if="page.settings.phone">
      
        <b-form-group class="col-6" id="phone-group" label="Telefon" label-for="phone">
          <b-form-input
            v-on:input="doValidation"
            id="phone"
            v-model="form.phone"
            :state="states['phone']"
            placeholder="Telefon"
          ></b-form-input>
        </b-form-group>

    </b-row>

    <b-row>
      <b-form-group class="col-6" id="email-group" label="E-post" label-for="email">
        <b-form-input
          v-on:input="doValidation"
          id="email"
          v-model="form.email"
          :state="states['email']"
          placeholder="E-post"
        ></b-form-input>
      </b-form-group>

      <b-form-group class="col-6" id="email2-group" label="Repetera E-post" label-for="email2">
        <b-form-input
          v-on:input="doValidation"
          id="email2"
          v-model="form.email2"
          :state="states['email2']"
          placeholder="Repetera E-post"
        ></b-form-input>
      </b-form-group>
    </b-row>

    <b-row v-if="page.settings.password">
      <b-form-group class="col-6" id="password1-group" label="Lösenord" label-for="password1">
        <b-form-input
          type="password"
          v-on:input="doValidation"
          id="password1"
          v-model="password1"
          :state="states['password1']"
          placeholder="Lösenord"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        class="col-6"
        id="password2-group"
        label="Repetera Lösenord"
        label-for="password2"
      >
        <b-form-input
          type="password"
          id="password2"
          v-model="password2"
          placeholder="Repetera Lösenord"
          v-on:input="doValidation"
          :state="states['password2']"
        ></b-form-input>
      </b-form-group>

    </b-row>

    <b-row v-if="page.settings.birthdate">
      <b-form-group class="col-6" id="birthdate-group" label="Födelsedag" label-for="birthdate">
        <b-form-input
          v-on:input="doValidation"
          :disabled="disabled_birthdate"
          id="birthdate"
          v-model="form.birthdate"
          :state="states['birthdate']"
          placeholder="YYYYMMDD"
        ></b-form-input>
      </b-form-group>
    </b-row>

    <b-row v-if="page.settings.address || page.settings.zipcode">
      <b-col lg="6" v-if="page.settings.address">  
        <b-form-group  id="address-group" label="Gatuadress" label-for="address">
          <b-form-input
            v-on:input="doValidation"
            id="address"
            v-model="form.address"
            :state="states['address']"
            placeholder="Gatuadress"
          ></b-form-input>
        </b-form-group>
      </b-col>
      <b-col lg="6" v-if="page.settings.zipcode">
        <b-form-group style="max-width: 200px;" id="zipcode-group" label="Postkod" label-for="zipcode">
          <b-form-input
            v-on:input="doValidation"
            id="zipcode"
            v-model="form.zipcode"
            :state="states['zipcode']"
            placeholder="00000"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="6" v-if="page.settings.zipcode">
        <b-form-group id="post-group" label="Postort" label-for="post">
          <b-form-input
            v-on:input="doValidation"
            id="post"
            v-model="form.post"
            :state="states['post']"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col lg="6">
        <b-form-group
          id="input-group-region_code"
          label="Region"
          label-for="input-region_code"
        >
          <b-form-select
            id="region_code"
            v-model="region_code"
            :options="regionOptions"
            v-on:input="doValidation"
            :state="states['region']"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col lg="6">
        <b-form-group
          id="input-group-commune_code"
          label="Kommun"
          label-for="input-commune_code"
        >
          <b-form-select
            id="commune_code"
            v-model="commune_code"
            :options="communeOptions"
            v-on:input="doValidation"
            :state="states['commune']"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
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
import moment from 'moment';
import validate_pers_number from '@/core/services/personnr';

export default {
  name: 'details-page',
  props: ['page','spar'],
  components: {},
  data() {
    return {
      form: { birthdate: '' },
      personnr: '',
      fmt_personnr: '',
      valid: false,
      skipPersonnr: false,
      regionOptions: [],
      communeOptions: [],
      region_code: null,
      commune_code: null,
      password1: '',
      password2: '',
      password1Valid: false,
      password2Valid: false,
      isBirthdate: false,
      disabled_birthdate: false,
      regions: {},
      states: {}
    };
  },
  mounted() {
    this.loadRegions();
    this.$emit('isValid', false, this.page.index);
    
    if (this.spar !== null) {
      this.form = this.spar;
      
      this.validate(this.form, this.states);
    }
  },
  watch: {
    spar(newValue, oldValue) {
      if (newValue) {
        this.form = newValue;

        this.region_code = this.form.region_code;
        this.commune_code = this.form.commune_code;

        if (newValue.fmt_personnr !== undefined && newValue.fmt_personnr !== null && newValue.fmt_personnr.length > 6) {
          this.form.birthdate = newValue.fmt_personnr.substring(0,8);
        }
        else if (newValue.birthdate !== undefined && newValue.birthdate !== null && newValue.birthdate.length === 8) {
          this.form.birthdate = newValue.birthdate;
        }
        
        this.validate(this.form, this.states);
      }
    },
    password1(newValue, oldValue) {
      if (newValue.length > 6) {
        this.password1Valid = true;
      } else {
        this.password1Valid = false;
      }
    },
    password2(newValue, oldValue) {
      if (newValue === this.password1) {
        this.password2Valid = true;
        this.form.password = newValue;
      } else {
        this.password2Valid = false;
      }
    },
    form(newValue, oldValue) {
      //this.$emit('isValid', this.validate(newValue), this.page.id);
    },
    region_code(newValue, oldValue) {
      this.form.region_code = newValue;
      this.form.region = this.regions[this.form.region_code].region;

      if (newValue) {
        this.loadCommunes(newValue);
      }

      var valid = this.validate(this.form, this.states);

      this.$emit('isValid', valid, this.page.id);
    },
    commune_code(newValue, oldValue) {
      this.form.commune_code = newValue;
      this.form.commune = this.regions[this.form.region_code].communes[newValue].commune;

      var valid = this.validate(this.form, this.states);

      this.$emit('isValid', valid, this.page.id);
    },
    personnr(newValue, oldValue) {
      var formatted = validate_pers_number(newValue);

      this.valid = formatted.valid;

      this.fmt_personnr = formatted.formatted;
      this.form.birthdate = formatted.year+formatted.month+formatted.day;
      this.form.age = this.getAge();

      this.validate(this.form, this.states);
    }
  },
  methods: {
    getAge() {
      var str = this.fmt_personnr.substring(0, 8);

      return moment().diff(str, 'years');
    },
    setBirthdate(date) {
      this.isBirthdate = true;
      this.form.birthdate = date;
      this.disabled_birthdate = this.is_ok(date);
    },
    doValidation() {
      this.states = {};

      var valid = this.validate(this.form, this.states);

      console.log('DetailsPage: emit isValid is ' + valid);

      this.$emit('isValid', valid, this.page.id);
    },
    validate(form, states) {
      const formatted = validate_pers_number(form.birthdate);
      
      if (this.page.settings.birthdate && (!formatted.success || form.birthdate.length !== 8)) {
        states['birthdate'] = false;
        this.form.age = 0;
      }
      else {
        states['birthdate'] = true;
        this.form.age = this.getAge();
      }

      if (this.page.settings.password) {
        if (!this.is_ok(this.password1) || this.password1.length < 6) {
          states['password1'] = false;
        }
        else {
          states['password1'] = true;
        }

        this.password1Valid = true;

        if (this.password1 !== this.password2) {
          states['password2'] = false;
          this.password2Valid = false;
        }
        else {
          states['password2'] = true;
        }

        this.form.password = this.password2;
        this.password2Valid = true;

      } 

      states['firstname'] = this.is_ok(form.firstname);
      states['lastname'] = this.is_ok(form.lastname);
      states['email'] = this.validate_email(form.email);
      states['email2'] = form.email === form.email2 && form.email2 !== undefined;
      
      states['zipcode'] =     !this.page.settings.zipcode || this.is_ok(form.zipcode);
      states['address'] =     !this.page.settings.address || this.is_ok(form.address);
      states['region'] =      !this.page.settings.region || this.is_region_ok(form.region_code);
      states['commune'] =     !this.page.settings.commune || this.is_ok(form.commune_code);
      states['phone'] =       !this.page.settings.phone || this.is_ok(form.phone);
      states['post'] =        !this.page.settings.zipcode || this.is_ok(form.post);

      for (const k in states) {
        if (!states[k]) {
          return false;
        }
      }

      return true;
    },
    is_ok(field) {
      return field !== null && field !== undefined && field.length > 1;
    },
    is_region_ok(field) {
      return field !== null && field !== undefined;
    },
    getData() {
      return this.form;
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
    
    validate_email(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    
    loadRegions() {
      axios
        .get('/location/regions')
        .then(res => {
          this.regions = res.data.regions;
          this.regionOptions = [];

          for (var k in this.regions) {
            this.regionOptions.push({ value: k, text: this.regions[k].region });
          }

          this.regionOptions.sort(function(a, b) {
            if (a.text < b.text) {
              return -1;
            }
            if (a.text > b.text) {
              return 1;
            }
            return 0;
          });
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta regioner');
        });
    },
    selectRegion(region_code) {
      this.loadCommunes(region_code, 1);
    },
    getCommunes(region_code) {
      var comm = [];

      var communes = this.regions[region_code].communes;
      this.communes = communes;

      for (var k in communes) {
        comm.push({ value: k, text: communes[k].commune });
      }

      comm.sort(function(a, b) {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      });

      return comm;
    },
    loadCommunes(selectedRegion) {
      console.log('selected region: ' + selectedRegion);
      this.communeOptions = [];

      var communes = this.regions[selectedRegion].communes;
      this.communes = communes;

      for (var k in communes) {
        this.communeOptions.push({ value: k, text: communes[k].commune });
      }

      this.communeOptions.sort(function(a, b) {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      });
    }
  }
};
</script>

