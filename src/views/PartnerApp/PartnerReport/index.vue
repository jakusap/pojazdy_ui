<template>
  <div class="table-wrapper">
    <div>
      <el-row v-if="parameters.length">
        <ReportParameterInput
          v-for="(parameter, idx) in reportDefinition.parameters"
          :key="idx"
          v-model="parameters[idx]"
          :type="parameter"
          @change="fetchReport()"
        />
      </el-row>
    </div>
    <el-table :data="datasets" stripe :cell-style="cellStyle">
      <component :is="column" v-for="(column, idx) in reportTemplate" :key="idx"></component>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';

import { generateReport } from '@/api/reportsApi';

import ReportParameterInput from './components/ReportParameterInput';

export default {
  name: 'PartnerReport',
  components: {
    ReportParameterInput,
  },
  props: {
    code: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      datasets: [],
      parameters: [],
    };
  },
  computed: {
    ...mapGetters('reports', ['reportsForPartner']),
    reportDefinition() {
      return this.reportsForPartner.find((r) => r.code.toUpperCase() === this.code.toUpperCase());
    },
    reportTemplate() {
      return this.reportDefinition.template
        .split('</el-table-column>')
        .filter((c) => c.trim().length)
        .map((c) => `${c}</el-table-column>`)
        .map((c) => Vue.compile(c));
    },
  },
  async created() {
    this.loading = true;
    this.prepareParameters();
    await this.fetchReport();
    this.loading = false;
  },
  methods: {
    prepareParameters() {
      this.parameters = this.reportDefinition.parameters.map((p) => {
        if (p === 'DAY') return new Date().toISOString().slice(0, 10);
        return '';
      });
    },
    async fetchReport() {
      const report = await generateReport(this.reportDefinition.datasource, this.parameters).then((response) => {
        if (response.ok) {
          return response.data;
        }
      });
      this.datasets = report.datasets;
    },
    cellStyle({ row }) {
      if (row && row.color) {
        return { 'background-color': row.color };
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped></style>
