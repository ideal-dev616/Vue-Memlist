<template>
  <tr>
    <td>
      {{ domain }}
    </td>
    <td>
      <a href="#" class="btn btn-icon btn-light btn-sm" @click="deleteDomainClicked(domain)">
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
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
  name: 'api-connection-table-row',
  props: ['domain'],
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
    deleteDomainClicked(domain) {
      this.$emit('deleteDomainClicked', domain);
    },
  }
};
</script>
