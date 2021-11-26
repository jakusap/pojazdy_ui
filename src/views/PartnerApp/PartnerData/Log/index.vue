<template>
  <DataWrapper v-loading="loading">
    <template slot="table-header">
      <h2>{{ $t('UploadData.import_log') }}</h2>

      <el-select v-model="filters.provider" clearable>
        <el-option :value="null" :label="$t('UploadData.all_providers')" />
        <el-option
          v-for="(uploadedProvider, idx) in uploadedProviders"
          :key="idx"
          :value="uploadedProvider"
          :label="uploadedProvider[0].toUpperCase().concat(uploadedProvider.slice(1))"
        />
      </el-select>
      <el-date-picker
        v-model="filters.dateFrom"
        :placeholder="$t('date_from')"
        class="filter-item"
        type="date"
        clearable
      />
      <el-date-picker
        v-if="filters.dateFrom"
        v-model="filters.dateTo"
        :picker-options="datePickerOptions"
        :placeholder="$t('date_to')"
        type="date"
        clearable
        class="filter-item"
      />
    </template>

    <template slot="table-body">
      <el-table :data="filteredLogs">
        <el-table-column
          align="center"
          width="100"
          :label="$t('UploadData.import_id')"
          prop="importId"
          sortable
        ></el-table-column>
        <el-table-column align="center" width="150" :label="$t('UploadData.import_status')">
          <template slot-scope="scope">
            <span v-if="scope.row.valid">
              <el-popover trigger="hover" placement="right">
                <span>
                  {{ $t('UploadData.import_successful') }}
                </span>
                <i slot="reference" class="el-icon-success icon-success" />
              </el-popover>
            </span>
            <span v-else>
              <el-popover trigger="hover" placement="right">
                <span>
                  {{ $t('UploadData.import_failed') }}
                </span>
                <i slot="reference" class="el-icon-warning icon-warning" />
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('UploadData.import_date')" prop="importDate" align="center"></el-table-column>
        <el-table-column :label="$t('UploadData.provider_names')" align="center">
          <template slot-scope="scope">
            <span v-for="(fileName, idx) in scope.row.fileNames" :key="idx">
              <ProviderBadge :provider="fileName" />
            </span>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </DataWrapper>
</template>

<script>
import { getUploadLogs } from '@/api/files';
import DataWrapper from '@/components/DataWrapper';
import ProviderBadge from '@/components/ProviderBadge';
export default {
  components: {
    DataWrapper,
    ProviderBadge,
  },
  data() {
    return {
      loading: false,
      logs: [],
      filters: {
        provider: null,
        dateFrom: null,
        dateTo: null,
      },
      uploadedProviders: [],
      datePickerOptions: {
        disabledDate: this.disabledFrom,
      },
    };
  },
  computed: {
    filtersActive() {
      return !!this.filters.provider || !!this.filters.dateFrom || !!this.filters.dateTo;
    },

    filteredLogs() {
      let filteredLogs = this.logs;

      if (this.filters.provider) {
        filteredLogs = filteredLogs.filter((log) => {
          return log.fileNames.includes(this.filters.provider.toUpperCase());
        });
      }
      if (this.filters.dateFrom) {
        const dateFrom = new Date(this.filters.dateFrom);
        const startMonth = new Date().getMonth() - 1;

        filteredLogs = filteredLogs.filter((log) => {
          return new Date(log.importDate) > dateFrom;
        });
      }
      if (this.filters.dateTo) {
        const dateTo = new Date(this.filters.dateTo);

        dateTo.setHours(23, 59, 59, 999);

        filteredLogs = filteredLogs.filter((log) => {
          return new Date(log.importDate) < dateTo;
        });
      }

      return this.filtersActive ? filteredLogs : this.logs;
    },
  },
  async created() {
    await getUploadLogs()
      .then((response) => {
        this.logs = response.data.map((log) => {
          return {
            ...log,
            fileNames: Array.from(
              new Set(
                log.fileNames.map((fileName) => {
                  return fileName.split('_')[0].toUpperCase();
                })
              )
            ),
          };
        });

        this.filterProviders(response.data);
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    disabledFrom(date) {
      return date < new Date(this.filters.dateFrom);
    },
    filterProviders(logs) {
      const uploadedProviders = new Set();

      logs.forEach((log) => {
        log.fileNames.forEach((fileName) => {
          uploadedProviders.add(fileName.split('_')[0]);
        });
      });

      this.uploadedProviders = uploadedProviders;
    },
  },
};
</script>

<style lang="scss" scoped></style>
