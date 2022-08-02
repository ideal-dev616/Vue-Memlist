<template>
  <tr>
    <td>
      <span class="d-block font-size-lg">{{ row.titlename }}</span>
    </td>
    <td>
      <b-form-input
        v-model="row.num_female"
        type="text"
      ></b-form-input>
    </td>
    <td>
      <b-form-input
        v-model="row.num_male"
        type="text"
      ></b-form-input>
    </td>
    <td>
      <b-form-input
        v-model="row.num_other"
        type="text"
      ></b-form-input>
    </td>
    <td>
      <b-form-input
        v-model="row.num_missing_info"
        type="text"
      ></b-form-input>
    </td>
    <td>
      <b-form-input
        v-model="row.num_total"
        type="text"
      ></b-form-input>
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
  name: 'mucf-table-row',
  props: ['row','keyname'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
      
    };
  },
  mounted() {},
  watch: {},
  methods: {
    
  }
};
</script>
