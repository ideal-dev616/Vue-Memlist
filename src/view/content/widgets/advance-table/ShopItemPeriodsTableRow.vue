<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg pl-4">
        <div class="d-flex">
            <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
            <input type="checkbox" name="" v-model="period.selected"  @click="period.selected = !period.selected" />
            <span></span>
            </label>
            <span class="ml-3 cursor-pointer"></span>
        </div>
      </span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ period.name }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ period.from }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ period.to }}</span>
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
import { mapGetters } from 'vuex';

export default {
  name: 'shop_items-table-row',
  props: ['period'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {

    };
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    selectPeriodClicked(period_id) {
      this.$emit('selectPeriodClicked', period_id);
    },
  }
};
</script>
