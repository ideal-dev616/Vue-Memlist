<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"></span>
      </h3>
      <div class="card-toolbar">

      </div>
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
            <tr><td class='pl-7'>SEK/Uppslag</td><td>{{ billing.sms_sek_per_send }}</td></tr>
            <tr><td class='pl-7'>Antal uppslag</td><td>{{ billing.sms_num_sent }}</td></tr>
            <tr><td class='pl-7'>Kostnad</td><td>{{ billing.sms_budget_spent }}</td></tr>
            <tr><td class='pl-7'>Fakturadatum</td><td>{{ billing.to_period }}</td></tr>
          </tbody>
        </table>
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
  name: "sms-table",
  props: ["billing","currentCompanyId"],
  components: {

  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      all_selected: false,
      list: [

      ]
    };
  }
};
</script>
