<template>
  <div class="px-5" id="page-events">
    <h4 class="mb-4 mt-4 ml-2">Evenemang för {{ company.name }}</h4>

    <EventList
      :company="company"
      :events="events"
      @selectEventClicked="selectEventClicked"
    />

  </div>
</template>

<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
</style>

<script>
import messageParent from '@/core/services/messageParent';
import axios from 'axios';
import moment from 'moment';
import { mapGetters } from 'vuex';
import EventList from '@/view/pages/members/public/EventList.vue';

export default {
  name: 'event-page',
  components: {
    EventList,
  },
  computed: {
    ...mapGetters(['currentClient'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
      company: { company_id: 'aaaa', name: '' },
      events: [],
    };
  },
  watch: {
  },
  methods: {
    showModal() {
      this.$refs['my-modal'].show()
    },
    hideModal() {
      this.$refs['my-modal'].hide()
    },
    async loadData() {
      this.company.company_id = this.$route.params.id;
      await this.loadCompany();
      await this.loadEvents();
    },
    async loadEvents() {
      if (!this.currentClient) {

        const loader = this.$loading.show();
        this.events = [];
        const res = await axios.get(`/events/list?company_id=${this.company.company_id}`)

        if (res.status === 200) {

          var events = res.data.events;
          var now = moment();
          for (var k in events) {
            var comp = events[k];

            for (var i = 0; i < comp.length; ++i) {

              var eventdt = moment(comp[i].to_datetime);
              if (eventdt < now) {
                continue;
              }
              //check event date
              this.events.push({ event: comp[i], client_event: null});
            }
          }

          setTimeout(function(){
            messageParent(JSON.stringify({ height: document.body.scrollHeight }));
          }, 300);
        } else {
          console.error(res);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista evenemang');
        }
        loader & loader.hide();
      } else {
        axios
          .get(`/events/listforclient?company_id=${this.company.company_id}&client_id=${this.currentClient.client_id}`) // ----- from_datetime is ''
          .then(res => {
            let now = moment();
            const events = res.data.events.filter(function(item) {
              let eventdt = moment(item.event.from_datetime);
              return now < moment(item.event.to_datetime);
            });
            if (events === undefined)
              this.events = [];
            else
              this.events = events;
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte hämta evenemang');
          });
      }
      await this.mapEvents();
    },
    mapEvents(){
      const ids = this.events.map(item => {
        return item.event.company_id;
      });
      this.events = this.events.map(item => {
        const index = this.company.companies.findIndex(el => el.company_id === item.event.company_id);

        if (index !== -1 && !ids.every(id => id === this.company.company_id)) {
          item.event.company_name = this.company.companies[index].name;
        } else
          item.event.company_name= '';

        return item;
      });
    },
    loadCompany() {
      axios
        .get(`/company/public?company_id=${this.company.company_id}`)
        .then(res => {
          this.company = res.data.company;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta förening');
        });
    },
    toggleModal() {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs['my-modal'].toggle('#toggle-btn')
    },
    selectEventClicked() {},
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    }
  }
};
</script>
