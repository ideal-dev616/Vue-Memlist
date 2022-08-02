<template>
  <b-card class="shadow-sm rounded login-body mb-5">
    <h3 class="text-center mt-4 mb-4">Logga in</h3>
    <form class="login-form" v-if="showForm">
      <b-alert
        :show="showWarning"
        variant="danger"
        dismissible
        @dismissed="showWarning = false"
        fade
        >Fel e-post eller lösenord.</b-alert
      >
      <b-form-input type="email" v-model="form.email" class="mb-8" placeholder="E-post" />
      <b-form-input type="password" v-model="form.password" class="mb-8" placeholder="Lösenord" />
      <div class="d-flex align-items-center justify-content-between mb-8">
        <router-link :to="forgetLink()" tag="a" class="line-link blue-link"
          >Glömt lösenord?</router-link
        >
        <b-button class="btn-login" variant="primary" @click="onSubmit">Logga In</b-button>
      </div>
    </form>
    <div class="warning-message" v-else>
      <b-alert variant="danger" fade show>
        <div class="d-flex align-items-center justify-content-center p-4">
          <div>
            <fa-icon :icon="['far', 'question-circle']" size="3x"></fa-icon>
          </div>
          <div class="ml-4">
            Felaktig inloggningslänk. Kontakta din förening för att begära en korrekt länk.
          </div>
        </div>
      </b-alert>
    </div>
  </b-card>
</template>

<style lang="scss" scoped>
  .bg-yellow {
    /*background-color: #FFF8C5;*/
    /*border-color: #ffffff;*/
    /*color: #3F4254;*/
    /*outline: 0;*/
  }
  
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
import messageParent from '@/core/services/messageParent';

import { mapState } from 'vuex';
import { CLIENT_LOGIN, CLIENT_LOGOUT } from '@/core/services/store/client.auth.module';

import axios from 'axios';

import { validationMixin } from 'vuelidate';
import { email, minLength, required } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  props: ['company_id','redirect'],
  name: 'login',
  data() {
    return {
      // Remove this dummy login info
      form: {
        email: '',
        password: '',
        company_id: ''
      },
      showWarning: false,
      showForm: false
    };
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  mounted() {
    if (this.$route.params.company_id) {
      this.form.company_id = this.$route.params.company_id;
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

    setTimeout(function(){
      messageParent(JSON.stringify({ height: document.body.scrollHeight }));
    }, 300);
  },
  methods: {
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
    async onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        this.showWarning = true;
        return;
      }

      const email = this.$v.form.email.$model;
      const password = this.$v.form.password.$model;

      // show loading
      const loader = this.$loading.show();
      const res = await axios.post('/client/login', { email, password, company_id: this.form.company_id });
      if (res.status === 200) {
        // success
        //this.$store.dispatch(CLIENT_SET_COMPANY, res.data.company);

        this.$store.dispatch(CLIENT_LOGIN, res.data);
        if (this.redirect) {
          this.$router.push({ name: this.redirect });
        }
        else {
          this.$router.push({ name: 'profile' });
        }
      } else {
        // un authorized
        //this.$func.showTextMessage('Unauthorized', 'Please check your credentials', 'info');
        this.showWarning = true;
      }
      loader & loader.hide();
    },
    forgetLink() {
      return '/forget/' + this.$route.params.company_id;
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
