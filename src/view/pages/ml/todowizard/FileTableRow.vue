<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ file.name }}</span>
    </td>
    <td>
      <span class="text-dark-75 d-block font-size-lg">{{ file.created_at }}</span>
    </td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="downloadFileClicked(file.file_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/download-solid.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a v-if="enableDelete" class="btn btn-icon btn-light btn-sm" @click="deleteFileClicked(file.file_id)">
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a v-if="!enableDelete" href="#" class="btn btn-icon btn-light btn-sm" >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
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
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
  name: 'shop_items-table-row',
  props: ['file', 'type'],
  computed: {
    ...mapGetters(['currentCompanyId']),
    enableDelete: function () {
      var from = moment(this.file.from);
      var now = moment();

      return (this.type === 'live' && now < from) || this.type !== 'live';
      //return true;
    }
  },
  data() {
    return {

    };
  },
  mounted() {},
  watch: {},
  methods: {
    downloadFileClicked(file_id) {
      this.$emit('downloadFileClicked', file_id);
    },
    selectFileClicked(file_id) {
      this.$emit('selectFileClicked', file_id);
    },
    deleteFileClicked(file_id) {
      this.$emit('deleteFileClicked', file_id);
    }
  }
};
</script>
