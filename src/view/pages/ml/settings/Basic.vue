<template>
  <div class="px-5 mt-8" id="page-basic0">
    <b-row>

      <b-col lg="12">
        <b-card title="" class="mb-2 mx-auto mt-8" hide-footer>
          <div>
            <b-form class="mt-8" @submit="saveData">
              <b-form-group id="input-group-name" label="Namn" label-for="input-name">
                <b-form-input
                  id="input-name"
                  v-model="form.name"
                  type="text"
                  required
                ></b-form-input>
              </b-form-group>

              <b-row v-if="form.logo != ''">
                <b-col lg="12"><b-img style="max-height: 200px;" :src="form.logo+'?rnd='+rnd" fluid thumbnail></b-img></b-col>
              </b-row>

              <b-row class="mt-2">
                <b-col lg="12"><b-button type="button" variant="success" @click="selectFile()">Ladda upp logotyp</b-button></b-col>
              </b-row>

              <input hidden type="file" id="file" ref="file" v-on:change="handleFileUpload()" accept="image/*"/>

              <b-form-group class="mt-8 mb-4" id="input-group-cnum" label="Föreningsnummer" label-for="input-cnum">
                <b-form-input id="input-cnum" v-model="form.cnum" type="text"></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-type" label="Typ" label-for="input-type">
                <b-form-select
                  id="type"
                  v-model="form.type"
                  :options="companyTypes"
                ></b-form-select>
              </b-form-group>

              <b-form-group
                id="input-group-org_number"
                label="Org. Nummer"
                label-for="input-org_number"
              >
                <b-form-input
                  id="input-org_number"
                  v-model="form.org_number"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-mpid" label="Medlemslöpnummer" label-for="input-mpid">
                <b-form-input id="input-mpid" v-model="form.mpid" type="text"></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-pc_id" label="Moderförening ID" label-for="input-pc_id">
                <b-form-input id="input-pc_id" v-model="form.pc_id" type="text"></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-street" label="Gatuadress" label-for="input-street">
                <b-form-input id="input-street" v-model="form.street" type="text"></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-zipcode" label="Postkod" label-for="input-zipcode">
                <b-form-input id="input-zipcode" v-model="form.zipcode" type="text"></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-post" label="Postort" label-for="input-post">
                <b-form-input id="input-post" v-model="form.post" type="text"></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-region_code"
                label="Region"
                label-for="input-region_code"
              >
                <b-form-select
                  id="region_code"
                  v-model="region_code"
                  :options="regionOptions"
                ></b-form-select>
              </b-form-group>

              <b-form-group
                id="input-group-commune_code"
                label="Kommun"
                label-for="input-commune_code"
              >
                <b-form-select
                  id="commune_code"
                  v-model="commune_code"
                  :options="communeOptions"
                ></b-form-select>
              </b-form-group>

              
              <b-form-group
                id="input-group-email"
                label="Konto e-post (Ej synlig)"
                label-for="input-email"
              >
                <b-form-input id="input-email" v-model="form.email" type="text"></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-phone"
                label="Konto telefon (Ej synlig)"
                label-for="input-phone"
              >
                <b-form-input id="input-phone" v-model="form.phone" type="text"></b-form-input>
              </b-form-group>


              <b-form-group id="input-group-c_name" label="Kontakt namn" label-for="input-c_name">
                <b-form-input id="input-c_name" v-model="form.c_name" type="text"></b-form-input>
              </b-form-group>

              

              <b-form-group
                id="input-group-c_email"
                label="Kontakt E-post"
                label-for="input-c_email"
              >
                <b-form-input id="input-c_email" v-model="form.c_email" type="text"></b-form-input>
              </b-form-group>

              <b-form-group
                id="input-group-c_phone"
                label="Kontakt Telefon"
                label-for="input-c_phone"
              >
                <b-form-input id="input-c_phone" v-model="form.c_phone" type="text"></b-form-input>
              </b-form-group>

             


              <b-form-group id="input-group-web" label="Hemsida" label-for="input-web">
                <b-form-input id="input-web" v-model="form.web" type="text"></b-form-input>
              </b-form-group>

              <div class="d-flex align-items-center mb-6">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="form.mucf.include"
                    @click="form.mucf.include = !form.mucf.include"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                  >Inkludera i MUCF beräkningar</span
                >
              </div>

              <div v-if="form.stats !== null && form.stats !== undefined" class="d-flex align-items-center mb-8">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-outline-2x checkbox-primary"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="form.stats.pcinc"
                    @click="form.stats.pcinc = !form.stats.pcinc"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                  >Statistik ska inkluderas i moderföreningen</span
                >
              </div>

              <template v-for="(item, i) in extras_data">
                <b-form-group
                  v-bind:key="i"
                  :label="item.name"
                >
                  <b-form-input v-model="item.value" type="text"></b-form-input>
                </b-form-group>
              </template>

              <!--<div>
                Testing
                <hr>
                <div class='d-flex justify-content'>
                  <label class="radio radio-outline radio-success mr-5">
                    <input type="radio" name="radios_test" checked='checked'>
                    <span class='mr-2'></span>Green Radio
                  </label>
                  <label class="radio radio-outline radio-outline-2x radio-primary">
                    <input type="radio" name="radios_test">
                    <span class='mr-2'></span>Blue Radio
                  </label>
                </div>
                <hr>
              </div>-->

              <b-button type="submit" variant="primary">Spara</b-button>
            </b-form>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="css" scoped>

