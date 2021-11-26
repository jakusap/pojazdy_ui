<template>
  <div class="main">
    <el-table :data="documents">
      <el-table-column :label="$t('DriverDocuments.title')" align="center">
        <template slot-scope="scope"> {{ scope.row.name }} {{ scope.row.signatureDate | formatDateLong }} </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot-scope="scope">
          <a :href="downloadLink(scope.row)" target="_blank">
            <el-button type="success">
              {{ $t('DriverDocuments.download') }}
            </el-button>
          </a>
        </template>
      </el-table-column>
      <el-table-column align="left">
        <template slot-scope="scope">
          <el-button type="primary" @click="openPreview(scope.row)">
            {{ $t('DriverInvoices.preview') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <a :href="downloadLink()" target="_blank">
      <el-button type="info"> {{ $t('DriverDocuments.download_all') }}</el-button>
    </a>
  </div>
</template>

<script>
import DocumentPreview from '@/effects/DocumentPreview';

export default {
  name: 'SignedContracts',
  props: {
    driver: {
      type: Object,
    },
    documents: {
      type: Array,
    },
  },
  methods: {
    downloadLink(doc) {
      let baseLink = '/api/partner-documents/signed/';
      if (doc) {
        baseLink = baseLink + `/${doc.contractId}/${doc.order}`;
      } else {
        baseLink = baseLink + '/all';
      }
      if (this.$props.driver && this.$props.driver.driverAccountUUID) {
        return baseLink + `?driverAccountUuid=${this.$props.driver.driverAccountUUID}`;
      } else if (this.$props.driver && this.$props.driver.driverUUID) {
        return baseLink + `?driverUuid=${this.$props.driver.driverUUID}`;
      } else {
        return baseLink;
      }
    },
    openPreview(doc) {
      this.$modalOn(DocumentPreview, { driver: this.$props.driver, contractId: doc.contractId, order: doc.order });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  margin-top: 15px;
}
.el-button--info {
  margin: 10px 5px 5px 5px;
}
</style>
