<template>
  <div class="b-table-sticky-header table-responsive" style="max-width: calc(100vw - 128px)">
    <table class="table b-table table-head-custom table-vertical-center table-head-bg table-borderless">
      <thead>
        <tr class="text-left">
          <th>Åtgärd</th>
          <th class="updated_at">Uppdaterat</th>
          <th class="status">Status</th>
          <th class="comment">Kommentar</th>
          <th class="action">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, i) in items">
          <TodoChildTableRow
            v-bind:key="i"
            :row="item"
            @toastr="toastr"
            @showFilesClicked="showFilesClicked"
            @showCommentsClicked="showCommentsClicked"
            @selectRowClicked="selectRowClicked"
            @deleteRowClicked="deleteRowClicked"
            @updateTaskStatus="updateTaskStatus"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.b-table-sticky-header > .table.b-table > thead > tr > th {
  position: sticky;
  top: 0;
  z-index: 2;
}
.b-table-sticky-header{
  overflow-y: hidden;
  max-height: unset;
}

th {
  padding-bottom: 4px !important;
}
  .updated_at{
    min-width: 140px;
    width: 200px;
  }
  .status {
    min-width: 133px;
    width: 145px;
  }
  .comment {
    min-width: 96px;
    width: 96px;
  }
  .action {
    width: 236px;
    min-width: 194px;
  }
</style>

<script>
import axios from 'axios';
import TodoChildTableRow from '@/view/pages/ml/todo/TodoChildTableRow.vue';

export default {
  name: 'child-table',
  props: ['item', 'items', 'currentCompanyId', 'type'],
  components: {
    TodoChildTableRow
  },
  watch: {
    items(newValue, oldValue) {
      console.log('watched');
    }
  },
  mounted() {
    console.log('mounted');

    if (this.type === 'draft') {
      this.title = 'Ärendenamn';
    }
    else {
      this.title = 'Förening';
    }
    console.log('mounted');
  },
  methods: {
    showFilesClicked(todo_task_id) {
      this.$emit('showFilesClicked', todo_task_id);
    },
    showCommentsClicked(todo_task_id) {
      this.$emit('showCommentsClicked', todo_task_id);
    },
    selectRowClicked(todo_task_id) {
      this.$emit('selectRowClicked', todo_task_id);
    },
    deleteRowClicked(todo_task_id) {
      this.$emit('deleteRowClicked', todo_task_id);
    },
    updateTaskStatus(){
      this.$emit('updateTaskStatus');
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
  },
  data() {
    return {
      expanded: {},
      list: [],
      search: '',
      title: '',
      rows: [],
      groups: {}
    };
  }
};
</script>

