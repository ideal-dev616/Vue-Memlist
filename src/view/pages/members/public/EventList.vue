<template>
  <div class="kt-section" id="current-events-list">
    <template v-for="(event, i) in events">
      <EventListRow
        v-bind:key="i"
        :event="event.event"
        :client_event="event.client_event"
        @selectEventClicked="selectEventClicked"
      />
    </template>
  </div>
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import EventListRow from '@/view/pages/members/public/EventListRow.vue';
import messageParent from '@/core/services/messageParent';

export default {
  name: 'events-list',
  props: ['events'],
  components: {
    EventListRow
  },
  watch: {
  },
  mounted() {
    setTimeout(function(){
      messageParent(JSON.stringify({ height: document.body.scrollHeight }));
    }, 300);
  },
  methods: {
    selectEventClicked(event, client_event) {
      this.$emit('selectEventClicked', event, client_event);
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    }
  },
  data() {
    return {
      list: []
    };
  }
};
</script>
