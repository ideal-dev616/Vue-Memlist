<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg pl-4">{{ prop.name }}</span>
    </td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectGroupAttributeClicked(prop.prop_id)"
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
        @click="deleteGroupAttributeClicked(prop.prop_id)"
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
  name: 'props-table-row',
  props: ['prop'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {

    };
  },
  mounted() {
    if (this.prop.name.length > 63) {
      this.prop.name = this.prop.name.substr(0, 64) + '...';
    }
  },
  watch: {

  },
  methods: {
    selectGroupAttributeClicked(prop_id) {
      console.log(prop_id, "SelectGroupAttr");
      this.$emit('selectGroupAttributeClicked', prop_id);
    },
    deleteGroupAttributeClicked(prop_id) {
      this.$emit('deleteGroupAttributeClicked', prop_id);
    },
  }
};
</script>
