<template>
  <tr>
    <td>
      {{ title.name }}
    </td>
    <td class="text-right pr-0" >
     <a href="#" class="btn btn-icon btn-light btn-sm" @click="deleteTitleClicked(title)">
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
        </span>
      </a>
      <a href="#" class="btn btn-icon btn-light btn-sm mx-3" @click="selectTitleClicked(title)">
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
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
  name: 'title-table-row',
  props: ['title'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {},
  methods: {
    deleteTitleClicked(title) {
      this.$emit('deleteTitleClicked', title);
    },
    selectTitleClicked(title) {
      this.$emit('selectTitleClicked', title);
    }
  }
};
</script>
