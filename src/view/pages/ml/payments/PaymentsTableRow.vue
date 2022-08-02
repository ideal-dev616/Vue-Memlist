<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ shop_order.client.name }}</span>
    </td>
    <td>{{ shop_order.shop_order_id }}</td>
    <td>{{ shop_order.created_at }}</td>
    <td>{{ shop_order.total_sek }}</td>
    <td>{{ shop_order.total_vat_sek }}</td>
    <td>{{ shop_order.dintero_id !== null && shop_order.dintero_id !== undefined && shop_order.dintero_id.length > 8 ? 'OK' : '-' }}</td>
    <td>{{ shop_order.is_payed === 1 ? 'Betalat' : 'Ej betalat'  }}</td>
    <td>{{ shop_order.is_fully_captured === 1 ? 'Ja' : 'Nej' }}</td>
    <td class="text-right pr-0">
      
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
  name: 'payments-table-row',
  props: ['shop_order'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {

    };
  },
  watch: {
  },
  methods: {
    
  }
};
</script>
