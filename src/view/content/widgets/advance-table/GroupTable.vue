<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column pl-2">
        <!-- <span class="card-label font-weight-bolder text-dark">Alla Kategorier</span> -->
      </h3>
      <div class="card-toolbar">
        <a href="#" class="btn btn-primary font-weight-bolder font-size-sm mr-1" @click="createGroupClicked"
            ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny attribut</a
          >
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 table-responsive">
      <b-table
        id="stickprov-table"
        :fields="headers"
        :items="items"
        head-variant="light"
        class='w-100 mh-100'
        sticky-header
      >
        <template #cell(action)='row'>
          <div class='d-flex justify-content-end'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="selectGroupClicked(row.item.group_id)"
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
              @click="deleteGroupClicked(row.item.group_id)"
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
    </div>

    <div class="card-body pt-0 pb-3">

      <!--begin::Table-->
      <!-- <div class="table-responsive">
        <table
          class="table table-head-custom table-vertical-center table-head-bg table-borderless"
        >
          <thead>
            <tr class="text-left">
              <th style="min-width: 40px" class='pl-7'>
                <span class="text-dark-75">Kategori</span>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in items">
              <GroupTableRow
                v-bind:key="i"
                :group="item"
                :currentCompanyId="currentCompanyId"
                @selectGroupClicked="selectGroupClicked"
                @deleteGroupClicked="deleteGroupClicked"
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
import GroupTableRow from "@/view/content/widgets/advance-table/GroupTableRow.vue";

export default {
  name: "groups-table",
  props: ["items","currentCompanyId"],
  components: {
    GroupTableRow,
  },
  methods: {
    createGroupClicked() {
      this.$emit('createGroupClicked');
    },
    selectGroupClicked(group_id) {
      this.$emit('selectGroupClicked', group_id);
    },
    deleteGroupClicked(group_id) {
      this.$emit('deleteGroupClicked', group_id);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      headers: [
        {
          key: 'name',
          label: 'Kategori',
          sortable: true,
          thClass: 'pl-7 w-100',
          tdClass: 'pl-7 align-middle'
        },
        {
          key: 'action',
          label: '',
          thClass: 'w-110px',
          tdClass: 'align-middle'
        },
      ],
      list: [

      ]
    };
  }
};
</script>
