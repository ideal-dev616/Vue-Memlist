<template>
  <b-card class="forget-body mb-5">

    <b-card class="forget-body mb-5" v-if="showChangePassword">
      <h3 class="text-center mt-4 mb-4">Ändra lösenordet</h3>

      <b-alert
        :show="showWarning"
        variant="danger"
        dismissible
        @dismissed="showWarning = false"
        fade
        >{{ warningText }}</b-alert
      >

      <b-form-input type="password" v-model="password1" class="mb-8" placeholder="Lösenord" />
      <b-form-input type="password" v-model="password2" class="mb-8" placeholder="Upprepa lösenord" />

      <b-button class="btn-login" variant="primary" type="butotn" @click="savePassword">Spara lösenord</b-button>
    </b-card>


    <b-card class="forget-body mb-5" v-if="!showChangePassword">
      <h3 class="text-center mt-4 mb-4">Klart</h3>

      <div class="text-center">Ditt lösenord har blivit ändrat</div>

      <div class="text-center mt-12">
          <router-link :to='loginLink()' tag="a" class="line-link blue-link"
            >Tillbaka till inloggningen
          </router-link>
        </div>
    </b-card>
  </b-card>
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
import messageParent from '@/core/services/messageParent';
import { mapState } from 'vuex';
import axios from 'axios';
import { validationMixin } from 'vuelidate';
import { email, required } from 'vuelidate/lib/validators';

export default {
  mixins: [validationMixin],
  name: 'forget',
  data() {
    return {
      // Remove this dummy login info
      password1: '',
      password2: '',
      token: null,
      showChangePassword: true,
      form: {
        email: '',
        company_id:''
      },
      showWarning: false,
      warningText: ''
    };
  },
  validations: {
    form: {
      email: {
        required,
        email
      }
    }
  },
  methods: {
    savePassword() {
      if (this.password1 !== this.password2) {
        this.showWarning = true;
        this.warningText = 'Lösenorden skiljer sig';
        return;
      }

      if (this.password1.length < 6) {
        this.showWarning = true;
        this.warningText = 'Lösenordet måste vara längre än 6 tecken';
        return;
      }
    
      this.showWarning = false;

      this.changePassword(this.password1);
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    changePassword(newpassword) {
      axios
        .post('/client/reset', { email: this.form.email, password: newpassword, token: this.token })
        .then(res => {
          this.showChangePassword = false;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte återställa konto lösenordet.')
        });
    },
    resetForm() {
      this.form = {
        email: null
      };

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    loginLink() {
      return '/login/' + this.form.company_id;
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 1000,
        appendToast: true,
        variant: type
      });
    },
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  },
  mounted(){
    const token = this.$route.params.token;
    this.token = token;

    axios 
      .get(`/client/resettoken?token=${token}`)
      .then(res => {
        this.form = res.data.client;
      })
      .catch(err => {
        this.showWarning = true;
        this.warningText = 'Länken är gammal eller felaktig, försök med en ny länk';
        console.error(err);
        this.toastr('danger', 'Fel', 'Felaktig länk')
      });
      
    setTimeout(function(){
      messageParent(JSON.stringify({ height: document.body.scrollHeight }));
    }, 300);
  }
};
</script>
