<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg pl-4">{{ sendout.name }}</span>
    </td>
    <td>{{ sendout.created_at }}</td>
    <td>{{ sendout.num_to_send }}</td>
    <td>{{ sendout.num_sent_ok }}</td>
    <td>{{ sendout.num_opens }}</td>
    <td>{{ sendout.num_clicks }}</td>
    <td>{{ sendout.num_sms_sent }}</td>

    <td class="text-right pr-0">
      <div class='d-flex justify-content-end'>
        <a v-if="sendout.status === 'DRAFT' && sendout.template_id !== null && sendout.template_id !== ''  && sendout.query_id !== null && sendout.query_id !== ''"
          class="btn btn-icon btn-light btn-sm mx-3"
          @click="startSendout(sendout.sendout_id)"
        >
          <span class="svg-icon svg-icon-md svg-icon-primary">
            <!--begin::Svg Icon-->
            <inline-svg src="/assets/svg/paper-plane.svg"></inline-svg>
            <!--end::Svg Icon-->
          </span>
        </a>
        <a v-if="sendout.status === 'DRAFT'"
          class="btn btn-icon btn-light btn-sm mx-3"
          @click="selectSendoutClicked(sendout.sendout_id)"
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
          @click="deleteSendoutClicked(sendout.sendout_id)"
        >
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
  name: 'sendout-table-row',
  props: ['sendout'],
  computed: {
    ...mapGetters(['currentCompanyId'])
  },
  data() {
    return {

    };
  },
  watch: {
  },
  methods: {
    startSendout(sendout_id) {
      this.$emit('startSendout', sendout_id);
    },
    selectSendoutClicked(sendout_id) {
      this.$emit('selectSendoutClicked', sendout_id);
    },
    deleteSendoutClicked(sendout_id) {
      this.$emit('deleteSendoutClicked', sendout_id);
    },
  }
};
</script>
