<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <b-alert class="mt-8" v-if="finalizeWait" show variant="secondary"
        ><strong>Vänligen vänta</strong><br />Medlemmarna kopieras nu in i databasen, detta kan ta
        ett antal minuter beroende på hur många medlemmar som ska kopieras</b-alert
      >

      <div v-if="finalizeWait" class="d-flex justify-content-center mt-10 mb-10">
        <b-spinner
          class="mx-auto text-center align-center"
          type="grow"
          label="Loading..."
        ></b-spinner>
      </div>

      <div v-if="!finalizeWait && !hasError">
        <b-alert show variant="success"><strong>Klart!</strong><br />Importen är avklarad</b-alert>
      </div>

      <div v-if="!finalizeWait && hasError">
        <b-alert show variant="danger"><strong>Fel!</strong><br />Gick inte att importera</b-alert>
      </div>
      <!--end::Table-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Advance Table Widget 9-->
</template>
<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'import-final-page',
  props: ['import_id', 'import_option', 'doFinalize'],
  components: {},
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  data() {
    return {
      finalizeWait: true,
      hasError: false
    };
  },
  mounted() {},
  watch: {
    doFinalize(newValue, oldValue) {
      if (newValue) {
        this.finalizeImport();
      }
    }
  },
  methods: {
    randomstr(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;

      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result;
    },
    exportErrors(import_id) {
      axios
        .post('/import/exporterrors', { import_id: import_id })
        .then(res => {
          location.href = res.data.file_url;
        })
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Kunde inte generera exportfil');
        });
    },
    finalizeImport() {
      axios
        .post('/import/finalize', { import_id: this.import_id, option: this.import_option })
        .then(res => {
          // hide the spinner
          // we might have a todo item waiting for import of clients
          // we should update that todo item in the backend

          this.finalizeWait = false;

          if (res.status === 201) {
            this.toastr('success', 'OK', 'Importen är avklarad');

            this.hasError = false;

            this.$emit('importFinalized');
          } else {
            this.hasError = true;
            this.$emit('importFailed');
          }
        })
        .catch(err => {
          this.hasError = true;
        });
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
