<template>
  <!--begin::Advance Table Widget 9-->
  <div>
    <!--begin::Header-->
    <div class="border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"></span>
      </h3>
      <div class="card-toolbar">

      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="pt-0 pb-3">
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
            :total-rows="books.length"
            :per-page="perPage"
            aria-controls="search-result-table"
          ></b-pagination>
        </div>
      </div>
      <!--begin::Table-->
      <div class="table-responsive">
        <b-table
          id="search-result-table"
          class="mt-3 cursor mh-100"
          :filter="filters"
          :items="books"
          :fields="headers"
          :per-page="perPage"
          :current-page="currentPage"
          head-variant="light"
          sticky-header
        >
          <template #head(selected)='row'>
            <div class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
              <input type="checkbox" name="" v-model="all_selected"  @click="all_selected = !all_selected" />
              <span></span>
              </label>
              <span class="ml-3 cursor-pointer"></span>
            </div>
          </template>
          <template #cell(selected)='row'>
            <div class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
              <input type="checkbox" name="" v-model="row.item.selected"  @click="row.item.selected = !row.item.selected" />
              <span></span>
              </label>
              <span class="ml-3 cursor-pointer"></span>
            </div>
          </template>
        </b-table>
        <!-- <table id="stickprov-table" role="table" aria-busy="false" aria-colcount="5" class="table b-table">
          <thead role="rowgroup" class="thead-light">
            <tr class="text-left" style=' border-radius: 1px; border-collapse: collapse; border-top-width: 1px;'>
              <th
                role="columnheader"
                scope="col"
                tabindex="0"
                aria-colindex="4"
              >
                <span class="">
                    <div class="d-flex align-items-center" style="max-height: 40px;">
                        <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                        <input type="checkbox" name="" v-model="all_selected"  @click="all_selected = !all_selected" />
                        <span></span>
                        </label>
                        <span class="ml-3 cursor-pointer"></span>
                    </div>
                </span>
              </th>
              <th
                role="columnheader"
                scope="col"
                tabindex="0"
                aria-colindex="4"
                style="min-width: 110px"
              >
                <div>ID</div>
              </th>
              <th
                role="columnheader"
                scope="col"
                tabindex="0"
                aria-colindex="4"
                style="min-width: 110px"
              >
                <div>Ext ID</div>
              </th>
              <th
                role="columnheader"
                scope="col"
                tabindex="0"
                aria-colindex="4"
                style="min-width: 110px"
              >
                <div>Datum</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in books">
              <BookTableRow
                v-bind:key="i"
                :book="item"
                :currentCompanyId="currentCompanyId"
                @toastr="toastr"
                />
            </template>
          </tbody>
        </table> -->
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
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import BookTableRow from "@/view/pages/ml/book/BookTableRow.vue";

export default {
  name: "book-table",
  props: {
    books:{
      type: Array,
      default:[]
    },
    currentCompanyId: {
      type: String,
      default: ''
    }
  },
  components: {
    vSelect,
    BookTableRow,
  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      all_selected: false,
      filters: '',
      perPage: 20,
      currentPage: 1,
      headers: [
        {
          key: 'selected',
          label: '',
          thClass: 'pl-7 align-middle w-60px',
          tdClass: 'pl-7 align-middle'
        },
        {
          key: 'book_id',
          label: 'ID',
          sortable: true,
          thClass: 'w-110px align-middle',
          tdClass: 'align-middle',
        },
        {
          key: 'external_id',
          label: 'Ext ID',
          thClass: 'w-110px align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'created_at',
          label: 'Datum',
          thClass: 'w-160px align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'created_a',
          label: '',
        },
      ],
      list: [

      ]
    };
  }
};
</script>
