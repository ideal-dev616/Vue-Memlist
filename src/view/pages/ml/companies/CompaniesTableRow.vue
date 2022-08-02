<template>
  <tr>
    <!--<td>
        <div class="d-flex align-items-center">
          <label
              class="checkbox checkbox-lg"
            >
              <input
                type="checkbox"
                v-model="selected"
                @click="selected = !selected"
              />
              <span></span>
          </label>
          <span class="ml-3 cursor-pointer"></span>
        </div>
    </td>-->
    <td>{{ company.name }}</td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectCompanyClicked(company.id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a href="#" class="btn btn-icon btn-light btn-sm" @click="deleteCompanyClicked(company.id)">
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
  name: 'company-table-row',
  props: ['company','allSelected'],
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
    selectCompanyClicked(company_id) {
      this.$emit('selectCompanyClicked', company_id);
    },
    deleteCompanyClicked(company_id) {
      this.$emit('deleteCompanyClicked', company_id);
    }
  }
};
</script>
