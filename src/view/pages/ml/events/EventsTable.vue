<template>
  <!--begin::Advance Table Widget 9-->
  <div class="card card-custom card-stretch gutter-b">
    <!--begin::Header-->
    <div class="card-header border-0 py-5">
      <!-- <h3 class="card-title align-items-start flex-column">
        <span class="card-label font-weight-bolder text-dark">&nbsp;</span>
      </h3> -->
      <div class="card-toolbar d-flex justify-content-between justify-content-sm-end w-100">
        <div class="d-flex align-items-center mr-sm-12 my-2">
          <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
            <input type="checkbox" name="" v-model="show_history" @click="show_history = !show_history" />
            <span></span>
          </label>
          <span class="ml-3 cursor-pointer">Tidigare event</span>
        </div>

        <a href="#" class="btn btn-primary font-weight-bolder font-size" @click="createEventClicked"
          ><i class="menu-icon flaticon2-plus" style="font-size: 1.0em;"></i>Nytt event</a>
      </div>
    </div>
    <!--end::Header-->
    <!--begin::Body-->
    <div class="card-body pt-0 pb-3 table-reponsive">
      <b-table
        id="event-table"
        :fields="headers"
        :items="items"
        head-variant="light"
        sticky-header
        class="mh-100"
      >
        <template #cell(event_id)="row">
          <div class='justify-content-end d-flex'>

             <a
              :href="event_url(row.item.event_id)"
              target="_blank"
              class="btn btn-icon btn-light btn-sm mx-3"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Directions.svg"></inline-svg>
              </span>
            </a>

            <a
              href="#"
              class="btn btn-icon btn-light btn-sm mr-3"
              @click="selectEventClicked(row.item.event_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Write.svg"></inline-svg>
              </span>
            </a>
            <a
              href="#"
              class="btn btn-icon btn-light btn-sm"
              @click="deleteEventClicked(row.item.event_id)"
            >
              <span class="svg-icon svg-icon-md svg-icon-primary">
                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
              </span>
            </a>
          </div>
        </template>
      </b-table>

      <!--begin::Table-->
      <!-- <div class="table-responsive">
        <table class="table table-head-custom table-vertical-center table-head-bg table-borderless">
          <thead>
            <tr class="text-left">
              <th style="min-width: 40px" class="pl-7">
                <span class="text-dark-75">Namn</span>
              </th>
              <th>Start Datum</th>
              <th>Anmälda</th>
              <th>LEDIGA PLATSER</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, i) in items">
              <EventsTableRow
                v-bind:key="i"
                :event="item"
                :currentCompanyId="currentCompanyId"
                @selectEventClicked="selectEventClicked"
                @deleteEventClicked="deleteEventClicked"
                @publishEventClicked="publishEventClicked"
                @toastr="toastr"
              />
            </template>
          </tbody>
        </table>
      </div> -->
      <!--end::Table-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Advance Table Widget 9-->
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>
<script>
import axios from 'axios';
import EventsTableRow from '@/view/pages/ml/events/EventsTableRow.vue';

export default {
  name: 'events-table',
  props: ['items', 'currentCompanyId'],
  components: {
    EventsTableRow
  },
  watch: {
    show_history(newcheck, oldcheck) {
      this.$emit('showHistoryToggled', newcheck);
    }
  },
  methods: {
    createEventClicked() {
      this.$emit('createEventClicked');
    },
    selectEventClicked(event_id) {
      this.$emit('selectEventClicked', event_id);
    },
    deleteEventClicked(event_id) {
      this.$emit('deleteEventClicked', event_id);
    },
    publishEventClicked(event_id){
      this.$emit('publishEventClicked', event_id)
    },
    gotoEvent(event_id){
      this.$router.push(`/event/${event_id}`)
    },
    toastr(type, title, message) {
      this.$emit('toastr', type, title, message);
    },
    event_url(event_id) {
      return '/event/' + event_id;
    }
  },
  data() {
    return {
      show_history: false,
      headers: [
        {
          key: 'name',
          label: 'Evenemang',
          sortable: true,
          thClass: 'pl-7 align-middle',
          tdClass: 'pl-7'
        },
        {
          key: 'from_datetime',
          label: 'Start Datum',
          sortable: true,
          thClass: 'w-140px align-middle',
          tdClass: 'w-140px',
        },
        {
          key: 'num_signups',
          label: 'Anmälda',
          sortable: true,
          thClass: 'w-100px align-middle',
          tdClass: 'w-100px',
        },
        {
          key: 'num_seats',
          label: 'Platser',
          sortable: true,
          thClass: 'w-150px align-middle',
          tdClass: 'w-150px',
        },
        {
          key: 'event_id',
          label: 'Hantera',
          thClass: 'text-right pr-22 w-110px align-middle',
        },
      ],
      list: []
    };
  }
};
</script>
