<template>
  <!--begin::Advance Table Widget 9-->
  <div>
    <!--begin::Header-->
    <div class="border-0 py-5 d-flex justify-content-end">
      <a
        href="#"
        class="btn btn-primary font-weight-bolder font-size-sm"
        @click="createPeriodClicked"
      >
        <i class="menu-icon flaticon2-plus" style="font-size: 1em"></i>Ny Period
      </a>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="pt-0 pb-3 table-responsive">
      <b-table
        id="template-table"
        :fields="headers"
        :items="periods"
        head-variant="light"
      >
        <template #cell(from)='row')>
          <span class="text-dark-75 d-block font-size-lg">
            {{ type === 'settings' ? (getMonthName(row.item.from_month) + ' ' + row.item.from_day) : row.item.from }}
          </span>
        </template>
        <template #cell(to)='row')>
          <span class="text-dark-75 d-block font-size-lg">
            {{ type === 'settings' ? (getMonthName(row.item.to_month) + ' ' + row.item.to_day) : row.item.to }}
          </span>
        </template>
        <template #cell(id)="row">
          <div class='justify-content-end d-flex'>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mx-3"
              @click="selectPeriodClicked(row.item.id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a v-if="enableDelete(row.item)" href="#" class="btn btn-icon btn-light btn-sm" @click="deletePeriodClicked(row.item.id)">
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                <!--end::Svg Icon-->
              </span>
            </a>
            <a v-if="!enableDelete(row.item)" href="#" class="btn btn-icon btn-light btn-sm" >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <!--begin::Svg Icon-->
                <!--end::Svg Icon-->
              </span>
            </a>
          </div>
        </template>
      </b-table>
    </div>

    <div class="pt-0 pb-3">
      <!--begin::Table-->
      <!-- <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th style="min-width: 110px">Namn</th>
              <th style="min-width: 110px">Period Från</th>
              <th style="min-width: 110px">Period Till</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in periods">
              <PeriodTableRow
                v-bind:key="i"
                :period="item"
                :type="type"
                :months="months"
                :currentCompanyId="currentCompanyId"
                @selectPeriodClicked="selectPeriodClicked"
                @deletePeriodClicked="deletePeriodClicked"
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
import moment from 'moment';
import { mapGetters } from 'vuex';
import PeriodTableRow from '@/view/pages/ml/periods/PeriodTableRow.vue';

export default {
  name: 'periods-table',
  props: ['periods', 'currentCompanyId', 'type', 'months'],
  components: {
    PeriodTableRow
  },
  computed: {
    ...mapGetters(['currentCompanyId']),
  },
  watch: {
    periods(newValue, oldvalue) {

    }
  },
  mounted() {

  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    selectPeriodClicked(period_id) {
      this.$emit('selectPeriodClicked', period_id);
    },
    deletePeriodClicked(period_id) {
      this.$emit('deletePeriodClicked', period_id);
    },
    createPeriodClicked() {
      this.$emit('createPeriodClicked');
    },
    getMonthName(month_str) {
      for (var i = 0; i < this.months.length; ++i) {
        if (this.months[i].value === month_str) {
          return this.months[i].text;
        }
      }
      return '';
    },
    enableDelete(period) {
      var from = moment(period.from);
      var now = moment();

      return (this.type === 'live' && now < from) || this.type !== 'live';
      //return true;
    }
  },
  data() {
    return {
      headers: [
        {
          key: 'name',
          label: 'Namn',
          sortable: true,
          thClass: 'pl-7',
          tdClass: 'pl-7'
        },
        {
          key: 'from',
          label: 'Period Från',
          thClass: 'w-165px',
          tdClass: 'w-165px',
          sortable: true
        },
        {
          key: 'to',
          label: 'Period Till',
          thClass: 'w-165px',
          tdClass: 'w-165px',
          sortable: true
        },
        {
          key: 'id',
          label: '',
          thClass: 'w-110px text-right',
        },
      ],
      list: []
    };
  }
};
</script>
