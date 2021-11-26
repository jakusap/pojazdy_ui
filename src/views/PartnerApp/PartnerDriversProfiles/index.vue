<template>
  <div class="linked-drivers">
    <DataWrapper>
      <template slot="table-header">
        <TableHeader :filters="filters" />
      </template>

      <div slot="table-body" v-loading="dataLoading">
        <BlockedDrivers
          v-if="linkType === 'BLOCKED'"
          :drivers-list="driversList"
          @unblock-driver="(e) => unblockDriver(e)"
        />
        <LinkedBy
          v-else
          :link-type="filters.linkType"
          :drivers-list="driversList"
          @link-driver="(e) => linkDriver(e)"
          @add-driver="(e) => showAddDriverModal(e)"
          @block-driver="(e) => blockDriver(e)"
          @show-documents-list="(e) => showDocumentsList(e)"
          @download-all="(e) => downloadAllSignedDoc(e)"
        />
      </div>
    </DataWrapper>
  </div>
</template>

<script>
import DataWrapper from '@/components/DataWrapper';
import AddDriver from '@/effects/AddDriver';
import DocumentsList from '@/effects/DocumentsList';
import eventBus from '@/eventBus';

import BlockedDrivers from './BlockedDrivers';
import driversProfilesMixin from './driversProfilesMixin';
import LinkedBy from './LinkedBy';
import TableHeader from './TableHeader';
export default {
  components: {
    DataWrapper,
    TableHeader,
    BlockedDrivers,
    LinkedBy,
  },
  mixins: [driversProfilesMixin],
  data() {
    return {
      filters: {
        driver: null,
        linkType: 'EMAIL',
      },
      linkedByEmail: [],
      linkedByUuid: [],
      blockedDrivers: [],
      doc: [],
      selectedDrivers: [],
    };
  },
  computed: {
    driversList() {
      let selectedDrivers =
        (this.linkType === 'EMAIL' && this.linkedByEmail) ||
        (this.linkType === 'UUID' && this.linkedByUuid) ||
        (this.linkType === 'BLOCKED' && this.blockedDrivers);
      return this.filterData(selectedDrivers, this.filters);
    },
    linkType() {
      return this.filters.linkType;
    },
  },
  watch: {
    async linkType(linkType) {
      this.toggleDataLoading(true);
      (linkType === 'EMAIL' && (await this.fetchLinkedByEmail())) ||
        (linkType === 'UUID' && (await this.fetchLinkedByUuid())) ||
        (linkType === 'BLOCKED' && (await this.fetchBlocked()));
      this.toggleDataLoading(false);
    },
  },
  async created() {
    eventBus.$on('added-linked-driver', this.linkedNewDriver);
    if (this.$route.params.driverUUID) {
      const driver = this.$route.params;
      this.filters.driver = driver.lastName + ' ' + driver.firstName;
    }
    this.toggleDataLoading(true);
    await Promise.all([this.fetchLinkedByEmail(), this.fetchLinkedByUuid(), this.fetchBlocked()]);
    this.toggleDataLoading(false);
  },
  beforeDestroy() {
    eventBus.$off('added-linked-driver', this.linkedNewDriver);
  },
  methods: {
    showAddDriverModal(driver) {
      this.$modalOn(AddDriver, { driver: driver });
    },
    async linkedNewDriver() {
      this.toggleDataLoading(true);
      await this.fetchLinkedByUuid();
      this.toggleDataLoading(false);
    },
    filterData(drivers, filters) {
      let filteredData = drivers;
      if (filters.driver) {
        const searchedDriver = filters.driver.toLowerCase();
        filteredData = filteredData.filter((driver) => {
          const fullName = driver.lastName + ' ' + driver.firstName;
          if (fullName.toLowerCase().search(searchedDriver) >= 0) return driver;
        });
      }
      return filteredData;
    },
    async showDocumentsList(driver) {
      const documents = await this.getSignedDocuments(driver.driverAccountUUID);
      this.$modalOn(DocumentsList, { driver: driver, documents: this.doc });
    },
  },
};
</script>

<style lang="scss" scoped></style>
