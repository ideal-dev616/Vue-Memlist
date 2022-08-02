<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ ladok.ladok_id }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ ladok.created_at }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ getStatus(ladok.status) }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ ladok.num_clients_total }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ ladok.num_clients_ok }}</span>
    </td>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ ladok.num_clients_nok }}</span>
    </td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectLadokClicked(ladok.ladok_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a 
        href="#" 
        class="btn btn-icon btn-light btn-sm" 
        @click="deleteLadokClicked(ladok.ladok_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
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

export default {
  name: 'ladoks-table-row',
  props: ['ladok'],
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
    getStatus(status) {
      const status_str = {
        N: 'Ej påbörjad',
        S: 'Väntar på infil',
        OK: 'Klart',
        NO: 'Ej klart',
        ERR: 'Fel'
      };

      return status_str[status];
    },
    selectLadokClicked(ladok_id) {
      this.$emit('selectLadokClicked', ladok_id);
    },
    deleteLadokClicked(ladok_id) {
      this.$emit('deleteLadokClicked', ladok_id);
    },
  }
};
</script>
