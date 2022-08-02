<template>
  <div>
    <div class="form-group">
      <div class="radio-list">
        <template v-for="(prop, j) in group.props">
          <label class="radio radio-outline radio-success mb-4" v-bind:key="j">
            <input type="radio" v-model="selected" :value="prop.prop_id" :name="group.group_id" />
            <span></span>
            {{ prop.name }}
          </label>
        </template>
      </div>
    </div>
  </div>
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
  name: 'property-page-radio-properties',
  props: ['group'],
  components: {},
  data() {
    return {
      selected: null
    };
  },
  mounted() {},
  watch: {
    selected(newValue, oldValue) {
      this.$emit('selected', this.group, newValue);
    }
  },
  methods: {
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
