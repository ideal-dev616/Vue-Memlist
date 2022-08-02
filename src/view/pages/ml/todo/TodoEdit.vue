<template>
  <div v-show="isVisible" id="page-todo-edit">
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-todo-container"
      ref="edit-todo"
      id="edit-todo"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form class="mt-8" @submit="submitTodo($event)">
          <b-form-group id="input-group-todo_id" label="ID" label-for="input-todo_id">
            <b-form-input
              id="input-todo_id"
              v-model="form.todo_id"
              type="text"
              required
              disabled
            ></b-form-input>
          </b-form-group>

          <div v-if="form.status === 'DRAFT'">
            <b-alert show variant="warning">Ärendet är ej publicerat, underföreningarna ser ej ärendet</b-alert>
            <b-button type="button" variant="primary" @click="publishTodoClicked">Publicera</b-button>
          </div>

          <div v-if="form.status !== 'DRAFT' && form.status !== 'INVALID' ">
            <b-alert show variant="primary">Ärendet är publicerat och visas nu för valda föreningar</b-alert>
            <b-button type="button" variant="danger">Återkalla ärendet</b-button>
          </div>

          <b-form-group id="input-group-6" label="Föreningar" label-for="input-6" class="mt-8">
            <CompanySelect
              ref="companySelect"
              remove-current-id
            />
          </b-form-group>

          <b-form-group id="input-group-1" label="Namn på ärendet" label-for="input-1">
            <b-form-input id="input-1" v-model="form.name" type="text"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" label="Beskrivning" label-for="input-4">
            <b-textarea id="input-4" v-model="form.descr" rows="6" class="mb-2"> </b-textarea>
          </b-form-group>

          <!--<v-datetime-picker label="Från datum" :timePickerProps="timePickerProps" :state="isFromValid" v-model="from_date" :min="min_date"> </v-datetime-picker>-->
          
          <!--<v-datetime-picker label="Till datum" :timePickerProps="timePickerProps" :state="isToValid" v-model="to_date" :min="from_date"> </v-datetime-picker>-->

          <VueCtkDateTimePicker id="from_datetime" name="from_datetime" v-model="from_datetime" label="Från datum" format="YYYY-MM-DD HH:mm" class="mb-8" />

          <VueCtkDateTimePicker id="to_datetime" name="to_datetime" v-model="to_datetime" label="Till datum" format="YYYY-MM-DD HH:mm" class="mb-8" />

          <!--<b-form-group id="input-group-2" label="Från datum" label-for="input-2">
            <b-form-datepicker id="input-2" :state="isFromValid" v-model="from_date" :min="min_date" class="mb-2"> </b-form-datepicker>
          </b-form-group>

          <b-form-group id="input-group-8" label="Från klockslag" label-for="input-8">
            <b-form-timepicker id="input-8" locale="sv" :state="isFromTimeValid" v-model="from_time" class="mb-2"> </b-form-timepicker>
          </b-form-group>

          <b-form-group id="input-group-3" label="Till datum" label-for="input-3">
            <b-form-datepicker id="input-3" :state="isToValid" v-model="to_date" :min="from_date" class="mb-2"> </b-form-datepicker>
          </b-form-group>

          <b-form-group id="input-group-9" label="Till klockslag" label-for="input-9">
            <b-form-timepicker id="input-9" locale="sv" :state="isToTimeValid" v-model="to_time" class="mb-2"> </b-form-timepicker>
          </b-form-group>-->

          <b-form-group>
            <div class="d-flex align-items-center">
                <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="send_email" @click="send_email = !send_email" />
                <span></span>
                </label>
                <span class="ml-3 cursor-pointer"
                >Skicka e-post till användare vid statusuppdateringar</span
                >
            </div>
           </b-form-group>

           <b-row>
             <b-col lg="12">
               <TaskTable
                  :tasks="tasks"
                  :status="form.status"
                  @createTaskClicked="createTaskClicked"
                  @selectTaskClicked="selectTaskClicked"
                  @deleteTaskClicked="deleteTaskClicked"
                />
             </b-col>
           </b-row>

           <b-row>
             <b-col lg="12">
               <TaskEdit
                  ref="editTask"
                  :todo="form"
                  :tasks="tasks"
                  @taskUpdated="taskUpdated"
               />
             </b-col>
           </b-row>

           <b-row>
               <b-col lg="12">
                 <b-alert v-if="tasks.length === 0" show variant="warning">Det finns inga åtgärder i ärendet! Du måste lägga till minst en åtgärd för att kunna skapa ärendet.</b-alert>
               </b-col>
           </b-row>

            <div v-if="form.status === 'INVALID'">
                <b-alert v-if="!isTasksValid" show variant="danger">Det måste finnas minst 1 åtgärd i ärendet</b-alert>
                <b-alert v-if="!isFromValid" show variant="danger">Startdatum är inte satt</b-alert>
                <b-alert v-if="!isToValid" show variant="danger">Slutdatum är inte satt</b-alert>
            </div>

           <b-row class="mt-8">
             <b-col lg="12">
               <b-button
                   type="submit"
                   variant="primary"
                   :disabled="!isTasksValid || !isFromValid || !isToValid"
               >
                   Spara Ärendet
               </b-button>
             </b-col>
           </b-row>


        </b-form>
      </div>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: Poppins, Helvetica, "sans-serif" !important;
}

