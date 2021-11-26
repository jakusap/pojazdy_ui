import { mapActions, mapGetters } from 'vuex';

import { deleteDriverLink, getBlocked, getLinkedByEmail, getLinkedByUuid, postDriverLink } from '@/api/driverLinksApi';
import { getSignedDocumentsForDriver } from '@/api/partnerDocumentsApi';

const driversProfilesMixin = {
  computed: {
    ...mapGetters(['dataLoading']),
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    async fetchLinkedByEmail() {
      await getLinkedByEmail().then((response) => {
        if (response.ok) {
          this.linkedByEmail = response.data;
        }
      });
    },
    async fetchLinkedByUuid() {
      await getLinkedByUuid().then((response) => {
        if (response.ok) {
          this.linkedByUuid = response.data;
        }
      });
    },
    async fetchBlocked() {
      await getBlocked().then((response) => {
        if (response.ok) {
          this.blockedDrivers = response.data;
        }
      });
    },
    linkDriver(driver) {
      this.toggleDataLoading(true);
      if (this.filters.linkType === 'EMAIL') {
        postDriverLink({
          ...driver,
          driverAccountUUID: driver.driverAccountUUID,
          linkStatus: { blocked: false },
        }).then((response) => {
          if (response.ok) {
            this.fetchLinkedByEmail().finally(() => {
              this.toggleDataLoading(false);
            });
          }
        });
      } else {
        postDriverLink({
          ...driver,
          driverAccountUUID: driver.driverAccountUUID,
          linkStatus: { blocked: false },
        }).then((response) => {
          if (response.ok) {
            this.fetchLinkedByUuid().finally(() => {
              this.toggleDataLoading(false);
            });
          }
        });
      }
    },
    blockDriver(driver) {
      this.toggleDataLoading(true);
      postDriverLink({
        ...driver,
        driverAccountUUID: driver.driverAccountUUID,
        linkStatus: { blocked: true },
      }).then((response) => {
        if (response.ok) {
          this.filters.linkType === 'EMAIL'
            ? this.fetchLinkedByEmail().finally(() => this.toggleDataLoading(false))
            : this.fetchLinkedByUuid().finally(() => this.toggleDataLoading(false));
        }
      });
    },
    unblockDriver(linkStatus) {
      this.toggleDataLoading(true);
      deleteDriverLink(linkStatus.id).then((response) => {
        if (response.ok) {
          this.fetchBlocked().finally(() => this.toggleDataLoading(false));
        }
      });
    },
    async getSignedDocuments(driverAccountUuid) {
      await getSignedDocumentsForDriver(driverAccountUuid, null).then((response) => {
        if (response.ok) {
          this.doc = response.data;
        }
      });
    },
    downloadFile(doc, driver) {
      const link = document.createElement('a');
      link.href = `/api/partner-documents/signed/${doc.contractId}/${doc.order}?driverAccountUuid=${driver.driverAccountUUID}`;
      link.target = '_blank';
      link.click();
      link.remove();
    },
    downloadAllSignedDoc(driver) {
      const link = document.createElement('a');
      link.href = `/api/partner-documents/signed/all?driverAccountUuid=${driver.driverAccountUUID}`;
      link.target = '_blank';
      link.click();
      link.remove();
    },
  },
};

export default driversProfilesMixin;
