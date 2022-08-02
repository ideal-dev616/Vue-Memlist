<template>
  <div>
    <div v-html="page.html"></div>
    <b-form-group class="col-6" id="name-group" label="Föreningsnamn" label-for="name">
      <b-form-input :state="stateName" v-on:input="doValidation" id="name" v-model="form.name" placeholder="Föreningsnamn"></b-form-input>
    </b-form-group>

    <div>
      <b-form-group class="col-6" id="address-group" label="Gatuadress" label-for="address">
        <b-form-input  :state="stateAddress" v-on:input="doValidation" id="address" v-model="form.address" placeholder="Gatuadress"></b-form-input>
      </b-form-group>
    </div>


    <div>
      <b-form-group class="col-6" id="co-group" label="C/O" label-for="co">
        <b-form-input v-on:input="doValidation" id="co" v-model="form.co" placeholder="C/O"></b-form-input>
      </b-form-group>
    </div>

    <div>
      <b-form-group class="col-6" id="zipcode-group" label="Postkod" label-for="zipcode">
        <b-form-input  :state="stateZipcode" v-on:input="doValidation" id="zipcode" v-model="form.zipcode" placeholder="00000"></b-form-input>
      </b-form-group>
    </div>

    <div>
      <b-form-group class="col-6" id="post-group" label="Postort" label-for="post">
        <b-form-input  :state="statePost" v-on:input="doValidation" id="post" v-model="form.post" placeholder=""></b-form-input>
      </b-form-group>
    </div>

    <div>
      <b-form-group
        id="input-group-region_code"
        label="Region"
        label-for="input-region_code"
        class="col-6"
      >
        <b-form-select
          id="region_code"
          v-model="region_code"
          :options="regionOptions"
          v-on:input="doValidation"
          :state="stateRegion"
        ></b-form-select>
      </b-form-group>
    </div>

    <div>
      <b-form-group
        id="input-group-commune_code"
        label="Kommun"
        label-for="input-commune_code"
        class="col-6"
      >
        <b-form-select
          id="commune_code"
          v-model="commune_code"
          :options="communeOptions"
          v-on:input="doValidation"
           :state="stateCommune"
        ></b-form-select>
      </b-form-group>
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
import moment from 'moment';

export default {
  name: 'details-page',
  props: ['page'],
  components: {},
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  data() {
    return {
      stateName: false,
      stateAddress: false,
      stateZipcode: false,
      statePost: false,
      stateRegion: false,
      stateCommune: false,
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
      birthdate: '',
      regions: {}
    };
  },
  mounted() {
    this.loadRegions();
    this.$emit('isValid', false, this.page.index);
  },
  watch: {
    form(newValue, oldValue) {
      this.$emit('isValid', this.validate(newValue), this.page.index);
    },
    region_code(newValue, oldValue) {
      this.form.region_code = newValue;
      this.form.region = this.regions[this.form.region_code].region;

      if (newValue) {
        this.loadCommunes(newValue);
      }

      this.$emit('isValid', this.validate(this.form), this.page.index);
    },
    commune_code(newValue, oldValue) {
      this.form.commune_code = newValue;
      this.form.commune = this.regions[this.form.region_code].communes[newValue].commune;

      this.$emit('isValid', this.validate(this.form), this.page.index);
    }
  },
  methods: {
    doValidation() {
      this.$emit('isValid', this.validate(this.form), this.page.index);
    },
    validate(form) {
      var ok = true;

      if (!this.is_ok(form.name)) {
        this.stateName = false;
        ok = false;
      }
      else {
        this.stateName = true;
      }

      if (!this.is_ok(form.address)) {
        this.stateAddress = false;
        ok = false;
      }
      else {
        this.stateAddress = true;
      }

      if (!this.is_ok(form.post)) {
        this.statePost = false;
        ok = false;
      }
      else {
        this.statePost = true;
      }

      if (!this.is_ok(form.zipcode) || (form.zipcode+'').length !== 5) {
        this.stateZipcode = false;
        ok = false;
      }
      else {
        this.stateZipcode = true;
      }

      if (!this.is_ok(form.region_code)) {
        this.stateRegion = false;

        ok = false;
      }
      else {
        this.stateRegion = true;
      }

      if (!this.is_ok(form.commune_code)) {
        this.stateCommune = false;
        
        ok = false;
      }
      else {
        this.stateCommune = true;
      }

      return ok;
    },
    is_ok(field) {
      return field !== null && field !== undefined && field.length > 0;
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
    loadRegions() {
      axios
        .get('/location/regions')
        .then(res => {
          this.regions = res.data.regions;
          this.regionOptions = [];

          for (var k in this.regions) {
            this.regionOptions.push({ value: k, text: this.regions[k].region });
          }

          this.regionOptions.sort(function (a, b) {
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

      comm.sort(function (a, b) {
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
      this.communeOptions = [];

      var communes = this.regions[selectedRegion].communes;
      this.communes = communes;

      for (var k in communes) {
        this.communeOptions.push({ value: k, text: communes[k].commune });
      }

      this.communeOptions.sort(function (a, b) {
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
