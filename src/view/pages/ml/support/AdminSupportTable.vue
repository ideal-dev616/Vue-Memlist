<template>
  <div class="card card-custom card-stretch gutter-b">
    <div class="card-body pt-10 pb-3">
      <div class="d-flex justify-content-fixed">
        <div>
          <b-select v-model="perPage" :options="options"></b-select>
        </div>
        <b-pagination
          class="ml-auto"
          v-model="currentPage"
          :total-rows="todos.length"
          :per-page="perPage"
          aria-controls="admin-support-table"
          first-number
          last-number
        ></b-pagination>
      </div>
      <b-table
        id="admin-support-table"
        :fields="headers"
        :items="items"
        :per-page="perPage"
        :current-page="currentPage"
        head-variant="light"
      >
        <template #cell(todo_id)="row">
          <a
            href="#"
            class="button"
            @click="selectTodo(row.item.todo_id)"
          >
            Hantera >
          </a>
        </template>
      </b-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}

.comment {
  background-color: #1a52c6;
}

</style>

<script>

import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'admin-support-table',
  components: {
  },
  props: {
    todos: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  computed: {
    ...mapGetters(['companies', 'currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
  },
  data() {
    return {
      perPage: 20,
      currentPage: 1,
      items: [],
      headers: [
        {
          key: 'category',
          label: 'Kategori',
          sortable: true,
          thClass: 'pl-7',
          tdClass: 'pl-7'
        },
        {
          key: 'company',
          label: 'Företagsnamn',
          sortable: true,
          thClass: 'comment'
        },
        {
          key: 'name',
          label: 'Ämne',
          sortable: true,
        },
        {
          key: 'severity',
          label: 'Nivå',
          sortable: true,
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
        },
        {
          key: 'updated_at',
          label: 'Senast uppdaterad',
          sortable: true,
        },
        {
          key: 'todo_id',
          label: 'Hantera',
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
  },
  watch: {
    companies(newValue, oldValue) {
      this.filterValue(this.todos);
    },
    todos(newValue, oldValue) {
      this.filterValue(newValue);
    }
  },
  methods: {
    filterValue(items) {
      let that = this;
      this.items = items.map( function(item) {
        let company = that.companies.find(company => company.company_id == (item.creator_company_id ? item.creator_company_id : item.company_id));
        let companyName = company ? company.name : 'Loading';
        return {
          todo_id: item.todo_id,
          category: that.category[item.type2],
          company: companyName,
          name: item.name,
          severity: that.supportOptions[item.severity - 1],
          status: that.status[item.status],
          updated_at: item.last_updated_at,
        }
      });
      this.items.sort( function (a, b) {
        return b.updated_at.localeCompare(a.updated_at);
      });
    },
    selectTodo(todo_id) {
      console.log(todo_id, "Todo_id");
      this.$emit("selectTodo", todo_id);
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
