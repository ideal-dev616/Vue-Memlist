<template>
  <div>
    <b-card class="mb-5" v-if="!showForget">
      <h3 class="text-center mt-4 mb-4">Återställ lösenord</h3>
      <div class="text-center">Lösenordsinställningen lyckades.</div>
      <hr>
      <router-link to="/ml-login" tag="a" class="">Till inloggningen</router-link>
    </b-card>
    <b-card class="forget-body mb-5" v-if="showForget">
      <h3 class="text-center mt-4 mb-4">Återställ lösenord</h3>
      <form class="forget-form">
        <b-alert
          v-if="form.email"
          show
          variant="light"
          >{{form.email}}</b-alert
        >

        <b-alert
          :show="showWarning"
          variant="danger"
          dismissible
          @dismissed="showWarning = false"
          fade
          >Fel e-post eller lösenord.</b-alert
        >
        <b-form-input
          type="password"
          v-model="form.password"
          class="mb-6 mt-4"
          placeholder="Nytt lösenord"
        />
        
        <b-form-input type="password" v-model="form.confirmPassword" placeholder="Bekräfta lösenord" class="mb-12 mt-4" />

        <div class="d-flex align-items-center justify-content-end mb-12 mt-12">
          <b-button class="btn-login" variant="primary" @click="onSubmit">
            Återställ lösenord
          </b-button>
        </div>
      </form>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
.forget-body {
  max-width: 500px;
  width: 100%;
  .forget-form {
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
}
</style>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

import { validationMixin } from 'vuelidate';
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  name: 'forget',
  data() {
    return {
      showForget: true,
      // Remove this dummy login info
      form: {
        email: '',
        confirmPassword: '',
        password: ''
      },
      token: null,
      showWarning: false
    };
  },
  validations: {
    form: {
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs('password') }
    }
  },
  mounted() {
    var token = this.$route.query.token;

    if (token === null || token === undefined || token.length < 8) {
      token = this.$route.params.token;
    }

    this.token = token;

    console.log('token: ' + token);

    this.getUserByToken(token);
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    getUserByToken(token) {
      const resetToken = token;
      axios
        .get(`/user/resettoken?token=${token}`)
        .then(res => {
          console.log(res.data.user);
          console.log(this.form);
          this.form.email = res.data.user.email;
          // this.showForm = true;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte hämta användardata');
        });
    },
    async onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        this.showWarning = true;
        return;
      }
      const email = this.form.email;
      const password = this.form.password;
      
      // show loading
      const loader = this.$loading.show();
      const res = await axios.post('/user/reset', { email, password, token: this.token });
      if (res.status === 200 || res.status === 204) {
        this.showForget = false;
        this.showWarning = false;
      } else {
        // un authorized
        // this.$func.showTextMessage('Unauthorized', 'Please check your credentials', 'info');
        this.showWarning = true;
        this.showForget = true;
      }
      loader & loader.hide();
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
