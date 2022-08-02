<template>
  <tr>
    <td :disabled='!available'>
        <div class="d-flex align-items-center">
          <label
              class="checkbox checkbox-lg checkbox-outline checkbox-outline-2x checkbox-primary"
            >
              <input
                type="checkbox"
                v-model="selected"
                @click="selected = !selected"
                :disabled='!available'
              />
              <span></span>
          </label>
          <span class="ml-3 cursor-pointer"></span>
        </div>
    </td>
    <td>{{ companyselect.name }}</td>
    <td>
      <label v-if='!available' style='color: red'>
        Det finns redan ett stickprov på föreningen
      </label>
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
  name: 'companyselect-table-row',
  props: ['companyselect','allSelected', 'available'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
      selected: false,
    };
  },
  mounted() {
    if (this.companyselect.id === this.currentCompanyId) {
      this.selected = true;
    }
    this.selected = this.selected && this.available;
  },
  watch: {
    allSelected(newValue, oldValue) {
      this.selected = newValue;
    },
    selected(newValue, oldValue) {
      this.$emit('companySelected', this.companyselect.id, newValue);
    },
    available(newValue, oldValue){
      this.selected = this.selected && this.available;
    }
  },
  methods: {
  }
};
</script>
