<template>
  <div class="px-5" id="page-ladoks">
    <h5 class="mb-6 ml-2">LADOK</h5>

    <LADOKsTable
      :items="ladoks"
      @createLadokClicked="createLadok"
      @selectLadokClicked="selectLadok"
      @deleteLadokClicked="deleteLadok"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-ladok-container"
      ref="edit-ladok"
      id="edit-ladok"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form class="mt-8">
          <b-form-group id="input-group-ladok_id" label="ID" label-for="input-ladok_id">
            <b-form-input
              id="input-ladok_id"
              v-model="form.ladok_id"
              type="text"
              required
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-1" label="Medlemmar i körningen" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.num_clients_total"
              type="text"
              disabled
              placeholder="..."
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Antal OK medlemmar" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="form.num_clients_ok"
              type="text"
              disabled
              placeholder="..."
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Antal EJ OK medlemmar" label-for="input-3">
            <b-form-input
              id="input-3"
              v-model="form.num_clients_nok"
              type="text"
              disabled
              placeholder="..."
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" label="Datum skapades" label-for="input-4">
            <b-form-input
              id="input-4"
              v-model="form.created_at"
              type="text"
              disabled
              placeholder="..."
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-5" label="Datum påbörjat" label-for="input-5">
            <b-form-input
              id="input-5"
              v-model="form.started_at"
              type="text"
              disabled
              placeholder="..."
              description="Datum när LADOK körningen påbörjades"
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-6" label="Datum påbörjat" label-for="input-6">
            <b-form-input
              id="input-6"
              v-model="form.ended_at"
              type="text"
              disabled
              placeholder="..."
              description="Datum när LADOK körningen avslutades"
            ></b-form-input>
          </b-form-group>

          <input hidden type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>

          <b-alert show variant="secondary">
            <p>Ladda ned CSV filen med medlemmar, lägg sedan upp filen i LADOK systemet.</p>
            <p>När du klickar på knappen för att ladda hem CSV så kommer status att övergå till "Påbörjad" och systemet förväntar sig att du kommer ladda upp en svarsfil i CSV format.</p>
          </b-alert>
          <b-button type="button" variant="success" @click="downloadFile()">Ladda ned CSV fil</b-button>
          

          <b-alert show variant="secondary" class="mt-8">
            <p>När LADOK har gett ett svar så måste du ladda upp den resulterande CSV filen här</p>
          </b-alert>

          <b-button type="button" variant="success" @click="selectFile()">Ladda upp LADOK resultat</b-button>
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
import LADOKsTable from '@/view/content/widgets/advance-table/LADOKsTable.vue';

export default {
  name: 'ladoks',
  components: {
    LADOKsTable,
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
  },
  mounted() {
    this.loadLadoks();
  },
  data() {
    return {
      form: {
        ladok_id:       '',
        lrun:           0,
        company_id:     '',
        period_id:      '',
        status:         'N',
        created_at:     '',
        started_at:     '',
        import_file_id: '',
        export_file_id: '',
        ended_at:       '',
        num_invalid:    0,
        num_valid:      0,
        num_clients_total: 0,
        num_clients_ok: 0,
        num_clients_nok: 0
      },
      creating: false,
      editing: false,
      ladoks: [],
      file: ''
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadLadoks();
      }
    }
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];

      this.uploadFile();
    },
    selectFile() {
      this.$refs.file.click();
    },
    uploadFile() {
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('ladok_id', this.form.ladok_id);
      formData.append('file_source', 'ladok');
      formData.append('file_type', 'FILE_CSV');
      formData.append('form_ladok_id', this.form.ladok_id);
      formData.append('company_id', this.currentCompanyId);

      axios
      .post( '/fileupload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      .then(res => {

        axios
        .post('/ladok/upload',
          { 
            ladok_id: this.form.ladok_id, 
            file_id: res.data.fileobjs[0].file_id 
          }
        )
        .then(ladokres => {
          this.toastr('success', 'OK', 'LADOK status uppdaterades');
          this.form.ended_at = ladokres.data.ladok.ended_at;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera LADOK körningens status');
        });
      })
      .catch( err => {
        console.error(err);
        this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
      });
    },
    downloadFile() {
      axios
        .post('/ladok/download', { ladok_id: this.form.ladok_id })
        .then( res => {
          this.form.started_at = res.data.ladok.started_at;
          this.form.export_file_id = res.data.ladok.file.file_id;
          location.href = res.data.ladok.file.public_path;
        })
        .catch( err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ladda hem fil');
        });
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      if (!this.titles) {
        return;
      }

      this.loadLadoks();
    },
    createLadok() {
      this.creating = false;
      this.editing = true;

      this.scrollToEditLadok();

      this.form.company_id = this.currentCompanyId;
      this.form.period_id = this.currentPeriodId;

      axios
        .post('/ladok', this.form)
        .then(res => {
        if (res.status === 201) {
            this.creating = false;
            this.form = res.data.ladok;
            this.toastr('success', 'OK', 'LADOK körning skapades');
            this.loadLadoks();
        }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa LADOK körning');
        });
    },
    deleteLadok(ladok_id) {
      axios
        .delete(`/ladok?ladok_id=${ladok_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.ladoks = this.ladoks.filter(item => item.ladok_id !== ladok_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'LADOK körning togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort LADOK körningar');
        });
    },
    selectLadok(ladok_id) {
      axios
        .get(`/ladok?ladok_id=${ladok_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.form = res.data.ladok;
          this.creating = false;
          this.editing = true;

          this.scrollToEditLadok();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta LADOK körningar');
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
    loadLadoks() {
      this.ladoks = [];
      axios
        .get(`/ladok/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.ladoks = res.data.ladoks;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista LADOK körningar');
        });
    },
    scrollToEditLadok() {
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
