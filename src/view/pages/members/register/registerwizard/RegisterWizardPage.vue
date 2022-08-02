<template>
  <div class="pb-5" data-wizard-type="step-content" data-wizard-state="current">
    <h4 class="mb-10 font-weight-bold text-dark">{{ header }}</h4>
    <div class="card card-custom card-stretch gutter-b">
      <!--begin::Body-->
      <div class="card-body pt-0 pb-3">
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
  name: 'register-wizard-page',
  props: ['state', 'header'],
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
