<template>

    <!--begin::Table-->
    <div class="table-responsive">
    <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
        <thead>
        <tr class="text-left">
            <th>Förening</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item, i) in companies">
            <UserCompanyAccessRow
            v-bind:key="i"
            :company_id="item.company.company_id"
            :name="item.company.name"
            :user_id="user_id"
            :has_access="hasAccess(item.company.company_id)"
            />
        </template>
        </tbody>
    </table>
    </div>
  <!--end::Advance Table Widget 9-->
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
import UserCompanyAccessRow from '@/view/pages/ml/users/UserCompanyAccessRow.vue';

export default {
  name: 'user-access',
  props: ['user_id', 'company_access', 'companies'],
  components: {
    UserCompanyAccessRow
  },

  methods: {

    hasAccess(company_id) {
      for (const c of this.company_access) {
        if (c.company.id === company_id) {
          return true;
        }
      }

      return false;
    },
  },
};
</script>
