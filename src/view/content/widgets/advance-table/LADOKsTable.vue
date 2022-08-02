<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <!-- <span class="card-label font-weight-bolder text-dark">Alla LADOK körningar</span> -->
      </h3>
      <div class="d-flex">
        <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createLadokClicked">
            <i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny LADOK körning
        </a>
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
        sticky-header
        class="mh-100"
      >
        <template #cell(status)="row">
          {{getStatus(row.item.status)}}
        </template>

        <template #cell(action)="row">
          <div class='justify-content-end d-flex'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="selectLadokClicked(row.item.ladok_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm"
              @click="deleteLadokClicked(row.item.ladok_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
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
              <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-75">ID</span>
              </th>
              <th style="min-width: 110px">Datum</th>
              <th style="min-width: 110px">Status</th>
              <th style="min-width: 101px">Medl. Totalt</th>
              <th style="min-width: 101px">Medl. OK</th>
              <th style="min-width: 101px">Medl. EJ OK</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in items">
              <LADOKTableRow
                v-bind:key="i"
                :ladok="item"
                :currentCompanyId="currentCompanyId"
                @selectLadokClicked="selectLadokClicked"
                @deleteLadokClicked="deleteLadokClicked"
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
.b-table {
  .table {
    td.my-class {
      vertical-align: middle;
    }
  }
}
</style>
<script>
import axios from 'axios';
import LADOKTableRow from "@/view/content/widgets/advance-table/LADOKTableRow.vue";

export default {
  name: "ladoks-table",
  props: ["items","currentCompanyId"],
  components: {
    LADOKTableRow,
  },
  methods: {
    createLadokClicked() {
      this.$emit('createLadokClicked');
    },
    selectLadokClicked(ladok_id) {
      this.$emit('selectLadokClicked', ladok_id);
    },
    deleteLadokClicked(ladok_id) {
      this.$emit('deleteLadokClicked', ladok_id);
    },
    getStatus(status) {
      const status_str = {
        N: 'Ej påbörjad',
        S: 'Väntar på infil',
        OK: 'Klart',
        NO: 'Ej klart',
        ERR: 'Fel'
      };

      return status_str[status];
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      headers: [
        {
          key: 'ladok_id',
          label: 'ID',
          sortable: true,
          thClass: 'pl-7 align-middle',
          tdClass: 'pl-7'
        },
        {
          key: 'created_at',
          label: 'Datum',
          sortable: true,
          thClass: 'w-165px align-middle',
          tdClass: 'w-165px',
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
          thClass: 'w-110px align-middle',
          tdClass: 'w-110px',
        },
        {
          key: 'num_clients_total',
          label: 'Medl. Totalt',
          sortable: true,
          thClass: 'w-110px align-middle',
          tdClass: 'w-110px',
        },
        {
          key: 'num_clients_ok',
          label: 'Medl. OK',
          sortable: true,
          thClass: 'w-110px align-middle',
          tdClass: 'w-110px',
        },
        {
          key: 'num_clients_nok',
          label: 'Medl. EJ OK',
          sortable: true,
          thClass: 'w-110px align-middle',
          tdClass: 'w-110px',
        },
        {
          key: 'action',
          label: '',
          thClass: 'w-110px',
        },
      ],
      list: [

      ]
    };
  }
};
</script>
