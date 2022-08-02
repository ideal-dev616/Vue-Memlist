<template>
  <div class="px-5" id="page-events">
    <h5 class="mb-6 ml-2">Evenemang</h5>
    <div class="scroll-to-top"></div>
    <EventsTable
        :items="events"
        @showHistoryToggled="showHistoryToggled"
        @createEventClicked="createEvent"
        @publishEventClicked="publishEventClicked"
        @selectEventClicked="selectEvent"
        @deleteEventClicked="deleteEvent"
        @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-event-container"
      ref="edit-event"
      id="edit-event"
      hide-footer
      v-if="creating || editing"
    >
      <b-tabs content-class="mt-3" lazy>
        <b-tab title="Inställningar" active>
          <div>
            <b-form
              class="mt-8"
              @submit="saveEvent"
            >
              <b-form-group
                id="input-group-event_id"
                label="ID"
                label-for="input-event_id"
                >
                <b-form-input
                    id="input-event_id"
                    v-model="form.event_id"
                    type="text"
                    disabled
                ></b-form-input>
                </b-form-group>

                <b-form-group
                id="input-group-1"
                label="Namn på evenemang"
                label-for="input-1"
                >
                <b-form-input
                    id="input-1"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Namn på evenemang"
                ></b-form-input>
                </b-form-group>

                <b-form-group id="descr-group" label="Text" label-for="descr">
                  <editor
                  v-model="form.descr_html"
                  api-key="qjaly68mahdluhx0rongdllvelixwgn18730f5z7fdzq6hq2"
                  :init="{
                      height: 500,
                      menubar: false,
                      external_plugins: {
                      thsvariables: 'http://localhost:8080/assets/plugins/thstinymce.js'
                      },
                      plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar:
                      'undo redo | formatselect | bold italic backcolor | \
                          alignleft aligncenter alignright alignjustify | \
                          bullist numlist outdent indent | removeformat | thsvariables'
                  }"
                  />
                </b-form-group>
                <b-card>
                  <h4 class="mb-8">Tidpunkt för evenemanget</h4>

                  <b-row>
                    <b-col lg="12">
                      <VueCtkDateTimePicker id="from_datetime" name="from_datetime" v-model="form.from_datetime" label="Starttid" format="YYYY-MM-DD HH:mm" class="mb-8" />
                    </b-col>
                  </b-row>

                  <b-row>
                    <b-col lg="12">
                      <VueCtkDateTimePicker id="to_datetime" name="to_datetime" v-model="form.to_datetime" label="Sluttid" format="YYYY-MM-DD HH:mm" class="mb-8" />
                    </b-col>
                  </b-row>

                </b-card>

                <b-card class='mt-8'>
                  <h4 class="mb-8">Adress till evenemanget</h4>

                  <div class="d-flex align-items-center mb-4">
                    <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                    <input
                        type="checkbox"
                        name=""
                        v-model="online"
                        @click="online = !online"
                    />
                    <span></span>
                    </label>
                    <span class="ml-3 cursor-pointer">Evenemanget är online/via internet</span>
                  </div>

                  <!-- <div v-if="online">
                    <b-form-group id="main_url-group" label="Evenemangslänk (visas när evenemanget har startats)" label-for="main_url">
                    <b-form-input
                        id="main_url"
                        v-model="form.main_url"
                        placeholder=""
                    ></b-form-input>
                    </b-form-group>
                  </div> -->

                  <div v-if="!online">
                    <b-form-group id="address-group" label="Gatuadress" label-for="address">
                    <b-form-input
                        id="address"
                        v-model="form.address"
                        placeholder="Gatuadress"
                    ></b-form-input>
                    </b-form-group>

                    <b-row>
                    <b-form-group class="col-6" id="zipcode-group" label="Postkod" label-for="zipcode">
                    <b-form-input
                        id="zipcode"
                        v-model="form.zipcode"
                        placeholder="Postkod"
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group class="col-6" id="postaladdress-group" label="Postort" label-for="postaladdress">
                    <b-form-input
                        id="postaladdress"
                        v-model="form.postaladdress"
                        placeholder="Postort"
                    ></b-form-input>
                    </b-form-group>
                    </b-row>

                    <b-alert v-if="!online && !hasGoogleMaps" show variant="danger">Google Maps har inte genererats för detta fysiska evenemang. Klicka på knappen nedan EFTER att du har angett adress, postkod och postort</b-alert>

                    <b-row class="mb-8">
                      <b-col lg="4">
                        <b-button type="button" variant="primary" @click="generateGoogleClicked">Generera Google Maps</b-button>
                      </b-col>
                    </b-row>

                    <b-row class="mb-8">
                      <b-col lg="12">
                        <google-map
                          :center="{ lat: form.google_maps.lat, lng: form.google_maps.lng }"
                          :zoom="16"
                          style="height: 256px" id="map" ref="Map">
                        <google-map-marker
                          :position="{ lat: form.google_maps.lat, lng: form.google_maps.lng }"
                        ></google-map-marker>

                        <google-map-infowindow
                          :position="infoWIndowContext.position"
                          :show.sync="showInfo"
                          :options="{maxWidth: 300}"
                        >
                          <h4>{{infoWIndowContext.title}}</h4>
                          <p>{{infoWIndowContext.description}}</p>
                        </google-map-infowindow>
                      </google-map>
                      </b-col>
                    </b-row>
                  </div>
                </b-card>

                <b-card class='mt-8'>
                  <div v-b-toggle.collapse_url_group class='d-flex justify-content-between w-100 bg-white'
                    @click='collapse_url_group=!collapse_url_group'
                    >
                    <h4>Externa informationslänkar</h4>
                    <b-button variant="primary" class='collapse_button'>
                      {{ collapse_url_group ? "Stäng" : "Öppna" }}
                    </b-button>
                  </div>
                  <b-collapse id='collapse_url_group' class='mt-4'>
                    <b-form-group id="facebook_url-group" label="Facebook Länk" label-for="facebook_url">
                    <b-form-input
                        id="facebook_url"
                        v-model="form.facebook_url"
                        placeholder="Facebook Länk"
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group id="extern_url-group" label="Annan länk" label-for="extern_url">
                    <b-form-input
                        id="extern_url"
                        v-model="form.extern_url"
                        placeholder="Annan Länk"
                    ></b-form-input>
                    </b-form-group>
                  </b-collapse>
                </b-card>

                <b-card class='mt-8'>
                  <div v-b-toggle.collapse_book_vat_acct class='d-flex justify-content-between w-100 bg-white'
                    @click='collapse_book_vat_acct=!collapse_book_vat_acct'>
                    <h4>Bokföring</h4>
                    <b-button variant="primary" class='collapse_button'>
                      {{ collapse_book_vat_acct ? "Stäng" : "Öppna" }}
                    </b-button>
                  </div>

                  <!-- <b-form-group id="book_acct" label="Bokför under kontor" label-for="book_acct ">
                    <b-form-input
                            id="book_acct "
                            v-model="form.book_acc"
                    ></b-form-input>
                  </b-form-group> -->
                  <b-collapse id='collapse_book_vat_acct' class='mt-4'>
                    <b-form-group id="book_vat_acct" label="Momskonto" label-for="book_vat_acct">
                      <b-form-input
                              id="book_vat_acct"
                              v-model="form.book_vat_acct"
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group id="book_cost_center" label="Kostnadsställe" label-for="book_cost_center">
                      <b-form-input
                              id="book_cost_center"
                              v-model="form.book_cost_center"
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group id="book_tags" label="Taggar" label-for="book_tags">
                      <b-form-tags
                              input-id="book_tags"
                              v-model="form.book_tags"
                              remove-on-delete
                      >
                      </b-form-tags>
                    </b-form-group>
                  </b-collapse>
                </b-card>

                <b-card class='mt-8'>
                  <div v-b-toggle.cost-group-member class='d-flex justify-content-between w-100 bg-white'
                    @click='cost_group_member=!cost_group_member'>
                    <h4>Kostnader</h4>
                    <b-button variant="primary" class='collapse_button'>
                      {{ cost_group_member ? "Stäng" : "Öppna" }}
                    </b-button>
                  </div>

                  <b-collapse id='cost-group-member' class='mt-4'>
                    <b-form-group id="cost-group" label="Kostnad för medlemmar" label-for="cost">
                    <b-form-input
                        id="cost"
                        v-model="form.cost"
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group id="cost_non_members-group" label="Kostnad för övriga" label-for="cost_non_members">
                    <b-form-input
                        id="cost_non_members"
                        v-model="form.cost_non_members"
                    ></b-form-input>
                    </b-form-group>
                  </b-collapse>
                </b-card>

                <b-card class='mt-8'>
                  <h4 class="mb-8">Kommunikation</h4>

                  <b-form-group id="ticket_template_id-group" label="E-postmall för biljett" label-for="ticket_template_id">
                  <b-form-select
                      id="ticket_template_id"
                      v-model="form.ticket_template_id"
                      :options="emailTemplatesOptions"
                  ></b-form-select>
                  </b-form-group>


                  <!--<b-form-group id="signedup_template_id-group" label="E-post mall för bekräftelse" label-for="ticket_template_id">
                  <b-form-select
                      id="signedup_template_id"
                      v-model="form.signedup_template_id"
                      :options="emailTemplatesOptions"
                  ></b-form-select>
                  </b-form-group>-->
                </b-card>

              <div v-if='false'>
                <div class="d-flex align-items-center mb-4">
                  <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                  <input
                      type="checkbox"
                      name=""
                      v-model="form.send_email_invite"
                      @click="form.send_email_invite = !form.send_email_invite"
                  />
                  <span></span>
                  </label>
                  <span class="ml-3 cursor-pointer">Skicka inbjudan till alla medlemmar</span>
                </div>

                <b-form-group v-if="form.send_email_invite" id="email_template_id-group" label="E-post för inbjudning" label-for="email_template_id">
                <b-form-select
                    id="email_template_id"
                    v-model="form.email_template_id"
                    :options="emailTemplatesOptions"
                ></b-form-select>
                </b-form-group>

                <div class="d-flex align-items-center mb-4">
                  <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                  <input
                      type="checkbox"
                      name=""
                      v-model="form.send_sms_invite"
                      @click="form.send_sms_invite = !form.send_sms_invite"
                  />
                  <span></span>
                  </label>
                  <span class="ml-3 cursor-pointer">Skicka SMS inbjudan till alla medlemmar</span>
                </div>

                <b-form-group v-if="form.send_sms_invite" id="sms_template_id-group" label="SMS för inbjudning" label-for="sms_template_id">
                <b-form-select
                    id="sms_template_id"
                    v-model="form.sms_template_id"
                    :options="smsTemplatesOptions"
                ></b-form-select>
                </b-form-group>

                <b-form-group class="mt-8" id="input-group-4" label="Skicka inbjudan vid denna tidpunkt" label-for="input-4">
                  <b-form-datepicker id="input-4" v-model="form.send_invite_at" class="mb-2"> </b-form-datepicker>
                </b-form-group>
              </div>
              <b-card class='mt-8 mb-8'>
                <h4 class="mb-8">Ansökningssätt</h4>

                <b-form-group>
                  <div class="d-flex align-items-center">
                      <label class="radio radio-list radio-outline radio-success">
                      <input type="radio" name="open_setting" v-model="open_setting" value="members" />
                      <span></span>
                      </label>
                      <span class="ml-3 cursor-pointer"
                      >Endast för medlemmar</span
                      >
                  </div>
                </b-form-group>

                <b-form-group>
                  <div class="d-flex align-items-center">
                      <label class="radio radio-list radio-outline radio-success">
                      <input type="radio" name="open_setting" v-model="open_setting" value="public" />
                      <span></span>
                      </label>
                      <span class="ml-3 cursor-pointer"
                      >Öppet för alla</span
                      >
                  </div>
                </b-form-group>

                <b-form-group id="num_seats" label="Max antal deltagare" label-for="num_seats">
                  <b-form-input
                          id="num_seats"
                          type="number"
                          v-model="form.num_seats"
                          :min='clients_event.length'
                  ></b-form-input>
                </b-form-group>

              </b-card>
              <div v-if='false'>
                <div class="d-flex align-items-center mb-4">
                  <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                  <input
                      type="checkbox"
                      name=""
                      v-model="form.strike_system"
                      @click="form.strike_system = !form.strike_system"
                  />
                  <span></span>
                  </label>
                  <span class="ml-3 cursor-pointer">Ge varning vid utebliven närvaro</span>
                </div>

                <b-form-group v-if="form.strike_system" id="strike_template_id-group" label="E-post att skicka vid utebliven närvaro" label-for="strike_template_id">
                <b-form-select
                    id="strike_template_id"
                    v-model="form.strike_template_id"
                    :options="emailTemplatesOptions"
                ></b-form-select>
                </b-form-group>

                <b-form-group v-if="form.strike_system" id="num_strike_days-group" label="Antal dagar varningen gäller" label-for="num_strike_days">
                <b-form-input
                    id="num_strike_days"
                    v-model="form.num_strike_days"
                ></b-form-input>
                </b-form-group>

                <b-form-group id="num_strikes_max-group" label="Max antal tillåtna varningar för att delta" label-for="num_strikes_max">
                <b-form-input
                    id="num_strikes_max"
                    type="number"
                    v-model="form.num_strikes_max"
                ></b-form-input>
                </b-form-group>

                <b-form-group id="num_strikes_orgs-group" label="Tillåt inte organisationer med minst antal utelåsta medlemmar" label-for="num_strikes_orgs">
                <b-form-input
                    id="num_strikes_orgs"
                    v-model="form.num_strikes_orgs"
                ></b-form-input>
                </b-form-group>
              </div>
              <div v-if="!online && !hasGoogleMaps" class='d-flex justify-content-between'>
                <b-alert show variant="danger" class='flex-fill mr-2'>Detta är ett fysiskt evenemang och du har inte genererat någon google map. Klicka här för att generera</b-alert>
                <b-button type="button" variant="primary" @click="generateGoogleClicked" style='height:40px;'>Klicka här</b-button>
              </div>
              <!--<b-alert v-if="!form.members_only && !form.public_only" show variant="danger">Du måste välja ansökningssätt</b-alert>-->
              <div>
                <b-button type="submit" variant="primary" :disabled="(!form.members_only && !form.public_only) || (!online && !hasGoogleMaps)">Spara</b-button>
                <!--<b-button class="ml-2" variant="primary" @click="publishEvent" :disabled="!form.members_only && !form.public_only">publicera</b-button>-->
              </div>
            </b-form>
          </div>
        </b-tab>
        <b-tab title="Anmälda" class='table-reponsive'>
          <b-table :items="clients_event" :fields="event_headers"
            sticky-header
          >
            <template #cell(hantera)="row">
              <a
                href="#"
                class="btn btn-icon btn-light btn-sm mx-3"
                @click="deleteClient_Event(row.item)"
              >
                <span class="svg-icon svg-icon-md svg-icon-primary">
                  <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                </span>
              </a>
            </template>
          </b-table>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<style lang="scss" scoped>

