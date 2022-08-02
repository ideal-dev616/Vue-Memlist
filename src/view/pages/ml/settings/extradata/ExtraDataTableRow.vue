<template>
  <tr>
    <td>
      {{ extra.id }}
    </td>
    <td>
      {{ extra.name }}
    </td>
    <td class="text-right pr-0">
     <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectExtra"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="deleteExtra"
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
  name: 'extra-table-row',
  props: ['extra'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
    
    };
  },
  mounted() {},
  watch: {
    
  },
  methods: {
    deleteExtra() {
      this.$emit('deleteExtra', this.extra.id);
    },
    selectExtra() {
      this.$emit('selectExtra', this.extra.id);
    }
  }
};
</script>