.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { SET_COMPANIES } from '@/core/services/store/common.module';

export default {
  name: 'basic-settings',
  components: {},
  props: ['company_id', 'company', 'extras', 'regions', 'creating'],
  computed: {
    ...mapGetters(['currentPeriodId','currentCompanyId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      extras_data: [],
      rnd: 'aaa',
      communeOptions: [],
      regionOptions: [],
      companyTypes: [
        { value: 'default', text: 'Förening' },
        { value: 'riks', text: 'Riksförbund' },
        { value: 'student', text: 'Studentkår' },
        { value: 'workgroup', text: 'Arbetsgrupp' },
      ],
      region_code: '',
      commune_code: '',
      form: {
        company_id: '',
        name: '',
        c_email: '',
        c_name: '',
        c_phone: '',
        org_number: '',
        type: '',
        cnum: 0,
        mpid: 0,
        pc_id: null,
        street: '',
        region_code: '',
        commune_code: '',
        web: '',
        mucf: {
          include: false,
        },
        stats: {
          pcinc: false
        },
        
      }
    };
  },
  watch: {
    company_id(newValue, oldValue) {
      if (newValue) {

      }
    },
    extras(newValue, oldValue) {
      this.extras_data = newValue;
    },
    regions(newValue, oldValue) {
      this.setRegions(newValue);
    },
    company(newValue, oldValue) {
      if (newValue) {
        for (var k in newValue) {
          if (newValue.hasOwnProperty(k))
            this.form[k] = newValue[k];
        }
        if (newValue.hasOwnProperty('region_code'))
          this.region_code = newValue.region_code;
        if (newValue.hasOwnProperty('commune_code'))
          this.commune_code = newValue.commune_code;
        if (!this.form.hasOwnProperty('mucf'))
          this.form["mucf"] = {include: false};
        if (!this.form.mucf.hasOwnProperty('include'))
          this.form["mucf"]["include"] = false;
        if (this.form.stats === null || this.form.stats === undefined) {
          this.form.stats = { pcinc: false };
        }
      }
    },
    region_code(newValue, oldValue) {
      if (newValue) {
        if (this.regions[newValue] != undefined && this.regions[newValue].hasOwnProperty('communes'))
          this.setCommunes(this.regions[newValue].communes);
      }
    },
  },
  methods: {
    setCommunes(communes) {

      this.communeOptions = [];

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
    },
    setRegions(regions) {
      this.regionOptions = [];

      for (var k in regions) {
        if (regions[k].hasOwnProperty('region'))
          this.regionOptions.push({ value: k, text: regions[k].region });
      }

      if (this.region_code in this.regions) {

      }
    },
    async loadData() {
      this.form = this.company;
      if (!this.form.hasOwnProperty('mucf'))
        this.form["mucf"] = {include: false};
      if (!this.form.mucf.hasOwnProperty('include'))
        this.form["mucf"]["include"] = false;

      this.region_code = this.company.region_code;
      this.commune_code = this.company.commune_code;

      this.setRegions(this.regions);

    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    loadCompany(company_id) {
      axios
        .get(`/company?company_id=${company_id}`)
        .then(res => {
          this.form = res.data.company;

          if (!this.form.hasOwnProperty('mucf') || !this.form.mucf.hasOwnProperty('include')) {
            this.form["mucf"]["include"] = false;
          }

          if (this.form.stats === null || this.form.stats === undefined) {
            this.form.stats = { pcinc: false };
          }

        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta föreningsuppgifter');
        });
    },
    saveData(e) {
      e.preventDefault();

      this.form.company_id = this.company.company_id;
      this.form.region_code = this.region_code;
      this.form.commune_code = this.commune_code;

      this.form.extras = this.extras_data;

      if (!this.creating) {
        axios
          .put('/company', this.form)
          .then(res => {
            if (res.status === 204) {
              this.toastr('success', 'OK', 'Inställningar uppdaterad');
              this.reloadCompanies();
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera inställningar');
          });
      }
      else {
        axios
          .post('/company', this.form)
          .then(res => {
            if (res.status === 201) {
              this.toastr('success', 'OK', 'Förening skapad');
              this.reloadCompanies();
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte skapa förening');
          });
      }
    },
    reloadCompanies() {
      axios
      .get('/company/list')
      .then(res => {
        if (res.status === 200) {
          this.$store.dispatch(SET_COMPANIES, res.data.companies);
          this.$emit('saved');
        }
      })
      .catch(err => {
        console.error(err);
        this.toastr('danger', 'Serverfel', 'Gick inte att hämta föreningslista');
      });
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];

      this.uploadFile();
    },
    selectFile() {
      this.$refs.file.click();
    },
    uploadFile() {
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('file_source', 'company_logo');
      formData.append('company_id', this.currentCompanyId);
      
      axios
        .post(`/fileupload`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.toastr('success', 'OK', 'Filen laddades upp');
          
          console.log(res.data);

          this.form.logo = res.data.files[0];

          console.log(this.form.logo);

          this.rnd = this.randomstr(5);

          //this.wizard.goNext();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
        });
    },
    randomstr(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result;
    },
  }
};
</script>
