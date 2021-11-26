<template>
  <div ref="chart" class="plotly-chart" />
</template>

<script>
import Plotly from 'plotly.js-dist-min';

export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    data: {
      type: Array,
      required: true,
    },
    hovermode: {
      type: Boolean,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
  },
  data() {
    return {
      layout: {
        height: this.height,
        width: this.width,
        showlegend: false,
        margin: { t: 48, b: 16, l: 'automargin', r: 'automargin' },
        hovermode: this.hovermode,
        font: {
          size: 16,
        },
      },
      options: {
        displayModeBar: false,
        responsive: true,
      },
    };
  },
  mounted() {
    this.plot();
  },
  methods: {
    plot() {
      const chart = this.$refs.chart;
      Plotly.newPlot(chart, this.data, { title: this.title, ...this.layout }, this.options);
    },
  },
};
</script>

<style lang="scss" scoped>
.plotly-chart {
  min-width: 300px;
}
</style>
