<template>
  <ModalGateway
    :title="createdDescription ? $t('SetInvoiceDescription.done_title') : $t('SetInvoiceDescription.title')"
    :close="close"
    :invoice="true"
  >
    <div id="pdf" v-loading="loading" class="inline-pdf" />
    <el-button v-if="mobilePdf" type="info" class="invoice-description__close-pdf" @click="toggleMobilePDF()">
      {{ $t('DriverInvoices.close_preview') }}
    </el-button>
    <div class="invoice-description__form">
      <el-form
        ref="invoice-form"
        v-loading="loading"
        :disabled="disabled"
        :model="invoiceDescription"
        :rules="rules"
        :validate-on-rule-change="false"
      >
        <DriverFields :driver="driver" />
        <NipFields
          :invoice-description="invoiceDescription"
          :contractor-nip-info="contractorNipInfo"
          :issuer-nip-info="issuerNipInfo"
          :editing-by-driver="editingByDriver"
        />
        <DateFields :invoice-description="invoiceDescription" />
        <Vat8Fields
          :disabled="vat8Disabled"
          :invoice-description="invoiceDescription"
          :vat-rate="0.08"
          @enable="(e) => (vat8Disabled = !e)"
        />
        <Vat23Fields
          :disabled="vat23Disabled"
          :invoice-description="invoiceDescription"
          :vat-rate="0.23"
          @enable="(e) => (vat23Disabled = !e)"
        />
      </el-form>
      <div class="invoice-description__partner-feedback">
        <PartnerFeedback :verification="verification" :invoice-description="invoiceDescription" />
      </div>
      <el-alert
        v-if="isDoubleInvoice"
        class="invoice-description__partner-feedback"
        :title="$t('SetInvoiceDescription.repeated_invoice')"
        type="warning"
        center
        show-icon
      />
      <section
        v-if="(!disabled && !mobilePdf) || (verification && !mobilePdf)"
        slot="footer"
        class="invoice-description__buttons"
      >
        <el-button :disabled="disableSubmit" type="primary" @click="setInvoiceDescription(uuid)">
          {{ $t('DriverInvoices.accept') }}
        </el-button>
        <el-button v-if="verification" type="success" @click="leaveFeedbackForDriver(uuid)">
          {{ $t('SetInvoiceDescription.feedback') }}
        </el-button>
        <el-button v-if="!mobilePdf" type="info" class="invoice-description__toggle-pdf" @click="toggleMobilePDF()">
          {{ $t('DriverInvoices.preview') }}
        </el-button>
        <el-button type="danger" @click="close = true">{{ $t('DriverInvoices.cancel') }}</el-button>
      </section>
      <section v-else slot="footer" class="invoice-description__buttons">
        <el-button v-if="!mobilePdf" type="info" class="invoice-description__toggle-pdf" @click="toggleMobilePDF()">
          {{ $t('DriverInvoices.preview') }}
        </el-button>
      </section>
    </div>
  </ModalGateway>
</template>

<script>
import PDFObject from 'pdfobject';
import { mapGetters } from 'vuex';

import {
  getPreviewInvoice,
  postInvoiceFeedback,
  postInvoiceOcr,
  postValidationData,
  putInvoice,
} from '@/api/invoicesApi';
import { validateNip } from '@/api/licensesApi';
import eventBus from '@/eventBus';
import ModalGateway from '@/modals/ModalGateway';
import { dateToJSONLocal } from '@/utils';
import { validateNumber } from '@/validators';

import { postInvoiceDetailsValidation } from '../../api/invoicesApi';
import BoltFormField from '../AddDriver/components/BoltFormField';
import DateFields from './components/DateFields';
import DriverFields from './components/DriverFields';
import NipFields from './components/NipFields';
import PartnerFeedback from './components/PartnerFeedback';
import Vat8Fields from './components/Vat8Fields';
import Vat23Fields from './components/Vat23Fields';

