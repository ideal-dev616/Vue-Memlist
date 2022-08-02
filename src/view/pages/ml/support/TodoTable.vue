<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <div class="card-toolbar d-flex justify-content-between justify-content-sm-end w-100">
        <div class="d-flex align-items-center mr-sm-12 my-2">
          <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
            <input type="checkbox" name="" v-model="show_history" @click="show_history = !show_history" />
            <span></span>
          </label>
          <span class="ml-3 cursor-pointer">Tidigare Ärenden</span>
        </div>

        <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createTodoClicked"
          ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Nytt Ärende</a>
      </div>
    </div>
    <div class="card-header border-0 py-5 m-1">
      <div>
        <b-select v-model="perPage" :options="options"></b-select>
      </div>
      <b-pagination
        class="ml-auto mb-0"
        v-model="currentPage"
        :total-rows="todos.length"
        :per-page="perPage"
        aria-controls="admin-support-table"
        first-number
        last-number
      ></b-pagination>
    </div>
    <div class="card-body pt-0">
      <b-table
        id="admin-support-table"
        :fields="headers"
        :items="todos"
        :per-page="perPage"
        :current-page="currentPage"
        head-variant="light"
        sticky-header
        responsive
      >
        <template #cell(todo_id)="row">
          <div class='d-flex justify-content-end'>
            <b-button
              href="#"
              class="button"
              variant="primary"
              @click="selectTodoClicked(row.item.todo_id)"
            >
                Hantera
            </b-button>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="deleteTodoClicked(row.item.todo_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
          </div>
        </template>
      </b-table>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <!-- <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-75">ämne</span>
              </th>
              <th>Kategory</th>
              <th>Allvarighetsgrad</th>
              <th>Status</th>
              <th>Senast uppdaterad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in items">
              <TodoTableRow
                v-bind:key="i"
                :todo="item"
                :currentCompanyId="currentCompanyId"
                @selectTodoClicked="selectTodoClicked"
                @deleteTodoClicked="deleteTodoClicked"
                @toastr="toastr"
              />
            </template>
          </tbody>
        </table>
      </div> -->
      <!--end::Table-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Advance Table Widget 9-->
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.b-table-sticky-header{
  overflow-y: hidden;
  max-height: unset;
}
</style>
<script>
import axios from 'axios';
import moment from 'moment';
import TodoTableRow from '@/view/pages/ml/support/TodoTableRow.vue';

export default {
  name: 'support-table',
  props: ['items', 'currentCompanyId'],
  components: {
    TodoTableRow
  },
  watch: {
    show_history(newcheck, oldcheck) {
      this.showItems();
      // this.$emit('showHistoryToggled', newcheck);
    },
    items(newValue, oldValue) {
      this.filterValue(newValue);
    }
  },
  mounted() {
    this.filterValue(this.items);
  },
  methods: {
    createTodoClicked() {
      this.$emit('createTodoClicked');
    },
    filterValue(items) {
      let that = this;
      this.todos = items.map( function(item) {
        return {
          todo_id: item.todo_id,
          category: that.category[item.type2],
          name: item.name,
          severity: that.supportOptions[item.severity - 1],
          status: that.status[item.status],
          target: item.target,
          creator_company_name: item.creator_company_name,
          updated_at: item.last_updated_at,
        }
      });
    },
    selectTodoClicked(todo_id) {
      this.$emit('selectTodoClicked', todo_id);
    },
    deleteTodoClicked(todo_id) {
      this.$emit('deleteTodoClicked', todo_id);
    },
    showItems() {
      if (!this.show_history) {
        let now = moment();
        let items = this.items.filter(function(item) {
          var eventdt = moment(item.to_datetime);
          return eventdt < now;
        });
        this.filterValue(items);
      }
    },
    isCompleted(status) {
      return status == 'DONE' || status == 'CN' || status == 'REJ' || status == 'DEL';
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },

  data() {
    return {
      show_history: false,
      todos: [],
      perPage: 20,
      currentPage: 1,
      headers: [
        {
          key: 'name',
          label: 'Ämne',
          sortable: true,
          thClass: 'pl-7 align-middle',
          tdClass: 'pl-7 align-middle'
        },
        {
          key: 'category',
          label: 'Kategori',
          thClass: 'w-160px align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'severity',
          label: 'Nivå',
          thClass: 'w-80px align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'status',
          label: 'Status',
          thClass: 'w-100px align-middle',
          tdClass: 'align-middle',
          sortable: true,
        },
        {
          key: 'creator_company_name',
          label: 'Förening',
          thClass: 'w-100px align-middle',
          tdClass: 'align-middle',
          sortable: true,
        },
        {
          key: 'target',
          label: 'Mål',
          thClass: 'align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'updated_at',
          label: 'Senast uppdaterad',
          thClass: 'w-165px align-middle',
          tdClass: 'align-middle',
          sortable: true,
        },
        {
          key: 'todo_id',
          label: 'Hantera',
          thClass: 'w-150px text-right pr-27 align-middle',
          tdClass: 'align-middle',
        },
      ],
      options: [
        { value: 20 , text: '20'},
        { value: 50 , text: '50'},
        { value: 100 , text: '100'}
      ],
      category: {
        //Teknisk
        N: 'NOTSET',
        I: 'Teknisk support',
        F: 'Ekonomi support',
        B: 'Försäljning' ,
        S: 'Förslag',
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
    };
  }
};
</script>
