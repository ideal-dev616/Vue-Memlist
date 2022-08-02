<template>
  <div id="page-profile-users">
    <b-form
    class="mt-8"
    >
    <b-form-group
        id="input-group-user_id"
        label="ID"
        label-for="input-user_id"
        >
        <b-form-input
            id="input-user_id"
            v-model="form.user_id"
            type="text"
            required
            disabled
        ></b-form-input>
        </b-form-group>

        <b-form-group
        id="input-group-1"
        label="E-post"
        label-for="input-1"
        >
        <b-form-input
            id="input-1"
            v-model="form.email"
            :state="!emailTaken"
            type="email"
            required
            placeholder="Ange e-post"
        ></b-form-input>
        <b-form-invalid-feedback id="member-email-feedback" >
          E-postadressen är redan registrerad i systemet. För att bjuda in denna e-post till denna förening, använd "Bjud in" knappen
        </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="input-phone"
          label="Telefon"
          label-for="input-phone"
        >
          <b-form-input
            id="input-phone"
            v-model="form.phone"
            placeholder="Ange telefonnummer"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="firstname-group" label="Förnamn" label-for="firstname">
        <b-form-input
            id="firstname"
            v-model="form.firstname"
            required
            placeholder="Förnamn"
        ></b-form-input>
        </b-form-group>

        <b-form-group id="lastname-group" label="Efternamn" label-for="lastname">
        <b-form-input
            id="lastname"
            v-model="form.lastname"
            required
            placeholder="Efternamn"
        ></b-form-input>
        </b-form-group>

        <b-form-group id="in_personnr-group" label="Personnummer" label-for="in_personnr">
        <b-form-input
            id="in_personnr"
            v-model="form.in_personnr"
            placeholder="YYYYMMDDXXXX"
            @input="personnrChanged"
        ></b-form-input>
        </b-form-group>

        <b-form-group id="fmt_personnr-group" label="Formaterat Personnummer" label-for="fmt_personnr">
        <b-form-input
            id="fmt_personnr"
            v-model="form.fmt_personnr"
            placeholder="YYYYMMDD-XXXX"
            disabled
        ></b-form-input>
        </b-form-group>

        <b-form-group id="sex-group" label="Juridiskt kön" label-for="sex">
        <b-form-select
            id="sex"
            v-model="form.sex"
            :options="genders"
            disabled
        ></b-form-select>
        </b-form-group>

        <b-form-group id="public_sex-group" label="Identifierat kön" label-for="public_sex">
        <b-form-select
            id="public_sex"
            v-model="form.public_sex"
            :options="genders"
            required
        ></b-form-select>
        </b-form-group>

        <b-form-group id="title-group" label="Titel" label-for="title_id">
        <b-form-select
            id="title_id"
            v-model="form.title_id"
            :options="companyTitles"

        ></b-form-select>
        </b-form-group>

        <b-form-group>
        <div class="d-flex align-items-center">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
            <input type="checkbox" v-model="form.is_director" @click="form.is_director = !form.is_director" />
            <span></span>
            </label>
            <span class="ml-3 cursor-pointer"
            >Är styrelsemedlem</span
            >
        </div>
        </b-form-group>
        <b-form-group>
        <div class="d-flex align-items-center">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
            <input type="checkbox" v-model="form.is_accountant"  @click="form.is_accountant = !form.is_accountant"/>
            <span></span>
            </label>
            <span class="ml-3 cursor-pointer"
            >Är revisor</span
            >
        </div>
        </b-form-group>

        <b-button type="button" variant="primary" @click="saveUser">Spara</b-button>
    </b-form>
  </div>
</template>

<style lang="scss" scoped>

.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.form-create-member {
    margin: 0 auto;
    padding: 25px;
}

</style>

<script>
import validatePersonnr from '@/core/services/personnr';
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'user-edit',
  components: {

  },
  props: ['companyTitles','user_id','creating'],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods', 'companies']),
  },
  async mounted() {
    if (this.user_id) {
      this.selectUser(this.user_id);
    }
  },
  data() {
    return {
      emailTaken: false,
      validEmail: true,
      titles: [],
      company: {},
      form: {
        user_id: '',
        email: '',
        firstname: '',
        lastname: '',
        is_accountant: false,
        is_director: false,
        title_id: '',
        public_sex: 'U',
        sex: 'U'
      },
      invite_email: '',
      genders: [
        { value: 'M', text: 'Man' },
        { value: 'F', text: 'Kvinna' },
        { value: 'O', text: 'Annat' },
        { value: 'U', text: 'Okänt' }
      ],
      editing: false,
    };
  },
  watch: {
    user_id(newValue, oldValue) {
      if (newValue === null) {
        this.clearFields();
        return;
      }

      if (newValue) {
        this.selectUser(newValue);
      }
    },
    'form.email': async function(){
      
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const val = re.test(String(this.form.email).toLowerCase());

      console.log('updated: ' + val + ' ' +this.creating );
      
      if (!val) {
        this.emailTaken = false;
        this.validEmail = false;
      } else {
        if (this.creating) {
          const res = await axios.get(`/user/checkemail?email=${this.form.email}`);
          this.emailTaken = res.status === 200;
          this.validEmail = !this.emailTaken;
        }
        else {
          this.validEmail = true;
          this.emailTaken = false;
        }
      }
    }
  },
  methods: {
    clearFields() {
    
      this.form = {
        user_id: '',
        email: '',
        firstname: '',
        lastname: '',
        is_accountant: false,
        is_director: false,
        title_id: '',
        public_sex: 'U',
        sex: 'U'
      };
    },
    selectUser(user_id) {
      axios
        .get(`/user?user_id=${user_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.form = res.data.user;
          
          this.$emit('userCreated', this.form);

          this.editing = true;

          this.company_access = res.data.company_access;
          this.form.title_id = this.company_access.title_id;
          this.form.is_accountant = false;
          this.form.is_director = false;

          for (var i = 0; i < this.company_access.types.length; ++i) {
            if (this.company_access.types[i] === 'd') {
              this.form.is_director = true;
            }
            else if (this.company_access.types[i] === 'a') {
              this.form.is_accountant = true;
            }
          }

          this.$emit('accessLoaded', res.data.access);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta användare');
        })
    },

    personnrChanged(evt) {
      var result = validatePersonnr(this.form.in_personnr);
      this.form.fmt_personnr = result.formatted;
      this.form.sex = result.sex;
    },
    saveUser(e) {
      e.preventDefault();

      this.form.company_id = this.currentCompanyId;

      this.$emit('saveUser', this.form);

    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type,
      })
    }
  }
};
</script>
