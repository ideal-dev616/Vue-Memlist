<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ stickprov.company_name }}</span>
    </td>
    <td>{{ stickprov.deadline }}</td>
    <td>{{ stickprov.num_clients }}</td>
    <td>{{ stickprov.num_answers }}</td>
    <td>{{ stickprov.num_confirm }}</td>
    <td>{{ stickprov.num_reject }}</td>
    <td class="text-right pr-0">
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="startEvent(stickprov.stickprov_id)"
        v-if="stickprov.is_stopped"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <i class="fas fa-play" style="color:#3699FF"></i>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="stopEvent(stickprov.stickprov_id)"
        v-if="!stickprov.is_stopped"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          <!--begin::Svg Icon-->
          <i class="fas fa-stop" style="color:#e63113"></i>
          <!--end::Svg Icon-->
        </span>
      </a>
      <a
        href="#"
        class="btn btn-icon btn-light btn-sm mx-3"
        @click="selectStickprovClicked(stickprov.stickprov_id)"
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
        @click="deleteStickprovClicked(stickprov.stickprov_id)"
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
  name: 'stickprov-table-row',
  props: ['stickprov'],
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
    startEvent(stickprov_id) {
      this.$emit('startEvent', stickprov_id, true);
    },
    stopEvent(stickprov_id) {
      this.$emit('startEvent', stickprov_id, false);
    },
    selectStickprovClicked(stickprov_id) {
      this.$emit('selectStickprovClicked', stickprov_id);
    },
    deleteStickprovClicked(stickprov_id) {
      this.$emit('deleteStickprovClicked', stickprov_id);
    },
  }
};
</script>