.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.bg-white {
  background-color: white;
}
.collapse_button {
  width: 80px;
}

.date-time-picker {
  font-family: Poppins, Helvetica, "sans-serif" !important;
}


</style>

<script>
import Editor from '@tinymce/tinymce-vue';
import axios from 'axios';
import moment from 'moment';
import { mapGetters } from 'vuex';
import EventsTable from '@/view/pages/ml/events/EventsTable.vue';
import Companies from './Companies.vue';
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';

export default {
  name: 'events',
  components: {
    EventsTable,  editor: Editor,
    Companies,
    VueCtkDateTimePicker
  },
  computed: {
    ...mapGetters(['companies', 'currentCompanyId', 'currentPeriodId'])
  },
  mounted() {
    this.loadData();
  },
  data() {
    return {
        open_setting: 'members',
        showHistory: false,
        hasGoogleMaps: false,
        cost_group_member: false,
        collapse_book_vat_acct: false,
        collapse_url_group: false,
        form: {
            event_id: '',
            num_strikes_orgs: 9999999,
            num_strikes_max: 9999999,
            num_seats: 0,
            num_signups: 0,
            num_strike_days: 0,
            strike_template_id: '',
            strike_system: false,
            members_only: true,
            public_only: false,
            sms_template_id: '',
            send_sms_invite: false,
            email_template_id: '',
            send_email_invite: false,
            signedup_template_id: '',
            ticket_template_id: '',
            cost_non_members: 0,
            cost: 0,
            extern_url: '',
            facebook_url: '',
            to_datetime: '',
            from_datetime: '',
            postaladdress: '',
            zipcode: '',
            address: '',
            descr: '',
            name: '',
            type: 'PHY',
            book_acct_first: 0,
            book_acct_second: 0,
            google_maps: { lat: 0, lng: 0, static_link: '' },
            book_tags:           [],
            book_acct:'',
            book_vat_acct:'',
            book_cost_center:'',
        },
        clients_forevent: [],
        clients_event: [],
        online: false,
        creating: false,
        editing: false,
        templates: [],
        emailTemplatesOptions: [],
        smsTemplatesOptions: [],

        addressok: false,
        zipcodeok: false,
        postaladdressok: false,

        generateGoogle: false,

        showInfo: false,

        events: [],
        event_headers: [
          {
            key: 'from',
            label: 'Registrering',
            sortable: true
          },
          {
            key: 'company',
            label: 'Företagsnamn',
          },
          {
            key: 'firstname',
            label: 'Förnamn',
            sortable: false
          },
          {
            key: 'lastname',
            label: 'Efternamn',
            sortable: true,
          },
          {
            key: 'email',
            label: 'E-post',
          },
          {
            key: 'telefon',
            label: 'Telefon',
          },
          {
            key: 'hantera',
            label: 'Hantera'
          }
        ],

        infoWIndowContext: {
          position: {
            lat: 44.2899,
            lng: 11.8774
          }
        },
        infoWindowsList: []
    };
  },
  watch: {
    open_setting(newValue, oldValue) {
      if (newValue == 'members') {
        this.form.members_only = true;
        this.form.public_only = false;
      }
      else if (newValue == 'public') {
        this.form.members_only = false;
        this.form.public_only = true;
      }
    },
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadEvents();
        this.clientsJoinedEvent();
      }
    }
  },
  methods: {
    showHistoryToggled(show) {
      this.showHistory = show;

      this.loadEvents();
    },
    generateGoogleClicked() {
      this.generateGoogleMaps(this.form.address, this.form.zipcode, this.form.postaladdress);
    },
    generateGoogleMaps(addr, zipcode, postal) {

      axios
        .get(`/company/geo?address=${addr}&zipcode=${zipcode}&postaladdress=${postal}&country=SE`)
        .then(res => {
          if (res.status === 200) {
            this.toastr('success', 'Google Maps', 'Google maps har genererats');

            this.form.google_maps = { lat: res.data.geo.lat, lng: res.data.geo.lng, static_link: '' };

            this.hasGoogleMaps = true;

            this.saveEvent();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Google Maps', 'Misslyckades generera Google Maps');
        });
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }

      this.loadTemplates();
      this.loadEvents();
    },
    createEvent() {
      this.creating = true;
      this.editing = true;

      axios
        .post('/events', { name: 'Nytt evenemang', company_id: this.currentCompanyId, period_id: this.currentPeriodId, members_only: true, public_only: false })
        .then(res => {
          if (res.status == 201) {
            //this.loadEvents();

            this.events.push(res.data.event);
            this.selectEvent(res.data.event.event_id);

            this.toastr('success', 'OK', 'Ett tomt evenemang har skapats');
          } else {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte skapa evenemang');
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa evenemang');
        });


    },
    deleteEvent(event_id) {

      axios
        .delete(`/events?event_id=${event_id}&company_id=${this.currentCompanyId}`)
        .then(res => {

          this.events = this.events.filter(item => item.event_id !== event_id)

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Evenemanget togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort evenemang');
        })
    },
    selectEvent(event_id) {
      axios
        .get(`/events?event_id=${event_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.form = res.data.event;
          this.creating = false;
          this.editing = true;
          this.online = this.form.type === 'ONL';
          if (!this.form.members_only && !this.form.public_only) {
            this.form.members_only = true;
          }
          this.open_setting = this.form.members_only ? 'members' : 'public';
          if (this.form.google_maps === undefined) {
            this.hasGoogleMaps = false;
            this.form.google_maps = { lat: 0, lng: 0, static_link: '' };
          }
          else {
            if (this.form.google_maps.lat !== 0 && this.form.google_maps.lng !== 0 && this.form.google_maps.lat !== '' && this.form.google_maps.lng !== '') {
              this.hasGoogleMaps = true;
            }
            else {
              this.hasGoogleMaps = false;
            }
          }

          this.scrollToClassName('scroll-to-container');

          axios
            .get(`/client_event?event_id=${event_id}`)
            .then(res => {
              if (res.status === 200) {
                this.clients_forevent = res.data.client_events;
                this.cc = res.data.companies;

                for (const ce of this.clients_forevent) {
                  ce.client.company = '';

                  for (const c of ce.client.company_ids) {
                    ce.client.company += this.cc[c]  + ' ';
                  }
                }

                this.clientsJoinedEvent();
              }
            })
            .catch(err =>{
              console.log(err, "clients for event");
            });

        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta evenemang');
        })
    },
    clientsJoinedEvent()
    {
      let that = this;
      let clients = this.clients_forevent.map(function(item) {

        return {
          id: item.client_event.client_event_id,
          from: item.client.updated_at === undefined ? item.client_event.ts_signup : item.client.updated_at,
          company: item.client.company,
          firstname: item.client.firstname,
          lastname: item.client.lastname,
          email: item.client.email,
          telefon: item.client.phone,
          hantera: ''
        };
      });

      this.clients_event = clients;

      if (this.form.num_strikes_max < this.clients_event.length) {
        this.form.num_strikes_max = this.clients_event.length;
      }

    },
    deleteClient_Event(client_event) {
      axios
        .delete(`/client_event?client_event_id=${client_event.id}`)
        .then(res => {
          this.clients_forevent = this.clients_forevent.filter(function(item) {
            return item.client_event.client_event_id != client_event.id;
          });
          this.clientsJoinedEvent();
          this.toastr('success', 'OK', 'Evenemang togs bort');
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte anmäla till evenemang');
        });
    },
    publishEventClicked(event_id){

    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    async loadEvents() {
      const loader = this.$loading.show();
      this.events = [];
      const res = await axios.get(`/events/list?company_id=${this.currentCompanyId}`)
      if (res.status === 200) {
        var events = res.data.events;
        var now = moment();

        for (var k in events) {
          var comp = events[k];

          for (var i = 0; i < comp.length; ++i) {

            var eventdt = moment(comp[i].to_datetime);
            if (!this.showHistory && eventdt < now) {
              continue;
            }

            //check event date
            this.events.push(comp[i]);
          }
        }
      } else {
        console.error(res);
        this.toastr('danger', 'Server Fel', 'Kunde inte lista evenemang');
      }
      loader & loader.hide();
    },
    loadTemplates() {
      this.templates = [];
      this.smsTemplatesOptions = [];
      this.emailTemplatesOptions = [];

      axios
        .get(`/template/list?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.templates = res.data.templates;
          }

          for (var i = 0; i < this.templates.length; ++i) {
            /*if (this.templates[i].type === 'email') {
              this.emailTemplatesOptions.push(this.templates[i]);
            }
            else {
              this.smsTemplatesOptions.push(this.templates[i]);
            }*/
            if (this.templates[i].is_sms === 0) {
              this.emailTemplatesOptions.push({ value: this.templates[i].template_id, text: this.templates[i].name });
            }
            else {
              this.smsTemplatesOptions.push({ value: this.templates[i].template_id, text: this.templates[i].name });
            }
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista mallar');
        });
    },
    scrollToClassName(classname) {
      var that = this;
      setTimeout(function(){

        const el = that.$el.getElementsByClassName(classname)[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 100);
    },
    checkUrl(url) {
      if (url == '' || url == 'https://')
        return '';
      if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0)
        return 'https://' + url;
      else
        return url;
    },
    saveEvent(e) {
      if (e !== undefined) {
        e.preventDefault();
      }
      this.form.company_id = this.currentCompanyId;
      this.form.type = this.online ? 'ONL' : 'PHY';
      this.form.facebook_url = this.checkUrl(this.form.facebook_url);
      this.form.extern_url = this.checkUrl(this.form.extern_url);

      axios
        .put('/events', this.form)
        .then(res => {
          if (res.status === 200) {
            //this.editing = false;
            this.toastr('success', 'OK', 'Evenemanget uppdaterades');
            this.loadEvents();
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera evenemanget');
        });
    },
    publishEvent(e){
      if (e !== undefined){
        e.preventDefault();
      }
      this.editing = false;
      this.creating = false;
      this.scrollToClassName('scroll-to-top');

    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type,
      })
    }
  }
};
</script>
