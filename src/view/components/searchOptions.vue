<template>
  <div>
    <b-modal v-model="showSavedSearchModal">
      <div class="table-responsive">
        <table
                class="table table-head-custom table-vertical-center table-head-bg table-borderless"
        >
          <thead>
          <tr class="text-left">
            <th width="55%">Name</th>
            <th width="35%">Date</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(item, i) in items">
            <tr v-bind:key="i">
              <td>
                            <span class="text-dark-75 d-block font-size-lg">
                              {{item.text}}
                            </span>
              </td>
              <td>
                <span class="text-dark-75 d-block font-size-lg">{{ item.date }}</span>
              </td>
              <td>
                <a
                        class="btn btn-icon btn-light btn-sm mx-1"
                        @click="deleteQuery(item.value)"
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
    </b-modal>

    <b-card >
      <template #header>
        <h5 v-if="showNumClients" class="mb-1"><b-icon class="mr-2" icon="check-circle" font-scale="1.3" :variant="selectedSearch && !noPermission?'success':'secondary'" /> Gör ett urval</h5>
        <h5 v-else>Gör en sökning</h5>
      </template>

      <!--Begin:: search option-->
      <b-collapse :visible="isShowSearch" id="collapse-search-option">
        <b-row class="mt-5">
          <b-form-group id="input-group-6" label="Föreningar" label-for="input-6" class="col-lg-12 col-sm-12">
            <CompanySelect
              ref="companySelect"
              :ids="company_ids"
            />
          </b-form-group>
        </b-row>
        <b-row>
          <b-form-group class="col-lg-6 col-sm-12" label="Förnamn" label-for="new-search-firstname">
            <b-form-input id="new-search-firstname" v-model="form.firstname" placeholder="Förnamn" />
          </b-form-group>
          <b-form-group class="col-lg-6 col-sm-12" label="Efternamn" label-for="new-search-lastname">
            <b-form-input id="new-search-lastname" v-model="form.lastname" placeholder="Efternamn" />
          </b-form-group>
        </b-row>
        <b-row>
          <b-form-group class="col-lg-6 col-sm-12" label="Gatuadress" label-for="new-search-street">
            <b-form-input id="new-search-street" v-model="form.street" placeholder="Gatuadress" />
          </b-form-group>
          <b-form-group class="col-lg-6 col-sm-12" id="input-group-7" label="Region" label-for="input-7">
            <multi-select ref="regionSelect" :selected-data="region_codes" :data="regionOptions" />
          </b-form-group>
        </b-row>
        <b-row>
          <b-form-group class="col-lg-6 col-sm-12" label="Postkod" label-for="new-search-postcode">
            <b-form-input id="new-search-postcode" v-model="form.zipcode" placeholder="Postkod" />
          </b-form-group>
          <b-form-group class="col-lg-6 col-sm-12" label="Land" label-for="new-search-countries">
            <b-form-select id="new-search-countries" v-model="form.country">
              <b-form-select-option value="all">Alla</b-form-select-option>
              <b-form-select-option
                      v-for="(c, i) in countries"
                      :key="`search-country-${i}`"
                      :value="c.iso"
              >{{ c.sv }}</b-form-select-option
              >
            </b-form-select>
          </b-form-group>
        </b-row>
        <b-row>
          <b-form-group class="col-lg-6 col-sm-12" label="Från Ålder" label-for="new-search-fromage">
            <b-form-input id="new-search-fromage" v-model="form.from_age" placeholder="Från" />
          </b-form-group>
          <b-form-group class="col-lg-6 col-sm-12" label="Till Ålder" label-for="new-search-toage">
            <b-form-input id="new-search-toage" v-model="form.to_age" placeholder="Till" />
          </b-form-group>
        </b-row>
        <b-row>
          <b-form-group class="col-lg-6 col-sm-12" label="Period" label-for="new-search-period">
            <b-form-select
                    id="new-search-period"
                    v-model="form.period_id"
                    :options="periods"
                    text-field="name"
                    value-field="id"
            >
            </b-form-select>
          </b-form-group>
          <b-form-group class="col-lg-6 col-sm-12" label="Betalstatus för perioden" label-for="new-search-payment">
            <b-form-select id="new-search-payment" v-model="form.payment">
              <b-form-select-option value="all">Alla</b-form-select-option>
              <b-form-select-option
                      v-for="(p, i) in payments"
                      :key="`search-payment-${i}`"
                      :value="p.value"
              >{{ p.text }}</b-form-select-option
              >
            </b-form-select>
          </b-form-group>
        </b-row>
        <b-row>
          <b-form-group class="col-lg-6 col-sm-12" label="Kön" label-for="new-search-gender">
            <b-form-select id="new-search-gender" v-model="form.gender">
              <b-form-select-option value="all">Alla</b-form-select-option>
              <b-form-select-option
                      v-for="(g, i) in genders"
                      :key="`search-gender-${i}`"
                      :value="g.value"
              >{{ g.text }}</b-form-select-option
              >
            </b-form-select>
          </b-form-group>
              <b-form-group class="col-lg-6 col-sm-12" label="LADOK status" label-for="new-search-ladoks">
                <b-form-select id="new-search-ladoks" v-model="form.ladok">
                  <b-form-select-option value="all">Alla</b-form-select-option>
                  <b-form-select-option
                          v-for="(l, i) in ladoks"
                          :key="`search-ladok-${i}`"
                          :value="l.value"
                  >{{ l.text }}</b-form-select-option
                  >
                </b-form-select>
              </b-form-group>
        </b-row>
        <b-form-group >
          <b-row class="mb-5">
            <b-col class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="search_clients" />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer" @click="search_clients = !search_clients"
              >Sök medlemmar</span
              >
            </b-col>
            <b-col class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="missing_email" />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer" @click="missing_email = !missing_email"
              >Endast medlemmar som saknar e-post</span
              >
            </b-col>
          </b-row>

          <b-row class="mb-5">
            <b-col class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="has_error" />
                <span></span>
              </label>
              <span
                      class="ml-3 cursor-pointer"
                      @click="has_error = !has_error"
              >Endast medlemmar med fel</span
              >
            </b-col>
            <b-col class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="has_membership" />
                <span></span>
              </label>
              <span
                      class="ml-3 cursor-pointer"
                      @click="has_membership = !has_membership"
              >Endast medlemmar som har bekräftat medlemskap för perioden</span
              >
            </b-col>
          </b-row>

          <b-row class="mb-5">
            <b-col class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="is_stickprov" />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer" @click="is_stickprov = !is_stickprov"
              >Endast medlemmar i stickprover</span
              >
            </b-col>
            <b-col class="d-flex align-items-center" v-if="showEvents">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="isShowEvents" />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer" @click="isShowEvents = !isShowEvents"
              >Sök med evenemang</span
              >
            </b-col>
          </b-row>

          <b-row>
            <b-col class="d-flex align-items-center">
              <label class="checkbox checkbox-lg checkbox-outline checkbox-success">
                <input type="checkbox" name="" v-model="search_users" />
                <span></span>
              </label>
              <span class="ml-3 cursor-pointer" @click="search_users = !search_users"
              >Sök användare</span
              >
            </b-col>
          </b-row>
        </b-form-group>

        <search-client v-if="isShowSearch && search_clients" :groups="groups" name="searchClient" ref="searchClient"/>
        <search-with-event v-if="showEvents && isShowEvents" @eventSelected="eventSelected" :events="events" />
        <user-search v-if="search_users" :selected_companies = "selected_companies" @setUserQuery="setUserQuery" />

