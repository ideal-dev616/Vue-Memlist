<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--end::Body-->
    <!-- Todo Header -->
    <table
      class="table table-head-custom table-vertical-center table-head-bg table-borderless"
    >
      <tbody>
        <tr style="
          background-color: #F3F6F9;
          box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.76);
          -webkit-box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.76);
          -moz-box-shadow: 0px 0px 1px 0px rgba(0,0,0,0.76);
         ">
          <td>
            <span class='mr-sm-1'><i class="fas fa-file-signature"></i></span>
            {{ todo.name }}
          </td>
          <td>
            <span class='mr-sm-1'><i class='far fa-question-circle'></i></span>
            {{category[todo.type2]}}
          </td>
          <td>
            <span class='mr-sm-1'><i class='fas fa-clock'></i></span>
            {{supportOptions[todo.severity - 1]}}
          </td>
          <td>
            <span v-if='!isCompleted(todo.status)' class='mr-sm-1'><i class='fas fa-lock-open'></i></span>
            <span v-if='isCompleted(todo.status)' class='mr-sm-1'><i class='fas fa-lock'></i></span>
            {{status[todo.status]}}
          </td>
          <td>
            <b-button v-if='!isCompleted(todo.status)' type="button" variant="primary" @click="closeTodo">Close</b-button>
          </td>
          <td>{{ todo.created_at }}</td>
        </tr>
        <b-form-group class='d-flex justify-content-start mt-3'>
          <b-button v-if='!isCompleted(todo.status)' type="button" variant="primary" @click="editComment">Svar</b-button>
        </b-form-group>
      </tbody>
    </table>

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

      <!-- <FileTable
        :files="files"
        @onUploadFileClicked="selectFile"
        @downloadFileClicked="downloadFileClicked"
      />

      <input hidden type="file" id="file" ref="file" v-on:change="handleFileUpload()" :accept="extensions"/>
 -->
      <b-form-group class='d-flex justify-content-end'>
        <b-button type="button" variant="primary" @click="sendComment">Skicka</b-button>
      </b-form-group>

    </b-form>
    <div>
      <div class='comment-task' v-for="(item, idx) in comments()" :key="idx">
        <div :class='item.user_id == userid ? "comment-default-title" : "comment-admin-title"'>
          <div class='d-sm-flex justify-content-between align-self-center p-sm-3'>
            <div class='d-flex justify-content-start align-self-center'>
              <span class='mr-sm-1'><i class='fas fa-user-circle' style="font-size:24px"></i></span>
              <div class='align-self-center'> {{ item.user_name == '' ? 'Unknown' : item.user_name }}</div>
            </div>
            <div class='align-self-center pr-sm-3'> {{ item.created_at == '' ? "Date Unknown" : item.created_at }} </div>
          </div>
        </div>
        <div class='p-sm-3'>
          <p class="my-4" :html='item.text' v-html="item.text">
          </p>
        </div>
      </div>

      <div class='comment-task'>
        <div class='d-sm-flex justify-content-between comment-admin-title align-self-center p-sm-3'>
          <div class='d-flex justify-content-start align-self-center'>
            <span class='mr-sm-1'><i class='fas fa-user-circle' style="font-size:24px"></i></span>
            <div class='align-self-center'> Admin User Name</div>
          </div>
          <div class='align-self-center pr-sm-3'> Date Unkown </div>
        </div>
        <div class='p-sm-3'>
          <p class="my-4">
            When admin response, we can use this style.
            When you check all, I will remove this tag.
          </p>
        </div>
      </div>
    </div>
    <!-- Todo Body -->

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
  -webkit-box-shadow: 0px -3px 0px 0px #e2e2e2;
  box-shadow: 0px -3px 0px 0px #e2e2e2;
}
.comment-admin-title {
  background-color: #c0d9f1;
  -webkit-box-shadow: 0px -1px 0px 0px #c0d9f1;
  box-shadow: 0px -1px 0px 0px #c0d9f1;
}
.comment-task {
  border: 1px solid #e2e2e2;
}
</style>

<script>
import axios from 'axios';
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'support-chat-box',
  props: ['todo', 'username', 'useremail', 'userid'],
  components: {
    editor: Editor,
  },
  watch: {
    todo(newValue, oldValue) {
      console.log(newValue, "Todo Data");
      if (newValue.tasks.length === 0)
        newValue.tasks.push(this.createTask(newValue.todo_id));
    },
  },
  methods: {
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
          newComment.user_name = newComment.from.substring(0, spaceIndex);
          newComment.user_email = newComment.from.substring(spaceIndex);
          taskTodo.comments.push(newComment);
          this.todo.tasks[0] = taskTodo;
          console.log(res, ": Comments");
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skicka kommentar');
        });
    },
    editComment() {
      this.editing = true;
    },
    closeTodo() {
      const todo = this.todo;
      todo.status = 'DEL';
      axios
        .put('/todo', todo)
        .then(res => {
          console.log(res, "Comment");
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa ärendet');
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
      isCompleted(status) {
        return status == 'DONE' || status == 'CN' || status == 'REJ' || status == 'DEL';
      },
      category: {
        //Teknisk
        N: 'NOTSET',
        B: 'BUG' ,
        F: 'FEATURE',
        I: 'INFO',
        S: 'SUPPORT',
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
    };
  }
};
</script>
