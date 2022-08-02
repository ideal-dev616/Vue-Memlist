<template>
  <b-card class="mx-auto mt-12 register-body mb-5">
    <b-alert v-if="show === 'ok'" show variant="success">Tack för ditt svar!</b-alert>
    <b-alert v-if="show === 'reject'" show variant="success">Tack! Du kommer inom kort att bli borttagen som medlem</b-alert>
    <div v-if="show === 'answer'">
      <h3 class="text-center mt-4 mb-4">Bekräfta ditt medlemskap</h3>

      <b-img v-if="company !== undefined && company !== null && company.logo !== undefined && company.logo.indexOf('placeholder') === -1" :src="company.logo" fluid alt="Responsive image"></b-img>

      <b-alert v-if="company !== undefined && company !== null" class="ml-6 mr-6 mt-8 mb-4" show variant="light">Vänligen bekräfta att du fortfarande är medlem i <strong>{{ company.name }}</strong> genom att fylla i nedanstående information</b-alert>

      <form class="register-form">
        <b-form-input type="text" v-model="form.firstname" class="mb-8" placeholder="Förnamn" />
        <b-form-input type="text" v-model="form.lastname" class="mb-8" placeholder="Efternamn" />
        <b-form-input type="text" v-model="form.personnr" class="mb-8" placeholder="Personnummer" />
        <b-form-input type="text" v-model="form.phone" class="mb-8" placeholder="Telefon" />
        <b-form-input type="email" v-model="form.email" class="mb-8" placeholder="E-post" />

        <div class="d-flex align-items-center justify-content-between mb-8">
          <b-button class="btn-register" variant="primary" @click="onSubmit"
            >Bekräfta medlemskap</b-button
          >
           <b-button class="btn-register" variant="danger" @click="onReject"
            >Jag är ej medlem</b-button
          >
        </div>

      </form>
    </div>
  </b-card>
</template>

<style lang="scss" scoped>
.register-body {
  max-width: 500px;
  width: 100%;
  .register-form {
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

import axios from 'axios';

export default {
  name: 'register-member-no-account',
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
      showForm: false,
      spurl: null,
      company: null,
      show: 'answer'
    };
  },
  mounted() {
    this.spurl = this.$route.params.id;

    this.loadClient();
  },
  methods: {
    reject() {
      axios
        .put('/client_stickprov/answer', {
          answer: 0,
          client_id: this.form.client_id,
          stickprov_id: this.form.stickprov.id
        })
        .then(res => {
          this.toastr('success', 'OK', 'Svaret registrerat');
          this.show = 'reject';
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skicka svar');
        });

    },
    confirm() {
      axios
        .put('/client_stickprov/answer', {
          answer: 1,
          client_id: this.form.client_id,
          stickprov_id: this.form.stickprov.id
        })
        .then(res => {
          this.toastr('success', 'OK', 'Ditt medlemskap är nu bekräftat');
          this.show = 'ok';
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skicka svar');
        });
    },
    loadClient() {
      axios
        .get(`/client/spurl?url=${this.spurl}`)
        .then(res => {
          this.form = res.data.client;
          this.company = res.data.company;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hitta medlemsdata');
        });
    },
    onSubmit() {
      this.confirm();
    },
    onReject() {
      this.reject();
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
};
</script>
