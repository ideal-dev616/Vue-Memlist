<template>

    <!--begin::Table-->
    <div class="table-responsive">
    <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
        <tbody>
        <template v-for="(item, i) in access_list">
            <UserPagesCompanyTable
                v-bind:key="i"
                :company_id="item.company.id"
                :name="item.company.name"
                :user_id="user_id"
                :access_list="item.acl"
                @updatedAccess="$emit('updatedAccess')"
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
import UserPagesCompanyTable from '@/view/pages/ml/users/UserPagesCompanyTable.vue';

export default {
  name: 'user-pages-access',
  props: ['user_id', 'access_list'],
  components: {
    UserPagesCompanyTable
  },
};
</script>
