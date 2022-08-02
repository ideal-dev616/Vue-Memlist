<template>
  <div>
    <h5>{{ title }}</h5>
    <!--begin::Table-->
    <div class="table-responsive">
      <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
        <thead>
          <tr class="text-left">
            <th style="min-width: 110px"></th>
            <th>Tjejer</th>
            <th>Killar</th>
            <th>Annat Kön</th>
            <th>Uppg. Saknas</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, i) in rows">
            <MucfDemographicRow
              v-bind:key="i"
              :row="item"
              :currentCompanyId="currentCompanyId"
              @toastr="toastr"
            />
          </template>
        </tbody>
      </table>
    </div>

    <!--end::Table-->
  </div>
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import MucfDemographicRow from '@/view/pages/ml/mucf/MucfDemographicRow.vue';

export default {
  name: 'shop_items-table',
  props: ['rows', 'currentCompanyId', 'title'],
  components: {
    MucfDemographicRow
  },
  watch: {},
  mounted() {
    console.log('mounted periodstable');
  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      list: []
    };
  }
};
</script>

