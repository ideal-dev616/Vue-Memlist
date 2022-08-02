<template>
  <div>
    <b-modal ref="showModal" size="lg" hide-footer>
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th>Filnamn</th>
              <th>Skapad</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody v-if="task">
            <template v-for="(item, i) in task.files">
              <FileTableRow
                v-bind:key="i"
                :file="item"
                @toastr="toastr"
                @deleteFileClicked="deleteFileClicked"
              />
            </template>
          </tbody>
        </table>
      </div>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
@media (min-width: 992px) {
 .modal-lg {
    max-width: auto !important;
   }
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: auto !important;
  }
}

</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import FileTableRow from '@/view/pages/ml/todo/FileTableRow.vue';

export default {
  name: 'filelistmodal',
  props: ['task'],
  components: {
    FileTableRow
  },
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  mounted() {

  },
  data() {
    return {
      
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {

      }
    }
  },
  methods: {
    show() {
      console.log(this.$refs['showModal']);
      this.$refs['showModal'].show();
    },
    hide() {
      this.$refs['showModal'].hide();
    },
    deleteFileClicked(file_id) {
      this.$emit('deleteFileClicked', file_id, this.task.todo_task_id);
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
