<template>
  <div class="px-5" id="page-support">
    <h5 class="mb-6 ml-2">Support/Förslagslåda</h5>

    <TodoTable
      :items="todos"
      @showHistoryToggled="showHistoryToggled"
      @createTodoClicked="createTodoClicked"
      @selectTodoClicked="selectTodo"
      @deleteTodoClicked="deleteTodo"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>

    <!-- Creating Todo  -->
    <b-card
      title=""
      class="mb-2 edit-todo-container"
      ref="edit-todo"
      id="edit-todo"
      hide-footer
      v-if="creating"
    >
      <b-form class='d-flex flex-column'>
        <div class='d-sm-flex justify-content-between mb-sm-10'>
          <b-form-group class='flex-fill mr-sm-6' id="input-group-user-name" label="Namn" label-for="input-user-name">
            <b-form-input
              id="input-user-name"
              type="text"
              disabled
              v-model="userid"
            >{{this.username}}</b-form-input>
          </b-form-group>
          <!-- <b-form-group class='flex-fill' id="input-group-user-email" label="E-postadress" label-for="input-user-email">
            <b-form-input
              id="input-user-email"
              type="text"
              v-model="useremail"
              disabled
            ></b-form-input>
          </b-form-group> -->
        </div>
        <div class='d-sm-flex justify-content mb-sm-10'>
          <div class='d-flex flex-column flex-fill mb-2 mr-sm-6 mb-sm-0'>
            <label class="block" for="support-type">Kategori</label>
            <b-form-select id="support-type" placeholder="Kategory" v-model="form.type2" :options="category">
            </b-form-select>
          </div>
          <div class='d-flex flex-column flex-fill mb-2 mb-sm-0'>
            <label for="support-type">Allvarighetsgrad</label>
            <b-form-select id="level-severity" placeholder="Level of severity"  v-model="form.severity" :options="supportOptions">
            </b-form-select>
          </div>
        </div>

        <b-form-group id="input-group-topic" label="Ämne" label-for="input-topic">
          <b-form-input id="input-topic" v-model="form.name" type="text" placeholder="InmatningsÄmne"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-desc" label="Meddelande" label-for="input-desc">
            <editor
              id='input-desc'
              v-model="form.descr"
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

        <FileTable
          :files="files"
          @onUploadFileClicked="selectFile"
          @downloadFileClicked="downloadFileClicked"
        />

        <input hidden type="file" id="file" ref="file" v-on:change="handleFileUpload()" :accept="extensions"/>

        <b-form-group class='d-flex justify-content-end'>
          <b-button type="button" variant="primary" @click="createComment" :disabled='!form.name || !form.descr'
            :title="(!form.name || !form.descr) ? 'Input Ämne and Meddelande' : ''">Skicka</b-button>
        </b-form-group>
      </b-form>
    </b-card>
    <!-- View Todo  -->
    <b-card v-if='editing'>
      <Chatbox
        :todo='todoSelected'
        :userid='userid'
        :username='username'
        :useremail='useremail'
        @closeTodo='closeTodo'
        id='support-task-table'
      />

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
import moment from 'moment';
import { mapGetters } from 'vuex';
import Editor from '@tinymce/tinymce-vue';
import TodoTable from '@/view/pages/ml/support/TodoTable.vue';
import Chatbox from '@/view/pages/ml/support/Chatbox.vue';
import FileTable from '@/view/pages/ml/todowizard/FileTable.vue';
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'support',
  components: {
    editor: Editor,
    TodoTable,
    Chatbox,
    FileTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'currentUserId', 'currentUser', 'companies'])
  },
  mounted() {
    this.loadData();
  },
  validations: {
    form: {
      name: {
        required,
      },
      descr: {
        required,
      }
    }
  },
  data() {
    return {
      showHistory: false,
      userid:'',
      username: '',
      useremail: '',
      category: [
        //Teknisk
        // { value: 'N', text: 'NOTSET' },
        { value: 'I', text: 'Teknisk support' },
        { value: 'F', text: 'Ekonomi support' },
        { value: 'B', text: 'Försäljning' },
        { value: 'S', text: 'Förslag' },
      ],
      supportOptions: [
        // Allvarighetsgrad
        { value: '4', text: 'låg' },
        { value: '7', text: 'medel' },
        { value: '10', text: 'hög' },
      ],
      files: [],
      form: {
        todo_id: '',
        company_id: '',
        creator_company_id: '',
        created_at: '',
        updated_at: '',
        severity: 1,
        status: '',
        descr: '',
        name: '',
        email_at: '',
        creator_user_id: '',
        assigned_users: [],
        comments: [],
        file_type: '',
        from_datetime: '',
        to_datetime: '',
        linked_todo_id: '',
        company_ids: [],
        target: '',
        rank: 0,
        upvotes: 0,
        downvotes: 0,
        type2: '',
        public_id: '',
        tasks: []
      },
      todoSelected: {

      },
      TODO_TYPE: {
        PARENT: 'PA',
        FILE_UPLOAD: 'FU',
        CONFIRM: 'CF',
        COMPANY: 'CO',
        SYSTEM: 'SY'
      },
      TODO_TYPE2: {
        NOTSET: 'N',
        BUG: 'B',
        FEATURE: 'F',
        INFO: 'I',
        SUPPORT: 'S'
      },
      TODO_STATUS: {
        WAITING:    'WAIT',
        DRAFT:      'DRAFT',
        NOT_DONE:   'NOT',
        DONE:       'DONE',
        CONFIRMED:  'CN',
        DELETED:    'DEL',
        ACCEPTED:   'ACC',
        REJECTED:   'REJ',
        BACKLOG:    'BAC',
        FUTURE:     'FUT'
      },
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
      creating: false,
      editing: false,
      todos: []
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadTodos();
      }
    },
  },
  methods: {
    showHistoryToggled(show) {
      this.showHistory = show;
    },
    async loadUser() {
      this.userid = this.currentUser.user_id;
      this.useremail = this.currentUser.email;
      axios
        .get(`/user?user_id=${this.currentUserId}`)
        .then(res => {
          this.username = res.data.user.firstname + ' ' + res.data.user.lastname;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta användare');
        })
    },

    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      this.loadUser();
      this.loadTodos();
    },

    createTodoClicked() {
      this.resetForm()
      this.creating = true;
      this.editing = false;

      this.form.severity = 4;
      this.form.type2 = 'I';
      this.form.tasks = [];
      this.form.name = '';
      this.files = [];
      this.form.tasks.push(
        {
          todo_task_id: '',
          status: '',
          type: 'SY',
          file_id: '',
          name: '',
          descr: '',
          comments: [],
          files: [],
          updated_at: '',
          category: '',
          valid_filetypes: '',
        }
      );
      this.createTodo();
      this.scrollToEditTodo();
    },
    createTodo() {
      this.form.company_id = this.currentCompanyId;
      this.form.period_id = this.currentPeriodId;
      this.form.creator_company_id = this.currentCompanyId;

      this.form.type = this.TODO_TYPE.SYSTEM;
      this.form.status = this.TODO_STATUS.WAITING;

      this.form.tasks[0].descr = this.form.descr;
      // this.form.name = 'Please input title';
      // this.form.descr = 'Please input comment';

      axios
        .post('/todo', this.form)
        .then(res => {
          let todo = res.data.todo;
          todo.last_updated_at = todo.updated_at;
          this.addTodo(todo, true);
          this.form = res.data.todo;
          this.createTask(res.data.todo.todo_id);
          this.toastr('success', 'OK', 'Ärendet har skapats');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa ärendet');
        });
    },

    createTask(todo_id) {
      axios
        .post('/todo_task', {todo_id: todo_id, type: 'SY'} )
        .then(res => {
          this.form['tasks'] = [res.data.task];
          this.toastr('success', 'OK', 'Ärendet har skapats');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa ärendet');
        });
    },

    createComment() {
      const from = 'sub';
      const comment = this.form.descr;
      const todo_task_id = this.form.tasks[0].todo_task_id;
      axios
        .post('/todo_task/comment', { from, comment , todo_task_id })
        .then(res => {
          this.saveTodo();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skicka kommentar');
        });
    },

    closeTodo(todo) {
      let index = this.todos.findIndex(item => item.todo_id == todo.todo_id);
      if (index != undefined) {
        todo = this.todos[index];
        todo.status = 'DOC';
        this.todos.splice(index, 1, todo);
      }
    },

    deleteTodo(todo_id) {
      axios
        .delete(`/todo?todo_id=${todo_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.todos = this.todos.filter(item => item.todo_id !== todo_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Ärendet togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort ärendet');
        });
    },
    selectTodo(todo_id) {
      axios
        .get(`/todo?todo_id=${todo_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.todoSelected = res.data.todo;
          this.editing = true;
          this.scrollToEditTodo(true);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta ärendet');
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
    async loadTodos() {
      // load the system todos
      this.todos = [];
      const createdTodos = await axios.get(`/todo/list?type=SY&company_id=${this.currentCompanyId}`);
      const assignedTodos = await axios.get(`/todo/list?type=SY&creator_company_id=${this.currentCompanyId}`);
      if (createdTodos.status === 200 && createdTodos.data.todos){
        this.todos = createdTodos.data.todos.map(item => {
          item.target = 'T';
          return item;
        })
      }
      if (assignedTodos.status === 200 && assignedTodos.data.todos){
        const list = assignedTodos.data.todos.map(item => {
          item.target = 'S';
          return item;
        })
        this.todos = [...this.todos, ...list];
        this.todos = this.todos.map(item => {
          const index = this.companies.findIndex(el => item.creator_company_id === el.company_id);
          if (index) item.creator_company_name = this.companies[index].name;
          return item;
        });
        console.log('Todo_List', this.todos)
      }
    },
    scrollToEditTodo(withId = false) {
      var that = this;
      setTimeout(function () {
        const el = withId ? document.getElementById('support-task-table') : that.$el.getElementsByClassName('scroll-to-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    },

    saveTodo(e) {
      if (e !== undefined) {
        e.preventDefault();
      }

      axios
        .put('/todo', this.form)
        .then(res => {
          if (res.status === 200) {
            this.toastr('success', 'OK', 'Ärendet uppdaterades');
            let todo = res.data.todo;
            this.addTodo(todo);
            this.creating = false;
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera ärende');
        });
    },
    addTodo(todo, creating = false) {
      if (creating)
        this.todos.push(todo);
      else {
        let index = this.todos.findIndex(function(item){
          return item.todo_id == todo.todo_id;
        });
        if (index != undefined) {
          todo.last_updated_at = todo.updated_at;
          this.todos.splice(index, 1, todo);
        }
      }
    },
    resetForm(){
      this.form = {
          todo_id: '',
          company_id: '',
          creator_company_id: '',
          created_at: '',
          updated_at: '',
          type: 'SY',
          status: '',
          descr: '',
          name: '',
          email_at: '',
          creator_user_id: '',
          assigned_users: [],
          comments: [],
          file_type: '',
          from_datetime: '',
          to_datetime: '',
          linked_todo_id: '',
          company_ids: [],
          target: '',
          rank: 0,
          upvotes: 0,
          downvotes: 0,
          type2: '',
          public_id: ''
      }
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
    selectFile() {
      this.$refs.file.click();
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];

      this.uploadFile();
    },

    uploadFile() {
      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('file_source', 'todo');
      formData.append('file_type', '');
      formData.append('company_id', this.currentCompanyId);
      formData.append('todo_id', this.form.todo_id);
      formData.append('todo_task_id', this.form.tasks[0].todo_task_id);

      axios
        .post(`/fileupload?todo=true&todo_id=${this.form.todo_id}&todo_task_id=${this.form.tasks[0].todo_task_id}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.toastr('success', 'OK', 'Filen laddades upp');
          this.file.file_id = res.data.fileobjs[0].file_id;
          this.file.created_at = res.data.fileobjs[0].created_at;
          this.files.push(this.file);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ladda upp fil');
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
