<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b px-0">
    <!--begin::Header-->
    <div class="card-header border-0">
      <div class="card-toolbar d-flex justify-content-between justify-content-sm-end">
        <div class="d-flex align-items-center mr-sm-12 my-2">
          <label class="checkbox checkbox-lg checkbox-outline checkbox-success" title="Visa Tidigare Utskick">
            <input type="checkbox" name="" v-model="show_history" @click="show_history = !show_history" />
            <span></span>
          </label>
          <span class="ml-3 cursor-pointer font-size-sm">Tidigare Utskick</span>
        </div>

        <a href="#" class="btn btn-primary font-weight-bolder font-size-sm" @click="createSendoutClicked"
          ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Nytt Utskick</a>

      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 table-responsive">
      <b-table
        id="template-table"
        :fields="headers"
        :items="items"
        head-variant="light"
        sticky-header
        class="mh-100"
      >
        <template #cell(template_id)="row">
          <div class='justify-content-end d-flex'>
            <a v-if="row.item.status === 'DRAFT' && row.item.template_id !== null &&
              row.item.template_id !== ''  && row.item.query_id !== null && row.item.query_id !== ''"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click.prevent="startSendout(row.item.sendout_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/paper-plane.svg"></inline-svg>
              </span>
            </a>
            <a v-if="row.item.status === 'DRAFT'"
              class="btn btn-icon btn-light btn-sm mr-3"
              @click="selectSendoutClicked(row.item.sendout_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
              </span>
            </a>
            <a href="#" class="btn btn-icon btn-light btn-sm" @click="deleteSendoutClicked(row.item.sendout_id)">
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
              </span>
            </a>
          </div>
        </template>
      </b-table>
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
import SendoutTableRow from '@/view/pages/ml/sendout/SendoutTableRow.vue';

export default {
  name: 'sendouts-table',
  props: ['items', 'currentCompanyId'],
  components: {
    SendoutTableRow
  },
  watch: {
    show_history(newcheck, oldcheck) {
      this.$emit('showHistoryToggled', newcheck);
    }
  },
  methods: {
    startSendout(sendout_id) {
      this.$emit('startSendout', sendout_id);
    },
    createSendoutClicked() {
      this.$emit('createSendoutClicked');
    },
    selectSendoutClicked(sendout_id) {
      this.$emit('selectSendoutClicked', sendout_id);
    },
    deleteSendoutClicked(sendout_id) {
      this.$emit('deleteSendoutClicked', sendout_id);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      show_history: false,
      list: [],
      headers: [
        {
          key: 'name',
          label: 'Utskick',
          sortable: true,
          thClass: 'pl-7 align-middle',
          tdClass: 'pl-7'
        },
        {
          key: 'created_at',
          label: 'Datum',
          thClass: 'w-165px align-middle',
          tdClass: 'w-165px align-middle',
          sortable: true
        },
        {
          key: 'num_to_send',
          label: 'Antal Urval',
          thClass: 'w-110px align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'num_sent_ok',
          label: 'Skickade',
          thClass: 'w-110px align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'num_opens',
          label: 'Öppnade',
          thClass: 'w-110px align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'num_clicks',
          label: 'Klick',
          thClass: 'w-110px align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'num_return_nok',
          label: 'SMS',
          thClass: 'w-110px align-middle',
          tdClass: 'align-middle',
          sortable: true
        },
        {
          key: 'template_id',
          label: '',
          thClass: 'w-110px text-right pr-6',
          tdClass: 'align-middle'
        },
      ],
    };
  }
};
</script>
