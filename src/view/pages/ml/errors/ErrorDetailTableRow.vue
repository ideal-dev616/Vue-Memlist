<template>
  <tr>
    <td class='pl-7'>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ error.name }}</span>
    </td>
    <td>
        <template v-for="(item, i) in error.errorlist">
            <div v-bind:key="i">
                {{ item.text }}
            </div>
        </template>
    </td>
    <td class="text-right pr-12">
      <a
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectErrorClicked()"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
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
const { isNavigationFailure, NavigationFailureType } = 'vue-router'
export default {
  name: 'errors-table-row',
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
    selectErrorClicked() {
        console.log(this.error)
        // go to the relevant page
      if (this.error.type === 'user') {
        this.$router.push(`/ml-users/${this.error.id}`);
      }
      else if (this.error.type === 'client') {

          this.$router.push(`/ml-quicksearch/${this.error.id}`);
      }
      else if (this.error.type === 'company') {
          this.$router.push(`/ml-settings/${this.error.id}`);
      }
      //console.log('going to page');
    }
  }
};
</script>
