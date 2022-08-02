<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <b-row align-v="end" v-if="type === 'draft'" class="card-header border-0 py-5">
      <b-col align="start" md="auto">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="searchLabel"
          single-line
          hide-details
          >
        </v-text-field>
      </b-col>
      <b-col class="d-flex justify-content-end">
        <a
                href="#"
                class="btn btn-primary font-weight-bolder font-size-sm"
                style="max-height: 38px;"
                @click="createTodoClicked"
        >
          <i class="menu-icon flaticon2-plus" style="font-size: 1em"></i>Nytt Ärende
        </a>
      </b-col>
    </b-row>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">

      <v-text-field v-if="type !== 'draft'"
              v-model="search"
              append-icon="mdi-magnify"
              :label="searchLabel"
              single-line
              hide-details
      ></v-text-field>

      <!--begin::Table-->
        <v-data-table
            :headers="todoHeaders"
            :items="todos"
            :search="search"
            item-key="todo_id"
            class="elevation-1"
            :header-props="headerProps"
        >
        <template v-slot:[`item.status`] = "{item}">
          {{statusName[item.status]}}
        </template>

        <template v-slot:[`item.action`] = "{item}">
          <div class="text-right pr-0">

            <a
              v-if="type !== 'draft'"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="showCommentsClicked(item.todo_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/chat.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>

            <a
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="publicTodoClicked(item.todo_id)"
            >
              <fa-icon icon="cloud-upload-alt" style="color: #3699FF"/>
            </a>

            <a
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="selectTodoClicked(item.todo_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>

            <a
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="deleteTodoClicked(item.todo_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>

          </div>
        </template>
        </v-data-table>
      <!--end::Table-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Advance Table Widget 9-->
</template>
<script>
import TodoTableRow from '@/view/pages/ml/todo/TodoTableRow.vue';

export default {
  name: 'todos-table',
  props: ['todos', 'type', 'statusName', 'searchLabel'],
  components: {
    TodoTableRow
  },
  data() {
    return {
      headerProps: {
        sortByText: 'Sortera'
      },
      expanded: {},
      list: [],
      search: '',
      title: '',
    };
  },
  methods: {
    showCommentsClicked(todo_id) {
      this.$emit('showCommentsClicked', todo_id);
    },
    publicTodoClicked(todo_id) {
      this.$emit('publicTodoClicked', todo_id);
    },
    selectTodoClicked(todo_id) {
      this.$emit('selectTodoClicked', todo_id);
    },
    deleteTodoClicked(todo_id) {
      this.$emit('deleteTodoClicked', todo_id);
    },
    showChildren(todo_id, show) {
      this.$emit('showChildren', todo_id, show);
    },
    createTodoClicked() {
      this.$emit('createTodoClicked');
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
  },
  computed: {
    todoHeaders(){
      return [
        {text: this.type === 'draft' ? 'Ärendenamn' : 'Förening', value: 'name'},
        {text: 'Status', value: 'status'},
        {text: 'Från Datum', value: 'from_datetime'},
        {text: 'Till Datum', value: 'to_datetime'},
        {text: '', value: 'action'}
      ]
    },
  },
};
</script>
<style lang="scss" scoped>
  .checkbox.checkbox-light-success > span {
    background-color: white;
    border: 1px solid #ddd;
  }
  .card.card-custom > .card-body {
    padding: 0 !important;
  }
  .card.card-custom > .card-header {
    padding: 0 !important;
  }
  .checkbox > span {
    background-color: white;
    border: 1px solid #ddd;
  }
  .hplus {
    cursor: pointer;
  }
  .hminus {
    cursor: pointer;
  }
</style>
