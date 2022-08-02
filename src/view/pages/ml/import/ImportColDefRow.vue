<template>
  <tr>
    <td>
      <span class="font-weight-bolder d-block font-size-lg">
          {{ mappedColumn.excel.col+1 }}
      </span>
    </td>
    <td>
      <span class="font-weight-bolder d-block font-size-lg">{{ mappedColumn.excel.name }}</span>
    </td>
    <td>
      <b-form-select
        :key="componentKey"
        v-model="mappedColumn.db.col_name"
        :options="dbColumnOptions"
        :state="!mappedColumn.duplicate"
        @change="coldefSelected"
      ></b-form-select>
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
  name: 'coldef-table-row',
  props: ['mappedColumn', 'refresh', 'dbColumnOptions'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
       componentKey: 0
    };
  },
  mounted() {

  },
  watch: {
    refresh(newVal, oldVal) {
      console.log('mapped column changed');
    }
  },
  methods: {
    updateComponent() {
      this.componentKey += 1;
    },
    coldefSelected() {
      this.$emit('coldefSelected', this.mappedColumn);

      this.componentKey += 1;
    },
  }
};
</script>
