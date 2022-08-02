<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"></span>
      </h3>
      <div class="card-toolbar">
       <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createTitleClicked"
          ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny Titel</a>
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
                @deleteTitleClicked="deleteTitleClicked"
                @selectTitleClicked="selectTitleClicked"
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
import TitleTableRow from '@/view/pages/ml/system/TitleTableRow.vue';

export default {
  name: 'title-table',
  props: ['titles', 'currentCompanyId'],
  components: {
    TitleTableRow
  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    createTitleClicked() {
      this.$emit('createTitleClicked');
    },
    deleteTitleClicked(title) {
      this.$emit('deleteTitleClicked', title);
    },
    selectTitleClicked(title) {
      this.$emit('selectTitleClicked', title);
    }
  },
  data() {
    return {};
  }
};
</script>

