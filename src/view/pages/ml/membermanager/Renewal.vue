<template>
  <b-card class="mt-8 mb-8">
    <h5 class="mt-4 mb-8">Förnya medlemskap</h5>

    <Confirm
        ref="confirm"
        title="Bekräfta förnyelse"
        message="Är du säker på att du vill skicka ut förnyelselänkar till alla medlemmar i urvalstabellen?"
        @confirm="confirm"
        @cancel="cancel"
    />

    <b-row>
    <b-col lg="12">
        <p>
        Medlemmar i tabellen kommer att få epost och/eller SMS skickade till sig med
        information och länkar om hur man som medlem förnyar sitt medlemsskap. Medlemmarna
        måste klicka på länken och sedan bekräfta sitt medlemskap på sidan.
        </p>
    </b-col>
    </b-row>
    <b-row class="mb-4 mt-8">
    <b-col lg="12">
        <h5>Välj utskicksmetoder</h5>
    </b-col>
    </b-row>
    <b-row>
    <b-form-group class="col-6">
        <div class="d-flex align-items-center">
        <label
            class="checkbox checkbox-lg checkbox-outline checkbox-success"
        >
            <input type="checkbox" name="" v-model="renew.sms" />
            <span></span>
        </label>
        <span class="ml-3 cursor-pointer" @click="renew.sms = !renew.sms"
            >Skicka via SMS</span
        >
        </div>
    </b-form-group>
    </b-row>

    <b-row>
    <b-form-group class="col-6">
        <div class="d-flex align-items-center">
        <label
            class="checkbox checkbox-lg checkbox-outline checkbox-success"
        >
            <input type="checkbox" name="" v-model="renew.email" />
            <span></span>
        </label>
        <span class="ml-3 cursor-pointer" @click="renew.email = !renew.email"
            >Skicka via E-post</span
        >
        </div>
    </b-form-group>
    </b-row>

    <b-row>
    <b-col lg="12">
        <b-form-group id="period_id-group" label="Förnya till period" label-for="period_id">
        <b-form-select
            id="period_id"
            v-model="renew.period_id"
            :options="periods"
            text-field="name"
            value-field="id"
            disabled
        ></b-form-select>
        </b-form-group>
    </b-col>
    </b-row>

    <b-row>
    <b-col lg="12">
        <b-alert show variant="danger"
        >Medlemmar i sökresultatet kommer att få en förnyelselänk skickad till sig när du klickar på "Bekräfta Förnyelse"</b-alert
        >
    </b-col>
    </b-row>

    <b-row>
    <div class="col-12">
        <div class="d-flex justify-content-end">
        <b-button variant="success" size="sm" @click="onRenew" :disabled='!renew.sms && !renew.email'>Bekräfta Förnyelse</b-button>
        </div>
    </div>
    </b-row>
</b-card>
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import Confirm from '@/view/components/Confirm.vue';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: "renwal-page",
  props: ["clients"],
  components: {
    Confirm
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'periods'])
  },
  watch: {
    currentPeriodId(newValue, oldValue) {
      if (newValue) {
        this.renew.period_id = newValue;
      }
    }
  },
  mounted() {
    this.renew.period_id = this.currentPeriodId;

    if (this.periods.length != undefined && this.periods.length > 0) {
      for (var i = 0; i < this.periods.length; ++i) {
        if (this.periods[i].from <= moment().format('YYYY-MM-DD') && this.periods[i].to >= moment().format('YYYY-MM-DD')) {
          this.renew.period_id = this.periods[i].id;
          break;
        }
      }
    }

  },
  methods: {
    confirm() {
      this.createRenewal();
    },
    cancel() {},
    onRenew() {
      this.$refs['confirm'].show();
    },
    createRenewal() {
      var client_ids = [];

      for (var i = 0; i < this.clients.length; ++i) {
        client_ids.push(this.clients[i].client_id);
      }

      axios.post(`/client/sendrenews`, { client_ids: client_ids, renew_sms: this.renew.sms, renew_email: this.renew.email })
        .then(res => {
          this.toastr('success', 'OK', 'Förnyelselänkar har skickats till medlemmarna')
        })
        .catch(err => {
          this.toastr('danger', 'Fel', 'Kunde inte skicka förnyelse');
        });
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      renew: {
        sms: false,
        email: true,
        period_id: ''
      },
    };
  }
};
</script>
