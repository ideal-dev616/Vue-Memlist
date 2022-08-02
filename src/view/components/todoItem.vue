<template>
  <a
    class="d-flex align-items-center justify-content-between border-bottom todo-item"
    @click="navigateUrl(info.todo_id)"
  >
    <i class="flaticon-warning text-danger" />
    <div class="todo-details">
      <div class="todo-title">{{ info.name }}</div>
      <div class="todo-to-datetime">{{ formatDate(info.to_datetime) }}</div>
    </div>
  </a>
</template>
<style lang="scss" scoped>
.todo-item {
  padding: 15px;
  cursor: pointer;
  font-size: 1.1rem;
  color: #74788d;
  &:hover {
    .todo-title {
      color: #5d78ff;
    }
  }
  .todo-details {
    margin-left: 15px;
    flex-grow: 1;
  }
  &:after {
    border: 0;
    font-family: 'LineAwesome';
    text-decoration: inherit;
    text-rendering: optimizeLegibility;
    text-transform: none;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    content: '>';
    font-size: 0.8rem;
    line-height: 0;
    position: relative;
    color: #74788d;
  }
}
</style>
<script>
export default {
  name: 'todo-item',
  data() {
    return {};
  },
  props: {
    info: { type: Object, default: null }
  },
  methods: {
    formatDate(d) {
      return d;
    },
    navigateUrl(id) {
      console.log('navigate to: ' + id);
      location.href = '/ml-todo-wizard/'+id;
    }
  }
};
</script>
