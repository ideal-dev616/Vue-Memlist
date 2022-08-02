<template>
  <tr>
    <td>
      {{ title.name }}
    </td>
    <td class="text-right pr-0">
      <label
        class="checkbox checkbox-lg checkbox-outline checkbox-outline-2x checkbox-primary text-right pr-0"
      >
        <input
          type="checkbox"
          name=""
          v-model="title.include"
          @click="toggle"
        />
        <span></span>
      </label>
      <span class="ml-3 cursor-pointer"
        ></span
      >
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
    return {
      include: false
    };
  },
  mounted() {},
  watch: {
    
  },
  methods: {
    toggle() {
      this.$emit('setIncludeTitle', this.title.id, !this.title.include);
    }
  }
};
</script>
