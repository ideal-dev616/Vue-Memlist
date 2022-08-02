<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark pl-2">Medlemsavgiften avser följande perioder</span>
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
          <thead>
            <tr class="text-left">
              <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-75">Välj</span>
              </th>
              <th style="min-width: 110px">Namn</th>
              <th style="min-width: 110px">Period Från</th>
              <th style="min-width: 110px">Period Till</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in periods">
              <ShopItemPeriodsTableRow
                v-bind:key="i"
                :period="item"
                :currentCompanyId="currentCompanyId"
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
import ShopItemPeriodsTableRow from "@/view/content/widgets/advance-table/ShopItemPeriodsTableRow.vue";

export default {
  name: "shop_items-table",
  props: ["periods","currentCompanyId"],
  components: {
    ShopItemPeriodsTableRow,
  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      list: [

      ]
    };
  }
};
</script>
