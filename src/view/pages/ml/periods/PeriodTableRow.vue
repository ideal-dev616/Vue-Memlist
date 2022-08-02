<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ period.name }}</span>
    </td>
    <td>
      <span class="text-dark-75 d-block font-size-lg">{{ type === 'settings' ? (getMonthName(period.from_month) + ' ' + period.from_day) : period.from }}</span>
    </td>
    <td>
      <span class="text-dark-75 d-block font-size-lg">{{ type === 'settings' ? (getMonthName(period.to_month) + ' ' + period.to_day) : period.to }}</span>
    </td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectPeriodClicked(period.id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a v-if="enableDelete" href="#" class="btn btn-icon btn-light btn-sm" @click="deletePeriodClicked(period.id)">
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a v-if="!enableDelete" href="#" class="btn btn-icon btn-light btn-sm" >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <!--end::Svg Icon-->
        </span>
      </a>
      
    </td>
  </tr>
</template>
<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'periods-table-row',
  props: ['period', 'type', 'months'],
  computed: {
    ...mapGetters(['currentCompanyId']),
    enableDelete: function () {
      var from = moment(this.period.from);
      var now = moment();

      return (this.type === 'live' && now < from) || this.type !== 'live';
      //return true;
    }
  },
  data() {
    return {
      
    };
  },
  mounted() {},
  watch: {},
  methods: {
    getMonthName(month_str) {
      console.log('getting month str: ' + month_str);
      console.log(this.months);

      for (var i = 0; i < this.months.length; ++i) {
        if (this.months[i].value === month_str) {
          return this.months[i].text;
        }
      }

      return '';
    },
    selectPeriodClicked(period_id) {
      this.$emit('selectPeriodClicked', period_id);
    },
    deletePeriodClicked(period_id) {
      this.$emit('deletePeriodClicked', period_id);
    }
  }
};
</script>
