<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg pl-4">{{ shop_item.name }}</span>
    </td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectShopItemClicked(shop_item.shop_item_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mr-7"
        @click="deleteShopItemClicked(shop_item.shop_item_id)"
      >
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
import { mapGetters } from 'vuex';

export default {
  name: 'shop_items-table-row',
  props: ['shop_item'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {

    };
  },
  mounted() {
    if (this.shop_item.name.length > 63) {
      this.shop_item.name = this.shop_item.name.substr(0, 64) + '...';
    }
  },
  watch: {

  },
  methods: {
    selectShopItemClicked(shop_item_id) {
      this.$emit('selectShopItemClicked', shop_item_id);
    },
    deleteShopItemClicked(shop_item_id) {
      this.$emit('deleteShopItemClicked', shop_item_id);
    },
  }
};
</script>
