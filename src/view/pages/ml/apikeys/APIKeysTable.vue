<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">&nbsp;</span>
      </h3>
      <div class="card-toolbar">
        <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createApiKeyClicked"
          ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Ny API Nyckel</a>
      </div>
    </div>
    <div class="card-header border-0 py-5 m-1">
      <div>
        <b-select v-model="perPage" :options="options"></b-select>
      </div>
      <b-pagination
        class="ml-auto mb-0"
        v-model="currentPage"
        :total-rows="items.length"
        :per-page="perPage"
        aria-controls="apikeys-table"
        first-number
        last-number
      ></b-pagination>
    </div>
    <div class="card-body pt-0">
      <b-table
        id="apikeys-table"
        :fields="headers"
        :items="items"
        :per-page="perPage"
        :current-page="currentPage"
        head-variant="light"
        
      >
        <template #cell(service)='row'>
          {{ serviceName[row.item.service] }}
        </template>

        <template #cell(status)='row'>
          {{ statusName[row.item.status] }}
        </template>

        <template #cell(id)="row">
          <div class='d-flex justify-content-end'>
            <a
              href="#"
              class="button"
              @click="selectApiKeyClicked(row.item.id)"
            >
              Hantera >
            </a>
            

            <a
              href="#"
              class="button ml-8"
              style="color: rgb(255 27 27);"
              @click="deleteApiKeyClicked(row.item.id)"
            >
              Radera >
            </a>

          </div>
        </template>
      </b-table>
    </div>
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
import moment from 'moment';


export default {
  name: 'apikey-table',
  props: ['items', 'currentCompanyId'],
  components: {
    
  },
  watch: {

  },
  mounted() {
    
  },
  methods: {
    createApiKeyClicked() {
      this.$emit('createApiKeyClicked');
    },
    selectApiKeyClicked(id) {
      this.$emit('selectApiKeyClicked', id);
    },
    deleteApiKeyClicked(id) {
      this.$emit('deleteApiKeyClicked', id);
    },

    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },

  data() {
    return {
      serviceName: {
        'dintero': 'Dintero',
        'fortnox': 'Fortnox',
        'spar': 'SPAR',
        'twilio': 'Twilio'
      },
      statusName: {
        'CLAIMED': 'OK',
        'UNCLAIMED': 'Ange nyckel',
        'CREATED': 'OK',
        'REVOKED': 'Spärrat',
        '': 'OK'
      },
      options: [
        { value: 20 , text: '20'},
        { value: 50 , text: '50'},
        { value: 100 , text: '100'}
      ],
      apiKeys: [],
      perPage: 20,
      currentPage: 1,
      headers: [
        {
          key: 'company_name',
          label: 'Förening',
          sortable: true,
          thClass: 'pl-7',
          tdClass: 'pl-7'
        },
        {
          key: 'service',
          label: 'Tjänst',
          sortable: true
        },
        {
          key: 'public_token',
          label: 'Publikt ID',
          sortable: true
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
        },
        {
          key: 'created_at',
          label: 'Skapad',
          sortable: true,
        },
        {
          key: 'id',
          label: 'Hantera',
          thClass: 'd-flex flex-row-reverse pr-6'
        },
      ],
      status: {
        UNCLAIMED : 'VÄNTAR',
        CLAIMED: 'AKTIV',
        CREATED  : 'SKAPAD',
        REVOKED : 'SPÄRRAT'
      }
    };
  }
};
</script>
