<template>
  <div class="px-5" id="page-live-periods">
    <PeriodTable
      :periods="periods"
      :months="months"
      type="live"
      @createPeriodClicked="createPeriod"
      @selectPeriodClicked="selectPeriod"
      @deletePeriodClicked="deletePeriod"
      @toastr="toastr"
    />
    <div class="scroll-to-container"></div>
    <b-card
      title=""
      class="mb-2 edit-live-period-container"
      ref="edit-live-period"
      id="edit-live-period"
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
            <b-form-datepicker id="input-2" v-model="form.from" class="mb-2"> </b-form-datepicker>
          </b-form-group>

          <b-form-group id="input-group-3" label="Till Datum" label-for="input-3">
            <b-form-datepicker id="input-3" v-model="form.to" class="mb-2"> </b-form-datepicker>
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
    this.loadPeriods();
  },
  data() {
    return {
      form: {
        id: '',
        from: '',
        to: '',
        name: ''
      },
      loaded: false,
      creating: false,
      editing: false,
      periods: []
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {
        this.loadPeriods();
      }
    }
  },
  methods: {
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
      if (this.creating) {
        axios
          .post('/company/liveperiod', this.form)
          .then(res => {
            if (res.status === 201) {
              this.creating = false;
              this.form = res.data.period;
              this.toastr('success', 'OK', 'Perioden skapades');
              this.loadPeriods();
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte skapa perioden');
          });
      } else {
        axios
          .put('/company/liveperiod', this.form)
          .then(res => {
            if (res.status === 204) {
              this.creating = false;
              this.form = res.data.period;
              this.toastr('success', 'OK', 'Period uppdaterades');
              this.loadPeriods();
            }
          })
          .catch(err => {
            console.error(err);
            this.toastr('danger', 'Server Fel', 'Kunde inte uppdatera perioden');
          });
      }
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
        .delete(`/company/liveperiod?period_id=${period_id}&company_id=${this.currentCompanyId}`)
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
        }
      }
      this.form.company_id = this.currentCompanyId;
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
            this.periods = res.data.company.periods;

            this.periods.sort(function(a,b) {
              return b.from.localeCompare(a.from);
            })

            this.loaded = true;
          }
        })
        .catch(err => {
          console.error(err);
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
