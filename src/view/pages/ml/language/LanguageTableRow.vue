<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ lang_record.lang_record_id }}</span>
    </td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectLangRecordClicked(lang_record.lang_record_id)"
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
        @click="deleteLangRecordClicked(lang_record.lang_record_id)"
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
  name: 'lang_records-table-row',
  props: ['lang_record'],
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
    selectLangRecordClicked(lang_record_id) {
      this.$emit('selectLangRecordClicked', lang_record_id);
    },
    deleteLangRecordClicked(lang_record_id) {
      this.$emit('deleteLangRecordClicked', lang_record_id);
    },
  }
};
</script>
