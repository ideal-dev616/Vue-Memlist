<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"></span>
      </h3>
      
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th>Titel</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in titles">
              <TitleTableRow
                v-bind:key="i"
                :title="item"
                :currentCompanyId="currentCompanyId"
                @setIncludeTitle="setIncludeTitle"
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
import TitleTableRow from '@/view/pages/ml/settings/titles/TitleTableRow.vue';

export default {
  name: 'title-table',
  props: ['titles', 'currentCompanyId'],
  components: {
    TitleTableRow
  },
  methods: {
    setIncludeTitle(id, include) {
      this.$emit('setIncludeTitle', id, include);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
  },
  data() {
    return {};
  }
};
</script>

