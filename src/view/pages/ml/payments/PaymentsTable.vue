<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">&nbsp;</span>
      </h3>
      <div class="card-toolbar">

            <div class="d-flex align-items-center mr-12 mb-8">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
              <input type="checkbox" name="" v-model="show_history" @click="show_history = !show_history" />
              <span></span>
            </label>
            <span class="ml-3 cursor-pointer">Visa alla betalningar</span>
          </div>

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
              <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-75">Medlem</span>
              </th>
              <th>Referens</th>
              <th>Datum</th>
              <th>Summa</th>
              <th>Moms</th>
              <th>Dintero</th>
              <th>Bet. Status</th>
              <th>Överfört</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(shop_order, i) in shop_orders">
              <PaymentsTableRow
                v-bind:key="i"
                :shop_order="shop_order"
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
import PaymentsTableRow from '@/view/pages/ml/payments/PaymentsTableRow.vue';

export default {
  name: 'payments-table',
  props: ['shop_orders', 'currentCompanyId'],
  components: {
    PaymentsTableRow
  },
  watch: {
    show_history(newcheck, oldcheck) {
      this.$emit('showHistoryToggled', newcheck);
    }
  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      show_history: false,
      list: []
    };
  }
};
</script>
