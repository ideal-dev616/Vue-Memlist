<template>
  <b-card class="login-body mb-5">
    <h3 class="text-center mt-4 mb-4" v-if='!showWarning'>Logga in</h3>
    <h3 class="text-center mt-4 mb-4" v-if='showWarning'>Obehörig, kontrollera dina referenser</h3>
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
  data() {
    return {
      // Remove this dummy login info
      token:"",
      showWarning: false,
    };
  },
  mounted() {
    this.token = this.$route.params.token;
    this.tokenLogin();
    // console.log(this.token, " : token");
    // console.log(this.$route.params.pathMatch);
  },
  methods: {
    async tokenLogin() {
      const token = this.token;
      const res = await axios.post(`/user/logintoken`, { token });
            // show loading
      // const loader = this.$loading.show();

      if (res.status === 200) {
        console.log('got user_id:' ,res.data);

        this.$store.dispatch(SET_USER_ID, res.data.id);
        this.$store.dispatch(SET_COMPANY, res.data.current_company_id);

        this.$store.dispatch(LOGIN, {
          user: {
            user_id: res.data.id,
            email: res.data.email
          },
          token: res.data.jwt_token
        });
        if (this.$route.params.pathMatch != '' && this.$route.params.pathMatch != undefined) {
          this.$router.push({ name: this.$route.params.pathMatch });
        } else {
          this.$router.push({ name: 'ml-dashboard' });
        }
      } else {
        // un authorized
        // this.$func.showTextMessage('Unauthorized', 'Please check your credentials', 'info');
        this.showWarning = true;
      }
      // loader & loader.hide();
    },
  }
};
</script>
