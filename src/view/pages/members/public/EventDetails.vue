<template>
  <div class="px-5" id="page-event-details">
    <b-modal ref="loginModal" hide-footer no-close-on-backdrop>
      <EventLogin
        :company_id="event.company_id"
        @addUserToEvent='addUserToEvent'
      />
      <!-- <div class="d-flex align-items-right justify-content-between mb-8">
        <b-button class="mx-auto" type="button" variant="primary" @click="continueNoAccount"
          >Fortsätt utan att skapa konto</b-button
        >
      </div> -->
    </b-modal>

    <b-modal ref="noAccountModal" hide-footer no-close-on-backdrop>
      <RegisterMemberNoAccount
        @submitForm="signupNoAccount"
        @submitForms="signupNoAccounts"
        :public_only='event.public_only'
        :members_only='event.members_only'
        :company_id='event.company_id'
      />
    </b-modal>

    <b-modal ref="successJoin" hide-footer>
      <div class="row">
            <div class="col-12 text-center">
                <i class="fa fa-check-circle" style="font-size: 42px; color: #8dda8d;"></i>
            </div>
        </div>
        <div class="row" style="margin-top: 15px; border-top: 1px solid #ebedf2; padding-top: 20px;">
            <div class="col-12 text-center">
                <h4 class="event-name" style="text-align: center;">{{ event.name }}</h4><br>
                <p>Ett mail kommer att skickas till din e-postadress med din biljett som du eventuellt kan komma att behöva visa upp vid tillträde till evenemanget.</p>

            </div>
        </div>
    </b-modal>

    <b-row class="mt-16" v-if="this.preview_event_id">
      <b-col lg="12">
        <b-card :title="event.name" class="mb-2 shadow-sm" hide-footer>
          <div v-if='client_id > -1'>
            <img :src='getImage()'>
          </div>
          <div class='d-flex justify-content-end'>
            <a href="#" @click="gotoEvent()">
              Läs mer
            </a>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <b-row :class="this.preview_event_id ? 'mt-4' : 'mt-16'">
      <b-col lg="12" v-if='event.type !== "ONL"'>
        <google-map
          :center="{ lat: event.google_maps.lat, lng: event.google_maps.lng }"
          :zoom="16"
          style="height: 256px"
          id="map"
          ref="Map"
          class="shadow-sm p-2 mb-5 rounded"
        >
          <google-map-marker
            :position="{ lat: event.google_maps.lat, lng: event.google_maps.lng }"
          ></google-map-marker>
        </google-map>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col lg="12">
        <b-card title="Detaljer" class="mb-2 shadow-sm" hide-footer>
          <div class="row">
            <div class="col-8">
              <div class="title-info">
                <h4>Datum och Tid</h4>
                <p>{{ from_formatted }}</p>
              </div>
              <div class="title-info">
                <h4>Plats</h4>
                <p v-if='event.type !== "ONL"'>{{ event.address }}, {{ event.zipcode }} {{ event.postaladdress }}</p>
                <p v-if='event.type === "ONL"'>Evenemang över internet</p>
              </div>
            </div>
            <div class="col-4">
              <div class="title-info">
                <h4>Kostnad</h4>
                <p>{{ price }}</p>
                <p
                  v-if="iAmSignedUp"
                  id="i-am-signedup-label"
                  style="display: none; color: #00c357; font-weight: bold"
                >
                  Du är anmäld
                </p>

                <p
                  v-if="isFull"
                  id="i-am-signedup-label"
                  style="display: none; color: #00c357; font-weight: bold"
                >
                  Evenemanget är fullt
                </p>

                <p
                  v-if="!isFull"
                  id="i-am-signedup-label"
                  style="display: none; color: #00c357; font-weight: bold"
                >
                  Evenemanget har platser kvar
                </p>

              </div>
              <div>
                <!--Button for when NOT logged in-->
                <button
                  v-if="!iAmSignedUp && !isFull"
                  id="btn-login-modal"
                  type="button"
                  class="btn btn-primary"
                  @click="signup"
                >
                  Anmäl dig
                </button>
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <b-row class='mt-4' v-if='isExistsLink()'>
      <b-col lg="12">
        <b-card title="Länkar" class="mb-2 shadow-sm" hide-footer>
          <a :href='event.facebook_url' :title="event.facebook_url" class='d-flex mb-3'
            v-if='event.facebook_url !== undefined && event.facebook_url != "" && this.event.facebook_url != "https://"'
          >
            <i class="fab fa-facebook-square mr-5" style="font-size:36px" ></i>
            <span class='align-self-center'>Läs mer information om eventet på Facebook </span>
          </a>
          <a :href='event.extern_url' :title="event.extern_url" class='d-flex'
            v-if='event.extern_url !== undefined && event.extern_url !="" && this.event.extern_url != "https://"'
          >
            <!-- <i class="fab fa-internet-explorer pr-2 " style="font-size:36px" :title="event.extern_url"></i> -->
            <i class="fas fa-globe pr-1 mr-3" style="font-size:36px" :title="event.extern_url"></i>
            <span class='align-self-center'>Besök denna webbplats för läsa mer om evenemanget </span>
          </a>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-4" v-if="!this.preview_event_id">
      <b-col lg="12">
        <b-card :title="event.name" class="mb-2 shadow-sm" hide-footer>
          <div v-html="event.descr_html"></div>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-4" v-if="this.preview_event_id">
      <b-col lg="12">
        <div class='d-flex justify-content-end'>
          <a href="#" class="btn btn-sm mx-3 font-weight-bold" @click="gotoEvent()">
            <!-- <span class="svg-icon svg-icon-md svg-icon-primary"> -->
              <!-- Läs mer -->
            <!-- </span> -->
          </a>
        </div>
      </b-col>
    </b-row>
  </div>
