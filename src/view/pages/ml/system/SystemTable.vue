<template>
  
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"></span>
      </h3>
      <div class="card-toolbar">

      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">

      <!--begin::Table-->
      <div class="table-responsive">
        <table
          class="table table-head-custom table-vertical-center table-head-bg table-borderless"
        >
          <tbody>
            <tr style="background-color: black; color: white;">
                <td>{{ title }}</td>
                <td></td>
                <td></td>
            </tr>
            <template v-for="(item, i) in items">
                <SystemTableRow 
                  v-bind:key="i"
                  :item="item"
                  :templateOptions="templateOptions"
                  @templateUpdated="templateUpdated"
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
.descr {
  font-size: 11px;
}
</style>
<script>
import axios from 'axios';
import SystemTableRow from '@/view/pages/ml/system/SystemTableRow.vue';

export default {
  name: "systems-table",
  props: ["templateOptions","items","title"],
  components: {
    SystemTableRow
  },
  watch: {
    
  },
  mounted() {
    
  },
  methods: {
    templateUpdated(id, template_id) {
      this.$emit('templateUpdated', id, template_id);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
  },
  data() {
    return {
      
    };
  }
};
</script>
