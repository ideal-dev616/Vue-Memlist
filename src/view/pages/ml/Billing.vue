<template>
  <div class="px-5" id="page-billing">
    <h5 class="mb-6 ml-2">Kostnader</h5>

    <b-card
      title=""
      class="mb-2"
      hide="footer"
      v-if="!billing_active">
      <b-alert show variant="warning">Fakturering och kostnader är inte aktiverat för denna förening.</b-alert>
      <b-button variant="success" @click="activateBilling">Aktivera Fakturering</b-button>
    </b-card>

    <b-card
      title=""
      class="mb-2"
      hide-footer
      v-if="billing_active"
    >

        <v-tabs
            background-color="white"
            color="accent-4"
            right
        >
            <v-tab>Finansiell information</v-tab>
            <v-tab>SPAR</v-tab>
            <v-tab>SMS</v-tab>
            <v-tab>E-post</v-tab>
            <v-tab>Budget</v-tab>
            <v-tab>Prisinställning för underföreningar</v-tab>
            <v-tab>Historik</v-tab>
            <v-tab v-if="isTalongAdmin">Administration</v-tab>

            <v-tab-item>
              <BillingInvoiceTable
                :billing="billing"
                @toastr='toastr'
              />
            </v-tab-item>

            <v-tab-item>
              <BillingSPARTable
                :billing="billing.spar_pricing"
              />
            </v-tab-item>

            <v-tab-item>
              <BillingSMSTable
                :billing="billing"
              />
            </v-tab-item>

             <v-tab-item>
              <BillingEmailTable
                :billing="billing.email_pricing"
              />
            </v-tab-item>

            <v-tab-item>
              <form>
                <b-alert class="mt-8" show >Ställ in budgeten för SMS och SPAR. Ifall det inte finns någon budget kommer inte SMS eller SPAR att användas.</b-alert>

                <b-form-group id="sms_budget-group" label="SMS Budget" label-for="sms_budget">
                  <b-form-input
                    id="sms_budget"
                    v-model="form.sms_budget"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="spar_budget-group" label="SPAR Budget" label-for="spar_budget">
                  <b-form-input
                    id="spar_budget"
                    v-model="form.spar_budget"
                  ></b-form-input>
                </b-form-group>

                <div class="d-flex justify-content-end">
                  <b-button type="button" variant="primary" @click="savePrice">Spara</b-button>
                </div>
              </form>
            </v-tab-item>

            <v-tab-item>
              <BillingSubcompanyTable
                :billing="billing"
              />
            </v-tab-item>

            <v-tab-item>
              <BillingHistoryTable
                :billing="billing"
              />
            </v-tab-item>

            <v-tab-item v-if="isTalongAdmin">
              <b-card class="mt-8">
                <b-form  @submit="saveAdminData($event)">

                  <div class="d-flex align-items-center mb-6">
                    <label
                      class="checkbox checkbox-lg checkbox-outline checkbox-success"
                    >
                      <input
                        type="checkbox"
                        name=""
                        v-model="billing.use"
                        @click="billing.use = !billing.use"
                        :disabled="disabled"
                      />
                      <span></span>
                    </label>
                    <span class="ml-3 cursor-pointer"
                      >Aktivera kostnadsanvändning för förening</span
                    >
                  </div>
