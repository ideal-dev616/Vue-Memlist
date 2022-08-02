<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="py-3">
      <!-- <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark pl-2">Alla filer inom perioden</span>
      </h3>
      <div class="card-toolbar">

      </div> -->
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-header border-0 py-5 m-1">
      <div>
        <b-select v-model="perPage" :options="options"></b-select>
      </div>
      <b-pagination
        class="ml-auto mb-0 align-middle"
        v-model="currentPage"
        :total-rows="items.length"
        :per-page="perPage"
        aria-controls="advance-file-table"
        first-number
        last-number
      ></b-pagination>
    </div>
    <!--begin::Table-->

    <div class="card-body pt-0 table-responsive">
      <b-table
        id="advance-file-table"
        :fields="headers"
        :items="items"
        :per-page="perPage"
        :current-page="currentPage"
        head-variant="light"
        sticky-header
        class="mh-100"
      >
        <template #cell(created_at)='row'>
          <div style='min-width: 150px'> {{row.item.created_at}} </div>
        </template>
        <template #cell(file_id)="row">
          <div class='justify-content-end d-flex'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="downloadFileClicked(row.item.file_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/download-solid.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mr-3"
              @click="selectFileClicked(row.item.file_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm"
              @click="deleteFileClicked(row.item.file_id)"
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
  name: "files-table",
  props: ["items","currentCompanyId"],
  components: {
  },
  methods: {
    createFileClicked() {
      this.$emit('createFileClicked');
    },
    downloadFileClicked(file_id) {
      this.$emit('downloadFileClicked', file_id);
    },
    selectFileClicked(file_id) {
      this.$emit('selectFileClicked', file_id);
    },
    deleteFileClicked(file_id) {
      this.$emit('deleteFileClicked', file_id);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      currentPage: 1,
      perPage: 25,
      options: [
        25, 50, 100
      ],
      headers: [
        {
          key: 'name',
          label: 'Filnamn',
          sortable: true,
          thClass: 'pl-7',
          tdClass: 'pl-7',
        },
        {
          key: 'created_at',
          label: 'Datum',
          sortable: true,
          thClass: 'w-150px',
        },
        {
          key: 'file_id',
          label: 'Hantera',
          thClass: 'w-150px text-right pr-22',
        },
      ],
      list: [

      ]
    };
  }
};
</script>
