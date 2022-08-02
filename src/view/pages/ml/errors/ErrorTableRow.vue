<template>
  <tr>
    <td class='pl-7'>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ error.name }}</span>
    </td>
    <td>{{ error.counts.client }}</td>
    <td>{{ error.counts.user }}</td>
    <td>{{ error.counts.company }}</td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectErrorClicked(error.id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
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
import { mapGetters } from 'vuex';

export default {
  name: 'errors-table-row',
  props: ['error'],
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
    selectErrorClicked(company_id) {
      this.$emit('selectErrorClicked', company_id);
    },
    deleteErrorClicked(company_id) {
      this.$emit('deleteErrorClicked', company_id);
    },
  }
};
</script>
