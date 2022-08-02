<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg pl-4">{{ group.name }}</span>
    </td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectGroupClicked(group.group_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm"
        @click="deleteGroupClicked(group.group_id)"
      >
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
  name: 'groups-table-row',
  props: ['group'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {

    };
  },
  mounted() {
    if (this.group.name.length > 63) {
      this.group.name = this.group.name.substr(0, 64) + '...';
    }
  },
  watch: {

  },
  methods: {
    selectGroupClicked(group_id) {
      this.$emit('selectGroupClicked', group_id);
    },
    deleteGroupClicked(group_id) {
      this.$emit('deleteGroupClicked', group_id);
    },
  }
};
</script>
