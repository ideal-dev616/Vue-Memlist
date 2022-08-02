<template>
  <b-card class="forget-body mb-5"> </b-card>
</template>

<style lang="scss" scoped>
.register-body {
  max-width: 500px;
  width: 100%;
}
</style>

<script>
import { mapState } from 'vuex';
import { validationMixin } from 'vuelidate';

export default {
  mixins: [validationMixin],
  name: 'register',
  data() {
    return {
      // Remove this dummy login info
      form: {
        email: '',
        password: ''
      },
      showWarning: false
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
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        email: null
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
      // this.$store.dispatch(LOGOUT);
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  }
};
</script>
