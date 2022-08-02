<template>
  <div class="px-5" id="page-files">
    <h5 class="mb-6 ml-2">Filer</h5>

    <FilesTable
      :items="files"
      @createFileClicked="createFile"
      @selectFileClicked="selectFile"
      @deleteFileClicked="deleteFile"
      @downloadFileClicked="downloadFile"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-file-container"
      ref="edit-file"
      id="edit-file"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form class="mt-8">
          <b-form-group id="input-group-file_id" label="ID" label-for="input-file_id">
            <b-form-input
              id="input-file_id"
              v-model="form.file_id"
              type="text"
              required
              disabled
            ></b-form-input>
          </b-form-group>
          <b-form-group id="input-group-file_name" label="NAMN" label-for="input-file_id">
            <b-form-input
              id="input-file_name"
              v-model="form.name"
              type="text"
              required
            ></b-form-input>
          </b-form-group>
          <b-form-group class='d-flex justify-content-end'>
            <b-button class='mr-2' type="button" variant="primary" @click="saveFile">Spara</b-button>
            <b-button type="button" variant="primary" @click="editing=false">Avbryt</b-button>
          </b-form-group>
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
import FilesTable from '@/view/content/widgets/advance-table/FilesTable.vue';

export default {
  name: 'files',
  components: {
    FilesTable,
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
  },
  mounted() {
    this.loadFiles();
  },
  data() {
    return {
      form: {
        file_id:        '',
        name: 	        '',
        ext: 	        '',
        filepath: 	    '',
        import_opt: 	{},
        export_opt: 	{},
        public_path: 	'',
        user_id: 	    '',
        company_id:     '',
        created_at: 	'',
        size_kb:        '',
        period_id:      '',
        type:           '',
        status:         '',
        comments:       [],
      },
      creating: false,
      editing: false,
      files: [],
      file: ''
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadFiles();
      }
    },
    currentPeriodId(newValue, oldValue) {
      if (this.currentCompanyId)
        this.loadFiles();
    }
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];

      this.uploadFile();
    },
    saveFile() {
      let that = this;
      axios
        .put(`/file`, this.form
        )
        .then(res => {
          if (res.status == 200) {
            let index = that.files.findIndex(item => item.file_id == res.data.file.file_id);
            if (index > -1) {
              that.files.splice(index, 1, res.data.file);
            }
          } else {
            this.toastr('danger', 'Server Fel', 'Kunde inte hämta filen');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta filen');
        });
    },
    selectFile() {
      this.$refs.file.click();
    },
    uploadFile() {
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('file_id', this.form.file_id);
      formData.append('file_source', 'file');
      formData.append('file_type', 'FILE_CSV');
      formData.append('form_file_id', this.form.file_id);
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
        .post('/file/upload',
          {
            file_id: this.form.file_id,
            file_id: res.data.fileobjs[0].file_id
          }
        )
        .then(fileres => {
          this.toastr('success', 'OK', 'LADOK status uppdaterades');
          this.form.ended_at = fileres.data.file.ended_at;
        })
        .catch(err => {
          console.error(err);
          console.log('error /file/upload: ' + err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera Filenens status');
        });
      })
      .catch( err => {
        console.error(err);
        this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
      });
    },
    getFilename(path) {
      return path.replace(/^.*[\\\/]/, '');
    },
    downloadFile() {
      axios
        .post('/file/download', { file_id: this.form.file_id })
        .then( res => {
          this.form.started_at = res.data.file.started_at;
          this.form.export_file_id = res.data.file.file.file_id;

          var filename = this.getFilename(res.data.file.file.public_path);

          this.downloadWithAxios(res.data.file.file.public_path, filename);
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

      this.loadFiles();
    },
    createFile() {
      this.creating = false;
      this.editing = true;

      this.scrollToEditFile();

      this.form.company_id = this.currentCompanyId;
      this.form.period_id = this.currentPeriodId;

      axios
        .post('/file', this.form)
        .then(res => {
        if (res.status === 201) {
            this.creating = false;
            this.form = res.data.file;
            this.toastr('success', 'OK', 'Filen skapades');
            this.loadFiles();
        }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa filen');
        });
    },
    downloadFile(file_id) {
      axios
        .get(`/file?file_id=${file_id}`)
        .then(res => {
          window.open(res.data.file.public_path, "_blank");
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta filen');
        });
    },
    deleteFile(file_id) {
      axios
        .delete(`/file?file_id=${file_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.files = this.files.filter(item => item.file_id !== file_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Filen togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort filen');
        });
    },
    selectFile(file_id) {
      axios
        .get(`/file?file_id=${file_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.form = res.data.file;
          this.creating = false;
          this.editing = true;

          this.scrollToEditFile();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta filen');
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
    loadFiles() {
      this.files = [];
      axios
        .get(`/file/list?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`)
        .then(res => {
          if (res.status === 200) {
            this.files = res.data.files;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista filer');
        });
    },
    scrollToEditFile() {
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
    },
    forceFileDownload(response, title) {
      console.log(title)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', title)
      document.body.appendChild(link)
      link.click()
    },
    downloadWithAxios(url, title) {
      axios({
        method: 'get',
        url,
        responseType: 'arraybuffer',
      })
        .then((response) => {
          this.forceFileDownload(response, title)
        })
        .catch(() => console.log('error occured'))
    },
  }
};
</script>
