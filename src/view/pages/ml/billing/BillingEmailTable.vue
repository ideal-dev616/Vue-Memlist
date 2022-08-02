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
        <table role="table" aria-busy="false" aria-colcount="5" class="table b-table">
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
                  E-post Grund
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class='pl-7'><p>10 000 st/år</p><p class="descr">Efter förbrukat saldo övergår prissättning till paketet E-post Utökad enligt nedan</p></td>
              <td>0 kr</td>
            </tr>

            <tr class="tr-grey">
              <td class='pl-7'>E-post Utökad</td>
              <td>Pris</td>
              <td></td>
            </tr>

            <tr v-for="(item, idx) in billing" :key="idx">
              <td class='pl-7'><p>{{item.from}}{{item.to > 999999 ? '+' : ' - ' + item.to}} st/mån</p></td>
              <td class='w-150px'>{{item.sek_per_month}} kr</td>
              <td class='w-150px'>
                <div class="d-flex justify-content-end">
                  <a
                    href="#"
                    class="btn btn-icon btn-light btn-sm mx-3"
                    @click="editItem(idx)"
                  >
                    <span class="svg-icon svg-icon-md svg-icon-primary">
                      <!--begin::Svg Icon-->
                      <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                      <!--end::Svg Icon-->
                    </span>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="editing">
          <hr>
          <b-form-group id="input-group-id" label="Price" label-for="input-id">
            <b-form-input
              id="input-id"
              v-model="currentPrice"
              type="number"
              required
            ></b-form-input>
          </b-form-group>

          <div class="d-flex justify-content-end">
            <b-button type="button" variant="primary" @click="cancelPrice" class="mr-2"
              >Avbryt</b-button
            >
            <b-button type="button" variant="primary" @click="savePrice">Spara</b-button>
          </div>
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
.descr {
  font-size: 11px;
}
.tr-grey {
  td {
    color: #3F4254;
    background-color: #F3F6F9;
    border-color: #EBEDF3;
    font-weight: 600;
    font-size: 1rem;
    border-bottom-width: 1px;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
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
    },
    editItem(index) {
      if (this.billing[index] != undefined) {
        this.currentIndex = index;
        this.currentPrice = this.billing[index].sek_per_month;
        this.editing = true;
      }
      console.log(this.currentPrice, "CurrentIndex");
    },
    deleteItem(index) {

    },
    savePrice() {
      this.editing = false;
      if (this.billing[this.currentIndex] != undefined) {
        this.billing[this.currentIndex].sek_per_month = this.currentPrice;
      }
    },
    cancelPrice() {
      this.editing = false;
    }
  },
  data() {
    return {
      editing: false,
      all_selected: false,
      currentPrice: 0,
      currentIndex: 0,
      list: [

      ]
    };
  }
};
</script>
