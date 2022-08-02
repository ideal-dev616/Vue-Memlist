<template>
  <tr>
    <td>
      <span class="d-block font-size-lg">{{ page.name }}</span>
    </td>
    <td>
      <span class="d-block font-size-lg">{{ getTypeString(page.type) }}</span>
    </td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="moveUpClicked(page.id)"
      >
        <fa-icon :icon="['fas', 'arrow-up']" size="lg" />
      </a>

       <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="moveDownClicked(page.id)"
      >
        <fa-icon :icon="['fas', 'arrow-down']" size="lg" />
      </a>

      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectPageClicked(page.id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Write.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="deletePageClicked(page.id)"
        v-if='page.type != "confirm"'
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
          <!--end::Svg Icon-->
        </span>
      </a>

      <a v-if="page.type === 'confirm'" href="#" class="btn btn-icon btn-light btn-sm mx-3" >
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
import { mapGetters } from 'vuex';

export default {
  name: 'page-table-row',
  props: ['page', 'types'],
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
    getTypeString(type) {
      return this.types[type];
    },
    moveDownClicked(page_id) {
      this.$emit('moveDownClicked', page_id);
    },
    moveUpClicked(page_id) {
      this.$emit('moveUpClicked', page_id);
    },
    selectPageClicked(page_id) {
      this.$emit('selectPageClicked', page_id);
    },
    deletePageClicked(page_id) {
      this.$emit('deletePageClicked', page_id);
    },
  }
};
</script>
