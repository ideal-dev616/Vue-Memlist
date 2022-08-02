<template>
  <tr>
    <td>{{ item.descr }}</td>
    <td>
        <b-form-select
          v-model="template_id"
          :options="templateOptions"
        ></b-form-select>
    </td>
    <td></td>
  </tr>
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.descr {
  font-size: 11px;
}
</style>
<script>
import axios from 'axios';

export default {
  name: "systems-table-row",
  props: ["templateOptions","item"],
  components: {

  },
  computed: {
      temp_id() {
        return this.template_id === null ? this.item.template_id : this.template_id;
      }
  },
  watch: {
    item(newValue, oldValue) {
      if (newValue){
        this.template_id = newValue.template_id;
        console.log(this.template_id)
      }
    },
    temp_id(newValue, oldValue) {
      if (newValue) {
        this.template_id = newValue;
        this.$emit('templateUpdated', this.item.id, newValue)
      }
    }
  },
  mounted() {
    this.template_id = this.item.template_id;

    console.log(this.template_id);
  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
  },
  data() {
    return {
      template_id: null,
    };
  }
};
</script>
