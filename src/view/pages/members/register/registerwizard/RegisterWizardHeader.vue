<template>
  <div>

      <div class="wizard-step" data-wizard-type="step" data-wizard-state="current">
        <div class="wizard-label">
        <h3 class="wizard-title"><span>{{ step }}</span> {{ header }}</h3>
        <div class="wizard-bar"></div>
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
  name: 'register-wizard-header',
  props: ['state', 'header', 'step'],
  components: {
    
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {},
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
