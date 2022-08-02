<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"></span>
      </h3>
      <div class="card-toolbar"></div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <div class="table-responsive">
        <table id="stickprov-table" role="table" aria-busy="false" aria-colcount="5" class="table b-table">
          <thead role="rowgroup" class="thead-light">
            <tr class="text-left" style=' border-radius: 1px; border-collapse: collapse; border-top-width: 1px;'>
              <th
                role="columnheader"
                scope="col"
                tabindex="0"
                aria-colindex="4"
                class="pl-7"
              >
                <div>
                  Namn
                </div>
              </th>
              <!-- <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-100">Namn</span>
              </th> -->
              <th
                role="columnheader"
                scope="col"
                tabindex="0"
                aria-colindex="4"
              >
                <div>Pris</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class='pl-7'>Kostnad för SPAR</td>
              <td>
                <input type='number' v-model="billing.spar_budget">
              </td>
            </tr>
            <tr>
              <td class='pl-7'>Kostnad för SMS</td>
              <td>
                <input type='number' v-model="billing.sms_budget">
              </td>
            </tr>
            <tr>
              <td class='pl-7'>Systemkostnad</td>
              <td>{{ billing.system_cost }}</td>
            </tr>
            <tr>
              <td class='pl-7'>Betala Senast</td>
              <td>{{ billing.to_period }}</td>
            </tr>
            <tr>
              <td class='pl-7'>Faktura PDF</td>
              <td></td>
            </tr>
            <tr>
              <td class='pl-7'>Betala direkt</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div class="d-flex justify-content-start">
          <b-button class="ml-3" type="button" variant="primary" @click="savePrice">Spara</b-button>
        </div>
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

export default {
  name: 'invoice-table',
  props: ['billing', 'currentCompanyId'],
  components: {},
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    savePrice() {
      const billing_id = this.billing.billing_id;
      const spar_budget  = this.billing.spar_budget;
      const sms_budget = this.billing.sms_budget;
      axios
        .put(`/billing`, { billing_id, spar_budget, sms_budget })
        .then(res => {
          this.toastr('success', 'OK', 'Priset har sparats.');
        })
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Det gick inte att spara priset.');
        });
    },
  },
  data() {
    return {
      editing_sms_price: false,
      editing_spar_price: false,
      columns: [
        {
          label: 'Name',
          field: 'name'
        },
        {
          label: 'Position',
          field: 'position'
        }
      ],
      all_selected: false,
      list: []
    };
  }
};
</script>