<!--
                  <b-form-group label="Fakturamottagare" label-for="recv">
                    <b-form-select id="recv" v-model="billing.recv">
                      <b-form-select-option
                        v-for="(p, i) in companies"
                        :key="`recv-${i}`"
                        :value="p.id"
                        :disabled="disabled"
                        >{{ p.name }}</b-form-select-option
                      >
                    </b-form-select>
                  </b-form-group>-->

                   <b-form-group id="input-group-system_cost" label="Systemkostnad per år" label-for="input-system_cost">
                    <b-form-input id="input-system_cost" v-model="form.system_cost" type="text"></b-form-input>
                  </b-form-group>

                  <b-form-group id="input-group-sms_sek_per_send" label="SMS SEK per skickat" label-for="input-sms_sek_per_send">
                    <b-form-input id="input-sms_sek_per_send" v-model="form.sms_sek_per_send" type="text"></b-form-input>
                  </b-form-group>

                  <b-form-group id="input-group-spar_sek_per_search" label="SPAR SEK per uppslag" label-for="input-spar_sek_per_search">
                    <b-form-input id="input-spar_sek_per_search" v-model="form.spar_sek_per_search" type="text"></b-form-input>
                  </b-form-group>

                  <b-form-group id="input-group-swish_pct" label="Swish % per transaktion" label-for="input-swish_pct">
                    <b-form-input id="input-swish_pct" v-model="form.swish_pct" type="text"></b-form-input>
                  </b-form-group>

                  <b-form-group id="input-group-swish_cost" label="Swish SEK per transaktion" label-for="input-swish_cost">
                    <b-form-input id="input-swish_cost" v-model="form.swish_cost" type="text"></b-form-input>
                  </b-form-group>

                  <b-form-group id="input-group-cc_pct" label="Kreditkort % per transaktion" label-for="input-cc_pct">
                    <b-form-input id="input-cc_pct" v-model="form.cc_pct" type="text"></b-form-input>
                  </b-form-group>

                  <b-form-group id="input-group-cc_cost" label="Kreditkort SEK per transaktion" label-for="input-cc_cost">
                    <b-form-input id="input-cc_cost" v-model="form.cc_cost" type="text"></b-form-input>
                  </b-form-group>

                  <b-button type="submit" variant="primary">Spara</b-button>
                </b-form>

              </b-card>
            </v-tab-item>

        </v-tabs>
    </b-card>

  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.alert.alert-info {
        color: #3F4254;
        background-color: #F3F6F9;
        border-color: #EBEDF3;
        font-weight: 600;
        font-size: 1rem;
        border-bottom-width: 1px;
        padding-top: 1rem;
        padding-bottom: 1rem;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import BillingInvoiceTable from '@/view/pages/ml/billing/BillingInvoiceTable.vue';
import BillingSPARTable from '@/view/pages/ml/billing/BillingSPARTable.vue';
import BillingSMSTable from '@/view/pages/ml/billing/BillingSMSTable.vue';
import BillingSubcompanyTable from '@/view/pages/ml/billing/BillingSubcompanyTable.vue';
import BillingEmailTable from '@/view/pages/ml/billing/BillingEmailTable.vue';
import moment from 'moment';


export default {
  name: 'billing',
  components: {
    BillingInvoiceTable,
    BillingSMSTable,
    BillingSPARTable,
    BillingSubcompanyTable,
    BillingEmailTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId', 'isTalongAdmin', 'companies'])
  },
  mounted() {
    this.loadBilling();
    this.loadCompany();

    if (this.isTalongAdmin) {
      this.disabled = false;
    }
    else {
      this.disabled = true;
    }
  },
  data() {
    return {
      disabled: false,
      billing: { use: false, recv: '' },
      form: {
        sms_budget: 0,
        spar_budget: 0,
        system_cost: 0,
        swish_cost: 0,
        swish_pct: 0,
        cc_cost: 0,
        cc_pct: 0,
        spar_sek_per_search: 0,
        sms_sek_per_send: 0,
      },
      billing_active: false,
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadCompany();
      }
    }
  },
  methods: {
    activateBilling() {
      // if we activate billing, we need to create a new billing

      var from_date = moment().startOf('month');
      var to_date = moment().endOf('month');

      axios
        .post('/billing', {
          company_id: this.currentCompanyId,
          period_id: this.currentPeriodId,
          from_date: from_date,
          to_date: to_date,
          is_active: 1,
          billing_company_id: this.currentCompanyId
        })
        .then(res => {
          this.billing_active = true;
          this.form = res.data.billing;

          this.billing = { use: true, recv: this.currentCompanyId };

          axios
            .put('/company', { company_id: this.currentCompanyId, billing: this.billing })
            .then(res => {
              this.toastr('success', 'OK', 'Föreningsinställningar uppdaterade');
            })
            .catch(err => {
              console.error(err);
              this.toastr('danger', 'Server Fel', 'Kunde inte spara föreningsdata');
            });
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa fakturering');
        });
    },

    saveAdminData(e) {
      e.preventDefault();

      axios
        .put('/company', { company_id: this.currentCompanyId, billing: this.billing })
        .then(res => {
          this.toastr('success', 'OK', 'Föreningsinställningar uppdaterade');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte spara föreningsdata');
        });

      this.form.company_id = this.currentCompanyId;
      this.form.period_id = this.currentPeriodId;

      axios
        .put('/billing', this.form )
        .then(res => {
          if (res.status === 200) {
            this.toastr('success', 'OK', 'Kostnader uppdaterade');
          }
          else {
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera kostnader');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte spara kostnader');
        });
    },
    loadCompany() {
      axios
        .get(`/company?company_id=${this.currentCompanyId}`)
        .then(res => {
          // this.billing = res.data.company.billing;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta föreningsdata');
        });
    },
    loadBilling() {
      console.log(this.billing, "bi");
      axios
        .get(`/billing/active?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.data.billing === null || res.data.billing === undefined) {
            this.toastr('danger', 'Saknas data', 'Fakturering är ej påslaget för denna förening');
            this.billing_active = false;
            return;
          }

          this.billing_active = true;
          this.billing = res.data.billing;
          this.form = res.data.billing;
          console.log(this.form, "billing");
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta kostnader');
        });
    },
    savePrice() {
      if (this.billing && this.billing.billing_id) {
        const billing_id = this.billing.billing_id;
        const spar_budget  = this.form.spar_budget;
        const sms_budget = this.form.sms_budget;
        axios
          .put(`/billing`, { billing_id, spar_budget, sms_budget })
          .then(res => {
            this.toastr('success', 'OK', 'Priset har sparats.');
          })
          .catch(err => {
            this.toastr('danger', 'Server Fel', 'Det gick inte att spara priset.');
          });
      }
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