<!--        <b-card v-if='create_urval' class='mb-3'>-->
<!--          <b-row>-->
<!--            <b-form-group class="col-12" label="Spara sökning/urval" label-for="new-search-savetext">-->
<!--              <b-form-input-->
<!--                      id="new-search-savetext"-->
<!--                      v-model="form.savetext"-->
<!--                      placeholder="Namn på sökning/urval"-->
<!--              />-->
<!--            </b-form-group>-->
<!--          </b-row>-->
<!--          <b-table :fields="urvals" :items="items" @row-clicked="urvalClickHandler" class='cursor-pointer'>-->
<!--            &lt;!&ndash; <template #cell(count) = "data">-->
<!--              {{data.item.count ? data.item.count : ''}}-->
<!--            </template> &ndash;&gt;-->
<!--          </b-table>-->
<!--          <div class='d-flex justify-content-end'>-->
<!--            <b-button v-if="useSavedSearch" variant="success" size="sm" @click="onSave($event)">Spara</b-button>-->
<!--          </div>-->
<!--        </b-card>-->

        <b-row>
          <div class="col-12">
            <div class="d-flex justify-content-end">
              <b-button variant="light" size="sm" class="ml-2" @click="onReset($event)">Rensa</b-button>
              <b-button variant="primary" size="sm" class="ml-2" @click="onSearch($event)" :disabled="button_disabled">Sök</b-button>
            </div>
          </div>
        </b-row>

        <hr />

        <!--Begin:: alert for numClients, do a search-->
        <b-alert :show="showNumClients" :variant="colorOne">
          {{alertOne}}
        </b-alert>
        <!--end:: alert for numClients, do a search-->

        <b-form-group class="mt-9" label="Spara sökning / urval" label-for="saved-name">
          <b-row align-v="center">
            <b-col md="11">
              <b-form-input
                placeholder="Namn på sökning / urval"
                id="new-search-savetext"
                v-model="form.savetext"
              />
            </b-col>
            <b-col align="end">
                <b-button variant="success" size="sm" @click="onSave($event)">Spara</b-button>
            </b-col>
          </b-row>
        </b-form-group>
      </b-collapse>
      <!--End:: search option-->

      <!--Begin:: selectQuery-->
      <b-form-group label="Välj sparat urval" label-for="select-savedsearch" >
        <b-row >
          <b-col md="9" class="my-1">
            <div class='d-flex justify-content-between'>
              <b-form-select v-model="selectedSearch" id="select-savedsearch" :options="searchHistory"></b-form-select>
              <div class="m-auto pl-4">
                <a
                    class="btn btn-icon btn-light btn-sm"
                    @click="showSavedSearchModal = true"
                >
                  <span class="svg-icon svg-icon-md svg-icon-primary">
                    <!--begin::Svg Icon-->
                    <inline-svg src="/assets/svg/CogWheel.svg"></inline-svg>
                    <!--end::Svg Icon-->
                  </span>
                </a>
              </div>
            </div>
          </b-col>
          <b-col align="end" md="3" class="my-1">
            <div v-if="!isShowSearch">
              <b-button v-if="showNumClients" variant="primary" @click="isShowSearch = true">SKAPA URVAL</b-button>
              <b-button v-else class="w-15" variant="primary" @click="isShowSearch = true">Sök</b-button>
            </div>
          </b-col>
        </b-row>
      </b-form-group>
      <!--End:: selectQuery-->

      <!--Begin:: alert for numClients, do a search-->
      <b-alert :show="showNumClients && !isShowSearch" :variant="colorOne">
        {{alertOne}}
      </b-alert>
      <!--end:: alert for numClients, do a search-->

      <!--Begin:: alert 403 noPermission-->
      <b-alert :show="noPermission" variant="danger">
        Du har inte tillgång till valda föreningar. Be administratör att lägga till din användare i föreningen.
      </b-alert>
      <!--End:: alert 403 noPermission-->

      <!--Begin:: alert query-->
      <b-alert :show="!queryOk && !noPermission && showNumClients" variant="danger">
        Ett urval måste väljas
      </b-alert>
      <!--End:: alert query-->

      <!--Begin:: close button-->
      <b-row v-if="isShowSearch">
        <b-col align="end">
          <b-button class="w-15" variant="primary" @click="isShowSearch = false">Stäng</b-button>
        </b-col>
      </b-row>
      <!--End:: close button-->

    </b-card>
  </div>