</template>


<style lang="scss" >
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
  img {
    width: 100%;
    height: auto;
  }
  .event_style {
    background-color: grey;
  }
</style>

<script>
import messageParent from '@/core/services/messageParent';
import axios from 'axios';
import { mapGetters } from 'vuex';
import moment from 'moment';
import EventLogin from '@/view/pages/members/public/EventLogin.vue';
import RegisterMemberNoAccount from '@/view/pages/members/auth/RegisterMemberNoAccount.vue';

export default {
  name: 'page-event-details',
  components: {
    EventLogin, RegisterMemberNoAccount
  },
  props: {
    preview_event_id: { type: Number, default: 0 },
    client_id: { type: Number, default: -1}
    },
  computed: {
    ...mapGetters(['isMemAuthenticated'])
  },
  mounted() {
    this.loadEvent();
  },
  data() {
    return {
      event: {
        google_maps: { lat: 0, lng: 0 }
      },
      client_events: [],
      from_formatted: '',
      price: '',
      count_clients: 0,
      iAmSignedUp: false,
      isFull: false
    };
  },
  watch: {
    event(newVal, oldVal){
      console.log(newVal)
    }
  },
  methods: {
    signup() {
      if (this.event.public_only && !this.event.members_only)
        this.$refs['noAccountModal'].show();
      else
        this.$refs['loginModal'].show();
    },
    showModal() {
      this.$refs['loginModal'].show();
    },
    hideModal() {
      this.$refs['loginModal'].hide();
    },
    toggleModal() {
      // We pass the ID of the button that we want to return focus to
      // when the modal has hidden
      this.$refs['loginModal'].toggle('#toggle-btn');
    },
    async loadData() {

      this.loadEvent();
    },

    loadEvent() {
      this.event_id = this.$route.params.id;

      if (this.preview_event_id) {
        this.event_id = this.preview_event_id;
      }

      axios
        .get(`/events?event_id=${this.event_id}`)
        .then(res => {
          this.event = res.data.event;

          if (this.event.from_datetime === '' || this.event.from_datetime === null) {
            this.event.from_datetime = '2020-12-01T20:00:00';
          }

          if (this.event.to_datetime === '' || this.event.to_datetime === null) {
            this.event.to_datetime = '2099-12-31T20:00:00';
          }

          var mom = moment(this.event.from_datetime).format('YYYY-MM-DD HH:mm') + ' till ' + moment(this.event.to_datetime).format('YYYY-MM-DD HH:mm');

          if (this.event.cost === 0) {
            this.price = 'Gratis';
          } else {
            this.price = this.event.cost + ' kr';
          }

          this.from_formatted = mom;

          this.isFull = !(this.event.num_signups < this.event.num_seats);

          setTimeout(function(){
            messageParent(JSON.stringify({ height: document.body.scrollHeight }));
          }, 300);
        })
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Kunde inte hitta evenemang');
          this.$router.push('/404')
        });

        axios
          .get(`/client_event?event_id=${this.event_id}`)
          .then(res => {
            if (res.status === 200) {
              this.count_clients = res.data.client_events.length;
              this.client_events = res.data.client_events;
            }
          })
          .catch(err =>{
            console.log(err, "clients for event");
          });
    },

    continueNoAccount() {
      this.$refs['loginModal'].hide();
      this.$refs['noAccountModal'].show();
    },

    signupNoAccounts(form, company_ids) {
      //for (let i = 0; i < company_ids.length; i++) {
        var data = form;
        data.company_ids = company_ids;
        data.event_id = this.event.event_id;
        data.signeup = 1;
        data.ts_signup = moment().format("YYYY-MM-DD");
        axios
          .post('/events/joinnoaccount', data)
          .then(res => {
            if (res.status === 406) {
              this.toastr('danger', 'Fullt', 'Evenemanget har slut på platser');
              return;
            }
            if (res.status == 201) {
              this.event.num_signups++;

              this.isFull = !(this.event.num_signups < this.event.num_seats);
              this.iAmSignedUp = true;

              this.$refs['noAccountModal'].hide();
              this.$refs['successJoin'].show();
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte anmäla till evenemang');
          });
      //}
    },
    signupNoAccount(form) {
      console.log('signed up with no account');
      console.log(form);

      var data = form;
      data.event_id = this.event.event_id;
      data.signeup = 1;
      data.ts_signup = moment().format("YYYY-MM-DDTHH:mm:ss");

      axios
        .post('/events/joinnoaccount', data)
        .then(res => {
          if (res.status == 201) {
            this.$refs['noAccountModal'].hide();
            this.$refs['successJoin'].show();

            this.iAmSignedUp = true;

            this.event.num_signups++;

            this.isFull = !(this.event.num_signups < this.event.num_seats);
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte anmäla till evenemang');
        });
    },
    signupAccount(form) {
      var data = form;
      data.event_id = this.event.event_id;
      console.log('SignupAccount');
      axios
        .post('/events/joinclient', data)
        .then(res => {
          this.$refs['loginModal'].hide();
          this.$refs['successJoin'].show();

          this.event.num_signups++;

          this.iAmSignedUp = true;
          this.isFull = !(this.event.num_signups < this.event.num_seats);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte anmäla till evenemang');
        });
    },
    addUserToEvent(client_id) {

      let data = {client_id: client_id, event_id: this.event.event_id};
      let index = this.client_events.findIndex(function(item) {
        if (item.client.hasOwnProperty('client_id'))
          return item.client.client_id == client_id;
        else
          return false;
      });
      if (index > -1) {
        this.toastr('info', 'Action Fel', 'Du är redan registrerad');
        return;
      }
      // data['client_id'] = client_id;
      // data['event_id'] = this.event.event_id;
      axios
        .post('/events/joinclient', data)
        .then(res => {

          this.event.num_signups++;

          this.iAmSignedUp = true;
          this.isFull = !(this.event.num_signups < this.event.num_seats);

          this.$refs['loginModal'].hide();
          this.$refs['successJoin'].show();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte anmäla till evenemang');
        });
    },
    isExistsLink()
    {
      return (this.event.extern_url !== undefined && this.event.extern_url !="" && this.event.extern_url != 'https://') ||
            (this.event.facebook_url !== undefined && this.event.facebook_url != "" && this.event.facebook_url != 'https://');
    },

    gotoEvent() {
      this.$router.push(`/event/${this.event.event_id}`);
    },

    getImage() {
      let that = this;
      let index = this.client_events.findIndex(item => item.client_event.client_id == that.client_id);
      return index == -1 ? '' : this.client_events[index].client_event.qr_url;
    },
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
