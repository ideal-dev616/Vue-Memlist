<template>
  <b-card>
    <b-alert v-if="showError" show variant="danger">Betalningen misslyckades</b-alert>
    <b-alert v-if="showSuccess" show variant="success">Betalningen lyckades</b-alert>
  </b-card>
</template>

<style lang="scss" scoped>

</style>

<script>

export default {
  name: 'payment-accept',
  data() {
    return {
      showError: false,
      showSuccess: false,
      merchant_reference: null,
      shop_order_id: null
    };
  },
  mounted() {
    //this.$route.params.company_id
    console.log('PaymentAccept');

    var error = this.$route.query.error;
    var merchant_reference = this.$route.query.merchant_reference;

    console.log('merchant_reference: ' + merchant_reference);
    console.log('error: ' + error);

    var shop_order_id = merchant_reference.substr('order-'.length);

    if (error) {
      this.paymentError(shop_order_id, merchant_reference, error);
    }
    else {
      this.paymentAccepted(shop_order_id, merchant_reference);
    }
  },
  methods: {
    paymentAccepted(shop_order_id, merchant_reference) { // when payment was OK
      this.shop_order_id = shop_order_id;
      this.merchant_reference = merchant_reference;
      
      this.checkPayment(this.shop_order_id, this.merchant_reference, function(success){
        if (success) {
          this.showSuccess = true;
        }
        else {
          this.showError = true;
        }
      });

      // check that the payment was OK
    },
    paymentError(shop_order_id, merchant_reference, reason) { // when payment has error
      this.shop_order_id = shop_order_id;
      this.merchant_reference = merchant_reference;
      
      this.showError = true;
      // reason can be "cancelled"
    },
    checkPayment(shop_order_id, merchant_reference, callback) {
      axios 
        .get(`/shop_order/status?shop_order_id=${shop_order_id}&merchant_reference=${merchant_reference}`)
        .then(res => {
          callback(res.data.status === 'AUTHORIZED');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte bekräfta betalning');
          callback(false);
        });
    },
    getOrder(shop_order_id) {
      axios 
        .get(`/shop_order?shop_order_id=${shop_order_id}`)
        .then(res => {

        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte hämta order');
        });
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type,
      })
    }
  },
  computed: {
    
  }
};
</script>
