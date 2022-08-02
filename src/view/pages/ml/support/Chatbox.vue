<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--end::Body-->
    <!-- Todo Header -->
    <table
      class="table table-vertical-center table-head-bg table-borderless"
    >
      <thead>
        <tr>
          <td style='width: 300px'>
            <div class='d-flex justify-content-start align-self-center'>
              <span class='ml-1 mr-3'><i class="fas fa-file-signature header-icon"></i></span>
              <div class='align-self-center'> {{ todo.name }} </div>
            </div>
          </td>

          <td>
            <div class='d-flex justify-content-start align-self-center'>
              <span class='mr-3'><i class='far fa-question-circle header-icon'></i></span>
              <div class='align-self-center'> {{category[todo.type2]}} </div>
            </div>
          </td>

          <td>
            <div class='d-flex justify-content-start align-self-center'>
              <span class='mr-3'><i class='fas fa-clock header-icon'></i></span>
              <div class='align-self-center'> {{supportOptions[todo.severity - 1]}} </div>
            </div>
          </td>

          <td>
            <div class='d-flex justify-content-start align-self-center'>
              <span v-if='!isCompleted(todo.status)' class='mr-3'><i class='fas fa-lock-open header-icon'></i></span>
              <span v-if='isCompleted(todo.status)' class='mr-3'><i class='fas fa-lock header-icon'></i></span>
              <div class='align-self-center'> {{status[todo.status]}} </div>
            </div>
          </td>

          <td>
            <div class='d-flex justify-content-end align-self-center'>
              <a v-if='!isCompleted(todo.status)' class="btn-text-primary btn-hover-light-primary font-weight-bold mr-3 cursor-pointer" @click="onClose">Stäng</a>
              <Confirm
                title="Ticket"
                message="Är du säker på att du vill stänga detta ärende?"
                ref="close_todo"
                :type="'success'"
                confirm="Ja"
                cancel="Nej"
                @confirm="closeTodo" />
            </div>
          </td>
        </tr>
      </thead>
    </table>

    <b-form-group class='d-flex justify-content-end mt-3'>
      <b-button v-if='!isCompleted(todo.status) && !editing' class='mr-6' type="button" variant="primary" @click="editComment">Svar</b-button>
    </b-form-group>

    <b-form class='d-flex flex-column' v-if='editing'>
      <div class='d-sm-flex justify-content-between mb-sm-10'>
        <b-form-group class='flex-fill mr-sm-6' id="input-group-user-name" label="Namn" label-for="input-user-name">
          <b-form-input
            id="input-user-name"
            type="text"
            disabled
            v-model="username"
          >{{this.username}}</b-form-input>
        </b-form-group>
        <b-form-group class='flex-fill' id="input-group-user-email" label="E-postadress" label-for="input-user-email">
          <b-form-input
            id="input-user-email"
            type="text"
            v-model="useremail"
            disabled
          ></b-form-input>
        </b-form-group>
      </div>

      <b-form-group id="input-group-desc" label="Meddelande" label-for="input-desc">
          <editor
            id='input-desc'
            v-model="form.comment"
            api-key="qjaly68mahdluhx0rongdllvelixwgn18730f5z7fdzq6hq2"
            :init="{
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat'
            }"
          />
      </b-form-group>

      <b-form-group class='d-flex justify-content-end'>
        <b-button class='mr-2' type="button" variant="primary" @click="sendComment">Skicka</b-button>
        <b-button type="button" variant="primary" @click="editing=false">Avbryt</b-button>
      </b-form-group>

      <FileTable
        :files="files"
        @onUploadFileClicked="selectFile"
        @downloadFileClicked="downloadFileClicked"
        @deleteFileClicked="deleteFileClicked"
      />

      <input hidden type="file" id="file" ref="file" v-on:change="handleFileUpload()" :accept="extensions"/>

    </b-form>

    <table v-for="(item, idx) in conversations()" :key="idx" class="table table-vertical-center table-borderless">
      <thead class='text-left'>
        <tr v-if='item.type == "comment"' :class='item.user_id == userid ? "comment-default-title" : "comment-admin-title"'>
          <td style='width: 300px'>
            <div class='d-flex justify-content-start align-self-center'>
              <span class='ml-1 mr-2'><i class='fas fa-user-circle' style="font-size:16px"></i></span>
              <div class='align-self-center'> {{ item.username == '' ? user_name : item.username }}</div>
            </div>
          </td>

          <td>
            <div class='align-self-center'> {{ item.created_at == '' ? "Date Unknown" : item.created_at }} </div>
          </td>
          <td class='align-self-center'>
          </td>
          <td class='align-self-center'>
          </td>
        </tr>

        <tr v-if='item.type == "file"' :class='item.user_id == userid ? "comment-default-title" : "comment-admin-title"'>
          <td style='width: 300px'>
            <div class='d-flex justify-content-start align-self-center'>
              <span class='ml-1 mr-3'><i class="fas fa-file" style="font-size:16px"></i></span>
              <div class='align-self-center'> {{ item.username == '' ? user_name : item.username }}</div>
            </div>
          </td>

          <td class='align-self-center'> {{ item.created_at == '' ? "Date Unknown" : item.created_at }} </td>

          <td class='align-self-center'>
          </td>
          <td class='align-self-center'>
            {{item.text}}
          </td>

          <td class='d-flex justify-content-end p-0'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-6 mt-2 border border-primary"

              @click='downloadFileClicked(item.file_id)'
            >
              <span ><i class="fa fa-download" aria-hidden="true" style="font-size:16px; color: #3699FF"></i></span>
            </a>
          </td>
        </tr>
      </thead>
      <tbody v-if='item.type == "comment"'>
        <td colspan="4">
          <p class="m-2 pl-8" :html='item.text' v-html="item.text">
          </p>
        </td>
      </tbody>
    </table>
  </div>
  <!--end::Advance Table Widget 9-->
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.comment-default-title {
  background-color: #f3f6f9;
  -moz-box-shadow: 0px -1px 0px 1px #e2e2e2;
  -webkit-box-shadow: 0px -1px 0px 1px #e2e2e2;
  box-shadow: 0px -1px 0px 1px #e2e2e2;
}
.comment-admin-title {
  background-color: #c0d9f1;
  -moz-box-shadow: 0px -1px 0px 1px #c0d9f1;;
  -webkit-box-shadow: 0px -1px 0px 1px #c0d9f1;
  box-shadow: 0px -1px 0px 1px #c0d9f1;
}
.header-icon {
  font-size:16px;
}
.comment-task {
  border: 1px solid #e2e2e2;
  min-height: 60px;
}
.chatbox-table{
  text-align: center
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import moment from 'moment';
import Editor from '@tinymce/tinymce-vue';
import Confirm from '@/view/components/Confirm.vue';
import FileTable from '@/view/pages/ml/todowizard/FileTable.vue';

export default {
  name: 'support-chat-box',
  props: ['todo', 'username', 'useremail', 'userid'],
  components: {
    editor: Editor,
    Confirm,
    FileTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'currentUserId', 'currentUser'])
  },
  watch: {
    todo(newValue, oldValue) {
      console.log(newValue, "Todo Data");
      if (newValue.tasks.length === 0)
        newValue.tasks.push(this.createTask(newValue.todo_id));
    },
  },
  methods: {
    conversations() {
      const comments = this.todo.tasks[0].comments;
      const files = this.todo.tasks[0].files;
      let conversations = comments.map(function (item) {
        return {user_id: item.user_id, text: item.text, created_at: item.created_at, type: 'comment', username: item.username, file_id: 0};
      });
      conversations = conversations.concat(files.map(function (item) {
        return {user_id: item.user_id, text: item.name, created_at: item.created_at, type: 'file', username: item.username, file_id: item.file_id};
      }));

      conversations.sort(function(a, b) {
        return b.created_at.localeCompare(a.created_at);
      })
      return conversations;
    },
    comments() {
      const comments = this.todo.tasks[0].comments;
    	return comments.slice().reverse();
    },
    createTask(todo_id) {
      axios
        .post('/todo_task', {todo_id: todo_id} )
        .then(res => {
          this.toastr('success', 'OK', 'Ärendet har skapats');
          return res.data.task;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa ärendet');
        });
    },
    sendComment() {
      this.editing = false;
      const taskTodo = this.todo.tasks[0];

      // post('/todo_task/comment', { from: 'top', comment: this.comment, todo_task_id: this.todo_task_id })
      const from = 'sub';
      const comment = this.form.comment;
      const todo_task_id = taskTodo.todo_task_id;
      axios
        .post('/todo_task/comment', { from, comment , todo_task_id })
        .then(res => {
          this.form.comment = '';
          const newComment = res.data.comment;
          let spaceIndex = newComment.from.lastIndexOf(' ');
          newComment.username = newComment.from.substring(0, spaceIndex);
          newComment.user_email = newComment.from.substring(spaceIndex);
          taskTodo.comments.push(newComment);
          this.todo.tasks[0] = taskTodo;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skicka kommentar');
        });
    },
    editComment() {
      this.editing = true;
      this.files = [];
    },
    onClose () {
      this.$refs['close_todo'].show();
    },
    closeTodo() {
      let todo = this.todo;
      todo.status = 'DOC';
      axios
        .put('/todo', todo)
        .then(res => {
          this.$emit('closeTodo', todo );
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa ärendet');
        });
    },

    downloadFileClicked(file_id) {
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

    deleteFileClicked(file_id) {
      axios
        .delete(`/file?file_id=${file_id}&company_id=${this.currentCompanyId}&todo_task_id=${this.todo.tasks[0].todo_task_id}`)
        .then(res => {
          if (res.status == 200) {
            this.files = this.files.filter(item => item.file_id != file_id);
            this.todo.tasks[0].files = this.todo.tasks[0].files.filter(item => item.file_id != file_id);
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
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
      this.uploadFile();
    },
    downloadFile() {

    },

    deleteFile() {

    },

    uploadFile() {
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('file_source', 'todo');
      formData.append('file_type', '');
      formData.append('company_id', this.currentCompanyId);
      formData.append('todo_id', this.todo.todo_id);
      formData.append('todo_task_id', this.todo.tasks[0].todo_task_id);

      axios
        .post(`/fileupload?todo=true&todo_id=${this.todo.todo_id}&todo_task_id=${this.todo.tasks[0].todo_task_id}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.toastr('success', 'OK', 'Filen laddades upp');
          this.file.file_id = res.data.fileobjs[0].file_id;
          this.file.created_at = res.data.fileobjs[0].created_at;
          this.file.user_id = this.userid;
          this.file.username = this.user_name;

          this.$emit('fileUploaded', this.file );

          this.files.push(this.file);
          this.todo.tasks[0].files.push(this.file);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
        });
    },

    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      editing: false,
      form: {
        username: '',
        comment: '',
      },
      files: [],
      isCompleted(status) {
        return status == 'DONE' || status == 'CN' || status == 'REJ' || status == 'DEL' || status == 'DOC';
      },
      category: {
        //Teknisk
        N: 'NOTSET',
        B: 'BUG' ,
        F: 'FEATURE',
        I: 'INFO',
        S: 'SUPPORT',
      },
      status: {
        WAIT : 'VÄNTAR',
        DRAFT: 'UTKAST',
        NOT  : 'EJ KLAR',
        DONE : 'KLART',
        CN   : 'BEKRÄFTAD',
        DEL  : 'BORTTAGEN',
        ACC  : 'ACCEPTERAD',
        REJ  : 'AVVISAD',
        BAC  : 'BACKLOG',
        FUT  : 'FRAMTID',
        UNREAD : 'OLÄST',
        READ : 'LÄST',
        DOC  : 'STÄNGT'
      },
      supportOptions: [
        // Allvarighetsgrad
        'låg',
        'låg',
        'låg',
        'låg',
        'medel',
        'medel',
        'medel',
        'hög',
        'hög',
        'hög',
      ],
      extensions: [
        '.7z',
        '.bz2',
        '.csv',
        '.docx',
        '.doc',
        '.eml',
        '.gif',
        '.gz',
        '.jpeg',
        '.jpg',
        '.odt',
        '.ods',
        '.pdf',
        '.php',
        '.png',
        '.rar',
        '.sql',
        '.txt',
        '.xls',
        '.xlsx',
        '.wav'
      ],
    };
  }
};
</script>
