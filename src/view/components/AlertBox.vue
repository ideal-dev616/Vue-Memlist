<template>
  <b-modal ref="alertModal" hide-footer :title="title">
    <b-row>
      <b-col lg="12">
        <div class="d-block text-center">
          <p>{{ message }}</p>
        </div>
      </b-col>
    </b-row>
    <b-row class="mt-8 mb-8">
      <b-col lg="12">
        <b-button class="mx-auto" :variant="confirmColor" block @click="onOk">{{confirm}}</b-button>
      </b-col>
    </b-row>
  </b-modal>
</template>

<style lang="scss" scoped>
</style>
<script>
export default {
  name: 'alert-modal',
  data() {
    return {};
  },
  props: {
    type: {
      type: String,
      default: 'danger'
    },
    title: String,
    message: String,
    confirm: { type: String, default: 'OK' },
  },
  async mounted() {},
  methods: {
    show() {
      this.$refs['alertModal'].show();
    },
    onOk() {
      this.$refs['alertModal'].hide();

      this.$emit('ok');
    },
  },
  computed: {
    confirmColor(){
      switch (this.type) {
        case 'danger':
          return 'outline-danger'
        case 'success':
          return 'outline-success'
        case 'info':
          return 'outline-info'
        case 'warning':
          return 'outline-warning'
        case 'primary':
          return 'outline-primary'
      }
    }
  }
};
</script>
