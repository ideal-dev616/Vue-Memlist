<template>
  <div>
    <h2>Dintero plugin</h2>
    <div id="checkout-container"></div>
  </div>
</template>

<style lang="scss" scoped>

</style>
<script>

import dintero from "@dintero/checkout-web-sdk";

export default {
  name: 'dintero-vue-wrapper',
  props: ['order'],
  components: {},
  data() {
    return {
      
    };
  },
  mounted() {

    if (dintero === null || dintero === undefined) {
      console.error('dintero is null');
      return;
    }

    const container = document.getElementById("checkout-container");

    const checkout = dintero.embed({
        container,
        sid: this.order.dintero_id, //client-id??
        language: "no",
        onSession: (event) => {
            console.log("session", event.session);
        },
        onPayment: (event) => {
            console.log("transaction_id", event.transaction_id);
            console.log("href", event.href);
            checkout.destroy();
        },
        onPaymentError: (event) => {
            console.log("href", event.href);
            checkout.destroy();
        },
        onSessionCancel: (event) => {
            console.log("href", event.href);
            checkout.destroy();
        },
        onSessionLocked: (event, checkout) => {
            console.log("pay_lock_id", event.pay_lock_id);
        },
        onSessionLockFailed: (event, checkout) => {
            console.log("session lock failed");
        },
    });
  },
  watch: {

  },
  methods: {
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
  }
};
</script>
