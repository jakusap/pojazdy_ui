<template>
  <section>
    <div>
      <h4>{{ $t('SetInvoiceDescription.nip_info') }}</h4>
    </div>
    <div>
      <el-form-item prop="invoiceNumber">
        <el-input
          v-model="invoiceDescription.invoiceNumber"
          show-word-limit
          maxlength="50"
          :placeholder="$t('DriverInvoices.invoice_number')"
        />
      </el-form-item>
    </div>

    <div v-loading="issuerNipInfo.fetching">
      <el-form-item prop="issuerNIP">
        <el-input
          v-model="invoiceDescription.issuerNIP"
          show-word-limit
          maxlength="10"
          :placeholder="$t('DriverInvoices.issuer_nip')"
        />
        <div v-if="issuerNipInfo.data" class="invoice-description__company">
          {{ issuerNipInfo.data.name }}
        </div>
      </el-form-item>
    </div>

    <div v-loading="contractorNipInfo.fetching">
      <el-form-item prop="contractorNIP">
        <el-input
          v-model="invoiceDescription.contractorNIP"
          show-word-limit
          maxlength="10"
          :placeholder="$t('DriverInvoices.contractor_nip')"
          :disabled="editingByDriver"
        />
        <div v-if="contractorNipInfo.data" class="invoice-description__company">
          {{ contractorNipInfo.data.name }}
        </div>
      </el-form-item>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

import { validateNip } from '@/api/licensesApi';
export default {
  props: {
    invoiceDescription: {
      type: Object,
    },
    issuerNipInfo: { type: Object },
    contractorNipInfo: { type: Object },
    editingByDriver: { type: Boolean },
  },

  computed: {
    ...mapGetters('partnerProfile', ['profileInfo']),
  },

  created() {
    const { contractorNIP, issuerNIP } = this.invoiceDescription;
    if (contractorNIP && issuerNIP) {
      validateNip(contractorNIP).then((response) => {
        if (response.ok) {
          this.contractorNipInfo.data = response.data;
        }
      });

      validateNip(issuerNIP).then((response) => {
        if (response.ok) {
          this.issuerNipInfo.data = response.data;
        }
      });
    } else {
      if (this.profileInfo.taxId) {
        this.getPartnerNipDetails(this.profileInfo.taxId);
      }
    }
  },
  methods: {
    getPartnerNipDetails(nip) {
      this.invoiceDescription.contractorNIP = nip;
      this.contractorNipInfo.fetching = true;

      validateNip(nip)
        .then((response) => {
          if (response.ok) {
            this.contractorNipInfo.data = response.data;
          }
        })
        .finally(() => {
          this.contractorNipInfo.fetching = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../_styles.scss';
</style>
