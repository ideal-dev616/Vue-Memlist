<template>
  <div>
    
    <b-alert
        v-if="error === 'invalid_link'"
        variant="danger"
        fade
        >Denna länk är felaktig</b-alert>
    <b-alert
        v-if="error === 'get_orders'"
        variant="danger"
        fade
        >Fel uppstod när din beställning skulle hämtas</b-alert>

    <b-alert
        v-if="error === 'no_orders'"
        variant="danger"
        fade
        >Du har inga väntande betalningar</b-alert>

    <b-card v-if="paymentSuccess" align="center" class="mx-auto mt-12" style="max-width: 800px;">
      <div class="row">
            <div class="col-12 text-center">
                <i class="fa fa-check-circle" style="font-size: 42px; color: #8dda8d;"></i>
            </div>
        </div>
        <div class="row" style="margin-top: 15px; border-top: 1px solid #ebedf2; padding-top: 20px;">
            <div class="col-12 text-center">
                <h4 class="event-name" style="text-align: center;">Tack</h4><br>
                <p>Ditt medlemskap är betalat och du är nu registrerad som medlem</p>
            </div>
        </div>
    </b-card>

    <div v-if="!paymentSuccess" class="mt-12" id="checkout-container"></div>
  </div>
</template>

<style lang="scss" scoped>

</style>
<script>

import dintero from "@dintero/checkout-web-sdk";
import axios from 'axios';

export default {
  name: 'dintero-vue-wrapper',
  props: [],
  components: {},
  data() {
    return {
      error: '',
      proceed: false,
      client_id: null,
      order: null,
      paymentSuccess: false
    };
  },
  mounted() {

    this.client_id = this.$route.params.client_id;

    if (!this.client_id) {
      this.error = 'invalid_link';

      return;
    }

    if (dintero === null || dintero === undefined) {
      console.error('dintero is null');
      return;
    }

    this.getOrdersForClient();
  },
  watch: {

  },
  methods: {
    startDintero() {
      const container = document.getElementById("checkout-container");

      console.log(this.order);

      const checkout = dintero.embed({
        container,
        sid: this.order.dintero_id, //client-id??
        language: "sv",
        onSession: (event) => {
            console.log("session", event.session);
        },
        onPayment: (event) => {
            this.paymentSuccess = true;

            console.log("transaction_id", event.transaction_id);
            console.log("href", event.href);
            
            try {
              checkout.destroy();
            }
            catch (err) {
              console.error('checkout destroy error: ', err);
            }
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
    getOrdersForClient() {
      axios 
        .get(`/shop_order/pending?client_id=${this.client_id}`)
        .then(res => {
          if (res.status === 200) {
            if (res.data === null || res.data.length === 0) {
              this.error = 'no_orders';
            }
            else {
              this.order = res.data[0];

              this.proceed = true;

              this.startDintero();
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.error = 'get_orders';
        });
    },

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
