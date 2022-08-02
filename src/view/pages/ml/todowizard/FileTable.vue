<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <div class="card-toolbar">
        <a
          href="#"
          class="btn btn-primary font-weight-bolder font-size-sm"
          :class="{disabled: taskStatus !=='COMPLETE' && taskStatus !== 'NOT'}"
          @click.prevent="onUploadFileClicked()"
        >
          <i class="menu-icon flaticon2-plus" style="font-size: 1em"></i>Ladda upp fil
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
              <th style="min-width: 110px">Namn</th>
              <th style="min-width: 110px">Datum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in files">
              <FileTableRow
                v-bind:key="i"
                :file="item"
                :type="type"
                :currentCompanyId="currentCompanyId"
                @downloadFileClicked="downloadFileClicked"
                @selectFileClicked="selectFileClicked"
                @deleteFileClicked="deleteFileClicked"
                @toastr="toastr"
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
import FileTableRow from '@/view/pages/ml/todowizard/FileTableRow.vue';

export default {
  name: 'shop_items-table',
  props: {
      files: Array,
      currentCompanyId: String,
      type: String,
      taskStatus: {type: String, default: 'COMPLETE'}
    },
  components: {
    FileTableRow
  },
  watch: {
    files(newValue, oldvalue) {
      console.log('files changed');
    }
  },
  mounted() {
    console.log('mounted filestable');
  },
  methods: {
    downloadFileClicked(file_id) {
      this.$emit('downloadFileClicked', file_id);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    selectFileClicked(file_id) {
      this.$emit('selectFileClicked', file_id);
    },
    deleteFileClicked(file_id) {
      this.$emit('deleteFileClicked', file_id);
    },
    onUploadFileClicked() {
      this.$emit('onUploadFileClicked');
    }
  },
  data() {
    return {
      list: []
    };
  }
};
</script>
