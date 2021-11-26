<template>
  <div>
    <h3 class="approved__title">
      <span> {{ $t('DriverInvoices.approved_invoices') }} </span>
      <el-button v-if="mobile" size="mini" type="info" @click="showSettings()">
        <i class="el-icon-setting" />
      </el-button>
    </h3>
    <div id="approvedFilter" class="table__settings">
      <el-row class="uploaded__filters">
        <el-input v-model="driver" :placeholder="$t('driver')" />
        <el-date-picker v-model="dates.from" :placeholder="$t('date_from')" />
        <el-date-picker v-model="dates.to" :placeholder="$t('date_to')" />
      </el-row>
    </div>
    <el-table :data="filteredInvoices" height="270" :empty-text="$t('DriverInvoices.no_invoices')">
      <el-table-column min-width="190%" align="center" :label="$t('DriverInvoices.actions')">
        <template slot-scope="scope">
          <el-button-group>
            <button class="el-button el-button--primary el-button--mini" @click="modifyInvoiceDescription(scope.row)">
              {{ $t('DriverInvoices.description') }}
            </button>
            <a
              :href="`/api/invoice-images/${scope.row.uuid}/preview`"
              target="_blank"
              class="el-button el-button--info el-button--mini"
            >
              {{ $t('DriverInvoices.download') }}
            </a>

            <button class="el-button el-button--danger el-button--mini" @click="removeInvoice(scope.row.uuid)">
              {{ $t('DriverInvoices.remove') }}
            </button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        min-width="100%"
        prop="invoiceImageDescription.invoiceNumber"
        align="center"
        :label="$t('DriverInvoices.invoice_number')"
      >
      </el-table-column>
      <el-table-column
        v-if="approvedInvoices.description"
        prop="description"
        align="center"
        :label="$t('DriverInvoices.description')"
      >
      </el-table-column>
      <el-table-column min-width="100%" align="center" :label="$t('driver')">
        <template slot-scope="scope">
          <div>{{ scope.row.driverLastName }}</div>
          &nbsp;
          <div>{{ scope.row.driverFirstName }}</div>
        </template>
      </el-table-column>

      <el-table-column
        min-width="110%"
        prop="invoiceImageDescription.issuerNIP"
        align="center"
        :label="$t('DriverInvoices.issuer_nip')"
      />

      <el-table-column
        v-if="!mobile"
        sortable
        min-width="100%"
        prop="invoiceImageDescription.invoiceDate"
        align="center"
        :label="$t('DriverInvoices.invoice_date')"
      >
      </el-table-column>
      <el-table-column
        v-if="!mobile"
        sortable
        min-width="110%"
        prop="invoiceImageDescription.saleDate"
        align="center"
        :label="$t('DriverInvoices.sale_date')"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deleteInvoice } from '@/api/invoicesApi';
import SetInvoiceDescription from '@/effects/SetInvoiceDescription';

import invoiceMixin from '../mixin';
import { filterInvoices } from '../utils';
export default {
  mixins: [invoiceMixin],
  props: {
    approvedInvoices: {
      type: Array,
      default: () => [],
    },
    dates: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      driver: null,
    };
  },
  computed: {
    dateFrom() {
      return this.dates.from;
    },
    dateTo() {
      return this.dates.to;
    },
    filteredInvoices() {
      return filterInvoices(this.approvedInvoices, {
        driver: this.driver,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
      });
    },
  },
  methods: {
    showSettings() {
      document.getElementById('approvedFilter').classList.toggle('active');
    },
    modifyInvoiceDescription(invoice) {
      const {
        uuid,
        invoiceImageDescription,
        driverFirstName,
        driverUUID,
        driverLastName,
        filename,
        systemEntryDate,
      } = invoice;

      const driver = {
        firstName: driverFirstName,
        lastName: driverLastName,
        filename: filename,
        driverUUID: driverUUID,
        date: systemEntryDate,
      };

      this.$modalOn(SetInvoiceDescription, {
        uuid: uuid,
        driver: driver,
        createdDescription: invoiceImageDescription,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.approved__title {
  margin-top: 128px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
}
.uploaded__filters {
  display: flex;
  flex-flow: column;
  width: auto;
}
.table__settings {
  width: 95%;
}

@media screen and (min-width: 992px) {
  .approved__title {
    margin-top: 32px;
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
