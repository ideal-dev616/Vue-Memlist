<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ item.name }}</span>
    </td>
    <td>
      <span class="text-dark-75 d-block font-size-lg">{{ item.quantity }}</span>
    </td>
    <td>
      <span class="text-dark-75 d-block font-size-lg">{{ item.price_sek + item.vat_sek }} kr</span>
    </td>
    <td class="text-right pr-0">
      
      <a v-if="!item.is_membership" href="#" class="btn btn-icon btn-light btn-sm" @click="deleteItemClicked($event, item.shop_item_id)">
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      
    </td>
  </tr>
</template>
<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'shopcart-table-row',
  props: ['item'],
  data() {
    return {
      
    };
  },
  mounted() {},
  watch: {},
  methods: {
    deleteItemClicked(e, shop_item_id) {
      e.preventDefault();
      this.$emit('deleteItemClicked', shop_item_id);
    }
  }
};
</script>
