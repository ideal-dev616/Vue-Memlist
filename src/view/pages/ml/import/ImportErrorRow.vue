<template>
  <tr>
    <td>
      <span class="font-weight-bolder d-block font-size-lg">
          {{ error.row }}
      </span>
    </td>
    <td>
      <span class="font-weight-bolder d-block font-size-lg">{{ error.firstname }}</span>
    </td>
    <td>
      <span class="font-weight-bolder d-block font-size-lg">{{ error.lastname }}</span>
    </td>
    <td>
      <span class="font-weight-bolder d-block font-size-lg">
        <template v-for="(item, i) in error.errors">
            <div v-bind:key="i" style="width: 100%;">
                 {{ item }}
            </div>
        </template>
      </span>
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
  name: 'error-table-row',
  props: ['error'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {
       
    };
  },
  mounted() {

  },
  watch: {

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
