<script>
import { Bar } from 'vue-chartjs';
export default {
  extends: Bar,
  props: {
    chartData: { type: Object, default: null },
    options: { type: Object, default: null }
  },
  watch: {
    chartData(newVal, oldVal) {
      if (this._data._chart) {
        this._data._chart.data.datasets[0].data = newVal;
        this.renderChart(newVal, this.options);
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
