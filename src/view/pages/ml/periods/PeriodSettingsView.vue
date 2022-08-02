<template>
  <div class="px-5" id="page-settings-periods">
    <PeriodTable
      :periods="periods"
      :months="months"
      type="settings"
      @createPeriodClicked="createPeriod"
      @selectPeriodClicked="selectPeriod"
      @deletePeriodClicked="deletePeriod"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-settings-period-container"
      ref="edit-settings-period"
      id="edit-settings-period"
      hide-footer
      v-if="creating || editing"
    >
      <div>
        <b-form class="mt-8" @submit="submitPeriod">
          <b-form-group id="input-group-period_id" label="ID" label-for="input-period_id">
            <b-form-input
              id="input-period_id"
              v-model="form.id"
              type="text"
              required
              disabled
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-1" label="Namn på perioden" label-for="input-1">
            <b-form-input id="input-1" v-model="form.name" type="text"></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Från Datum" label-for="input-2">
            <!--<b-form-datepicker id="input-2" v-model="form.from" class="mb-2"> </b-form-datepicker>-->
            <b-form-select class="col-3" v-model="selectedFromMonth" :options="months"></b-form-select>
            <b-form-select class="col-2 ml-2" v-model="selectedFromDay" :options="fromDays"></b-form-select>
          </b-form-group>

          <b-form-group id="input-group-3" label="Till Datum" label-for="input-3">
            <!--<b-form-datepicker id="input-3" v-model="form.to" class="mb-2"> </b-form-datepicker>-->
            <b-form-select class="col-3" v-model="selectedToMonth" :options="months"></b-form-select>
            <b-form-select class="col-2 ml-2" v-model="selectedToDay" :options="toDays"></b-form-select>
          </b-form-group>

          <b-button type="submit" variant="primary">Spara</b-button>
        </b-form>

         
      </div>
    </b-card>
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
import { mapGetters } from 'vuex';
import PeriodTable from '@/view/pages/ml/periods/PeriodTable.vue';
import moment from 'moment';

export default {
  name: 'periods',
  components: {
    PeriodTable
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  props: ['months'],
  mounted() {
    this.maxDays['01'] = 31;
    this.maxDays['02'] = 29;
    this.maxDays['03'] = 31;
    this.maxDays['04'] = 30;
    this.maxDays['05'] = 31;
    this.maxDays['06'] = 30;
    this.maxDays['07'] = 31;
    this.maxDays['08'] = 31;
    this.maxDays['09'] = 30;
    this.maxDays['10'] = 31;
    this.maxDays['11'] = 30;
    this.maxDays['12'] = 31;
    
    this.initDates();
    this.loadPeriods();
  },
  data() {
    return {
      
      fromDays: [],
      toDays: [],
      selectedFromMonth: '01',
      selectedToMonth: '01',
      selectedFromDay: '01',
      selectedToDay: '01',
      form: {
        id: '',
        from: '',
        to: '',
        name: ''
      },
      loaded: false,
      creating: false,
      editing: false,
      periods: [],
      maxDays: {}
    };
  },
  watch: {
    selectedFromMonth(newValue, oldValue) {
      var num = this.maxDays[newValue];

      this.fromDays = [];

      for (var i = 1; i <= num; ++i) {
        this.fromDays.push({ value: (i+'').padStart(2, '0'), text: i+'' });
      }
    },
    selectedToMonth(newValue, oldValue) {
      var num = this.maxDays[newValue];

      this.toDays = [];

      for (var i = 1; i <= num; ++i) {
        this.toDays.push({ value: (i+'').padStart(2, '0'), text: i+'' });
      }
    },
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadPeriods();
      }
    }
  },
  methods: {
    initDates() {
      this.selectedFromMonth = '01';
      this.selectedToMonth = '01';
      
      var num = this.maxDays[this.selectedFromMonth];

      this.toDays = [];

      for (var i = 1; i <= num; ++i) {
        this.toDays.push({ value: (i+'').padStart(2, '0'), text: i+'' });
      }

      num = this.maxDays[this.selectedToMonth];

      this.fromDays = [];

      for (var i = 1; i <= num; ++i) {
        this.fromDays.push({ value: (i+'').padStart(2, '0'), text: i+'' });
      }
    },
    async loadData() {
      if (!this.currentCompanyId) {
        return;
      }
      if (!this.titles) {
        return;
      }

      this.loadPeriods();
    },
    submitPeriod(e) {
      e.preventDefault();

      this.updatePeriod();
    },
    updatePeriod() {

      this.form.from_month = this.selectedFromMonth;
      this.form.to_month = this.selectedToMonth;
      this.form.from_day = this.selectedFromDay;
      this.form.to_day = this.selectedToDay;
      
      axios
        .put('/company/settingperiod', { period: this.form, company_id: this.currentCompanyId } )
        .then(res => {
          if (res.status === 204) {
            this.creating = false;
            //this.form = res.data.period;
            this.toastr('success', 'OK', 'Period uppdaterades');
            this.loadPeriods();
          }
          else {
            this.toastr('danger', 'Server Fel', 'Okänd returkod');  
          }
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera perioden');
        });
    },
    createPeriod() {
      this.creating = true;
      this.editing = true;

      this.scrollToEditPeriod();

      this.form.company_id = this.currentCompanyId;
      this.form.period_id = this.currentPeriodId;
    },
    deletePeriod(period_id) {

      axios
        .delete(`/company/settingperiod?period_id=${period_id}&company_id=${this.currentCompanyId}`)
        .then(res => {
          this.periods = this.periods.filter(item => item.period_id !== period_id);

          this.creating = false;
          this.editing = false;

          this.toastr('success', 'OK', 'Perioden togs bort');

          this.loadPeriods();
        })
        .catch(err => {
          console.error(err);
          this.toastr('danger', 'Server Fel', 'Kunde inte ta bort perioden');
        });
    },
    selectPeriod(period_id) {
      for (var i = 0; i < this.periods.length; ++i) {
        if (this.periods[i].id === period_id) {
          this.form = this.periods[i];
          this.selectedFromMonth = this.form.from_month;
          this.selectedToMonth = this.form.to_month;
          this.selectedFromDay = this.form.from_day;
          this.selectedToDay = this.form.to_day;
        }
      }

      this.creating = false;
      this.editing = true;

      this.scrollToEditPeriod();
    },
    getLangText(lang_text, lang) {
      for (var i = 0; i < lang_text.length; ++i) {
        if (lang_text[i].lang === lang) {
          return lang_text[i].text;
        }
      }

      return 'Språköversättning saknas';
    },
    async loadPeriods() {
      this.periods = [];
      axios
        .get(`/company?company_id=${this.currentCompanyId}`)
        .then(res => {
          if (res.status === 200) {
            this.periods = res.data.company.settings.periods;

            this.loaded = true;
          }
        })
        .catch(err => {
          this.toastr('danger', 'Server Fel', 'Kunde inte lista perioder');
        });
    },
    scrollToEditPeriod() {
      var that = this;
      setTimeout(function () {
        const el = that.$el.getElementsByClassName('edit-live-period-container')[0];

        if (el) {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
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
    }
  }
};
</script>
