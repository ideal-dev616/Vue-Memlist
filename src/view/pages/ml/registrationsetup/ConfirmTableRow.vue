<template>
  <tr>
    <td>
      <span class="d-block font-size-lg">{{ term.name }}</span>
    </td>
    <!-- <td>
      <span class="d-block font-size-lg">{{ getTypeString(template.type) }}</span>
    </td> -->
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectTermClicked"
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
        @click="deleteTermClicked"
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
  name: 'confirm-term-table-row',
  props: ['term'],
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
    getTypeString(type) {
      return this.types[type];
    },
    selectTermClicked() {
      console.log(this.term);
      console.log(this.term.id + ": term_id");
      this.$emit('selectTermClicked', this.term.id);
    },
    deleteTermClicked() {
      console.log(this.term);
      console.log('deleting ' + this.term.id);
      this.$emit('deleteTermClicked', this.term.id);
    },
  }
};
</script>
