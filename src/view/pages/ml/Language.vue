<template>
  <div class="px-5" id="page-lang_records">
    <h5 class="mb-6 ml-2">Språk och översättningar</h5>

    <LanguageTable
      :items="lang_records"
      @createLangRecordClicked="createLangRecordClicked"
      @selectLangRecordClicked="selectLangRecord"
      @deleteLangRecordClicked="deleteLangRecord"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-lang_record-container"
      ref="edit-lang_record"
      id="edit-lang_record"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form class="mt-8" @submit.prevent="saveLangRecord">
          <b-form-group id="input-group-lang_record_id" label="ID" label-for="input-lang_record_id">
            <b-form-input
              id="input-lang_record_id"
              v-model="form.lang_record_id"
              type="text"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-sv_text" label="Svenska" label-for="input-sv_text">
            <b-form-input
              id="input-sv_text"
              v-model="form.lang_text[0].text"
              type="text"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-en_text" label="Engelska" label-for="input-en_text">
            <b-form-input
              id="input-en_text"
              v-model="form.lang_text[1].text"
              type="text"
            ></b-form-input>
          </b-form-group>

          <b-button variant="primary" type="submit"
          >Spara</b-button>
        </b-form>
      </div>
    </b-card>
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
import LanguageTable from '@/view/pages/ml/language/LanguageTable.vue';

export default {
  name: 'lang_records',
  components: {
    LanguageTable,
  },
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  mounted() {
    this.loadLangRecords();
  },
  data() {
    return {
      form: {
        lang_record_id: 'NEW_RECORD',
        lang_text: [
            { lang: 'sv', text: '' },
            { lang: 'en', text: '' },
        ]
      },
      creating: false,
      editing: false,
      lang_records: [],
      lang_record: ''
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadLangRecords();
      }
    }
  },
  methods: {
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.loadLangRecords();
    },
    createLangRecordClicked() {
      this.creating = true;
      this.editing = true;

      this.scrollToEditLangRecord();

    },
    createLangRecord() {
      if (this.form.lang_record_id === 'NEW_RECORD' || this.form.lang_record_id.length < 8) {
        this.toastr('danger', 'Fel', 'Felaktigt ID');
        return;
      }

      axios
        .post('/lang', this.form)
        .then(res => {
          if (res.status === 201) {
              this.creating = false;
              this.form = res.data.lang_record;
              this.toastr('success', 'OK', 'Översättning skapades');
              this.loadLangRecords();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa översättning');
        });
    },
    deleteLangRecord(lang_record_id) {
      axios
        .delete(`/lang?lang_record_id=${lang_record_id}`)
        .then(res => {
          this.lang_records = this.lang_records.filter(item => item.lang_record_id !== lang_record_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Översättningen togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort översättningen');
        });
    },
    selectLangRecord(lang_record_id) {
      axios
        .get(`/lang?lang_record_id=${encodeURIComponent(lang_record_id)}`)
        .then(res => {
          this.form = res.data.lang_record;
          this.creating = false;
          this.editing = true;

          if (this.form.lang_text.length < 2) {
              this.form.lang_text = [
                  { lang: 'sv', text: '' },
                  { lang: 'en', text: '' } ];
          }

          this.scrollToEditLangRecord();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta översättningen');
        });
    },
    async saveLangRecord(){

      if (this.creating) {
        this.createLangRecord();
        return;
      }

      axios
        .put(`/lang`, this.form)
        .then(res => {
          if (res.status === 204) {
            this.creating = false;
            this.form = res.data.lang_record;
            this.toastr('success', 'OK', 'Översättning uppdaterad');
            this.loadLangRecords();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera översättning');
        });
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    loadLangRecords() {
      this.lang_records = [];
      axios
        .get(`/lang/list`)
        .then(res => {
          if (res.status === 200) {
            this.lang_records = res.data.lang_records;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista översättningar');
        });
    },
    scrollToEditLangRecord() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('scroll-to-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
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