export default {
  components: {
    PartnerFeedback,
    ModalGateway,
    DriverFields,
    NipFields,
    DateFields,
    Vat8Fields,
    Vat23Fields,
  },
  props: {
    uuid: {
      type: String,
    },
    createdDescription: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    driver: {
      type: Object,
    },
    verification: {
      type: Boolean,
      default: false,
    },
    editingByDriver: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      close: false,
      mobilePdf: false,
      vat8Disabled: true,
      vat23Disabled: false,
      dialogFormVisible: false,
      isDoubleInvoice: false,
      contractorNipInfo: { fetching: false, data: null },
      issuerNipInfo: { fetching: false, data: null },
      invoiceDescription: {
        approvedByPartnerTimestamp: null,
        contractorNIP: null,
        invoiceDate: null,
        invoiceNumber: null,
        issuerNIP: null,
        modificationTimestamp: null,
        modifierUsername: null,
        saleDate: null,
        net8Amount: null,
        gross8Amount: null,
        vat8Amount: null,
        net23Amount: null,
        gross23Amount: null,
        vat23Amount: null,
        partnerFeedback: null,
      },
    };
  },
  computed: {
    ...mapGetters('app', ['currencySymbol']),
    ...mapGetters('partnerProfile', ['profileInfo']),
    disableSubmit() {
      return this.vat8Disabled && this.vat23Disabled;
    },
    invoiceForm() {
      return this.$refs.form;
    },
    rules() {
      return {
        invoiceNumber: [
          { required: true, message: this.$t('SetInvoiceDescription.required') },
          { max: 50, message: this.$t('validation.max') },
          { validator: this.validateInvoiceNumberAndIssuerNip, trigger: 'blur' },
        ],
        contractorNIP: [{ validator: this.checkNip, trigger: 'change' }],
        issuerNIP: [
          { validator: this.checkNip, trigger: 'change' },
          { validator: this.validateInvoiceNumberAndIssuerNip, trigger: 'blur' },
          { validator: this.getDetailsValidation, trigger: 'blur' },
        ],
        invoiceDate: [{ required: true, message: this.$t('SetInvoiceDescription.required') }],
        saleDate: [
          { required: true, message: this.$t('SetInvoiceDescription.required') },
          { validator: this.getDetailsValidation, trigger: 'blur' },
        ],
        net8Amount: [{ required: !this.vat8Disabled, validator: validateNumber }],
        gross8Amount: [
          { required: !this.vat8Disabled, validator: validateNumber },
          { validator: this.getDetailsValidation, trigger: 'change' },
        ],
        vat8Amount: [{ required: !this.vat8Disabled, validator: validateNumber }],
        net23Amount: [{ required: !this.vat23Disabled, validator: validateNumber }],
        gross23Amount: [
          { required: !this.vat23Disabled, validator: validateNumber },
          { validator: this.getDetailsValidation, trigger: 'change' },
        ],
        vat23Amount: [{ required: !this.vat23Disabled, validator: validateNumber }],
      };
    },
  },
  watch: {
    vat8Disabled(value) {
      const invoiceForm = this.$refs['invoice-form'];
      if (invoiceForm) {
        invoiceForm.clearValidate();
      }
    },
    vat23Disabled(value) {
      const invoiceForm = this.$refs['invoice-form'];
      if (invoiceForm) {
        invoiceForm.clearValidate();
      }
    },
  },
  created() {
    if (this.createdDescription) {
      this.invoiceDescription = { ...this.createdDescription };
      this.invoiceDescription.gross23Amount = Number(this.invoiceDescription.gross23Amount).toFixed(2);
      this.invoiceDescription.net23Amount = Number(this.invoiceDescription.net23Amount).toFixed(2);
      this.invoiceDescription.vat23Amount = Number(this.invoiceDescription.vat23Amount).toFixed(2);
      this.invoiceDescription.gross8Amount = Number(this.invoiceDescription.gross8Amount).toFixed(2);
      this.invoiceDescription.net8Amount = Number(this.invoiceDescription.net8Amount).toFixed(2);
      this.invoiceDescription.vat8Amount = Number(this.invoiceDescription.vat8Amount).toFixed(2);

      this.vat8Disabled = !this.invoiceDescription.gross8Amount;
      this.vat23Disabled = !this.invoiceDescription.gross23Amount;
    }
  },
  async mounted() {
    this.loading = true;
    await getPreviewInvoice(this.uuid)
      .then((e) => {
        const invoice = e.data;
        if (!this.createdDescription) {
          this.invoiceOcr(invoice);
        }
        return URL.createObjectURL(invoice);
      })
      .then((url) => {
        PDFObject.embed(url, '#pdf');
      });

    this.loading = false;
  },
  methods: {
    async checkNip(rule, value, callback) {
      if (String(value).length === 10) {
        switch (rule.field) {
          case 'issuerNIP':
            this.issuerNipInfo.fetching = true;
            break;
          case 'contractorNIP':
            this.contractorNipInfo.fetching = true;
            break;
        }

        await validateNip(value)
          .then((response) => {
            if (response.ok) {
              switch (rule.field) {
                case 'issuerNIP':
                  this.issuerNipInfo.data = response.data;
                  break;
                case 'contractorNIP':
                  this.contractorNipInfo.data = response.data;
                  break;
              }
              callback();
            } else {
              callback(this.$t('validation.nip_invalid'));
            }
          })
          .finally(() => {
            switch (rule.field) {
              case 'issuerNIP':
                this.issuerNipInfo.fetching = false;
                break;
              case 'contractorNIP':
                this.contractorNipInfo.fetching = false;
                break;
            }
          });
      } else {
        switch (rule.field) {
          case 'issuerNIP':
            this.issuerNipInfo.data = null;
            break;
          case 'contractorNIP':
            this.contractorNipInfo.data = null;
            break;
        }
        callback(this.$t('validation.nip_required'));
      }
    },
    toggleMobilePDF() {
      document.getElementById('pdf').classList.toggle('mobile');
      this.mobilePdf = !this.mobilePdf;
    },

    async invoiceOcr(invoice) {
      const formData = new FormData();
      formData.append('file', invoice, 'invoice.pdf');

      await postInvoiceOcr(formData).then((response) => {
        if (response.ok) {
          const { number, nips, grossAmount } = response.data;

          if (nips) {
            const filteredNips = nips.filter((nip) => nip !== this.profileInfo.taxId);
            this.invoiceDescription.issuerNIP = filteredNips[0];
          }
          if (grossAmount) {
            this.invoiceDescription.gross23Amount = Number(grossAmount).toFixed(2);
            this.invoiceDescription.net23Amount = Number(grossAmount / 1.23).toFixed(2);
            this.invoiceDescription.vat23Amount = Number(
              this.invoiceDescription.gross23Amount - this.invoiceDescription.net23Amount
            ).toFixed(2);
          }
        }
      });
    },

    async leaveFeedbackForDriver(uuid) {
      const invoiceDescription = { partnerFeedback: this.invoiceDescription.partnerFeedback };
      await postInvoiceFeedback(uuid, invoiceDescription).then((response) => {
        if (response.ok) {
          this.$message({
            message: this.$t('SetInvoiceDescription.success'),
            type: 'success',
            center: true,
          });
          eventBus.$emit('set-invoice-description');
          this.close = true;
        } else {
          this.$message({
            message: this.$t('SetInvoiceDescription.error'),
            type: 'error',
            center: true,
          });
        }
      });
    },

    async setInvoiceDescription(uuid) {
      const invoiceForm = this.$refs['invoice-form'];

      invoiceForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const formData = new FormData();

          const {
            net8Amount,
            gross8Amount,
            vat8Amount,
            net23Amount,
            gross23Amount,
            vat23Amount,
            ...rest
          } = this.invoiceDescription;

          const invoiceDescription = {
            driverUUID: this.driver.driverUUID,
            invoiceImageDescription: {
              ...rest,
              net8Amount: Number(net8Amount).toFixed(2),
              gross8Amount: Number(gross8Amount).toFixed(2),
              vat8Amount: Number(vat8Amount).toFixed(2),
              net23Amount: Number(net23Amount).toFixed(2),
              gross23Amount: Number(gross23Amount).toFixed(2),
              vat23Amount: Number(vat23Amount).toFixed(2),
              invoiceDate: dateToJSONLocal(new Date(this.invoiceDescription.invoiceDate)),
              saleDate: dateToJSONLocal(new Date(this.invoiceDescription.saleDate)),
            },
          };

          formData.append(
            'invoiceImage',
            new Blob([JSON.stringify(invoiceDescription)], {
              type: 'application/json',
            })
          );

          await putInvoice(uuid, formData).then((response) => {
            if (response.ok) {
              this.$message({
                message: this.$t('SetInvoiceDescription.success'),
                type: 'success',
                center: true,
              });
              eventBus.$emit('set-invoice-description');
              this.close = true;
            } else {
              this.$message({
                message: this.$t('SetInvoiceDescription.error'),
                type: 'error',
                center: true,
              });
            }
          });
          this.loading = false;
        }
      });
    },
    async validateInvoiceNumberAndIssuerNip(rule, value, callback) {
      const issuerNip = this.invoiceDescription.issuerNIP;
      const invoiceNumber = this.invoiceDescription.invoiceNumber;
      if (issuerNip && invoiceNumber) {
        const invoice = {
          driverUUID: this.driver.driverUUID,
          invoiceImageDescription: { issuerNIP: issuerNip, invoiceNumber: invoiceNumber },
        };
        await postValidationData(invoice, this.driver.driverUUID).then((response) => {
          if (response.ok) {
            callback();
          } else {
            callback(new Error(this.$t('SetInvoiceDescription.repeated_invoice_number')));
          }
        });
      }
    },
    async getDetailsValidation(rule, value, callback) {
      const issuerNip = this.invoiceDescription.issuerNIP;
      const gross8Amount = this.invoiceDescription.gross8Amount;
      const gross23Amount = this.invoiceDescription.gross23Amount;
      const saleDate = this.invoiceDescription.saleDate;
      if (issuerNip && (gross8Amount || gross23Amount) && saleDate) {
        const invoice = {
          driverUUID: this.driver.driverUUID,
          invoiceImageDescription: {
            issuerNIP: issuerNip,
            gross8Amount: gross8Amount,
            gross23Amount: gross23Amount,
            saleDate: saleDate,
          },
        };

        await postInvoiceDetailsValidation(invoice).then((response) => {
          this.isDoubleInvoice = !response.ok;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.inline-pdf {
  display: none;
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 50%;
  &.mobile {
    z-index: 9999;
    display: initial;
    height: 90%;
    width: 100%;
  }
  @media screen and (min-width: 768px) {
    display: initial;
  }
}

.invoice-description__partner-feedback {
  flex: 1;
  margin-bottom: 5px;
  width: 100% !important;
}

.invoice-description__buttons {
  display: flex;
  justify-content: center;
  flex-flow: wrap;
}

.invoice-description__toggle-pdf {
  display: initial;
  @media screen and (min-width: 768px) {
    display: none;
  }
}
.invoice-description__close-pdf {
  position: fixed;
  left: calc(50% - 80px);
  bottom: 16px;
}
</style>
