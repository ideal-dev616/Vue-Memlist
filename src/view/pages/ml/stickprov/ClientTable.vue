<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">&nbsp;</span>
      </h3>
      <div class="card-toolbar">

          <a href="#" class="btn btn-primary font-weight-bolder font-size-sm mb-8" @click="exportExcelClicked"
            ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Exportera Excel</a>
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0">
      <b-table
        id="stickprov-table"
        :fields="headers"
        :items="list"
        head-variant="light"
        class='w-100'
      >
        <template #cell(do_manual)="row">
          <b-button v-if="row.item.do_manual === 1 && row.item.done === 0" class="mr-2" type="button" variant="primary" @click="confirm(row.item)">Svara Ja</b-button>
          <b-button v-if="row.item.do_manual === 1 && row.item.done === 0" type="button" variant="danger" @click="reject(row.item)">Svara Nej</b-button>
          
          <b-badge v-if="row.item.do_manual === 0" variant="light">Nej</b-badge>

        </template>
        <template #cell(status)="row">
          
            <b-badge v-if="row.item.con === 1" variant="success">Bekräftat</b-badge>
            <b-badge v-if="row.item.rej === 1" variant="danger">Ej medlem</b-badge>
            <b-badge v-if="row.item.ans === 0" variant="warning">Ej svar</b-badge>

        </template>
      </b-table>
    </div>
    <!-- <div class="card-body pt-0 pb-3">
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-75">Namn</span>
              </th>
              <th>E-post</th>
              <th>Telefon</th>
              <th>Manuell</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in clients">
              <ClientTableRow
                v-bind:key="i"
                :client="item"
                :stickprov="stickprov"
                :currentCompanyId="currentCompanyId"
                @confirm="confirm"
                @reject="reject"
                @toastr="toastr"
              />
            </template>
          </tbody>
        </table>
      </div>
    </div> -->
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
import ClientTableRow from '@/view/pages/ml/stickprov/ClientTableRow.vue';

export default {
  name: 'clients-table',
  props: ['clients', 'currentCompanyId','stickprov'],
  components: {
    ClientTableRow
  },
  watch: {
    clients(newValue, oldValue) {
      let that = this;
      this.list = newValue.map(function(item) {
      return {
        'name': item.name,
        'email': item.email,
        'phone': item.phone,
        'do_manual': item.do_manual,
        'con': item.con,
        'ans': item.ans,
        'done': item.done,
        'rej': item.rej,
        'status': item.con === 1 ? 'confirmed' : (item.rej === 1 ? 'rejected' : 'no_answer'),
        'client_id': item.client_id
      }});
    }
  },
  methods: {
    exportExcelClicked() {
      axios
        .post('/stickprov/xlsx', { stickprov_id: this.stickprov.stickprov_id })
        .then(res => {
          location.href = res.data.file.public_path;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Fel', 'Kunde inte skapa Excelfil');
        });
    },
    confirm(row) {
      this.$emit('confirm', row.client_id);
      row.status = 'confirmed';
    },
    reject(row) {
      this.$emit('reject', row.client_id);
      row.status = 'rejected';
    },
    selectClientClicked(client_id) {
      this.$emit('selectClientClicked', client_id);
    },
    deleteClientClicked(client_id) {
      this.$emit('deleteClientClicked', client_id);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      show_history: false,
      headers: [
        {
          key: 'name',
          label: 'Namn',
          sortable: true,
          thClass: 'pl-7',
          tdClass: 'pl-7'
        },
        {
          key: 'email',
          label: 'E-post',
          sortable: true,
        },
        {
          key: 'phone',
          label: 'Telefon',
          sortable: true,
        },
        {
          key: 'do_manual',
          label: 'Manuell',
        },
        {
          key: 'status',
          label: 'Status',
        },
      ],
      list: []
    };
  }
};
</script>
