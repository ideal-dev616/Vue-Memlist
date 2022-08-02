<template>
  <b-card class="login-body mb-5">
    <h3 class="text-center mt-4 mb-4">Aktivera ditt konto</h3>
    <form class="login-form" v-if="showForm">
      <b-alert
        :show="showWarning"
        variant="danger"
        dismissible
        @dismissed="showWarning = false"
        fade
        >Fel e-post eller lösenord.</b-alert
      >

      <b-form-group id="input-group-companyname" label="Företagsnamn" label-for="input-companyname">
        <b-form-input id="input-companyname" v-model="form.company_name" type="text" disabled></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-firstname" label="Förnamn" label-for="input-firstname">
        <b-form-input id="input-firstname" v-model="form.firstname" type="text"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-lastname" label="Efternamn" label-for="input-lastname">
        <b-form-input id="input-lastname" v-model="form.lastname" type="text"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-email" label="E-post" label-for="input-email">
        <b-form-input id="input-email" v-model="form.email" type="text" disabled></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-phone" label="Telefon" label-for="input-phone">
        <b-form-input id="input-phone" v-model="form.phone" type="text"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-password" label="Lösenord" label-for="input-password">
        <b-form-input id="input-password" v-model="form.password" type="password"></b-form-input>
      </b-form-group>

      <div class="d-flex align-items-center justify-content-end mb-8">
        <!-- <b-button class="btn-login" variant="primary" @click="onSubmit">Aktivera konto</b-button> -->
        <b-button class="btn-login" variant="primary" @click="onSubmit">Aktivera konto</b-button>
      </div>
    </form>
    <div class="warning-message" v-else>
      <b-alert variant="danger" fade show>
        <div class="d-flex align-items-center justify-content-center p-4">
          <div>
            <fa-icon :icon="['far', 'question-circle']" size="3x"></fa-icon>
          </div>
          <div class="ml-4">Aktiveringslänken är antingen felaktig eller för gammal.</div>
        </div>
      </b-alert>
    </div>
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
import { CLIENT_LOGIN, CLIENT_LOGOUT } from '@/core/services/store/client.auth.module';
import { LOGIN } from '@/core/services/store/auth.module';
import { SET_COMPANY, SET_USER_ID } from '@/core/services/store/common.module';

import axios from 'axios';

export default {
  props: ['company_id','redirect'],
  name: 'confirm',
  data() {
    return {
      // Remove this dummy login info
      form: {
        company_name: '',
        user_id: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        in_personnr: '',
        password: '',
        token: '',
      },
      showWarning: false,
      showForm: false
    };
  },
  mounted() {
    var client_id = this.$route.params.client_id;
    var code = this.$route.params.token;

    console.log('user_id: ' + client_id);
    console.log('code: ' + code);

    this.getClientByToken(code);
  },
  methods: {
    getClientByToken(code) {
      axios
        .get(`/user/bytoken?invite_token=${code}`)
        .then(res => {
          this.form.email = res.data.user.email;
          this.form.firstname = res.data.user.firstname;
          this.form.lastname = res.data.user.lastname;
          this.form.company_name = res.data.user.company_name;
          this.form.in_personnr = res.data.user.in_personnr;
          this.form.token = res.data.user.invite_token;
          this.showForm = true;
          console.log(res.data.user);
          console.log(this.form);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta användardata');
        });
    },
    async onSubmit() {
      const client_id = this.$route.params.user_id;
      const code = this.form.code;
      // show loading
      const loader = this.$loading.show();

      const res = await axios.post('/client/confirmacct', { client_id, code});
      if (res.status === 200) {
        // success
        this.$store.dispatch(SET_USER_ID, res.data.id);
        this.$store.dispatch(SET_COMPANY, res.data.current_company_id);

        this.$store.dispatch(LOGIN, {
          user: {
            user_id: res.data.id,
            email: email
          },
          token: res.data.token
        });
        this.$router.push({ name: 'ml-dashboard' });
      } else if (res.status === 401) {
        // un authorized
        this.$func.showTextMessage('Unauthorized', 'Please check your credentials', 'info');
        this.showWarning = true;
      } else if (res.status === 204) {
        this.$func.showTextMessage('Tack för att du har bekräftat ditt konto', 'info');
        this.showWarning = false;
      }
      loader & loader.hide();
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type,
      })
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
