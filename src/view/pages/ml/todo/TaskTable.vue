<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <div class="card-toolbar">
        <a
          v-if="status === 'DRAFT' || status === 'INVALID'"
          href="#"
          class="btn btn-primary font-weight-bolder font-size-sm"
          @click="createTaskClicked($event)"
        >
          <i class="menu-icon flaticon2-plus" style="font-size: 1em"></i>Ny åtgärd
        </a>
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th>Åtgärd</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in tasks">
              <TaskTableRow
                v-bind:key="i"
                :task="item"
                @toastr="toastr"
                @selectTaskClicked="selectTaskClicked"
                @deleteTaskClicked="deleteTaskClicked"
              />
            </template>
          </tbody>
        </table>
      </div>
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
</style>
<script>
import axios from 'axios';
import TaskTableRow from '@/view/pages/ml/todo/TaskTableRow.vue';

export default {
  name: 'tasks-table',
  props: ['tasks', 'currentCompanyId', 'status'],
  components: {
    TaskTableRow
  },
  watch: {
    
  },
  mounted() {
    
  },
  methods: {
    selectTaskClicked(task_id) {
      this.$emit('selectTaskClicked', task_id);
    },
    deleteTaskClicked(task_id) {
      this.$emit('deleteTaskClicked', task_id);
    },
    createTaskClicked(e) {
      e.preventDefault();

      this.$emit('createTaskClicked');
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
  },
  data() {
    return {
      list: []
    };
  }
};
</script>

