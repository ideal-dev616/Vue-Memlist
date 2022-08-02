<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ task.name }}</span>
    </td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectTaskClicked($event, task.todo_task_id)"
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
        @click="deleteTaskClicked($event, task.todo_task_id)"
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
  name: 'task-table-row',
  props: ['type','task'],
  computed: {
    ...mapGetters(['currentCompanyId']),
  },
  data() {
    return {
      showPlus: false,
      children: [],
      /*task: {
        todo_task_id:  '',
        todo_id:       '',
        name:          '',
        descr:         '',
        is_file:       '',
        status:        '',
        type:          '',
        category:      '',
        files: [
            {
                file_id:    '',
                status:     '',
                created_at: '',
                user_id:    '',
                name:       ''
            }
        ],
        valid_filetypes: [],
        comments: [
          { 
            user_id:    '', 
            text:       '', 
            created_at: '' 
          }
        ]
      }*/
    };
  },
  mounted() {},
  watch: {},
  methods: {
    deleteTaskClicked(e, task_id) {
      e.preventDefault();

      this.$emit('deleteTaskClicked', task_id);
    },
    selectTaskClicked(e, task_id) {
      e.preventDefault();

      this.$emit('selectTaskClicked', task_id);
    },
    toggle() {
      this.showPlus = !this.showPlus;
      console.log('toggle: ' + this.showPlus);

      if (this.showPlus) {
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
    }
  }
};
</script>
