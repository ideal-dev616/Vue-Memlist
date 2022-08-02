<template>
  <div class="px-5" id="page-dashboard">

    <b-row>
      <b-col lg="4">
        <b-card
          bg-variant="danger"
          text-variant="white"
          class="p-6 mt-6"
          no-body
          v-if="showTodo"
        >
          <div class="d-flex align-items-center">
            <i class="flaticon-warning text-white"></i>
            <h6 class="ml-2 mb-0">Du har saker att göra</h6>
          </div>
          <div class="f-300 mt-8">
            Glöm inte bort att slutföra det som behöver göras innan datumen nedan i listan. Klicka
            på "Att göra" i menyn till vänster för att börja beta av att göra listan.
          </div>
        </b-card>
        <b-card class="mt-6" no-body v-if="showTodo">
          <template #header>
            <h5 class="mb-0">Att göra</h5>
          </template>
          <div class="p-6">
            <todo-item v-for="(item, index) in todoData" v-if="validate(item)" :key="`todo-${index}`" :info="item" />
          </div>
        </b-card>
        <!--<b-card class="mt-6" header-border-variant="white" no-body>
          <template #header>
            <h5 class="mb-0">Försäljning</h5>
          </template>
          <b-card-body>
            <div class="custom-card-body-2-column">
              <div class="title">
                <span class="sales-title-text">0 SEK</span>
                <img src="assets/images/iconbox_bg.png" alt="bg" />
              </div>
              <div class="data">Hi</div>
            </div>
          </b-card-body>
        </b-card>-->
        <b-card class="mt-6" header-border-variant="white" no-body>
          <template #header>
            <h5 class="mb-0">Medlemmar</h5>
          </template>
          <div class="custom-card-body-2-column">
            <div class="title">
              <div class="d-flex flex-column">
                <span class="sales-title-text">{{
                  statChartData.datasets[0].data.reduce((a, b) => a + b, 0) +
                  statChartData.datasets[1].data.reduce((a, b) => a + b, 0) +
                  statChartData.datasets[2].data.reduce((a, b) => a + b, 0)
                }}</span>
              </div>
              <img src="assets/images/iconbox_bg.png" alt="bg" />
            </div>
            <div class="data">
              <div class="member-lists">
                <div class="data-member-icon mb-3">
                  <i class="member-icon-1"></i><span>Män</span>
                  <span class="sales-title-text"
                    >: {{ statChartData.datasets[1].data.reduce((a, b) => a + b, 0) }}</span
                  >
                </div>
                <div class="data-member-icon mb-3">
                  <i class="member-icon-2"></i><span>Kvinnor</span>
                  <span class="sales-title-text"
                    >: {{ statChartData.datasets[0].data.reduce((a, b) => a + b, 0) }}</span
                  >
                </div>
                <div class="data-member-icon mb-3">
                  <i class="member-icon-3"></i><span>Övriga</span>
                  <span class="sales-title-text"
                    >: {{ statChartData.datasets[2].data.reduce((a, b) => a + b, 0) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
      <b-col lg="8">
        <b-card class="mt-6">
          <template #header>
            <h5 class="mb-0">Ansökningar om anslutande</h5>
          </template>
          <div class="application-body">
            <div>
              Följande föreningar vill ansluta sig till ert riksförbund. Ni måste acceptera eller
              neka ansökan.
            </div>
            <b-table class="mt-3 mh-100" :fields="applicationFields" :items="applicationData" sticky-header>
              <template #cell(company_id)></template>
              <template #cell(actions)="data">
                <div class="d-flex">
                  <b-button size="sm" variant="success" @click="acceptCompany(data.item.company_id)"
                    >Acceptera</b-button
                  >
                  <b-button
                    size="sm"
                    variant="danger"
                    class="ml-2"
                    @click="denyCompany(data.item.company_id)"
                    >Neka</b-button
                  >
                </div>
              </template>
            </b-table>
          </div>
        </b-card>

        <b-card class="mt-6">
          <template #header>
            <h5 class="mb-0">Medlemsförvärv</h5>
          </template>
          <div class="membership-acquisition">
            <div class="d-flex mb-6">
              <div class="d-flex align-items-center">
                <div class="gender-girl-line"></div>
                <span class="ml-2">Tjejer</span>
              </div>
              <div class="d-flex align-items-center ml-5">
                <div class="gender-boy-line"></div>
                <span class="ml-2">Killar</span>
              </div>
              <div class="d-flex align-items-center ml-5">
                <div class="gender-other-line"></div>
                <span class="ml-2">Övriga</span>
              </div>
            </div>
            <bar-chart :chartData="statChartData" :options="barOption" />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import todoItem from '@/view/components/todoItem.vue';
import barChart from '@/view/components/barChart.vue';

export default {
  name: 'dashboard',
  components: { todoItem, barChart },
  data() {
    return {
      applicationFields: [
        { key: 'company_id', label: '' },
        { key: 'name', label: 'Namn' },
        {
          key: 'org_number',
          label: 'Org. Nummer'
        },
        { key: 'created_at', label: 'Datum' },
        {
          key: 'actions',
          label: ''
        }
      ],
      applicationData: [],
      todoData: [],
      statData: [],
      barOption: {
        responsive: true,
        maintainAspectRatio: false,
        legend: false,
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Month'
              },
              gridLines: false,
              ticks: {
                display: true,
                beginAtZero: true,
                // fontColor: KTApp.getBaseColor('shape', 3),
                fontSize: 13,
                padding: 10
              }
            }
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: 'Value'
              },
              gridLines: {
                drawBorder: false,
                offsetGridLines: false,
                drawTicks: false,
                borderDash: [3, 4],
                zeroLineWidth: 1,
                zeroLineBorderDash: [3, 4]
              },
              ticks: {
                max: 30,
                stepSize: 10,
                display: true,
                beginAtZero: true,
                fontSize: 13,
                padding: 5,
              }
            }
          ]
        },
        hover: {
          mode: 'index'
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: 'nearest',
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: '#5D78FF',
          titleFontColor: '#ffffff',
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters(['currentCompanyId', 'currentPeriodId']),
    statChartData: function() {
      return {
        is_loading: false,
        data_loaded: false,
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'Maj',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Okt',
          'Nov',
          'Dec'
        ],
        datasets: [
          {
            label: 'Tjejer',
            backgroundColor: '#5d78ff',
            borderWidth: 0,
            categoryPercentage: 0.35,
            barPercentage: 0.7,
            data: this.statData.female_stats ? this.statData.female_stats : []
          },
          {
            label: 'Killar',
            backgroundColor: '#93a2dd',
            borderWidth: 0,
            categoryPercentage: 0.35,
            barPercentage: 0.7,
            data: this.statData.male_stats ? this.statData.male_stats : []
          },
          {
            label: 'Övriga',
            backgroundColor: '#646c9a',
            borderWidth: 0,
            categoryPercentage: 0.35,
            barPercentage: 0.7,
            data: this.statData.unknown_stats ? this.statData.unknown_stats : []
          }
        ]
      };
    },
    showTodo(){
      return this.todoData.length > 0
    }
  },
  mounted() {
    this.loadData();
  },
  watch: {
    currentCompanyId(newValue, oldValue) {
      if (newValue) {
        this.loadData();
      }
    },
    currentPeriodId(newValue, oldValue) {
      if (newValue) {
        this.loadData();
      }
    }
  },
  methods: {
    validate(item){
      return item.creator_company_id === item.company_id
              ? ['NOT','DRAFT'].includes(item.status)
              : ['NOT', 'COMPLETE'].includes(item.status) ;
    },
    async loadData() {
      if (this.data_loaded) { return; }
      if (this.is_loading) { return; }

      if (!this.currentCompanyId) {
        return;
      }
      if (!this.currentPeriodId) {
        return;
      }
      console.log('---- LOAD DATA ----');

      this.is_loading = true;

      const loader = this.$loading.show();
      this.applicationData = [];
      this.todoData = [];
      this.statData = [];
      // get company list no accept
      const res = await axios.get(`/company/listnonaccept?company_id=${this.currentCompanyId}`);
      if (res.status === 200) {
        this.applicationData = res.data.companies;
      } else {
      }
      // get todo list
      const res1 = await axios.get(`/todo/list?type=PA&source=dashboard&company_id=${this.currentCompanyId}`);
      if (res1.status === 200) {
        this.todoData = res1.data.todos;
      } else {
      }

      // get company stat
      if (this.currentPeriodId != undefined) {
        const res2 = await axios.get(
          `/company/stats?company_id=${this.currentCompanyId}&period_id=${this.currentPeriodId}`
        );
        if (res2.status === 200) {
          this.changeBarChartY(res2.data.stats)
          this.statData = res2.data.stats;
        }
      }
      // get company stat
      // const res3 = await axios.get(
      //   `/client/list?company_id=${this.currentCompanyId}`);
      // if (res3.status === 200) {
      //   console.log(res3.data, "Memberlist");
      // } else {
      // }

      this.is_loading = false;
      this.data_loaded = true;

      loader & loader.hide();
    },
    async acceptCompany(id) {
      const child_company_id = id;
      const val = true;
      const pc_id = this.currentCompanyId;
      // const res = await axios.post(`/company/acceptcompany?val=${val}&child_company_id=${child_company_id}&pc_id=${pc_id}`);
      const res = await axios.post(`/company/acceptcompany`, {val, child_company_id, pc_id});
      if (res.status === 201) {
        this.applicationData = this.applicationData.filter(function(data){
          return child_company_id !== data.company_id;
        });
      } else {
        console.log(res);
      }
    },
    async denyCompany(id) {
      const child_company_id = id;
      const val = false;
      const pc_id = this.currentCompanyId;
      // const res = await axios.post(`/company/acceptcompany?val=${val}&child_company_id=${child_company_id}&pc_id=${pc_id}`);
      const res = await axios.post(`/company/acceptcompany`, {val, child_company_id, pc_id});
      if (res.status === 201) {
        this.applicationData = this.applicationData.filter(function(data){
          return child_company_id !== data.company_id;
        });
      } else {
        console.log(res);
      }
    },

    /**
     *  Change bar-chart yAxes max value
     */
    changeBarChartY(stats){
      let tempMembers = stats.female_stats.concat(stats.male_stats, stats.unknown_stats);
      const max = Math.max(...tempMembers, 4);
      if (!isNaN(max)) {
        let nAddedStep = Math.pow(10, Math.floor(Math.log(max) / Math.log(10)));
        nAddedStep = nAddedStep < 1 ? 1 : nAddedStep;
        this.barOption.scales.yAxes[0].ticks.max = Math.floor(max) < 10 ? 10 : Math.floor(max) + nAddedStep - Math.floor(max) % nAddedStep;
        this.barOption.scales.yAxes[0].ticks.stepSize = this.barOption.scales.yAxes[0].ticks.max / 5;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  #page-dashboard {
    .custom-card-body-2-column {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      width: 100%;
      height: 100%;
      padding: 2rem 0rem;
      .title {
        flex: 1;
        position: relative;
        font-size: 2.2rem;
        font-weight: 600;
        color: #595d63;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          opacity: 0.08;
          position: absolute;
          z-index: 0;
          width: 120px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .data {
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 3rem;
        .member-icon-1 {
          display: inline-block;
          width: 0.45rem;
          height: 0.45rem;
          flex: 0 0 0.45rem;
          border-radius: 100%;
          margin-bottom: 0.12rem;
          margin-right: 0.8rem;
          background-color: #93a2dd !important;
        }
        .member-icon-2 {
          display: inline-block;
          width: 0.45rem;
          height: 0.45rem;
          flex: 0 0 0.45rem;
          border-radius: 100%;
          margin-bottom: 0.12rem;
          margin-right: 0.8rem;
          background-color: #5d78ff !important;
        }
        .member-icon-3 {
          display: inline-block;
          width: 0.45rem;
          height: 0.45rem;
          flex: 0 0 0.45rem;
          border-radius: 100%;
          margin-bottom: 0.12rem;
          margin-right: 0.8rem;
          background-color: #646c9a !important;
        }
      }
    }
    .membership-acquisition {
      .gender-girl-line {
        width: 15px;
        height: 5px;
        border-radius: 3px;
        background-color: #5d78ff !important;
      }
      .gender-boy-line {
        width: 15px;
        height: 5px;
        border-radius: 3px;
        background-color: #93a2dd !important;
      }
      .gender-other-line {
        width: 15px;
        height: 5px;
        border-radius: 3px;
        background-color: #646c9a !important;
      }
    }
  }
</style>
