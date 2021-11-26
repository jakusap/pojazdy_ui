<template>
  <div class="uploaded">
    <h3 class="uploaded__title">
      <span>{{ $t('DriverInvoices.uploaded_invoices') }}</span>
      <el-button v-if="mobile" size="mini" type="info" @click="showSettings()">
        <i class="el-icon-setting" />
      </el-button>
    </h3>
    <div v-if="uploadededInvoices.length">
      <div id="settings" class="table__settings">
        <el-row class="uploaded__filters">
          <el-input v-model="driver" :placeholder="$t('driver')" />
          <el-date-picker v-model="dates.from" :placeholder="$t('date_from')" />
          <el-date-picker v-model="dates.to" :placeholder="$t('date_to')" />
          <el-select v-model="describeBy" clearable :placeholder="'Czynność na fakturze'">
            <el-option
              v-for="option in describeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-row>
      </div>
      <div class="uploaded-list">
        <div v-for="invoice in filteredInvoices" :key="invoice.uuid" class="uploaded-list__invoice">
          <el-tooltip
            v-if="profileInfo.describeProvision.enable"
            effect="dark"
            :content="tooltipMessage(invoice)"
            placement="top"
          >
            <i v-if="invoice.describedByDriver" class="el-icon-success icon-info" />
            <i v-else class="el-icon-edit icon-warning" />
          </el-tooltip>
          <div class="invoice-info">
            <span> {{ $t('DriverInvoices.driver') }} {{ invoice.driverFirstName }} {{ invoice.driverLastName }} </span>
            <span> {{ $t('DriverInvoices.file_name') }} {{ invoice.filename }} </span>
            <span> {{ $t('DriverInvoices.upload_date') }} {{ invoice.systemEntryDate }} </span>
          </div>
          <div class="uploaded__buttons">
            <el-button
              v-if="!invoice.describedByDriver"
              size="mini"
              type="primary"
              @click="createInvoiceDescription(invoice)"
            >
              {{ $t('DriverInvoices.edit') }}
            </el-button>
            <el-button v-else size="mini" type="primary" @click="createInvoiceDescription(invoice)">
              {{ $t('DriverInvoices.verify') }}
            </el-button>
            <a
              :href="`/api/invoice-images/${invoice.uuid}/preview`"
              target="_blank"
              class="el-button el-button--info el-button--mini"
            >
              {{ $t('DriverInvoices.download') }}
            </a>
            <el-button size="mini" type="danger" @click="removeInvoice(invoice.uuid)">
              {{ $t('DriverInvoices.remove') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="uploaded__placeholder">
      <h3>
        {{ $t('DriverInvoices.no_uploaded') }}
      </h3>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SetInvoiceDescription from '@/effects/SetInvoiceDescription';

import invoiceMixin from '../mixin';
import { filterInvoices } from '../utils';
export default {
  mixins: [invoiceMixin],
  props: {
    uploadededInvoices: {
      type: Array,
    },
    dates: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      driver: null,
      dateFrom: null,
      dateTo: null,
      describeBy: null,
      describeOptions: [
        { label: 'Faktury do opisania', value: 'PARTNER' },
        { label: 'Faktury opisane przez kierowców', value: 'DRIVER' },
      ],
    };
  },
  dateFrom() {
    return this.dates.from;
  },
  dateTo() {
    return this.dates.to;
  },
  computed: {
    ...mapGetters('partnerProfile', ['profileInfo']),
    filteredInvoices() {
      return filterInvoices(this.uploadededInvoices, {
        driver: this.driver,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        describeBy: this.describeBy,
      });
    },
  },

  methods: {
    showSettings() {
      document.getElementById('settings').classList.toggle('active');
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
        describedByDriver,
      } = invoice;

      const driver = {
        firstName: driverFirstName,
        lastName: driverLastName,
        driverUUID: driverUUID,
        filename: filename,
        date: systemEntryDate,
      };
      if (describedByDriver) {
        this.$modalOn(SetInvoiceDescription, {
          uuid: uuid,
          driver: driver,
          createdDescription: invoiceImageDescription,
          verification: describedByDriver,
        });
      } else {
        this.$modalOn(SetInvoiceDescription, {
          uuid: uuid,
          driver: driver,
          verification: describedByDriver,
        });
      }
    },
    tooltipMessage(invoice) {
      if (invoice.describedByDriver) {
        return this.$t('DriverInvoices.invoice_to_verify');
      } else {
        return this.$t('DriverInvoices.invoice_to_describe');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.uploaded__title {
  margin-top: 32px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}

.uploaded-list {
  display: grid;
  grid-template-columns: 1fr;
  max-height: 350px;
  overflow-y: auto;
  & .el-tooltip {
    margin-bottom: auto;
    margin-right: 5px;
  }
}
.uploaded-list__invoice {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin: 4px 4px 0px 0px;
  border-radius: 4px;
  border: 1px solid gray;
}
.invoice-info {
  display: flex;
  height: 100%;
  justify-content: space-between;
  flex-flow: column;
}
.uploaded__placeholder {
  display: flex;
  justify-content: center;
  & > h3 {
    background: #f5f7fa;
    border: 2px solid #bfcbd9;
    padding: 8px;
    border-radius: 8px;
  }
}
.uploaded__buttons {
  display: flex;
  flex-flow: column;
  & .el-button {
    margin: 2px 0;
  }
}
.uploaded__filters {
  display: flex;
  flex-flow: column;
  margin-bottom: 16px;
  width: auto;
}
.table__settings {
  width: 95%;
}
@media screen and (min-width: 768px) {
  .uploaded-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
@media screen and (min-width: 992px) {
  .uploaded-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .uploaded__filters {
    display: flex;
    flex-flow: row;
    margin-bottom: 16px;
    & .el-input {
      max-width: 300px;
    }
    & .el-select {
      width: 300px;
    }
  }
}
</style>
