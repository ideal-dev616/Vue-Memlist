<template>
<div>
  <div class="card card-custom card-stretch">
      <!--begin::Body-->
      <div class="card-body pt-3 pb-3">

        <h5 class="mb-4 mt-4">{{ task.name }}</h5>

        <p class="mb-8">{{ task.descr}}</p>

        <FileTable
          v-if="task.type === 'FILE_WIZARD'"
          :files="files"
          :taskStatus="task.status"
          @onUploadFileClicked="selectFile"
          @downloadFileClicked="downloadFileClicked"
          @deleteFileClicked="deleteFileClicked"
        />

        <input hidden type="file" id="file" ref="file" v-on:change="handleFileUpload()" :accept="getExtensions()"/>

        <ChatBox
          :comments="comments"
        />

        <b-row align-h="between" class="px-8">
          <b-col>
            <b-form-group id="input-group-text" label="Skriv meddelande" label-for="input-text">
              <b-textarea id="input-text" v-model="comment" class="mb-2"> </b-textarea>
            </b-form-group>
          </b-col>
          <b-col md="auto">
            <b-button :disabled="task.status !=='COMPLETE' && task.status !== 'NOT'" type="button" style="margin-top: 26px; height: 55px; width: 120px;" variant="primary" @click="sendCommentClicked">Skicka</b-button>
          </b-col>
        </b-row>
        <b-row class="px-8">
          <b-col>
            <p>Bekräfta nuvarande status av din inlämning i detta steg.</p>
            <label class="radio radio-outline radio-success mb-3">
              <input type="radio" v-model="status" value="DONE">
              <span class="mr-2"></span>
              Jag är klar med inlämning för denna åtgärd
            </label>
            <label class="radio radio-outline radio-success mr-5">
              <input type="radio" v-model="status" value="NOT">
              <span class="mr-2"></span>
              Jag är inte klar med inlämningen för denna åtgärd
            </label>
          </b-col>
        </b-row>
      </div>
      <!--end::Body-->
    </div>
</div>
</template>
<style lang="scss">
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import ChatBox from '@/view/components/chatBox.vue';
import FileTable from '@/view/pages/ml/todowizard/FileTable.vue';
import moment from 'moment';

export default {
  name: 'todo-wizard-page',
  props: ['title','page','todo','task'],
  components: {
    ChatBox, FileTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  data() {
    return {
      comment: '',
      todo_task_id: '',
      comments: [],
      files: [],
      status:'',
    };
  },
  mounted() {
    console.log('TODO',this.todo);
    console.log('TASK',this.task);
    this.todo_task_id = this.task.todo_task_id;
    this.files = this.task.files;
    this.status = this.task.status;
    this.loadComments();
  },
  watch: {
    status(newVal, oldVal){
      if(newVal !== ''){
        this.selectedTaskStatus(newVal)
      }
    },
  },
  methods: {
    downloadFileClicked(file_id) {
      axios
        .get(`/file/file_id=${file_id}`)
        .then(res => {
          location.href = res.data.public_path;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta filen');
        });
    },
    deleteFileClicked(file_id){
      axios.delete(`/file?file_id=${file_id}&todo_task_id=${this.task.todo_task_id}`).then(res => {
        this.files = this.files.filter(file => file.file_id !== file_id);
      }).catch(err => {
        console.error(err);
        this.toastr('danger', 'Server Fel', 'Kunde inte radera filen');
      })
    },
    loadComments() {

      axios
        .get(`/todo_task/comments?todo_task_id=${this.todo_task_id}`)
        .then(res => {
          this.comments = res.data.comments;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta kommentarer');
        });
    },
    sendCommentClicked() {
      axios
        .post('/todo_task/comment', { from: 'sub', comment: this.comment, todo_task_id: this.todo_task_id })
        .then(res => {
          this.comment = '';
          this.comments.push(res.data.comment);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skicka kommentar');
        });
    },
    getExtensions() {
      let tempExtension = '';
      if (this.task.hasOwnProperty('valid_filtypes')) {
        this.task.valid_filtypes.forEach(element => {
          tempExtension += ', .' + element;
        });
      }
      return tempExtension;
    },
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
      formData.append('file_source', 'todo');
      formData.append('file_type', this.task.category);
      formData.append('company_id', this.currentCompanyId);
      formData.append('todo_id', this.todo.todo_id);
      formData.append('todo_task_id', this.task.todo_task_id);

      axios
        .post(`/fileupload?todo=true&todo_id=${this.todo.todo_id}&todo_task_id=${this.task.todo_task_id}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.toastr('success', 'OK', 'Filen laddades upp');
          this.file_id = res.data.fileobjs[0].file_id;
          this.file.created_at = moment().format('YYYY-MM-DD HH:mm:ss');

          this.$emit('fileUploaded', this.file );

          this.files.push(this.file);
          //this.wizard.goNext();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
        });
    },
    selectedTaskStatus(status){
      this.$emit('disableNext', true);
      axios.put('/todo_task', {status: status, todo_task_id: this.todo_task_id }).then(res => {
        this.$emit('selectedStatus', res.data.task.status);
        this.$emit('disableNext', false);
      }).catch(err => console.log(err));
    },
    resetForm(){
      this.comment = ''
      this.todo_task_id= '';
      this.comments= [];
      this.files= [];
      this.status='';
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