.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import CompanySelect from '@/view/components/companySelect.vue';
import TaskTable from '@/view/pages/ml/todo/TaskTable.vue';
import TaskEdit from '@/view/pages/ml/todo/TaskEdit.vue';
import moment from 'moment';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

export default {
  name: 'todoedit',
  props: ['todonames', 'todoids', 'activenames'],
  components: {
    CompanySelect,
    TaskTable,
    TaskEdit,
    VueCtkDateTimePicker
  },
  computed: {
    ...mapGetters(['currentCompanyId','currentPeriodId', 'companies']),
    isFromValid() {
      return moment(this.from_datetime).isValid();
    },
    isToValid() {
      return moment(this.to_datetime).isValid();
    },
    isTasksValid() {
      return this.tasks.length > 0;
    }
  },
  watch: {
    from_datetime(newValue, oldValue) {
      this.form.from_datetime = newValue;
    },
    to_datetime(newValue, oldValue) {
      this.form.to_datetime = newValue;
    },
  },
  async mounted() {
      await this.setMinDatetime();
      this.isVisible = true;
  },
  data() {
    return {
      timePickerProps: {
        format: "24hr"
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
        FUTURE:     'FUT',
        CLOSE:      'CLOSE',
        INVALID:    'INVALID'
      },
      TODO_TYPE: {
        PARENT:         'PA',
        FILE_UPLOAD:    'FU',
        CONFIRM:        'CF',
        COMPANY:        'CO',
        SYSTEM:         'SY'
      },
      form: {
        id: '',
        from_datetime: '',
        to_datetime: '',
        name: '',
        status: 'INVALID',
        type: 'PA'
      },
      loaded: false,
      creating: false,
      editing: false,
      canEdit: true,
      send_email: true,
      tasks: [],
      min_date:'',
      from_datetime: '',
      to_datetime: '',
      isVisible: false,
    };
  },
  methods: {
    createTaskClicked() {
      console.log('create task clicked');

      this.$refs['editTask'].createTaskClicked();
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      if (!this.titles) {
        return;
      }

    },
    selectTaskClicked(todo_task_id) {
      this.$refs['editTask'].selectTask(todo_task_id);
    },
    deleteTaskClicked(todo_task_id) {
      axios
        .delete(`/todo_task?todo_task_id=${todo_task_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.tasks = this.tasks.filter(item => item.todo_task_id !== todo_task_id);

          this.toastr('success', 'OK', 'Åtgärden togs bort');

          //this.$emit('taskUpdated', todo_task_id);
          this.taskUpdated(todo_task_id);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort ärendet');
        });

    },
    submitTodo(e) {
      console.log('submitting todo', this.form);
      e.preventDefault();

      var is_all = this.$refs['companySelect'].isAll();
      var companies = this.$refs['companySelect'].getCompanies();

      this.updateTodo();
    },
    close() {
      this.creating = false;
      this.editing = false;
    },
    publishTodoClicked() {
      // validate the todo
      this.publishTodo();
    },
    publishTodo() {
      // when we publish, we will create a separate todo per each subcompany
      this.form.company_ids = this.$refs['companySelect'].getCompanies();
      this.form.name = this.getAvailableNameActive(this.form.name);
      axios
        .post('/todo/publish', this.form)
        .then(res => {
            let todo = res.data.todos[0];
            this.toastr('success', 'OK', 'Ärendet har publicerats');
            this.$emit('todoPublished', todo);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte publicera ärendet');
        });
    },
    selectTodo(todo_id) {

      axios
        .get(`/todo?todo_id=${todo_id}`)
        .then(res => {
          this.form = res.data.todo;
          this.from_datetime = this.form.from_datetime;
          this.to_datetime = this.form.to_datetime;
          this.editing = true;
          this.scrollToEditTodo();
          this.loadTasks();
          var that = this;

          setTimeout(function(){
            that.$refs['companySelect'].setCompanies(that.form.company_ids);
          }, 500);

        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta ärendet');
        });
    },
    taskUpdated(task_id) {
      console.log('task was updated: ' + task_id);
      this.loadTasks();
    },
    loadTasks() {
      axios
        .get(`/todo_task/list?todo_id=${this.form.todo_id}`)
        .then(res => {
          this.tasks = res.data.tasks;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta åtgärder');
        });
    },
    getAvailableName(name, todo_id = -1) {
      let tempName = name;
      if (todo_id == -1) {
        while (this.todonames.findIndex(item => item == tempName) > -1) {
          let nIndex = tempName.indexOf('#');
          if (nIndex > -1) {
            let number = parseInt(tempName.substring(nIndex + 1));
            let strReplaced = '#' + (number + 1);
            tempName = tempName.replace(tempName.substring(nIndex), strReplaced);
          } else {
            tempName += ' #1';
          }
        }
      } else {
        while (this.todonames.findIndex(item => item == tempName) > -1) {
          let numberth = this.todonames.findIndex(item => item == tempName);
          if (this.todoids[numberth] == todo_id) {
            if (this.todonames.findIndex((index, item) => item == tempName && index > numberth) == -1)
              break;
          }
          let nIndex = tempName.indexOf('#');
          if (nIndex > -1) {
            let number = parseInt(tempName.substring(nIndex + 1));
            let strReplaced = '#' + (number + 1);
            tempName = tempName.replace(tempName.substring(nIndex), strReplaced);
          } else {
            tempName += ' #1';
          }
        }
      }
      return tempName;
    },
    getAvailableNameActive(name, todo_id = -1) {
      let tempName = name;
      console.log(name, this.activenames, "LiveNames");
      if (todo_id == -1) {
        while (this.activenames.findIndex(item => item == tempName) > -1) {
          let nIndex = tempName.indexOf('#');
          if (nIndex > -1) {
            let number = parseInt(tempName.substring(nIndex + 1));
            let strReplaced = '#' + (number + 1);
            tempName = tempName.replace(tempName.substring(nIndex), strReplaced);
          } else {
            tempName += ' #1';
          }
        }
      }
      console.log(tempName, "TempName");
      return tempName;
    },
    updateTodo() {
      this.formatDateTime()
      this.form.creator_company_id = this.currentCompanyId;
      this.form.period_id = this.currentPeriodId;
      if (this.creating) {
        this.form.name = this.getAvailableName(this.form.name);
        axios
          .post('/todo', this.form)
          .then(res => {
            if (res.status === 201) {
              this.creating = false;
              this.form = res.data.todo;
              this.toastr('success', 'OK', 'Ärendet skapades');
              this.$emit('todoUpdated', this.form);
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte skapa ärendet');
          });
      } else {
        this.form.company_ids = this.$refs['companySelect'].getCompanies();
        this.form.name = this.getAvailableName(this.form.name, this.form.todo_id);
        axios
          .put('/todo', this.form)
          .then(res => {
            if (res.status === 200) {
              this.editing = false;
              this.form = res.data.todo;
              this.toastr('success', 'OK', 'Ärendet uppdaterades');
              this.$emit('todoUpdated', this.form);
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera ärendet');
          });
      }
    },
    createTodo() {
      this.creating = true;
      this.editing = true;
      this.resetField();
      this.formatDateTime();
      this.updateTodo();
      this.scrollToEditTodo();

//
//      this.form.todo_id = this.currentTodoId;
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    scrollToEditTodo() {
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
      resetField(){
        this.form = {
              id: '',
              from_datetime: '',
              to_datetime: '',
              status: 'INVALID',
              type: 'PA',
              creator_company_id : this.currentCompanyId,
              company_id : this.currentCompanyId,
              period_id : this.currentPeriodId,
              company_ids : [],
              name : 'Nytt ärende',
            };
          this.tasks= []
      },
      setMinDatetime(){
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        this.min_date = today;
        console.log(today)
      },
      formatDateTime(){
        
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
