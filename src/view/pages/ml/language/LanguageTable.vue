<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <!-- <span class="card-label font-weight-bolder text-dark">Översättningar</span> -->
      </h3>
      <div class="card-toolbar">
        <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createLangRecordClicked"
          ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny Översättning</a
        >
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <div class='d-md-flex justify-content-between align-items-center mb-4'>
        <div class='w-100 mr-md-10 mb-md-0 mb-4'>
          <b-form-input
              id="filter-input"
              v-model="filters"
              type="search"
              placeholder="Sök översättning"
          ></b-form-input>
        </div>
        <div class='d-sm-flex justify-content-end align-items-center'>
          <v-select
            class='mr-sm-2 my-2 mx-0'
            style='width: 200px'
            v-model="perPage"
            :options="[25, 50, 100]"
            :clearable="false"
            :searchable="false"
          ></v-select>
          <b-pagination
            class="ml-auto mb-0"
            v-model="currentPage"
            :total-rows="items.length"
            :per-page="perPage"
            aria-controls="search-result-table"
          ></b-pagination>
        </div>
      </div>

      <!--begin::Table-->
      <b-table
        id="search-result-table"
        class="mt-3 cursor mh-100"
        :filter="filters"
        :items="items"
        :fields="headers"
        :per-page="perPage"
        :current-page="currentPage"
        head-variant="light"
        sticky-header
      >
        <template #cell(lang_record_id)="data">
          <div :title='data.item.lang_record_id' class='d-none d-sm-block'>
            {{ data.item.lang_record_id }}
          </div>
          <div :title='data.item.lang_record_id' class='d-block d-sm-none'>
            {{ maxLengthOfCell(data.item.lang_record_id, 10) }}
          </div>
        </template>
        <template #cell(actions)="data">
          <div class='d-flex justify-content-end'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click.prevent="selectLangRecordClicked(data.item.lang_record_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a href="#" class="btn btn-icon btn-light btn-sm" @click.prevent="deleteCompanyClicked(data.item.lang_record_id)">
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
          </div>
        </template>
      </b-table>

      <!-- <div class="table-responsive">
        <table
          class="table table-head-custom table-vertical-center table-head-bg table-borderless"
        >
          <thead>
            <tr class="text-left">
              <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-75">Översättning</span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in items">
              <LanguageTableRow
                v-bind:key="i"
                :lang_record="item"
                :currentCompanyId="currentCompanyId"
                @selectLangRecordClicked="selectLangRecordClicked"
                @deleteLangRecordClicked="deleteLangRecordClicked"
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
// import LanguageTableRow from "@/view/pages/ml/language/LanguageTableRow.vue";

export default {
  name: "lang_records-table",
  props: ["items","currentCompanyId"],
  components: {
    // LanguageTableRow,
    vSelect
  },
  methods: {
    createLangRecordClicked() {
      this.$emit('createLangRecordClicked');
    },
    selectLangRecordClicked(lang_record_id) {
      this.$emit('selectLangRecordClicked', lang_record_id);
    },
    deleteLangRecordClicked(lang_record_id) {
      this.$emit('deleteLangRecordClicked', lang_record_id);
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
      headers: [
        { key: 'lang_record_id', label: 'Översättning', show: true, sortable: true, thClass: 'pl-7 w-100', tdClass: 'pl-7'},
        { key: 'actions', label: '', show: true, sortable: false}
      ],
      filters: '',
      perPage: 20,
      currentPage: 1,
      list: [

      ]
    };
  }
};
</script>