</template>
<style lang="scss" scoped>
.checkbox.checkbox-light-success > span {
  background-color: white;
  border: 1px solid #ddd;
}
  .w-15{
    width: 100px;
  }
</style>
<script>
import axios from 'axios';
import moment from 'moment';
import VueSimpleRangeSlider from 'vue-simple-range-slider';
import { mapGetters } from 'vuex';
import 'vue-simple-range-slider/dist/vueSimpleRangeSlider.css';
import CompanySelect from '@/view/components/companySelect.vue';
import MultiSelect from '@/view/components/multiSelect.vue';
import UserSearch from '@/view/components/userSearch.vue';
import SearchWithEvent from "@/view/components/searchWithEvent.vue";
import searchClient from "@/view/components/searchClient.vue";

export default {
  name: 'search-options',
  components: {SearchWithEvent, VueSimpleRangeSlider, CompanySelect, MultiSelect, UserSearch, searchClient},
  data() {
    return {
      form: {
        firstname: '',
        lastname: '',
        street: '',
        postcode: '',
        country: 'all',
        period_id: '',
        gender: 'all',
        payment: 'all',
        ladok: 'all',
        incorrect_membership: false,
        sample_member: false,
        age_range: [0, 25],
        savetext: ''
      },
      user: {},
      search_users: false,
      search_clients: true,
      is_stickprov: false,
      missing_email: false,
      has_error: false,
      has_membership: false,
      eventOptions: [],
      region_code: '',
      commune_code: '',
      regions: {},
      communes: {},
      regionOptions: [],
      communeOptions: [],
      queries: [],
      groups:[],
      searchHistory: [{ value: null, text: 'Det finns inga sparade sökningar'}],
      selectedSearch: null,
      isShowSearch: this.collapse,
      showSavedSearchModal: false,
      fields: [
        {key:'text', label: 'Name'},
        {key: 'date', label: 'Date'},
        {key: 'action'}
      ],
      urvals: [
        {key:'text', label: 'Name'},
        {key: 'date', label: 'Date'},
        {key: 'count', label: 'Count'},
      ],
      events: [],
      selectedEventIds:[],
      isShowEvents: false,
      company_ids:[],
      region_codes: [],
      colorOne: 'success',
    };
  },
  props: {
    countries: { type: Array, default: [] },
    periods: { type: Array, default: [] },
    genders: { type: Array, default: [] },
    payments: { type: Array, default: [] },
    ladoks: { type: Array, default: [] },
    showEvents: { type: Boolean, default: false },
    showRegions: { type: Boolean, default: false },
    collapse: {type: Boolean, default: false},
    useSavedSearch: {type: Boolean, default: true},
    button_disabled: {type: Boolean, default: false},
    noPermission: {type: Boolean, default: false},
    queryOk: {type: Boolean, default: false},
    numClients: {type: Number, default: null},
    showNumClients: {type: Boolean, default: false}
  },
  mounted() {
    this.form.period_id = this.currentPeriodId;

    if (this.showEvents) {
      this.loadEvents();
    }

    if (this.showRegions) {
      this.loadRegions();
    }

    this.loadCompany();
    this.loadGroups();
  },
  watch: {
    selectedSearch(newVal, oldVal) {
      if (!newVal) this.selectedSearch = null;
      for (var i = 0; i < this.queries.length; ++i) {
        if (this.queries[i].id === newVal) {
          this.setQuery(this.queries[i]);
          break;
        }
      }
      this.$emit('querySelected', newVal);
    },
    commune_code(newVal, oldVal) {
      if (!newVal) {
        return;
      }

      if (this.region_code in this.region_code && newVal in this.regions[this.region_code].communes) {
        this.form.commune = this.regions[this.region_code].communes[newValue].commune;
      }
    },
    region_code(newVal, oldVal) {
      if (!newVal) return;
      if (newVal === this.region_code) {
        this.form.region = 'Alla';
      } else if (newVal in this.region_code) {
        this.form.region = this.regions[newVal].region;
      }
    },
    currentPeriodId(newValue, oldValue) {
      this.form.period_id = newValue;
    },
    isShowSearch(newVal, oldVal){
      if (newVal === true)
        this.scrollToClassName('card mb-8')
    }
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId']),
    selected_companies(){
      return this.$refs['companySelect'].getCompanies();
    },
    items(){
      return this.searchHistory.filter(item => {
        return item.value !== null;
      })
    },
    alertOne(){
      let text = '';
      if (this.numClients === null || this.numClients === undefined) {
        this.colorOne = "warning";
        text = "Gör en sökning för att kontrollera hur många medlemmar som finns i urvalet";
      } else {
        text = `Antal medlemmar i urvalet: ${this.numClients}`;
        this.colorOne = "success";
      }
      return text;
    },
  },
  methods: {
    eventSelected(ids) {
      this.event_ids = ids
      this.$emit('eventSelected', ids);
    },
    urvalClickHandler(record, id) {
      let index = this.queries.findIndex(item => item.id === record.value);
      let query = this.queries[index];
      let that = this;
      if (query) {
        axios
          .post('/search/direct', query)
          .then(res => {
              this.search_button_disabled = false;
              if (res.status === 200){
                  let indexHistory = that.searchHistory.findIndex(value => record.value == value.value);
                  let history = that.searchHistory[indexHistory];
                  const clients = [...res.data.users, ...res.data.clients];
                  history.count = clients.map(item => {
                      item.period = res.data.periods.length > 0 ? res.data.periods[this.clients[i].period_id].name : '';
                      item.company = item.current_company_id
                          ? res.data.companies[item.current_company_id]
                          : res.data.companies[item.company_id]
                      return item;
                  }).length;
                  that.searchHistory.splice(indexHistory, 1, history);
              } else {
                  this.toastr('danger', 'Kan inte publicera', 'Det finns inga underföreningar i ärendet');
              }
          })
          .catch(err => {
              this.search_button_disabled = false;
              console.error(err);
              this.toastr('danger', 'Server fel', 'Kunde inte söka');
          });
      }
    },
    async deleteQuery(id){

      const res = await axios.delete(`/company/searchquery?id=${id}&company_id=${this.currentCompanyId}`);
      if (res.status === 200){
        this.toastr('success', 'Ok', 'Den valda sparade sökningen har just tagits bort.');
        this.searchHistory = this.searchHistory.filter(item=>{
          return item.value !== id
        });
        this.selectedSearch = null;
      } else {
        this.toastr('danger', 'Server Fel', 'Det gick inte att ta bort den valda sparade sökningar.');
      }
    },
    setUserQuery(user){
      this.user = user;
    },
    selectQuery(query_id) {
      this.selectedSearch = query_id;
    },
    createQuery() {
      return this.getQuery();
    },
    loadCompany() {
      axios
        .get(`/company?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.company = res.data.company;
          }

          this.searchHistory = [{ value: null, text: 'Välj sparad sökning' }];
          this.queries = [];
          for (var i = 0; i < this.company.settings.search_queries.length; ++i) {
            var query = this.company.settings.search_queries[i];

            this.queries.push(query);
            this.searchHistory.push({ value: query.id, text: query.name, date: query.date });
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta föreningsinställningar');
        });
    },
    loadEvents() {
      axios
        .get(`/events/list?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`)
        .then(res => {
          this.events = res.data.events[this.currentCompanyId];
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte hämta evenemangslista');
        });
    },
    loadGroups() {
      this.groups = [];
      axios
        .get(`/property_group/list?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`)
        .then(res => {
          if (res.status === 200) {
            this.groups = res.data.groups.map(group=>{
              return {text: group.name, value: group.group_id};
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte lista kategorier');
        });
    },
    resetQuery() {
      this.search_clients = true;
      this.search_users = false;
      this.has_error = false;
      this.is_stickprov = false;
      this.isShowEvents = false;
      this.has_error = false;
      this.has_membership = false;
      this.missing_email = false;

      this.$refs['companySelect'].reset();
      this.$refs['regionSelect'].reset();

      this.commune_code = '';
      this.form.gender = 'all';
      this.form.firstname = '';
      this.form.lastname = '';
      this.form.street = '';
      this.form.country = 'all';
      this.form.payment = 'all';
      this.form.email = '';
      this.form.ladok = 'all';
      this.form.zipcode = '';
      this.form.period_id = this.currentPeriodId;
      this.form.from_age = 0;
      this.form.to_age = 200;
    },
    setQuery(query) {
      console.log('setting query');
      console.log(query);

      this.search_clients = false;
      this.search_users = false;

      for (var i = 0; i < query.types.length; ++i) {
        if (query.types[i] === 'member') {
          this.search_clients = true;
        }

        if (query.types[i] === 'user') {
          this.search_users = true;
        }
      }

      this.region_code = '';
      this.commune_code = '';
      this.form.gender = 'all';
      this.form.firstname = '';
      this.form.lastname = '';
      this.form.email = '';
      this.form.ladok = 'all';
      this.form.zipcode = '';
      this.form.period_id = this.currentPeriodId;
      this.form.from_age = 0;
      this.form.to_age = 200;
      this.has_error = false;

      this.company_ids = query.company_ids;
      this.region_codes = query.region_codes;
      this.form.zipcode = query.postcode;
      this.form.street = query.street;
      this.form.country = query.country;
      this.form.payment = query.payment;

      if (query.region_codes && query.region_codes.length > 0) {
        this.region_code = query.region_codes[0];
      }

      if (query.commune_codes && query.commune_codes.length > 0) {
        this.commune_code = query.commune_codes[0];
      }

      if (query.sexes && query.sexes.length > 0) {
        this.form.gender = query.sexes[0];
      }

      for (var i = 0; i < query.variables.length; ++i) {
        var key = query.variables[i].key;
        var val = query.variables[i].value;

        if (key === 'firstname') {
          this.form.firstname = val;
        }
        else if (key === 'lastname') {
          this.form.lastname = val;
        }
        else if (key === 'email') {
          this.form.email = val;
        }
        else if (key === 'from_age') {
          this.form.from_age = val;
        }
        else if (key === 'to_age') {
          this.form.to_age = val;
        }
        else if (key === 'zipcode') {
          this.form.zipcode = val;
        }
        else if (key === 'ladok') {
          this.form.ladok = val;
        }
        else if (key === 'personnr') {
          this.form.personnr = val;
        }
        else if (key === 'has_error') {
          this.has_error = Boolean(val);
        }
        else if (key === 'cl_conf') {
          this.has_membership = Boolean(val);
        }
        else if (key === 'no_email') {
          this.missing_email = Boolean(val);
        }
        else if (key === 'period_id') {
          this.form.period_id = val;
        }
        else if (key === 'is_stickprov') {
          this.is_stickprov = val;
        }
      }
    },
    getQuery() {

      // var region_code = this.region_code === '' ? null : [this.region_code];
      var commune_code = this.commune_code === '' ? null : [this.commune_code];
      var sexes = this.form.gender === '' ? null : [this.form.gender];
      var events = !this.showEvents ? null : this.event_ids;
      let user = this.user;
      var variables = [];
      var types = [];

      if (this.search_users) {
        types.push('user');
      }

      if (this.search_clients) {
        types.push('member');
      }

      if (this.is_set(this.form.firstname)) {
        variables.push({ key: 'firstname', value: this.form.firstname });
      }

      if (this.is_set(this.form.lastname)) {
        variables.push({ key: 'lastname', value: this.form.lastname });
      }

      if (this.is_set(this.form.ladok)) {
        variables.push({ key: 'ladok', value: this.form.ladok });
      }

      if (this.is_set(this.form.address)) {
        variables.push({ key: 'address', value: this.form.address });
      }

      if (this.is_set_len(this.form.zipcode, 5)) {
        variables.push({ key: 'zipcode', value: this.form.zipcode });
      }

      if (this.is_set(this.form.email)) {
        variables.push({ key: 'email', value: this.form.email });
      }

      if (this.is_set(this.form.personnr)) {
        variables.push({ key: 'personnr', value: this.form.personnr });
      }

      if (this.is_set(this.form.period_id)) {
        variables.push({ key: 'period_id', value: this.form.period_id });
      }

      if (this.is_set(this.form.from_age)) {
        variables.push({ key: 'from_age', value: this.form.from_age });
      }

      if (this.is_set(this.form.to_age)) {
        variables.push({ key: 'to_age', value: this.form.to_age });
      }

      if (this.is_set(this.missing_email)) {
        variables.push({ key: 'no_email', value: this.missing_email });
      }

      if (this.is_set(this.form.zipcode)) {
        variables.push({ key: 'zipcode', value: this.form.zipcode });
      }

      if (this.is_set(this.form.country)) {
        variables.push({ key: 'country', value: this.form.country });
      }

      if (this.has_error) {
        variables.push({ key: 'has_error', value: 1 });
      }

      if (this.is_stickprov){
        variables.push({key: 'is_stickprov', value: 1});
      }

      if (this.has_membership) {
        variables.push({ key: 'cl_conf', value: 1 });
      }

      return {
        id: '',
        name: this.form.savetext,
        variables: variables,
        user: user,
        date: moment().format('YYYY-MM-DD'),
        event_ids: events,
        company_ids: this.$refs['companySelect'].getCompanies(),
        types: types,
        commune_codes: commune_code,
        region_codes: this.$refs['regionSelect'].getData(),
        groups: this.search_clients ? this.$refs['searchClient'].getData() : [],
        sexes: sexes,
        selected_company_id: this.currentCompanyId,
        company_id: this.currentCompanyId,
        order_by: { key: 'lastname', value: 'desc' },
        payment: this.form.payment,
        street: this.form.street,
        limit: 999999,
        page: 1,
      }
    },
    is_set_len(vv, len) {
      return vv !== null && vv !== undefined && vv !== '' && vv !== ' ' && (vv+'').length === len;
    },

    is_set(vv) {
      return vv !== null && vv !== undefined && vv !== '' && vv !== ' ';
    },
    onSave(e) {
      e.preventDefault();
      axios
        .post('/search/query', this.getQuery() )
        .then(res => {
          this.toastr('success', 'OK', 'Sökning skapad');

          var query = res.data.query;

          this.$emit('queryCreated', query);

          this.searchHistory.push({ value: query.id, text: query.name });
          this.selectedSearch = query.id;
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte skapa sökning');
        });
    },
    onReset(e) {
      e.preventDefault();

      this.resetQuery();
    },
    onSearch(e) {
      e.preventDefault();

      this.$emit('onSearch', this.getQuery());
    },
    loadRegions() {
      axios
        .get('/location/regions')
        .then(res => {
          this.regions = res.data.regions;
          this.regionOptions = [];

          for (var k in this.regions) {
            this.regionOptions.push({ code: k, label: this.regions[k].region });
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
    selectRegion(region_code) {
      this.loadCommunes(region_code, 1);
    },
    getCommunes(region_code) {
      var comm = [];

      var communes = this.regions[region_code].communes;
      this.communes = communes;

      for (var k in communes) {
        comm.push({ value: k, text: communes[k].commune });
      }

      comm.sort(function (a, b) {
        if (a.text < b.text) {
          return -1;
        }
        if (a.text > b.text) {
          return 1;
        }
        return 0;
      });

      return comm;
    },
    loadCommunes(selectedRegion, option) {
      this.communeOptions = [];

      var communes = this.regions[selectedRegion].communes;
      this.communes = communes;

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

      if (option == 1) {
        this.communeOptions1 = this.communeOptions;
      } else {
        this.communeOptions2 = this.communeOptions;
      }
    },
    scrollToClassName(classname) {
      var that = this;
      setTimeout(function () {

        const el = that.$el.getElementsByClassName(classname)[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({top: y, behavior: 'smooth'});
        }
      }, 100);
    },
    toastr(type, title, message) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 2000,
        appendToast: true,
        variant: type
      });
    },

  }
};
</script>
