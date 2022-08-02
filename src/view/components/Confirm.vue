<template>
  <b-modal ref="confirmModal" hide-footer :title="title">
    <b-row>
      <b-col lg="12">
        <div class="d-block text-center">
          <h3>{{ message }}</h3>
        </div>
      </b-col>
    </b-row>
    <b-row class="mt-8 mb-8">
      <b-col lg="6">
        <b-button class="" :variant="confirmColor" block @click="onConfirm">{{confirm}}</b-button>
      </b-col>
      <b-col lg="6">
        <b-button class="" variant="outline-secondary" block @click="onCancel"
          >{{cancel}}</b-button
        >
      </b-col>
    </b-row>
  </b-modal>
</template>

<style lang="scss" scoped>
</style>
<script>
export default {
  name: 'confirm-modal',
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
    confirm: { type: String, default: 'Bekräfta' },
    cancel: { type: String, default: 'Avbryt' },
  },
  async mounted() {},
  methods: {
    show() {
      this.$refs['confirmModal'].show();
    },
    onConfirm() {
      this.$refs['confirmModal'].hide();

      this.$emit('confirm');
    },
    onCancel() {
      this.$refs['confirmModal'].hide();

      this.$emit('cancel');
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
