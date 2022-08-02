<template>
  <b-card class="register-body mb-5">
    <h3 class="text-center mt-4 mb-4">Registrera dina uppgifter</h3>
    <form class="register-form">
      <b-form-input type="text" v-model="form.firstname" class="mb-8" placeholder="Förnamn" />
      <b-form-input type="text" v-model="form.lastname" class="mb-8" placeholder="Efternamn" />
      <b-form-input type="text" v-model="form.personnr" class="mb-8" placeholder="Personnummer" v-if='!public_only'/>
      <b-form-input type="text" v-model="form.phone" class="mb-8" placeholder="Telefon" />
      <b-form-input type="email" v-model="form.email" class="mb-8" placeholder="E-post" />
      <SubCompanies :company_id='company_id' v-if='public_only' class="mb-sm-8" ref='companies_selected'/>
      <b-alert v-if="form.phone.length > 32 || !validate_phone(form.phone)" show variant="danger">Felaktigt telefonnummer</b-alert>
      <b-alert v-if="form.email.length > 64 || !validate_email(form.email)" show variant="danger">Felaktig e-post</b-alert>
      <div class="d-flex align-items-center justify-content-between mb-8">
        <b-button class="btn-register" variant="primary" @click="onSubmit"
          :disabled="form.email.length > 64 || !validate_email(form.email) || form.phone.length > 32"
          >Anmäl mig</b-button>
      </div>
    </form>
  </b-card>
</template>

<style lang="scss" scoped>
.login-body {
  max-width: 500px;
  width: 100%;
  .login-form {
    padding: 2rem 1.5rem 2rem 1.5rem;
    .btn-login {
      font-size: 1.2rem;
      font-weight: 500;
      padding: 1rem 3rem;
      background-color: #5d78ff;
      border-color: #5d78ff;
      &:hover {
        background-color: #3758ff;
        border-color: #2a4eff;
      }
    }
  }
  .warning-message {
    padding: 30px 20px;
  }
}
</style>

<script>
import { mapState } from 'vuex';
import { LOGIN, LOGOUT } from '@/core/services/store/auth.module';
import axios from 'axios';

import { validationMixin } from 'vuelidate';
import { email, minLength, required, maxLength } from 'vuelidate/lib/validators';
import SubCompanies from '@/view/pages/members/public/SubCompanies.vue';

export default {
  mixins: [validationMixin],
  props: ['company_id', 'public_only', 'members_only'],
  name: 'register-member-no-account',
  components: {
    SubCompanies
  },
  data() {
    return {
      // Remove this dummy login info
      form: {
        email: '',
        password: '',
        company_id: '',
        firstname: '',
        lastname: '',
        phone: '',
        personnr: ''
      },
      showWarning: false,
      showForm: false
    };
  },
  validations: {
    form: {
      email: {
        required,
        email,
        maxLength: maxLength(64)
      },
      password: {
        required,
        minLength: minLength(3)
      },
      phone: {
        maxLength: maxLength(32)
      }
    }
  },
  mounted() {

    if (this.$route.query.company_id) {
      this.form.company_id = this.$route.query.company_id;
      this.showForm = true;
    } else {
      if (this.company_id) {
        this.showForm = true;
        this.form.company_id = this.company_id;
      }
      else {
        this.showForm = false;
      }
    }
  },
  methods: {
    validate_phone(phone) {
      if ((phone+'').length < 6) {
        return false;
      }
      
      var re = /^\+?\d*$/;
      return re.test(String(phone).toLowerCase());
    },
    validate_email(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        email: null,
        password: null
      };

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    onSubmit() {
      var companies = [];

      if (this.public_only)
        companies = this.$refs['companies_selected'].getCompanies();
      else
        companies.push(this.company_id);

      if (this.members_only) {
        let data = this.form;
        let that = this;

        companies.forEach(function(item) {
          data.company_id = item;
          axios
            .post('/client/public', data)
            .then(res => {
              if (res.status === 201) {
                console.log('Crate Account');
                that.$emit('submitForm', data);
              } else {
                console.error(res);
                that.toastr('danger', 'Server Fel', 'Kunde inte skapa medlemskonto');
              }
            })
            .catch(err => {
              console.error(err);
              that.toastr('danger', 'Server Fel', 'Kunde inte skapa medlemskonto');
            });
        })
      } else {
        this.$emit('submitForms', this.form, companies);
      }
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
