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

      <b-form-group id="input-group-firstname" label="Förnamn" label-for="input-firstname">
        <b-form-input id="input-firstname" v-model="form.firstname" type="text"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-lastname" label="Efternamn" label-for="input-lastname">
        <b-form-input id="input-lastname" v-model="form.lastname" type="text"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-email" label="E-post" label-for="input-email">
        <b-form-input id="input-email" v-model="form.email" type="text"></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-phone" label="Telefon" label-for="input-phone">
        <b-form-input id="input-phone" v-model="form.phone" type="text"></b-form-input>
      </b-form-group>

      <!--<b-form-group id="input-group-password" label="Lösenord" label-for="input-password">
        <b-form-input id="input-password" v-model="form.password" type="text"></b-form-input>
      </b-form-group>-->

      <b-form-input type="email" v-model="form.email" class="mb-8" placeholder="E-post" />
      <b-form-input type="password" v-model="form.password" class="mb-10" placeholder="Lösenord" />
      <div class="d-flex align-items-center justify-content-between mb-8">
        <router-link to="/forget" tag="a" class="line-link blue-link"
          >Glömt lösenord?</router-link
        >
        <b-button class="btn-login" variant="primary" @click="onSubmit">Aktivera konto</b-button>
      </div>
    </form>
    <div class="warning-message" v-else>
      <b-alert variant="danger" fade show>
        <div class="d-flex align-items-center justify-content-center p-4">
          <div>
            <fa-icon :icon="['far', 'question-circle']" size="3x"></fa-icon>
          </div>
          <div class="ml-4">
            Aktiveringslänken är antingen felaktig eller för gammal.
          </div>
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
import messageParent from '@/core/services/messageParent';
import { mapState } from 'vuex';
import { CLIENT_LOGIN, CLIENT_LOGOUT } from '@/core/services/store/client.auth.module';

import axios from 'axios';

export default {
  props: ['company_id','redirect'],
  name: 'activate',
  data() {
    return {
      // Remove this dummy login info
      form: {
        company_id: '',
        client_id: '',
        public_id: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
      },
      showWarning: false,
      showForm: false
    };
  },
  mounted() {
    var user_id = this.$route.params.user_id;
    var token = this.$route.params.token;

    console.log('user_id: ' + user_id);
    console.log('token: ' + token);

    this.getClientByToken(token);

    setTimeout(function(){
      messageParent(JSON.stringify({ height: document.body.scrollHeight }));
    }, 300);
  },
  methods: {
    getClientByToken(token) {
      axios
        .get(`/client/resettoken?token=${token}`)
        .then(res => {
          this.form = res.data.client;
          this.showForm = true;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta medlemsdata');
        });
    },
    async onSubmit() {

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
