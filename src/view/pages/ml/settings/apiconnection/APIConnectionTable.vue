<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark"></span>
      </h3>
      <div class="card-toolbar"></div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3">
      <!--begin::Table-->
      <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th>Domän</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in domains">
              <APIConnectionTableRow
                v-bind:key="i"
                :domain="item"
                :currentCompanyId="currentCompanyId"
                @deleteDomainClicked="deleteDomainClicked"
                @toastr="toastr"
              />
            </template>
          </tbody>
        </table>
      </div>
      <!--end::Table-->
    </div>
    <!--end::Body-->
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
import APIConnectionTableRow from '@/view/pages/ml/settings/apiconnection/APIConnectionTableRow.vue';

export default {
  name: 'api-connection-table',
  props: ['domains', 'currentCompanyId'],
  components: {
    APIConnectionTableRow
  },
  methods: {
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    deleteDomain(domain) {
      axios
        .delete(`/company/domain?company_id=${domain}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.domains = this.users.domains(item => item !== domain);

          this.toastr('success', 'OK', 'Domänen togs bort');
        })
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort domän');
        });
    }
  },
  data() {
    return {

    };
  }
};
</script>

