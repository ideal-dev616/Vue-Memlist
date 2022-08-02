<template>
  <div class="px-5" id="admin-support">
    <h5 class="mb-6 ml-2">Admin Support</h5>
    <AdminSupportTable
      @selectTodo="selectTodo"
      :todos="todos"
      v-if='isTalongAdmin'
    />
    <b-card v-if='editing'>
      <Chatbox
        :todo='todo_selected'
        :userid='userid'
        :username='username'
        :useremail='useremail'
        @closeTodo='closeTodo'
        id='supper-support-table'
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
import { mapGetters } from 'vuex';
import { SET_COMPANIES } from '@/core/services/store/common.module';
import AdminSupportTable from '@/view/pages/ml/support/AdminSupportTable.vue';
import AdminTodoEdit from '@/view/pages/ml/support/AdminTodoEdit.vue';
import Chatbox from '@/view/pages/ml/support/Chatbox.vue';

export default {
  name: 'admin-support',
  components: {
    AdminSupportTable,
    AdminTodoEdit,
    Chatbox
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'currentUserId', 'currentUser', 'isTalongAdmin'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      todos: [],
      todo_selected: 0,
      username: '',
      userid: "",
      useremail: "",
      editing: false
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    async loadData() {
      this.loadUser();
      this.loadTodos();
    },
    loadTodos() {
      // load the system todos
      this.todos = [];
      axios
        .get(`/todo/admin`)
        .then(res => {
          if (res.status === 200) {
            this.todos = res.data.todos;
         }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista ärenden');
        });
    },
    loadUser() {
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
        });
    },
    selectTodo(todo_id) {
      axios
        .get(`/todo?todo_id=${todo_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.todo_selected = res.data.todo;
          this.editing = true;
          this.scrollToEditTodo(true);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta ärendet');
        });
    },
    saveTodo() {

    },

    closeTodo(todo) {
      let index = this.todos.findIndex(item => item.todo_id == todo.todo_id);
      if (index != undefined) {
        todo = this.todos[index];
        todo.status = 'DOC';
        this.todos.splice(index, 1, todo);
      }
    },

    scrollToEditTodo() {
      var that = this;
      setTimeout(function () {
        const el = document.getElementById('supper-support-table');

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
