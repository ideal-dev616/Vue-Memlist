<template>

  <tr>
    <!--<td v-if="showPlus" @click="toggle">
        <span v-if="hasChildren" class="svg-icon svg-icon-md svg-icon-primary">
          <inline-svg src="/assets/svg/plus-square.svg"></inline-svg>
        </span>
    </td>
    <td v-else @click="toggle">
        <span v-if="hasChildren" class="svg-icon svg-icon-md svg-icon-primary">
          <inline-svg src="/assets/svg/minus-square.svg"></inline-svg>
        </span>
    </td>-->
    <td>
      {{ getName }}
    </td>
    <td>
      {{ statusName[todo.status] }}
    </td>
    <td>
      {{ todo.from_datetime }}
    </td>
    <td>
      {{ todo.to_datetime }}
    </td>
    <td class="text-right pr-0">
      <a
        v-if="type !== 'draft'"
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="showCommentsClicked(todo.todo_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/chat.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="publicTodoClicked(todo.todo_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/share.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectTodoClicked(todo.todo_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="deleteTodoClicked(todo.todo_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
    </td>
  </tr>
</template>
<style lang="scss" scoped>
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
<script>
import axios from 'axios';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'todo-table-row',
  props: ['type','todo'],
  computed: {
    ...mapGetters(['currentCompanyId']),
    getName(){
      return this.todo.name
    }
  },
  data() {
    return {
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
      showPlus: true,
      children: [],
      show: true,
      hasChildren: true
    };
  },
  mounted() {
    /*if (this.todo.linked_todo_id === null || this.todo.linked_todo_id === undefined || this.todo.linked_todo_id === '') {
      this.show = true;
      this.hasChildren = true;
    }
    else {
      this.show = false;
      this.hasChildren = false;
    }

    if (this.todo.show) {
      this.show = true;
    }*/
  },
  methods: {
    showCommentsClicked() {
      this.$emit('showCommentsClicked', this.todo.todo_id);
    },
    publicTodoClicked() {
      this.$emit('publicTodoClicked', this.todo.todo_id);
    },
    selectTodoClicked() {
      this.$emit('selectTodoClicked', this.todo.todo_id);
    },
    deleteTodoClicked() {
      this.$emit('deleteTodoClicked', this.todo.todo_id);
    },
    toggle() {


      this.showPlus = !this.showPlus;
      console.log('toggle: ' + this.showPlus);

      if (!this.showPlus) {
        this.children = [
            {
                name: 'Testrad 1',
                updated_at: '2020-01-01 22:00:11',
                num_messages: 0
            },
            {
                name: 'Testrad 2',
                updated_at: '2020-01-01 22:00:11',
                num_messages: 0
            },

        ]
      }
      else {
        this.children = [];
      }

      this.$emit('showChildren', this.todo.todo_id, !this.showPlus);
    }
  }
};
</script>
