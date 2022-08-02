<template>
  <div class="px-5" id="page-shop_items">
    <h5 class="mb-6 ml-2">Betalningar</h5>

    <PaymentsTable
      :shop_orders="shop_orders"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    
  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}

</style>

<script>

import axios from 'axios';
import { mapGetters } from 'vuex';
import PaymentsTable from '@/view/pages/ml/payments/PaymentsTable.vue';

export default {
  name: 'shop_items',
  components: {
    PaymentsTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId']),
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      shop_orders: []
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadPayments(newValue);
      }
    },
  },
  methods: {
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.loadPayments(this.currentCompanyId);
    },
    loadPayments(company_id) {
      console.log('loading payments');
      axios 
        .get(`/shop_order/list?company_id=${company_id}`)
        .then(res => {
          this.shop_orders = res.data.orders;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte lista betalningar');
        });
    },
    scrollToEditOrder() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('scroll-to-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
