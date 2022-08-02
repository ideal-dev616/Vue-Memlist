<template>
  <tr>
    <td>
      <span class="d-block font-size-lg">{{ user.email }}</span>
    </td>
    <td>
      <span class="d-block font-size-lg">Administratör</span>
    </td>
    <td class="text-right pr-0">
      <a href="#" class="btn btn-icon btn-light btn-sm" @click="deleteUserClicked(user.user_id)">
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
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'useraccount-table-row',
  props: ['user'],
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
    deleteUserClicked(user_id) {
      this.$emit('deleteUserClicked', user_id);
    }
  }
};
</script>
