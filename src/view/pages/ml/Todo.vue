<template>
  <div class="px-5" id="page-todos">
    <h5 class="mb-6 ml-2">Ärendehantering</h5>
    <Confirm
        ref="confirmModal"
        type="danger"
        message="Är du säker?"
        @confirm="deleteTodoClicked(selectedTodoId)"
    />

    <FilesListModal
      ref="filesListModal"
      :task="selectedTask"
      @deleteFileClicked="deleteFileClicked"
    />

    <b-modal ref="manageLiveTodo" size="lg" hide-footer>
      <div>
        <b-alert show variant="secondary">När alla åtgärder i ärendet är avklarat så bör du stänga ärendet. När ärendet är stängt kommer inga notifikationer att skickas ut, samt att ärendet hamnar i "Avslutade ärenden"</b-alert>

        <template v-for="(item, i) in selectedTasks">
          <b-alert v-if="item.status !== 'DONE'" v-bind:key="i" show variant="warning">Åtgärd "{{item.name}}" är ej klart</b-alert>
        </template>

        <b-button type="button" variant="outline-danger" @click="closeTodoClicked">Stäng ärendet</b-button>
        <b-button type="button" variant="danger" class="ml-4" @click="confirmDelete">Radera ärende</b-button>
        <b-button type="button" variant="secondary" class="ml-4" @click="closeManageModalClicked">Ångra</b-button>
      </div>

    </b-modal>

    <b-modal ref="chatBoxModal" size="lg" hide-footer>
      <ChatBox
        :comments="comments"
      />

      <b-row>
        <b-col lg="8">
          <b-form-group id="input-group-text" label="Skriv meddelande" label-for="input-text">
            <b-textarea id="input-text" v-model="comment" class="mb-2"> </b-textarea>
          </b-form-group>
        </b-col>
        <b-col lg="4">
          <b-button type="button" style="margin-top: 26px; height: 55px; width: 120px;" variant="primary" @click="sendCommentClicked">Skicka</b-button>
        </b-col>
      </b-row>

    </b-modal>

    <b-card
      title=""
      class="mb-2"
      hide-footer
    >

        <v-tabs
            v-model="tab"
            background-color="white"
            color="dark"
            right
        >
            <v-tab>Utkast</v-tab>
            <v-tab>Aktiva ärenden</v-tab>
            <v-tab>Avslutade ärenden</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" touchless>
            <v-tab-item class="mt-8">
                <TodoTable
                  type="draft"
                  searchLabel="Sök ärende"
                  :statusName="statusName"
                  :todos="draftTodos"
                  @createTodoClicked="createTodoClicked"
                  @publicTodoClicked="publicTodoClicked"
                  @selectTodoClicked="selectTodoClicked"
                  @deleteTodoClicked="deleteTodoClicked"
                />

                <TodoEdit
                  ref="todoEdit-draft"
                  :todonames="draftNames()"
                  :todoids="draftIds()"
                  :activenames='activeNames()'
                  @todoUpdated="todoUpdated"
                  @todoPublished="todoPublished"
                />
            </v-tab-item>

            <v-tab-item class="mt-8">

              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Sök förening"
                single-line
                hide-details
              ></v-text-field>

              <!--<b-form-group id="input-group-search" description="Sök efter förening" label-for="input-search">
                <b-form-input id="input-search" v-model="search" type="text"></b-form-input>
              </b-form-group>-->
              <v-data-table
                :headers="todoHeaders"
                :items="liveTodos"
                :items-per-page="20"
                :footer-props="{
                    itemsPerPageOptions: rowsPerPage
                }"
                :single-expand="singleExpand"
                :expanded.sync="expanded"
                :search="search"
                item-key="todo_id"
                show-expand
                class="elevation-1"
                :header-props="headerProps"
              >
                <template
                  v-slot:[`item.action`]="{ item }" >
                  <b-button type="button" class="btn btn-sm" @click="manageLiveTodoClicked(item.todo_id)" variant="primary">Hantera</b-button>
                </template>
                <template
                  v-slot:[`item.status`]="{ item }" >
                  {{ statusName[item.status] }}
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" style="padding: 1px;">
                    <TodoChildTable
                      type="live"
                      :items="item.tasks"
                      :item="item"
                      @showFilesClicked="showFilesClicked"
                      @selectRowClicked="selectRowClicked"
                      @deleteRowClicked="deleteRowClicked"
                      @showCommentsClicked="showCommentsClicked"
                      @updateTaskStatus="updateTaskStatus"
                    />
                  </td>
                </template>
              </v-data-table>

                <TodoEdit
                    ref="todoEdit-active"
                    @todoUpdated="todoUpdated"
                    @todoPublished="todoPublished"
                />
            </v-tab-item>

            <v-tab-item class="mt-8">
                <v-text-field
                        v-model="cls_search"
                        append-icon="mdi-magnify"
                        label="Sök förening"
                        single-line
                        hide-details
                ></v-text-field>

                <v-data-table
                        :headers="todoHeaders"
                        :items="historyTodos"
                        :single-expand="singleExpand"
                        :expanded.sync="expanded"
                        :search="cls_search"
                        :header-props="headerProps"
                        item-key="todo_id"
                        show-expand
                        class="elevation-1"
                >

