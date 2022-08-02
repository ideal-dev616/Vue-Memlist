<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b scroll-to-container">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark pl-2">Fel</span>
      </h3>
      <div class="card-toolbar">

      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <div class="table-responsive">
        <!-- <table
          class="table table-vertical-center table-head-bg table-borderless"
        > -->
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
                <div>Fel</div>
              </th>
              <th
                role="columnheader"
                scope="col"
                tabindex="0"
                aria-colindex="4"
                class="w-110px text-right pr-7"
              >
                <div>Hantera</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr class="tr-black" v-bind:key='i' v-for="(field, i) in ErrorDetailFields">
              <td>{{ field.title }}</td>
              <td></td>
              <td></td>
              <template v-for="(item, i) in getItemsWithType(field.key)">
                <ErrorDetailTableRow
                  v-bind:key="i"
                  :error="item"
                  :currentCompanyId="currentCompanyId"
                  @toastr="toastr"
                  />
              </template>
            </tr> -->

            <tr class="tr-black">
              <td class='pl-7'>Föreningsinställningar</td>
              <td></td>
              <td></td>
            </tr>
            <div class='p-3 pl-7' v-if='getItemsWithType("company").length == 0'> Inga fel hittades </div>
            <template v-for="(item, i) in getItemsWithType('company')">
              <ErrorDetailTableRow
                v-bind:key="i + '_company'"
                :error="item"
                :currentCompanyId="currentCompanyId"
                @toastr="toastr"
                />
            </template>

            <tr class="tr-black">
              <td class="white--text pl-7">Användare</td>
              <td></td>
              <td></td>
            </tr>
            <div class='p-3 pl-7' v-if='getItemsWithType("user").length == 0'> Inga fel hittades </div>
            <template v-for="(item, i) in getItemsWithType('user')">
              <ErrorDetailTableRow
                      v-bind:key="i + '_user'"
                      :error="item"
                      :currentCompanyId="currentCompanyId"
                      @toastr="toastr"
              />
            </template>

            <tr class="tr-black">
              <td class='pl-7'>Medlemmar</td>
              <td></td>
              <td></td>
            </tr>
            <div class='pb-2' v-if='items.length == 0'> </div>
            <template v-for="(item, i) in getItemsWithType('client')">
              <ErrorDetailTableRow
                      v-bind:key="i + 'client'"
                      :error="item"
                      :currentCompanyId="currentCompanyId"
                      @toastr="toastr"
              />
            </template>
            <div class='p-3  pl-7' v-if='getItemsWithType("client").length == 0'> Inga fel hittades </div>
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
.tr-black {
  background-color: #4F5264;
  color: white;
}

</style>
<script>
import axios from 'axios';
import ErrorDetailTableRow from "@/view/pages/ml/errors/ErrorDetailTableRow.vue";

export default {
  name: "errors-table",
  props: ["items","currentCompanyId"],
  components: {
    ErrorDetailTableRow,
  },
  methods: {
    getItemsWithType(type) {
      return this.items.filter(item => item.type == type);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      ErrorDetailFields: [
        {title: 'Föreningsinställningar', key: 'company'},
        {title: 'Användare', key: 'user'},
        {title: 'Medlemmar', key: 'client'}
      ],
      list: [

      ]
    };
  },
  watch: {
    items(newVal, oldVal){
      console.log(newVal)
    }
  }
};
</script>
