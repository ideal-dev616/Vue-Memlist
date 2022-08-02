<template>
  <div>
    <div class="form-group">
      <div class="check-list">
        <template v-for="(prop, j) in group.props">
          <div class="d-flex align-items-center mb-4" v-bind:key="j">
            <label
              class="checkbox checkbox-lg checkbox-outline checkbox-success"
            >
              <input
                type="checkbox"
                :name="group.group_id"
                v-model="selected"
                :value="prop.prop_id"
              />
              <span></span>
            </label>
            <span class="ml-3 cursor-pointer">{{ prop.name }}</span>
          </div>
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
  name: 'property-page-checkbox-properties',
  props: ['group'],
  components: {},
  data() {
    return {
      selected: [],
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
