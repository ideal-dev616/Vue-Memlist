<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th style="min-width: 110px">Artikel</th>
              <th style="min-width: 110px">Antal</th>
              <th style="min-width: 110px">Summa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in cart">
              <ShopCartTableRow
                v-bind:key="i"
                :item="item"
                @deleteItemClicked="deleteItemClicked"
                @toastr="toastr"
              />
            </template>
            <tr>
                <td>
                <span class="text-dark-75 font-weight-bolder d-block font-size-lg"></span>
                </td>
                <td>
                <span class="text-dark-75 d-block font-size-lg">Total</span>
                </td>
                <td>
                <span class="text-dark-75 d-block font-size-lg">{{ total_price + total_vat }} kr</span>
                </td>
                <td class="text-right pr-0">
                
                </td>
            </tr>
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
import ShopCartTableRow from '@/view/pages/members/register/registerwizard/ShopCartTableRow.vue';

export default {
  name: 'shopcart-table',
  props: ['cart', 'total_price', 'total_vat'],
  components: {
    ShopCartTableRow
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    deleteItemClicked(shop_item_id) {
      this.$emit('deleteItemClicked', shop_item_id);
    }
  },
  data() {
    return {
      list: []
    };
  }
};
</script>

