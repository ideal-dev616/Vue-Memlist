<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5 ml-2">
      <h3 class="card-title align-items-start flex-column">
        <!-- <span class="card-label font-weight-bolder text-dark">Alla artiklar</span> -->
      </h3>
      <div class="card-toolbar">
      <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createShopItemClicked"
          ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny Artikel</a
        >
      </div>
    </div>

    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3 table-responsive">
      <div class="d-flex justify-content-between">
        <div>
          <b-select v-model="perPage" :options="options"></b-select>
        </div>
        <b-pagination
          class="ml-auto"
          v-model="currentPage"
          :total-rows="items.length"
          :per-page="perPage"
          aria-controls="shopitem-table"
          first-number
          last-number
        ></b-pagination>
      </div>
      <b-table
        id="shopitem-table"
        class="mt-3 cursor mh-100"
        :filter="filter"
        :items="items"
        :fields="showFields"
        :per-page="perPage"
        :current-page="currentPage"
        head-variant="light"
        sticky-header
      >
        <template #cell(name)="data">
          <div :title='data.item.name' class='d-none d-sm-block'>
            {{ data.item.name }}
          </div>
          <div :title='data.item.name' class='d-block d-sm-none'>
            {{ maxLengthOfCell(data.item.name, 14) }}
          </div>
        </template>
        <template #cell(actions)="data">
          <div class='d-flex justify-content-end'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click.prevent="selectShopItemClicked(data.item.shop_item_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mr-4"
              @click="deleteShopItemClicked(data.item.shop_item_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
          </div>
        </template>
      </b-table>
      <!--begin::Table-->
      <!-- <div class="table-responsive">
        <table
          class="table table-head-custom table-vertical-center table-head-bg table-borderless"
        >
          <thead>
            <tr class="text-left">
              <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-75">Artikel</span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in items">
              <ShopItemTableRow
                v-bind:key="i"
                :shop_item="item"
                :currentCompanyId="currentCompanyId"
                @selectShopItemClicked="selectShopItemClicked"
                @deleteShopItemClicked="deleteShopItemClicked"
                @toastr="toastr"
                />
            </template>
          </tbody>
        </table>
      </div> -->
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
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import ShopItemTableRow from "@/view/content/widgets/advance-table/ShopItemTableRow.vue";

export default {
  name: "shop_items-table",
  props: ["items","currentCompanyId"],
  components: {
    ShopItemTableRow,
    vSelect
  },
  methods: {
    createShopItemClicked() {
      this.$emit('createShopItemClicked');
    },
    selectShopItemClicked(shop_item_id) {
      this.$emit('selectShopItemClicked', shop_item_id);
    },
    deleteShopItemClicked(shop_item_id) {
      this.$emit('deleteShopItemClicked', shop_item_id);
    },
    maxLengthOfCell(str, length) {
      return str.length > length ? str.substring(0, length) + '...' : str;
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      perPage: 25,
      currentPage: 1,
      options: [25, 50, 100],
      showFields: [
        { key: 'name', label: 'ARTIKEL', show: true, sortable: true, thClass: 'pl-7 w-100', tdClass: 'pl-7'},
        { key: 'actions', label: '', show: true, sortable: false}
      ],
      filter: '',
      list: [

      ]
    };
  }
};
</script>