<!--                    <template-->
<!--                            v-slot:[`item.action`]="{ item }" >-->
<!--                        <b-button type="button" class="btn btn-sm" @click="manageLiveTodoClicked(item.todo_id)" variant="primary">Hantera</b-button>-->
<!--                    </template>-->
                    <template
                            v-slot:[`item.status`]="{ item }" >
                        {{ statusName[item.status] }}
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length" style="padding: 1px;">
                            <TodoChildTable
                                    type="live"
                                    :items="item.tasks"
                                    :item="item"
                                    @showFilesClicked="showFilesClicked"
                                    @selectRowClicked="selectRowClicked"
                                    @deleteRowClicked="deleteRowClicked"
                                    @showCommentsClicked="showCommentsClicked"
                            />
                        </td>
                    </template>
                </v-data-table>


<!--                <TodoTable-->
<!--                  type="history"-->
<!--                  searchLabel="Sök Förening"-->
<!--                  :todos="historyTodos"-->
<!--                  :statusName="statusName"-->
<!--                  @showCommentsClicked="showCommentsClicked"-->
<!--                  @selectTodoClicked="selectTodoClicked"-->
<!--                  @deleteTodoClicked = "deleteTodoClicked"-->
<!--                />-->

                <TodoEdit
                    ref="todoEdit-finished"
                    @todoUpdated="todoUpdated"
                    @todoPublished="todoPublished"
                />
            </v-tab-item>
        </v-tabs-items>
    </b-card>

    
      <LiveTaskEdit 
        v-if="liveTodoTask"
        ref="editLiveTask"
        :task="liveTodoTask"
        @closeEditLiveTask="closeEditLiveTask"
      />
    

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
import TodoTable from '@/view/pages/ml/todo/TodoTable.vue';
import TodoEdit from '@/view/pages/ml/todo/TodoEdit.vue';
import LiveTaskEdit from '@/view/pages/ml/todo/LiveTaskEdit.vue';
import TodoChildTable from '@/view/pages/ml/todo/TodoChildTable.vue';
import FilesListModal from '@/view/pages/ml/todo/FilesListModal.vue';
import ChatBox from '@/view/components/chatBox.vue';
import Confirm from '@/view/components/Confirm.vue';

