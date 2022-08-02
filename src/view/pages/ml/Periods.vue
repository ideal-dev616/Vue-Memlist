<template>
  <div class="px-5" id="page-periods">
    <h5 class="mb-6 ml-2">Perioder</h5>

    <b-card
      title=""
      class="mb-2"
      hide-footer
    >

        <v-tabs
            background-color="white"
            color="dark"
            right
        >
            <v-tab>Aktiva Perioder</v-tab>
            <v-tab>Inställningar</v-tab>

            <v-tab-item class='mt-8'>
                <PeriodLiveView
                  :months="months"
                 />
            </v-tab-item>

            <v-tab-item class='mt-8'>
                <PeriodSettingsView
                  :months="months"
                />
            </v-tab-item>
        </v-tabs>
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
import PeriodLiveView from '@/view/pages/ml/periods/PeriodLiveView.vue';
import PeriodSettingsView from '@/view/pages/ml/periods/PeriodSettingsView.vue';

export default {
  name: 'periods',
  components: {
    PeriodLiveView, PeriodSettingsView,
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId'])
  },
  mounted() {

  },
  data() {
    return {
      months: [
        { value: '01', text: 'Januari' },
        { value: '02', text: 'Februari' },
        { value: '03', text: 'Mars' },
        { value: '04', text: 'April' },
        { value: '05', text: 'Maj' },
        { value: '06', text: 'Juni' },
        { value: '07', text: 'Juli' },
        { value: '08', text: 'Augusti' },
        { value: '09', text: 'September' },
        { value: '10', text: 'Oktober' },
        { value: '11', text: 'November' },
        { value: '12', text: 'December' },
      ],
    };
  },
  watch: {
    currentCompanyId(newValue, oldvalue) {
      if (newValue) {

      }
    }
  },
  methods: {
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
