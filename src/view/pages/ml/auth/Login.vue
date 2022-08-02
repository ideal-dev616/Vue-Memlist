<template>
  <b-card class="login-body mb-5">
    <h3 class="text-center mt-4 mb-4">Logga in</h3>
    <form class="login-form" v-on:submit.prevent="onSubmit">
      <b-alert
        :show="showNoPermissions"
        variant="danger"
        dismissible
        @dismissed="showNoPermissions = false"
        fade
        >Du lyckades logga in, men du har inte tillgång till någon sida. Kontakta administratören och be om att få tillgång till minst en sida på memlist.</b-alert
      >
      <b-alert
        :show="showWarning"
        variant="danger"
        dismissible
        @dismissed="showWarning = false"
        fade
        >Fel användarnamn eller lösenord.</b-alert
      >
      <b-form-input type="email" v-model="form.email" class="mb-8" placeholder="E-post" />
      <b-form-input type="password" v-model="form.password" class="mb-10" placeholder="Lösenord" />
      <div class="d-flex align-items-center justify-content-between mb-8">
        <router-link to="/ml-forget" tag="a" class="line-link blue-link"
          >Glömt lösenord?</router-link
        >
        <b-button class="btn-login" variant="primary" type="submit">Logga In</b-button>
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
}
</style>

<script>
import { mapState } from 'vuex';
import { LOGIN } from '@/core/services/store/auth.module';
import { SET_COMPANY, SET_USER_ID } from '@/core/services/store/common.module';
import { SET_ACCESS, SET_TALONGADMIN, LOGOUT } from '@/core/services/store/auth.module';
import axios from 'axios';

import { validationMixin } from 'vuelidate';
import { email, minLength, required } from 'vuelidate/lib/validators';
import store from '@/core/services/store';

export default {
  mixins: [validationMixin],
  name: 'login',
  data() {
    return {
      // Remove this dummy login info
      form: {
        email: '',
        password: ''
      },
      showWarning: false,
      showNoPermissions: false
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

      try {
        const res = await axios.post('/user/login', { email, password });
        if (res.status === 200) {
          // success
          console.log('got user_id:' + res.data.id);

          const is_superadmin = res.data.superadmin;

          await this.$store.dispatch(SET_ACCESS, res.data.acl.acl);
          await this.$store.dispatch(SET_TALONGADMIN, is_superadmin ? 'Y' : 'N');
          this.$store.dispatch(SET_USER_ID, res.data.id);
          this.$store.dispatch(SET_COMPANY, res.data.current_company_id);
          
          this.$store.dispatch(LOGIN, {
            user: {
              user_id: res.data.id,
              email: email
            },
            token: res.data.token
          });
          //await this.getAccess(res.data.id);

          loader.hide();

          // find page with access
          const acl = store.getters['currentAccess'];

          if (is_superadmin) {
            this.$router.push({ name: 'ml-dashboard' });

            return;
          }

          // if we have access to dashboard, then redirect to it
          if ('ml-dashboard' in acl) {

            if (acl['ml-dashboard'].p === 'rw') {
              this.$router.push({ name: 'ml-dashboard' });
              return;
            }
          }

          // try to find another page with access
          for (const k in acl) {
            if (acl[k].p === 'rw') {
              this.$router.push({ name: k });
              return;
            }
          }

          this.showNoPermissions = true;

        } else if (res.status === 401) {
          //console.log('got 401');
          // un authorized
          // this.$func.showTextMessage('Unauthorized', 'Please check your credentials', 'info');
          this.showWarning = true;
        }
      }
      catch (err) {
        this.showWarning = true;
      }
      
      loader.hide();
    },
    async getAccess(user_id){
      try {
        const user_data = await axios.get(`/user?user_id=${user_id}`);
        if (user_data.data.user === null || user_data.data.user === undefined) {
          await this.$store.dispatch(LOGOUT);
          this.$router.push({ name: 'ml-login' });
          return;
        } else if (user_data.status === 200) {
          await this.$store.dispatch(SET_TALONGADMIN, user_data.data.user.talongadmin);
          await this.$store.dispatch(SET_ACCESS, user_data.data.acl.acl);
        }
      } catch (err){
        console.error(err.response.data.error);
      }
      this.$router.push({ name: 'ml-dashboard' });
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
