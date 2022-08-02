<template>

      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th>Förening</th>
              <th>E-post</th>
              <th>SMS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in company_access">
              <UserNotificationRow
                v-bind:key="i"
                :company_user="item"
              />
            </template>
          </tbody>
        </table>
      </div>

</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import UserNotificationRow from '@/view/pages/ml/users/UserNotificationRow.vue';

export default {
  name: 'user-notifications',
  props: ['company_access'],
  components: {
    UserNotificationRow
  },

  methods: {

    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type,
      })
    }
  },

};
</script>
