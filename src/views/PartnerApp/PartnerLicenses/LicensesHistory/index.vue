<template>
  <DataWrapper>
    <template slot="table-header">
      <h1>
        {{ $t('LicensesHistory.table_title') }}
      </h1>
    </template>
    <template slot="table-body">
      <el-table :data="purchasedLicenses" height="calc(100vh - 64px - 32px - 32px - 32px)">
        <el-table-column :label="$t('LicensesHistory.description')" prop="pricelist.description" align="center">
        </el-table-column>

        <el-table-column :label="$t('LicensesHistory.purchaseDate')" align="center" prop="purchaseDate">
          <template slot-scope="scope">
            {{ scope.row.purchaseDate | formatDateLong }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('LicensesHistory.invoice')" align="center">
          <template slot-scope="scope">
            <a
              type="primary"
              class="el-button el-button--primary"
              :href="`/api/online-payments/${scope.row.paymentId}/invoice`"
              target="_self"
            >
              {{ $t('LicensesHistory.download_invoice') }}
            </a>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </DataWrapper>
</template>

<script>
import { getPuchasedLicenses } from '@/api/licensesApi';
import DataWrapper from '@/components/DataWrapper';

export default {
  components: {
    DataWrapper,
  },
  data() {
    return {
      purchasedLicenses: [],
    };
  },
  created() {
    getPuchasedLicenses().then((response) => {
      if (response.ok) {
        this.purchasedLicenses = response.data;
      }
    });
  },
};
</script>

<style lang="scss" scoped></style>
