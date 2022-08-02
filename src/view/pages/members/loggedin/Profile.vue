<template>
  <div class="px-5" id="page-event-details">
    <b-modal class="px-5" ref="showTicket" >
      <img :src='QR_URL'>
    </b-modal>
    <b-modal class="px-5" ref="showEvent" hide-footer>
      <EventDetails
        :preview_event_id='event_selected'
        :client_id='client.client_id'
      />
      <!-- <div class="d-flex align-items-right justify-content-between mb-8">
        <b-button class="mx-auto" type="button" variant="primary" @click="continueNoAccount"
          >Fortsätt utan att skapa konto</b-button
        >
      </div> -->
    </b-modal>
    <b-row align-h="center">
      <b-col xl="6" lg="8" md="12" sm="12">
        <div class="card card-custom mt-20 shadow-sm">
          <!--begin::Header-->
          <div class="card-header py-3">
            <div class="card-title align-items-start flex-column">
              <h3 class="card-label font-weight-bolder text-dark">Din Profil</h3>
              <span class="text-muted font-weight-bold font-size-sm mt-1"
              >Uppdatera din personliga information</span
              >
            </div>
            <div class="card-toolbar">
              <button type="reset" class="btn btn-success mr-2" @click="updateProfile()" ref="kt_save_changes">
                Spara ändringar
              </button>
              <!--<button type="reset" class="btn btn-secondary" @click="cancel()">Ångra</button>-->
            </div>
          </div>
          <!--end::Header-->
          <!--begin::Form-->
          <form class="form">
            <!--begin::Body-->
            <div class="card-body">
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Medlemskort</label>
                <div class="col-lg-9 col-xl-9">
                  <div class='d-flex justify-content-end'>
                    <b-button
                            id="UserQR_show"
                            variant="outline-success"
                            size="sm"
                            @click="showUser_QR=!showUser_QR"
                            style='width:130px'
                    >
                      {{ showUser_QR ? "Dölj medlemskort" : "Visa medlemskort" }}
                    </b-button>
                  </div>
                  <vue-qrcode v-if="showUser_QR" value="https://www.1stg.me" :width="qrWidth" style="width: 100%" />
                </div>
              </div>

              <!--<div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Avatar</label>
                <div class="col-lg-9 col-xl-6">
                  <div class="image-input image-input-outline" id="kt_profile_avatar">
                    <div
                      class="image-input-wrapper"
                      :style="{ backgroundImage: `url(${photo})` }"
                    ></div>
                    <label
                      class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                      data-action="change"
                      data-toggle="tooltip"
                      title=""
                      data-original-title="Change avatar"
                    >
                      <i class="fa fa-pen icon-sm text-muted"></i>
                      <input
                        type="file"
                        name="profile_avatar"
                        accept=".png, .jpg, .jpeg"
                        @change="onFileChange($event)"
                      />
                      <input type="hidden" name="profile_avatar_remove" />
                    </label>
                    <span
                      class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                      data-action="cancel"
                      data-toggle="tooltip"
                      title="Cancel avatar"
                    >
                      <i class="ki ki-bold-close icon-xs text-muted"></i>
                    </span>
                    <span
                      class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
                      data-action="remove"
                      data-toggle="tooltip"
                      title="Remove avatar"
                      @click="current_photo = null"
                    >
                      <i class="ki ki-bold-close icon-xs text-muted"></i>
                    </span>
                  </div>
                  <span class="form-text text-muted">Allowed file types: png, jpg, jpeg.</span>
                </div>
              </div>-->

              <div v-if="company.profile.na" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Förnamn</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="firstname"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          v-bind:value="client.firstname"
                  />
                </div>
              </div>
              <div v-if="company.profile.na" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Efternamn</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="lastname"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          v-bind:value="client.lastname"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Medlemsnummer</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="public_id"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          disabled
                          v-bind:value="client.public_id"
                  />
                </div>
              </div>
              <div v-if="company.profile.pn" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Personnummer</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="fmt_personnr"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          disabled
                          v-bind:value="client.fmt_personnr"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Förening</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="company_name"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          v-bind:value="company.name"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Medlemsstatus</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="status"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          disabled
                          v-bind:value="client.status"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Notifikationer</label>
                <div class="col-lg-9 col-xl-9">

                  <div class="check-list">
                    <div class="d-flex align-items-center mb-4">
                      <label
                              class="checkbox checkbox-lg checkbox-outline checkbox-success"
                      >
                        <input
                                type="checkbox"
                                v-model="optSys"
                                value="sys"
                                @click="clickNotif"
                                :disabled="true"
                        />
                        <span></span>
                      </label>
                      <span class="ml-3 cursor-pointer">Ta emot systemmeddelanden</span>
                    </div>
                    <div class="d-flex align-items-center mb-4">
                      <label
                              class="checkbox checkbox-lg checkbox-outline checkbox-success"
                      >
                        <input
                                type="checkbox"
                                v-model="optImp"
                                value="imp"
                                @click="clickNotif"
                        />
                        <span></span>
                      </label>
                      <span class="ml-3 cursor-pointer">Ta emot viktiga meddelanden</span>
                    </div>
                    <div class="d-flex align-items-center mb-4">
                      <label
                              class="checkbox checkbox-lg checkbox-outline checkbox-success"
                      >
                        <input
                                type="checkbox"
                                v-model="optDef"
                                value="def"
                                @click="clickNotif"
                        />
                        <span></span>
                      </label>
                      <span class="ml-3 cursor-pointer">Ta emot normala meddelanden</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <label class="col-xl-3"></label>
                <div class="col-lg-9 col-xl-6">
                  <h5 class="font-weight-bold mt-10 mb-6">Kontaktuppgifter</h5>
                </div>
              </div>
              <div v-if="company.profile.ph" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Telefon</label>
                <div class="col-lg-9 col-xl-9">
                  <div class="input-group input-group-lg input-group-solid">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <i class="la la-phone"></i>
                      </span>
                    </div>
                    <input
                            ref="phone"
                            type="text"
                            class="form-control form-control-lg form-control-solid"
                            placeholder="Telefon"
                            v-bind:value="client.phone"
                    />
                  </div>
                  <span class="form-text text-muted"></span>
                </div>
              </div>
              <div v-if="company.profile.em" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">E-post</label>
                <div class="col-lg-9 col-xl-9">
                  <div class="input-group input-group-lg input-group-solid">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <i class="la la-at"></i>
                      </span>
                    </div>
                    <input
                            ref="email"
                            type="text"
                            class="form-control form-control-lg form-control-solid"
                            placeholder="E-post"
                            v-bind:value="client.email"
                    />
                  </div>
                </div>
              </div>

              <div v-if="company.profile.st" class="form-group row">
                <label class="col-xl-3 col-lg-3 pl3 col-form-label text-right">Gatuadress</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="address"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          v-bind:value="client.address"
                  />
                </div>
              </div>

              <div v-if="company.profile.co" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">C/O</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="co"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          v-bind:value="client.co"
                  />
                </div>
              </div>

              <div v-if="company.profile.zi" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Postkod</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="zipcode"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          v-bind:value="client.zipcode"
                  />
                </div>
              </div>

              <div v-if="company.profile.pa" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Postort</label>
                <div class="col-lg-9 col-xl-9">
                  <input
                          ref="post"
                          class="form-control form-control-lg form-control-solid"
                          type="text"
                          v-bind:value="client.post"
                  />
                </div>
              </div>

              <div v-if="company.profile.rc" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Region</label>
                <div class="col-lg-9 col-xl-9">
                  <b-form-select
                          id="region_code"
                          v-model="region_code"
                          :options="regionOptions"
                  ></b-form-select>
                </div>
              </div>

              <div v-if="company.profile.cc" class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Kommun</label>
                <div class="col-lg-9 col-xl-9">
                  <b-form-select
                          id="commune_code"
                          v-model="commune_code"
                          :options="communeOptions"
                  ></b-form-select>
                </div>
              </div>

              <!-- events -->
              <div class='row'>
                <label class="col-xl-3"></label>
                <div class="col-lg-9 col-xl-6">
                  <h5 class="font-weight-bold mt-10 mb-6">Evenemang</h5>
                  <p v-if='currentClient == null'>
                    Inga evenemang hittade
                  </p>
                </div>
              </div>

              <div class="form-group row" v-if='currentClient != null'>
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Aktiva evenemang</label>
                <div class="col-lg-9 col-xl-9 table-responsive">
                  <table
                          class="table table-head-custom table-vertical-center table-head-bg table-borderless"
                  >
                    <thead>
                    <tr class="text-left">
                      <th>Evenemang</th>
                      <th>Från</th>
                      <th>Till</th>
                      <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="(event, i) in events">
                      <tr v-bind:key="i" style="cursor: pointer">
                        <td @click='showEventDetail(event)'>
                            <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{
                              event.name
                            }}</span>
                        </td>
                        <td @click='showEventDetail(event)'>
                          <span class="text-dark-75 d-block font-size-lg">{{ event.from }}</span>
                        </td>
                        <td @click='showEventDetail(event)'>
                          <span class="text-dark-75 d-block font-size-lg">{{ event.to }}</span>
                        </td>
                        <td class="text-right pr-0" >
                          <!-- @click="deletePageClicked(page.id)"
                          v-if='page.type != "confirm"' -->
                          <a
                                  class="btn btn-icon btn-light btn-sm mx-1"
                                  @click="deleteEventClicked(event)"
                          >
                              <span class="svg-icon svg-icon-md svg-icon-primary">
                                <!--begin::Svg Icon-->
                                <inline-svg src="/assets/svg/Trash.svg"></inline-svg>
                                <!--end::Svg Icon-->
                              </span>
                          </a>
                          <!-- <a
                            class="btn btn-icon btn-light btn-sm mx-1"
                            @click='showQR_CODE(event)'
                          >
                            <span class="svg-icon svg-icon-md svg-icon-primary">
                              begin::Svg Icon-->
                          <!-- <img :src='baseUrl + event.qr_url'></img> -->
                          <!--end::Svg Icon
                        </span>
                      </a> -->
                        </td>
                      </tr>
                    </template>
                    </tbody>
                  </table>
                </div>
              </div>
              <!-- end events-->

              <div class="row">
                <label class="col-xl-3"></label>
                <div class="col-lg-9 col-xl-6">
                  <h5 class="font-weight-bold mt-10 mb-6">Betalade perioder</h5>
                </div>
              </div>

              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">Perioder</label>
                <div class="col-lg-9 col-xl-9">
                  <div class="table-responsive">
                    <table
                            class="table table-head-custom table-vertical-center table-head-bg table-borderless"
                    >
                      <thead>
                      <tr class="text-left">
                        <th>Periodnamn</th>
                        <th>Period Från</th>
                        <th>Period Till</th>
                        <th>Status</th>
                      </tr>
                      </thead>
                      <tbody>
                      <template v-for="(period, i) in periods">
                        <tr v-bind:key="i">
                          <td>
                              <span class="text-dark-75 font-weight-bolder d-block font-size-lg">{{
                                period.name
                              }}</span>
                          </td>
                          <td>
                            <span class="text-dark-75 d-block font-size-lg">{{ period.from }}</span>
                          </td>
                          <td>
                            <span class="text-dark-75 d-block font-size-lg">{{ period.to }}</span>
                          </td>
                          <td >status</td>
                        </tr>
                      </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!--Begin:: Parent table-->

              <b-row class="mt-10 mb-6">
                <b-col xl="3"/>
                <b-col >
                  <h5 class="font-weight-bold">Tillagda målsmän</h5>
                </b-col>
                <b-col cols="auto">
                  <a
                          class="btn btn-primary font-weight-bolder font-size-sm"
                          style="max-height: 38px;"
                          @click="createParent"
                  >
                    <i class="menu-icon flaticon2-plus" style="font-size: 1em"></i> Målsman
                  </a>
                </b-col>
              </b-row>
              <b-collapse :visible="showParentForm" id="collapse-attribute-form">
                <b-row align-content="between">
                  <b-col xl="3" lg="3"/>
                  <b-col >
                    <b-form-group label="Förnamn" label-for="parentFName">
                      <b-form-input id="parentFName" type="text" v-model="parent.fn"  />
                    </b-form-group>
                  </b-col>
                  <b-col >
                    <b-form-group label="Efternamn" label-for="parentLName">
                      <b-form-input id="parentLName" type="text" v-model="parent.ln"  />
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Telefon" label-for="parentPhone">
                      <b-form-input id="parentPhone" v-model="parent.ph"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="2">
                    <b-form-group label="E-post" label-for="parentEmail">
                      <b-form-input id="parentEmail" type="email" v-model="parent.em"/>
                    </b-form-group>
                  </b-col>
                  <b-col class="d-flex align-items-center">
                    <b-button id="parentSave" variant="outline-success" size="sm" :disabled="!disabledSaveParent" @click="onSaveParent">Spara</b-button>
                  </b-col>
                </b-row>
              </b-collapse>

              <div class="form-group row">
                <label class="col-xl-3 col-lg-3 col-form-label text-right">
                  Målsman
                </label>
                <div class="col-lg-9 col-xl-9">
                  <div class="table-responsive">
                    <table
                            class="table table-head-custom table-vertical-center table-head-bg table-borderless"
                    >
                      <thead>
                      <tr class="text-left">
                        <th width="20%">Förnamn</th>
                        <th width="20%">Efternamn</th>
                        <th width="20%">Telefon</th>
                        <th width="20%">E-post</th>
                        <th></th>
                      </tr>
                      </thead>
                      <tbody>
                      <template v-for="(item, i) in parentItems">
                        <tr v-bind:key="i">
                          <td>
                                <span class="text-dark-75 d-block font-size-lg">
                                  {{item.fn}}
                                </span>
                          </td>
                          <td>
                            <span class="text-dark-75 d-block font-size-lg">{{ item.ln }}</span>
                          </td>
                          <td>
                            <span class="text-dark-75 d-block font-size-lg">{{ item.ph }}</span>
                          </td>
                          <td>
                            <span class="text-dark-75 d-block font-size-lg">{{ item.em }}</span>
                          </td>
                          <td>
                            <a
                                    class="btn btn-icon btn-light btn-sm mx-1"
                                    @click="editParent(i)"
                            >
                                  <span class="svg-icon svg-icon-md svg-icon-primary">
                                    <!--begin::Svg Icon-->
                                    <inline-svg src="/assets/svg/Write.svg"></inline-svg>
                                    <!--end::Svg Icon-->
                                  </span>
                            </a>

                            <a
                                    class="btn btn-icon btn-light btn-sm mx-1"
                                    @click="deleteParent(i)"
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
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <!--End:: Parent table-->

              <div class="row mt-10">
                <label class="col-xl-3 col-lg-3 col-form-label text-right"></label>
                <div class="col-lg-9 col-xl-9">
                  <b-row align-h="end">
                    <b-col cols="auto">
                      <a
                              class="btn btn-primary font-weight-bolder font-size-sm"
                              style="max-height: 38px;"
                              @click="onExport"
                      >
                        <fa-icon icon="file-excel" class="mr-2" /> Ladda ner personuppgifter
                      </a>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
            <!--end::Body-->
          </form>
          <!--end::Form-->
        </div>
      </b-col>
    </b-row>

  </div>
