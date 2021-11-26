<template>
  <div v-loading="loading" class="driver-invoices">
    <div v-if="partnerUuid">
      <div class="driver-invoices__list">
        <ApprovedInvoices
          :approved-invoices="approvedInvoices"
          @start-loading="loading = true"
          @fetch-approved="fetchApprovedInvoices()"
        />
        <div>
          <hr class="driver-invoices__hr" />
        </div>
        <UploadedInvoices
          :uploadeded-invoices="uploadededInvoices"
          @start-loading="loading = true"
          @fetch-uploaded="fetchUploadedInvoices()"
        />
        <UploadInvoice
          :partner-u-u-i-d="partnerUuid"
          :partner-provision="partnerProvision"
          @start-loading="loading = true"
          @fetch-uploaded="fetchUploadedInvoices()"
          @fetch-uploaded-describe="fetchUploadedInvoices(true)"
        />
        <div>
          <hr class="driver-invoices__hr" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { getInvoices, getPartnerInvoiceProvision } from '@/api/invoicesApi';
import SetInvoiceDescription from '@/effects/SetInvoiceDescription';
import eventBus from '@/eventBus';

import ApprovedInvoices from './components/ApprovedInvoices';
import UploadedInvoices from './components/UploadedInvoices';
import UploadInvoice from './components/UploadInvoice';

export default {
  name: 'DriverInvoices',
  components: {
    UploadedInvoices,
    ApprovedInvoices,
    UploadInvoice,
  },
  data() {
    return {
      loading: false,
      uploadededInvoices: [],
      approvedInvoices: [],
      partnerProvision: {},
    };
  },
  computed: {
    ...mapGetters(['partnerUuid']),
  },
  watch: {
    partnerUuid: {
      async handler(value) {
        if (value) {
          this.loading = true;
          await getInvoices(this.partnerUuid, false).then((response) => {
            if (response.ok) {
              this.uploadededInvoices = response.data;
            }
          });
          await getInvoices(this.partnerUuid, true).then((response) => {
            if (response.ok) {
              this.approvedInvoices = response.data;
            }
          });
          this.loading = false;
        }
      },
      immediate: true,
    },
  },
  async created() {
    eventBus.$on('set-invoice-description', this.fetchUploadedInvoices);

    await getPartnerInvoiceProvision().then((response) => {
      if (response.ok) {
        this.partnerProvision = response.data;
      }
    });
  },
  beforeDestroy() {
    eventBus.$off('set-invoice-description', this.fetchUploadedInvoices);
  },
  methods: {
    async fetchUploadedInvoices(describe = false) {
      await getInvoices(this.partnerUuid, false)
        .then((response) => {
          if (response.ok) {
            this.uploadededInvoices = response.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
      if (describe) {
        const searchList = this.uploadededInvoices;
        const invoice = searchList.reverse().find((invoice) => {
          if (invoice.describedByDriver) return invoice;
        });
        this.createInvoiceDescription(invoice);
      }
    },
    async fetchApprovedInvoices() {
      await getInvoices(this.partnerUuid, true)
        .then((response) => {
          if (response.ok) {
            this.approvedInvoices = response.data;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    createInvoiceDescription(invoice) {
      const {
        uuid,
        driverFirstName,
        driverLastName,
        driverUUID,
        filename,
        systemEntryDate,
        invoiceImageDescription,
      } = invoice;
      const driver = {
        firstName: driverFirstName,
        lastName: driverLastName,
        driverUUID: driverUUID,
        filename: filename,
        date: systemEntryDate,
      };

      this.$modalOn(SetInvoiceDescription, {
        uuid: uuid,
        driver: driver,
        createdDescription: invoiceImageDescription,
        disabled: false,
        editingByDriver: true,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.driver-invoices {
  padding: 16px;
  &__list {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
  }
  &__hr {
    margin-bottom: 4px;
    border: 1px solid var(--light-blue-border);
    background: var(--light-blue-background);
  }
}
</style>