export default {
  name: 'todo',
  components: {
    TodoTable,
    TodoEdit,
    ChatBox,
    TodoChildTable,
    Confirm,
    FilesListModal,
    LiveTaskEdit
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      liveTodoTask: null,
      expanded: [],
      singleExpand: false,
        headerProps:{
          sortByText: 'Sortera'
        },
      todoHeaders: [
        { text: 'Ärendenamn', value: 'name'},
        {
          text: 'Förening',
          align: 'start',
          sortable: true,
          value: 'company_name',
        },
        { text: 'Antal Filer', value: 'num_files' },
        { text: 'Antal Kommentarer', value: 'num_comments' },
        { text: 'Senast Uppdaterat', value: 'last_updated_at' },
        { text: 'Status', value: 'status' },
        { text: 'Hantera', value: 'action' },
        { text: '', value: 'data-table-expand' },
      ],
      selectedTodoId: null,
      selectedTasks: [],
      selectedTask: null,
      todos: [],
      liveTodos: [],
      draftTodos: [],
      historyTodos: [],
      comments: [],
      comment: '',
      todo_id: null,
      todo_task_id: null,
      columns: ['name', 'code', 'uri'],
      search: '',
        cls_search:'',
        tab: null,
      statusName: {
        DRAFT: 'Utkast',
        INVALID: 'Ej giltig',
        WAIT: 'Väntar',
        NOT: 'Ej klar',
        DONE: 'Klar',
        CN: 'Bekräftat',
        DEL: 'Raderat',
        ACC: 'Accepterat',
        REJ: 'Avslaget',
        BAC: 'Backlog',
        FUT: 'Framtida',
        CLOSE: 'Stängt'
      },
        todoStatusPrio: {
            REJ:        -4,
            CLOSE:      -3,
            INVALID:    -2,
            WAIT:       -1,
            DRAFT:      0,
            NOT:        1,
            DONE:       2,
            CN:         3,
            DEL:        4,
            ACC:        5,
            BAC:        7,
            FUT:        8,
        },
        rowsPerPage: [10, 20, 40, -1],
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadData();
      }
    },
    currentPeriodId(newValue, oldValue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    deleteFileClicked(file_id, todo_task_id) {
      this.selectedTask.files = this.selectedTask.files.filter(item => item.file_id !== file_id);

      axios
        .put('/todo_task', this.selectedTask)
        .then(res => {
          this.selectedTask = res.data.task;

          this.toastr('success', 'OK', 'Filen togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte radera fil');
        });
    },
    showFilesClicked(todo_task_id) {
      axios
        .get(`/todo_task?todo_task_id=${todo_task_id}`)
        .then(res => {
          this.selectedTask = res.data.task;
          this.$refs['filesListModal'].show();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte hämta åtgärdsdata');
        });
    },
    closeManageModalClicked() {
      this.$refs['manageLiveTodo'].hide();
    },
    closeTodoClicked() {
        this.closeManageModalClicked();
        axios
        .post('/todo/close', { todo_id: this.selectedTodoId })
        .then(res => {
            const todo = this.getTodoWithId(this.selectedTodoId);
            if (res.status === 200 && todo !== null){
                todo.status = 'CLOSE';
                this.historyTodos.push(todo);
                this.todos = this.todos.filter(item => item.todo_id !== this.selectedTodoId);
                this.draftTodos = this.draftTodos.filter(item => item.todo_id !== this.selectedTodoId);
                this.liveTodos = this.liveTodos.filter(item => item.todo_id !== this.selectedTodoId);
            } else
                this.toastr('danger', 'Server Fel', 'Kunde inte stänga ärendet');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte stänga ärendet');
        });
    },
    getTodoWithId(todo_id) {
      for (var i = 0; i < this.todos.length; ++i) {
        if (this.todos[i].todo_id === todo_id) {
          return this.todos[i];
        }
      }

      return null;
    },
    manageLiveTodoClicked(todo_id) {
      console.log('selected todo_id: ' + todo_id);

      var todo = this.getTodoWithId(todo_id);
      this.selectedTasks = todo.tasks;

      this.selectedTodoId = todo_id;

      this.$refs['manageLiveTodo'].show();
    },
    sendCommentClicked() {
      axios
        .post('/todo_task/comment', { from: 'top', comment: this.comment, todo_task_id: this.todo_task_id })
        .then(res => {
          this.comment = '';
          this.comments.push(res.data.comment);
          this.loadData();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skicka kommentar');
        });
    },
    showCommentsClicked(todo_task_id) {
      console.log('showing chatbox: ' + todo_task_id);
      this.todo_task_id = todo_task_id;

      axios
        .get(`/todo_task?todo_task_id=${todo_task_id}`)
        .then(res => {
          this.comments = res.data.task.comments;

          this.$refs['chatBoxModal'].show();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta kommentarer');
        });
    },
    closeEditLiveTask() {
      this.liveTodoTask = null;
    },
    selectRowClicked(todo_task_id) {
      console.log('editing todo_task: ' + todo_task_id);
      var that = this;

      for (const todo of this.liveTodos) {
        for (const task of todo.tasks) {
          if (task.todo_task_id === todo_task_id) {
            this.liveTodoTask = task;
            
            setTimeout(function(){
              that.$refs['editLiveTask'].init();
            }, 100);

            return;
          }
        }
      }
    },
    deleteRowClicked(todo_task_id) {
        axios.delete(`/todo_task?todo_task_id=${todo_task_id}`).then(res=>{
            if (res.status === 200){
                this.liveTodos.filter((todo, i)=>{
                    todo.tasks.filter((task, t)=>{
                        if (task.todo_task_id === todo_task_id) this.liveTodos[i].tasks.splice(t, 1);
                    })
                })
            }
            this.toastr('success', 'OK', 'Åtgärd togs bort');
        }).catch(err => {
            console.log(err)
            this.toastr('danger', 'Server Fel', 'Kunde inte ta bort åtgärd');
        })
      console.log('deleteRowClicked: ' + todo_task_id);
    },
    updateTaskStatus(){
        this.loadData();
    },
    todoUpdated(todo) {
      this.loadData();
    },
    todoPublished(todo){
      this.loadData();
    },
    async loadData() {
      axios
        .get(`/todo/list?type=PA&creator_company_id=${this.currentCompanyId}`)
        .then(res => {
          console.log(res.data.todos);

          this.todos = res.data.todos;

          this.liveTodos = [];
          this.draftTodos = [];
          this.historyTodos = [];

          for (var i = 0; i < this.todos.length; ++i) {
            var t = this.todos[i];

            if (t.status === 'INVALID' || t.status === 'DRAFT') {
              this.draftTodos.push(t);
            }
            else if (t.status === 'DEL' || t.status === 'CLOSE') {
              this.historyTodos.push(t);
            }
            else {
            //else if (t.status === 'NOT' || t.status === 'WAIT' || t.status === 'DONE' || t.status === 'CN' || t.status === 'ACC' || t.status === 'REJ') {
              this.liveTodos.push(t);
            }
          }
          this.liveTodos.map(function (item) {
            if (item.company_name == "")
              item.company_name = 'Alla';
          });
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta ärenden');
        });
    },
    createTodoClicked() {
      console.log('creating new todo');
      const tab_ref = this.selectedTab();
      this.$refs[`${tab_ref}`].createTodo();
    },
    publicTodoClicked(todo_id) {
      axios
        .get(`/todo?todo_id=${todo_id}`)
        .then(res => {
          let form = res.data.todo;
          axios
              .get(`/company/hierarchy?company_id=${this.currentCompanyId}`)
              .then(res => {
                  form.subcompanies = res.data.tree.children.map(item => {
                      return item.company_id;
                  });
                  if(form.subcompanies.length > 0 || form.company_ids.length > 0){
                      axios
                          .post('/todo/publish', form)
                          .then(res => {
                              let todo = res.data.todos[0];
                              this.toastr('success', 'OK', 'Ärendet har publicerats');
                              this.todoPublished();
                              this.tab = 1;
                          })
                          .catch(err => {
                              console.error(err);
                              this.toastr('danger', 'Server Fel', 'Kunde inte publicera Ärendet');
                          });
                  } else {
                      this.toastr('danger', 'Kan inte publicera', 'Det finns inga underföreningar i ärendet');
                  }
              }).catch(err => {
              console.error(err);
              this.toastr('danger', 'Server Fel', 'Kunde inte hämta Ärendet');
          })
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta Ärendet');
        });
    },
    selectTodoClicked(todo_id) {
      console.log('selecting todo: ' + todo_id);
      const tab_ref = this.selectedTab();
      console.log(tab_ref)
      this.$refs[`${tab_ref}`].selectTodo(todo_id);
    },
    deleteTodoClicked(todo_id) {
      console.log('deleting todo');
        this.closeManageModalClicked();
      axios
        .delete(`/todo?todo_id=${todo_id}`)
        .then(res => {
            if (res.status === 200){
                this.todos = this.todos.filter(item => item.todo_id !== todo_id);
                this.draftTodos = this.draftTodos.filter(item => item.todo_id !== todo_id);
                this.liveTodos = this.liveTodos.filter(item => item.todo_id !== todo_id);
                this.historyTodos = this.historyTodos.filter(item => item.todo_id !== todo_id);
                this.toastr('success', 'OK', 'Ärendet togs bort');
            } else {
                this.toastr('danger', 'Server Fel', 'Kunde inte ta bort ärende');
            }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort ärende');
        });
    },
    confirmDelete(){
      this.$refs['confirmModal'].show();
    },
    selectedTab(){
        let tab = '';
        if (this.tab === 0) tab = 'todoEdit-draft';
        if (this.tab === 1) tab = 'todoEdit-active';
        if (this.tab === 2) tab = 'todoEdit-finished';
        return tab;
    },
    draftNames() {
      return this.draftTodos.map(function(item) {
        return item.name;
      });
    },
    draftIds() {
      return this.draftTodos.map(function(item) {
        return item.todo_id;
      });
    },
    activeNames() {
      return this.liveTodos.map(function(item) {
        return item.name;
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