</template>


<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
.form-create-member {
  margin: 0 auto;
  padding: 25px;
}
</style>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import moment from 'moment';
import VueQrcode from 'vue-qrcode';
import { CLIENT_LOGIN } from '@/core/services/store/client.auth.module';
import EventDetails from '@/view/pages/members/public/EventDetails.vue';
import messageParent from '@/core/services/messageParent';

export default {
  name: 'profile-details',
  components: {
    VueQrcode,
    EventDetails
  },
  computed: {
    ...mapGetters(['isMemAuthenticated', 'currentClient']),
    disabledSaveParent(){
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const validEmail = re.test(String(this.parent.em).toLowerCase());
      const validLName = this.is_set(this.parent.ln);
      const validFName = this.is_set(this.parent.fn);
      const validPhone = this.is_set(this.parent.ph) && !!Number(this.parent.ph);
      return validEmail && validLName && validFName && validPhone;
    },
  },
  async mounted() {
    this.route_client_id = this.$route.params.client_id;
    this.route_token = this.$route.params.token;

    await this.loadRegions();

    if (this.isMemAuthenticated) {
      this.loadProfile();
      this.loadEvents();
    }

    if (this.route_token !== undefined && this.route_token !== null && this.route_token.length > 8) {
      await this.loadClientToken()
    }
  },
  data() {
    return {
      /*me: {
        client: { client_id: '', firstname: '', lastname: '' },
        company: {
          id: '',
          name: '',
          profile: {}
        },
        periods: []
      },*/
      showUser_QR: false,
      route_client_id: null,
      optSys: true,
      optImp: false,
      optDef: false,
      qrWidth: 640,
      region_code: null,
      commune_code: null,
      communeOptions: [],
      regionOptions: [],
      default_photo: 'media/users/blank.png',
      current_photo: null,
      company: {
        id: '',
        name: '',
        profile: {}
      },
      client: {
        email: '',
        firstname: '',
        lastname: '',
        company_name: '',
        phone: '',
        company_site: '',
        post: ''
      },
      events: [],
      photo: '',
      event_selected: '',
      QR_URL: '',
      periods: [{ id: 'aaa', from: '2019-01-01', to: '2019-12-31', status: 'P', name: 'test' }],
      showParentForm: false,
      parentFields: [
        {key: 'fn', label: 'Förnamn', thStyle: 'width: 20%'},
        {key: 'ln', label: 'Efternamn', thStyle: 'width: 20%'},
        {key: 'ph', label: 'Telefon', thStyle: 'width: 20%'},
        {key: 'em', label: 'E-post', thStyle: 'width: 20%'},
        {key: 'action', label: '', thStyle: 'width: auto'},
      ],
      parentItems: [],
      parentIndex:'',
      parent: {
        ln:'', fn:'', em:'', ph:'', pn:''
      },
    };
  },
  watch: {
    region_code(newValue, oldValue) {
      if (newValue) {
        this.loadCommunes(newValue);
      }
    },
    currentClient(newValue, oldValue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    onExport(){
      axios.get(`/client/mygdpr`).then(res => {
        var filename = res.data.filepath.replace(/^.*[\\\/]/, '')

        this.downloadWithAxios(res.data.filepath, filename);

        this.toastr('success', 'OK', 'Exporten lyckades');
      }).catch(err => console.log(err))
    },
    forceFileDownload(response, title) {
      console.log(title)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', title)
      document.body.appendChild(link)
      link.click()
    },
    downloadWithAxios(url, title) {
      axios({
        method: 'get',
        url,
        responseType: 'arraybuffer',
      }).then((response) => {
        this.forceFileDownload(response, title)
      }).catch(() => console.log('error occured'))
    },
    onSaveParent(){
      this.parent.pn = '';
      if (this.is_set(this.parentIndex))
        this.parentItems[this.parentIndex] = this.parent;
      else
        this.parentItems.push(this.parent);
      console.log('Parent', this.parentItems)
      this.showParentForm = false;
      this.parent = {};
    },
    createParent(){
      this.parentIndex = '';
      this.showParentForm = !this.showParentForm;
    },
    editParent(index){
      this.showParentForm =  !this.showParentForm;
      if (this.showParentForm){
        this.parentIndex = index;
        this.parent = this.parentItems[index];
      }
    },
    deleteParent(index){
      this.parentItems.splice(index, 1);
    },
    async loadData() {

      this.loadProfile();
      this.loadEvents();
    },
    loadRegions() {
      axios
        .get('/location/regions')
        .then(res => {
          this.regions = res.data.regions;
          this.regionOptions = [];

          for (var k in this.regions) {
            this.regionOptions.push({ value: k, text: this.regions[k].region });
          }

          this.regionOptions.sort(function (a, b) {
            if (a.text < b.text) {
              return -1;
            }
            if (a.text > b.text) {
              return 1;
            }
            return 0;
          });
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta regioner');
        });
    },
    loadCommunes(selectedRegion) {
      this.communeOptions = [];

      var communes = this.regions[selectedRegion].communes;

      for (var k in communes) {
        this.communeOptions.push({ value: k, text: communes[k].commune });
      }

      this.communeOptions.sort(function (a, b) {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      });
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },
    getOpt() {
      var opt = {};

      opt['sys'] = this.optSys;
      opt['def'] = this.optDef;
      opt['imp'] = this.optImp;

      return opt;
    },
    setOpts(opt) {
      this.optSys = false;
      this.optDef = false;
      this.optImp = false;

      if (opt === undefined || opt === null) {
        return;
      }

      this.optSys = opt['sys'];
      this.optDef = opt['def'];
      this.optImp = opt['imp'];
    },
    loadProfile() {
      axios
        //.get(`/client/public?shared_client_id=${this.currentClient.shared_client_id}`)
        .get(`/client/me`)
        .then(res => {
          //this.me = res.data.me;
          this.client = res.data.client;
          this.company = res.data.company;

          this.setOpts(this.client.opt);

          this.periods = res.data.periods;
          this.region_code = this.client.region_code;
          this.commune_code = this.client.commune_code;

          setTimeout(function(){
            messageParent(JSON.stringify({ height: document.body.scrollHeight }));
          }, 300);
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ladda profilen');
        });
    },
    async loadClientToken() {

      let res = await axios.post('/client/token', { login_token: this.route_token });
      if (res.status == 200) {
          this.client = res.data.client;
          this.company = res.data.company;
          this.periods = res.data.periods;
          this.region_code = this.client.region_code;
          this.commune_code = this.client.commune_code;

          if (this.client.parents){
            this.parentItems = this.client.parents;
          }
          this.$store.dispatch(CLIENT_LOGIN, res.data);
          console.log(res.data, ': Login token data');
          this.$store.dispatch(CLIENT_LOGIN, {
            client: res.data.client,
            token: res.data.token,
            company: res.data.company
          });

          setTimeout(function(){
            messageParent(JSON.stringify({ height: document.body.scrollHeight }));
          }, 300);
          
      } else {
        console.log("error : ", res);
        this.toastr('danger', 'Serverfel', 'Kunde inte hämta medlemsdata');
      }
    },
    loadEvents() {
      let baseUrl = axios.defaults.baseURL;
      this.baseUrl = baseUrl.substring(0, baseUrl.indexOf('/', 8));
      if (this.currentClient == null)
        return;

      axios.get(`/client_event/list?client_id=${this.currentClient.client_id}`)
        .then(res => {
          this.events = res.data.events;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Serverfel', 'Kunde inte hämta medlemsdata (3)');
        });
    },
    deleteEventClicked(event) {
        axios
          .delete(`/client_event?client_event_id=${event.id}`)
          .then(res => {
            this.events = this.events.filter(function(item) {
              return item.id != event.id;
            });
            this.toastr('success', 'OK', 'Evenemang togs bort');
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte anmäla till evenemang');
          });
    },
    showEventDetail(event)
    {
      this.event_selected = event.event_id;
      this.$refs['showEvent'].show();
    },
    showQR_CODE(event) {
      this.$refs['showTicket'].show();
      this.QR_URL = this.baseUrl + event.qr_url;
    },
    clickNotif() {
      var that = this;

      setTimeout(function(){
        var opt = that.getOpt();

        axios
          .post('/client/notifs', { client_id: that.client.client_id, opt: opt })
          .then(res => {
            that.toastr('success', 'OK', 'Notifikationsinställningar uppdaterade');
          })
          .catch(err => {
            console.error(err);
            that.toastr('danger', 'Server Fel', 'Kunde inte sätta notifikationer');
          });
        }, 200);
    },
    updateProfile() {
      this.client.commune_code = this.commune_code;
      this.client.region_code = this.region_code;
      this.client.parents_data = this.parentItems;
      axios.put('/client/public', this.client);
    },
    is_set(vv) {
      return vv !== null && vv !== undefined && vv !== '' && vv !== ' ';
    },
  }
};
</script>
