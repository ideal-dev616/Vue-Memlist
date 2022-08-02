<template>
<b-card class="mb-4 shadow-sm">
  <div class="row">
    <div class="col-2">
      <div class="event-date text-center">
        <h2>{{dateStarted('D')}}</h2>
        <span>{{dateStarted('MMM')}}</span>
      </div>
    </div>
    <div class="col-8">
      <div class="title-info">
        <h4>{{ event.name }}</h4>
        <p>{{ event.from }} {{ event.to }}</p>
        <p>{{ event.company_name }}</p>
        <p v-if='event.type !== "ONL"'>{{ event.address }}, {{ event.zipcode }} {{ event.postaladdress }}</p>
        <p v-if='event.type === "ONL"'>Evenemang över internet</p>
      </div>
    </div>
    <div class="col-2">
      <div class="event-buttons text-center">
        <div class="row">
          <div class="col-12">
            <button
              type="button"
              class="btn btn-primary .signup-loggedin"
              v-if="!client_event"
              @click="clickedEventButton"
            >
              Anmäl dig
            </button>

            <button
              type="button"
              class="btn btn-primary .signup-loggedin"
              v-if="client_event"
              @click="clickedEventButton"
            >
              Du är anmäld
            </button>
          </div>
        </div>
        <div class="row text-center" style="margin-top: 20px">
          <div class="col-12"><a :href="href">Läs mer</a></div>
        </div>
      </div>

    </div>
  </div>
</b-card>
</template>
<style lang="scss" scoped>
.checkbox > span {
  background-color: white;
  border: 1px solid #ddd;
}
.event-date {
    border: 1px solid black;
    width: 72px;
    padding: 10px;
}

.event-date h2 {
    color: black;
}

.event-date span {
    color: black;
}

.side-event li {
    list-style: none;
    padding-left: 0px;
    height: 110px;
    margin-bottom: 20px;
}

.side-event {
    padding-left: 0px;
}

.event-group {
    clear: both;
}

.side-event button {
    float: right;
}

.side-event h4 {
    font-size: 16px;
}

.modal-footer h4::after {
    content: "\a";
    white-space: pre;
}

.title-info h4 {
    font-size: 1.1rem;
    color: black;
}
</style>
<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'event-list-row',
  props: ['event', 'client_event'],
  computed: {
    href: function() {
      return '/event/'+this.event.event_id;
    }
  },
  data() {
    return {

    };
  },
  mounted() {

  },
  watch: {},
  methods: {
    clickedEventButton() {
      this.$router.push('/event/' + this.event.event_id);
    },
    selectEventClicked() {
      this.$emit('selectEventClicked', this.event, this.client_event);
    },
    dateStarted(format) {
      let time = moment(this.event.from_datetime);
      return time.format(format);
    }
  }
};
</script>
