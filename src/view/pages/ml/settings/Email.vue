<template>
  <div class="px-5 mt-8" id="page-email">
    <b-row>
      <b-col lg="2"></b-col>
      <b-col lg="8">
        <b-card title="" class="mb-2 mt-8" hide-footer>
          <div>
            <b-form class="mt-8" @submit="saveData">
              <div class="d-flex align-items-center">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="use_memlist"
                    @click="use_memlist = !use_memlist"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Använd Memlist som e-postleverantör</span>
              </div>

              <div class="d-flex align-items-center mt-8 mb-8">
                <label
                  class="checkbox checkbox-lg checkbox-outline checkbox-success"
                >
                  <input
                    type="checkbox"
                    name=""
                    v-model="use_custom"
                    @click="use_custom = !use_custom"
                  />
                  <span></span>
                </label>
                <span class="ml-3 cursor-pointer">Använd annan e-post leverantör</span>
              </div>

              <div v-if="!smtp.use_custom">
                <b-form-group
                  id="input-group-memlist_prefix"
                  label="Memlist Avsändare"
                  label-for="input-memlist_prefix"
                >
                  <b-form-input
                    id="input-memlist_prefix"
                    v-model="smtp.memlist_prefix"
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </div>
              <div v-if="smtp.use_custom">
                <b-form-group id="input-group-from" label="Plusgiro" label-for="input-from">
                  <b-form-input id="input-pg" v-model="smtp.from" type="text"></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-password" label="Lösenord" label-for="input-password">
                  <b-form-input
                    id="input-password"
                    v-model="smtp.password"
                    type="text"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-server" label="Serveradress" label-for="input-server">
                  <b-form-input id="input-server" v-model="smtp.server" type="text"></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-port" label="Port" label-for="input-port">
                  <b-form-input id="input-port" v-model="smtp.port" type="text"></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-security" label="Säkerhet" label-for="input-security">
                  <b-form-select
                    id="security"
                    v-model="smtp.security"
                    :options="securityTypes"
                  ></b-form-select>
                </b-form-group>
              </div>

              <b-button type="submit" variant="primary">Spara</b-button>
            </b-form>
          </div>
        </b-card></b-col
      >
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'smtp-settings',
  components: {},
  props: ['company', 'smtp'],
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      securityTypes: [{ value: 'ssl', text: 'SSL' }],
      use_memlist: false,
      use_custom: false,
      smtp: {
        use_custom: false,
        memlist_prefix: '',
        from: '',
        password: '',
        server: '',
        port: 0,
        security: ''
      }
    };
  },
  watch: {
    use_memlist(newVal, oldVal) {
      if (newVal === this.use_memlist) {
        return;
      }

      this.use_custom = !newVal;

      this.smtp.use_custom = this.use_custom;
    },
    use_custom(newVal, oldVal) {
      if (newVal === this.use_custom) {
        return;
      }

      this.use_memlist = !newVal;

      this.smtp.use_custom = this.use_custom;
    }
  },
  methods: {
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    saveData(e) {
      e.preventDefault();

      this.$emit('updateSettings', this.smtp);
    },

    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
