<template>
  <div>
    <div class="upload-invoice">
      <label class="upload-invoice__action">
        <el-tooltip :content="$t('DriverInvoices.add_file')" placement="bottom">
          <div class="el-button el-button--primary circle">
            <i class="el-icon-circle-plus-outline" />
          </div>
        </el-tooltip>
        <input id="invoice-upload" type="file" :accept="akceptedFiles" @input="(e) => previewFile(e)" />
      </label>
    </div>
    <div v-if="partnerProvision.enable" class="description-method">
      <el-radio-group v-model="selectedMethod">
        <el-radio-button v-for="(option, idx) in descriptionMethods" :key="idx" :label="option.value">
          {{ option.label }}
        </el-radio-button>
      </el-radio-group>
      <el-alert
        v-if="partnerProvision.provision !== 0"
        :title="$t('DriverInvoices.provision')"
        :description="$t('DriverInvoices.provision_warning') + partnerProvision.provision + ' ' + currencySymbol"
        type="info"
        show-icon
        :closable="false"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { postInvoice } from '@/api/invoicesApi';
import { AVALONLOGISTICS } from '@/utils/referenced-partners';

export default {
  props: {
    partnerUUID: {
      type: String,
    },
    partnerProvision: Object,
  },
  data() {
    return {
      description: 'test',
      drawer: false,
      selectedMethod: 'DRIVER_DESCRIPTION',
      descriptionMethods: [
        { label: this.$t('DriverInvoices.driver_description'), value: 'DRIVER_DESCRIPTION' },
        { label: this.$t('DriverInvoices.partner_description'), value: 'PARTNER_DESCRIPTION' },
      ],
    };
  },
  computed: {
    ...mapGetters(['partnerCode']),
    ...mapGetters('app', ['currencySymbol']),
    akceptedFiles() {
      if (this.partnerCode === AVALONLOGISTICS) {
        return 'image/*,.pdf';
      }
      return '.pdf';
    },
  },
  methods: {
    previewFile(filesEvent) {
      if (filesEvent.length > 0 || filesEvent?.target?.files) {
        const uploadedFile = filesEvent?.target?.files || filesEvent;
        const file = uploadedFile[0];
        if (file.size <= 10 ** 7) {
          this.sendInvoice(file);
        } else {
          this.$message({ message: this.$t('DriverInvoices.upload_file_size'), type: 'info', center: true });
        }
      }
    },
    async sendInvoice(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', this.description);

      const invoiceImage = {
        partnerUUID: this.partnerUUID,
        describedByDriver: this.partnerProvision.enable ? this.selectedMethod === 'DRIVER_DESCRIPTION' : false,
      };
      formData.append(
        'invoiceImage',
        new Blob([JSON.stringify(invoiceImage)], {
          type: 'application/json',
        })
      );

      this.$emit('start-loading');

      await postInvoice(formData)
        .then((response) => {
          if (response.ok) {
            this.$message({
              type: 'success',
              message: this.$t('DriverInvoices.upload_success'),
              center: true,
              duration: 2000,
            });
          } else {
            this.$message({
              type: 'error',
              message: this.$t('DriverInvoices.upload_failed'),
              center: true,
              duration: 2000,
            });
          }
        })
        .finally(() => {
          const upload = document.getElementById('invoice-upload');
          upload.value = '';
          if (this.selectedMethod === 'DRIVER_DESCRIPTION' && this.partnerProvision.enable) {
            this.$emit('fetch-uploaded-describe');
          } else {
            this.$emit('fetch-uploaded');
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.circle {
  @include flex-center;
  box-shadow: var(--box-shadow-medium);
  border-radius: 32px;
  padding: 0;
  height: 48px;
  width: 48px;
}
.upload-invoice {
  position: fixed;
  right: 8px;
  bottom: 8px;
  @include flex-center;
  flex-flow: column;
  margin: 8px 0;

  & i {
    font-size: 24px;
  }

  &__action {
    @include flex-center;
    flex-flow: column;
    cursor: pointer;

    & i {
      font-weight: bold;
    }

    input {
      display: none;
    }
  }

  &__uploaded {
    @include flex-center;
    flex-flow: column;
  }
}
.description-method {
  display: flex;
  flex-flow: column;
  margin: 16px;
  color: var(--black-color);

  .el-radio-button {
    display: grid;
    margin-top: 2px;
    justify-content: center;
  }
  .el-alert {
    align-content: center;
    margin-top: 16px;
    width: 80%;
  }
}
@media screen and(min-width:576px) {
  .upload-invoice {
    position: initial;
  }
  .description-method {
    @include flex-center;
    display: flex;
    flex-flow: column;
    margin: 16px;
    color: var(--black-color);

    .el-alert {
      align-content: center;
      margin-top: 16px;
      width: 500px;
    }
    .el-radio-button {
      display: inline-block;
      flex-flow: column;
      margin-top: 2px;
      justify-content: space-between;
    }
  }
}
</style>
