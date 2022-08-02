<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg pl-4"
        >{{ template.name }}</span
      >
    </td>
    <td nowrap="nowrap">
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg"
        >{{ template.created_at }}</span>
    </td>
    <td nowrap="nowrap">
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg"
        >{{ template.updated_at }}</span>
    </td>
    <td nowrap="wrap">
      <div class="d-flex align-items-center">
        <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
          <input
            type="checkbox"
            name=""
            :checked="!Boolean(template.is_sms)"
            disabled
          />
          <span></span>
        </label>
        <span class="ml-3 cursor-pointer"></span>
      </div>
    </td>
    <td>
      <div class="d-flex align-items-center">
        <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
          <input
            type="checkbox"
            name=""
            :checked="Boolean(template.is_sms)"
            disabled
          />
          <span></span>
        </label>
        <span class="ml-3 cursor-pointer"></span>
      </div>
    </td>
    <td class="text-right pr-0">
      <div class='justify-content-start d-flex'>
        <a
          href="#"
          class="btn btn-icon btn-light btn-sm"
          @click.prevent="copyTemplateClicked()"
        >
          <span class="svg-icon svg-icon-md svg-icon-primary">
            <!--begin::Svg Icon-->
            <i class="far fa-copy" style="color:#3699FF"></i>
            <!--end::Svg Icon-->
          </span>
        </a>
        <a
          href="#"
          class="btn btn-icon btn-light btn-sm mx-3"
          @click="selectTemplateClicked(template.template_id)"
        >
          <span class="svg-icon svg-icon-md svg-icon-primary">
            <!--begin::Svg Icon-->
            <inline-svg src="/assets/svg/Write.svg"></inline-svg>
            <!--end::Svg Icon-->
          </span>
        </a>
        <a href="#" class="btn btn-icon btn-light btn-sm" @click="deleteTemplateClicked(template.template_id)">
          <span class="svg-icon svg-icon-md svg-icon-primary">
            <!--begin::Svg Icon-->
            <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
            <!--end::Svg Icon-->
          </span>
        </a>
      </div>
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
  name: 'templates-table-row',
  props: ['template'],
  computed: {
    ...mapGetters(['currentCompanyId', 'titles'])
  },
  data() {
    return {
      is_sms: false
    };
  },
  mounted() {
  },
  watch: {

  },
  methods: {
    copyTemplateClicked() {
      this.$emit('copyTemplateClicked', this.template);
    },
    selectTemplateClicked(template_id) {

      this.$emit('selectTemplateClicked', template_id);
    },
    deleteTemplateClicked(template_id) {
      this.$emit('deleteTemplateClicked', template_id);
    },
  }
};
</script>
