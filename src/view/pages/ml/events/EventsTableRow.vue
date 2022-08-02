<template>
  <tr>
    <td>
      <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{ event.name }}</span>
    </td>
    <td>{{ formatDate(event.from_datetime) }}</td>
    <td>{{ event.num_signups }}</td>
    <td>{{ event.num_seats }}</td>
    <td class="text-right pr-0">
      <!---<a href="#"
         class="btn btn-icon btn-light btn-sm mx-3"
         @click="publishEventClicked(event.event_id)"
      >
        <span class="svg-icon svg-icon-md svg-icon-primary">
          
          <inline-svg src="/assets/svg/Up-2.svg"></inline-svg>
          
        </span>
      </a>-->
      <a
        :href="event_url"
        target="_blank"
        class="btn btn-icon btn-light btn-sm mx-3"
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
        @click="selectEventClicked(event.event_id)"
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
        @click="deleteEventClicked(event.event_id)"
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
import moment from 'moment';

export default {
  name: 'event-table-row',
  props: ['event'],
  computed: {
    ...mapGetters(['currentCompanyId']),
    event_url() {
      return '/events/' + this.event.event_id;
    }
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
    formatDate(datetime) {
      var mom = moment(datetime);

      return mom.format('YYYY-MM-DD HH:mm');
    },
    gotoEvent(event_id){
      this.$router.push(`/event/${event_id}`)
    },
    publishEventClicked(event_id){
      this.$emit('publishEventClicked', event_id)
    },
    selectEventClicked(event_id) {
      this.$emit('selectEventClicked', event_id);
    },
    deleteEventClicked(event_id) {
      this.$emit('deleteEventClicked', event_id);
    },
  }
};
</script>
