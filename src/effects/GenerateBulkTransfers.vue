<template>
  <ModalGateway :title="$t('GenerateBulkTransfers.title')" :close="close">
    <el-form ref="form" v-loading="dataLoading" :model="formModel" label-position="left" :rules="rules">
      <el-form-item :label="$t('transfers.INVOICE')" prop="INVOICE">
        <el-input v-model="transfersModel.INVOICE.title" :placeholder="$t('transfers.INVOICE')">
          <template slot="append">
            <el-checkbox v-model="transfersModel.INVOICE.considerInFile">{{
              $t('GenerateBulkTransfers.consider_in_file')
            }}</el-checkbox>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('transfers.LEASE_CONTRACT')" prop="LEASE_CONTRACT">
        <el-input v-model="transfersModel.LEASE_CONTRACT.title" :placeholder="$t('transfers.LEASE_CONTRACT')">
          <template slot="append">
            <el-checkbox v-model="transfersModel.LEASE_CONTRACT.considerInFile">{{
              $t('GenerateBulkTransfers.consider_in_file')
            }}</el-checkbox>
          </template></el-input
        >
      </el-form-item>
      <el-form-item :label="$t('transfers.ORDER_CONTRACT')" prop="ORDER_CONTRACT">
        <el-input v-model="transfersModel.ORDER_CONTRACT.title" :placeholder="$t('transfers.ORDER_CONTRACT')">
          <template slot="append">
            <el-checkbox v-model="transfersModel.ORDER_CONTRACT.considerInFile">{{
              $t('GenerateBulkTransfers.consider_in_file')
            }}</el-checkbox>
          </template></el-input
        >
      </el-form-item>
      <el-form-item :label="$t('transfers.DEDUCTION_COST')" prop="DEDUCTION_COST">
        <el-input v-model="transfersModel.DEDUCTION_COST.title" :placeholder="$t('transfers.DEDUCTION_COST')">
          <template slot="append">
            <el-checkbox v-model="transfersModel.DEDUCTION_COST.considerInFile">{{
              $t('GenerateBulkTransfers.consider_in_file')
            }}</el-checkbox>
          </template></el-input
        >
      </el-form-item>
      <el-form-item v-if="ibanIsVisible" :label="$t('iban')" prop="iban">
        <el-button
          v-if="!editMode"
          type="primary"
          class="card-edit"
          size="small"
          icon="el-icon-edit"
          circle
          @click="editMode = true"
        />
        <el-input v-model="formModel.iban" :disabled="!editMode">
          <template slot="append">
            <el-tooltip
              v-if="editMode"
              class="tooltip"
              effect="dark"
              :content="$t('GenerateBulkTransfers.edit_iban_tooltip')"
              placement="top-end"
            >
              <span><i class="el-icon-info"></i></span>
            </el-tooltip> </template
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('GenerateBulkTransfers.date')">
        <el-date-picker
          v-model="paymentDate"
          :picker-options="pickerOptions"
          :placeholder="$t('GenerateBulkTransfers.date')"
          type="date"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('GenerateBulkTransfers.type')">
        <el-select v-model="fileType">
          <el-option
            v-for="standard in fileStandards"
            :key="standard.value"
            :label="standard.label"
            :value="standard.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('mark_as_paid')">
        <el-radio v-model="markedAsPaid" :label="true">{{ $t('yes') }}</el-radio>
        <el-radio v-model="markedAsPaid" :label="false">{{ $t('no') }}</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="dataLoading" @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button :disabled="!transferDataIsCorrect" type="success" @click="createTransfersFile()">
        {{ $t('GenerateBulkTransfers.generate_file') }}
      </el-button>
    </span>
  </ModalGateway>
</template>

<script>
import { mapActions } from 'vuex';

import { postGenerateFileTransfers, putPaidStatus } from '@/api/settlementsApi';
import { checkForeignIban } from '@/validators';

import addTransactionMixin from './addTransactionMixin';

export default {
  mixins: [addTransactionMixin],
  props: {
    settlements: {
      type: Array,
    },
    partnerIban: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      formModel: {
        iban: null,
      },
      transfersModel: {
        ORDER_CONTRACT: { title: '', considerInFile: true },
        DEDUCTION_COST: { title: '', considerInFile: true },
        LEASE_CONTRACT: { title: '', considerInFile: true },
        INVOICE: { title: '', considerInFile: true },
      },
      pickerOptions: {
        disabledDate(time) {
          const currentDate = new Date();
          return time < new Date(currentDate).setDate(currentDate.getDate() - 1);
        },
      },
      rules: {
        iban: [{ validator: checkForeignIban, trigger: 'blur' }],
      },
      editMode: false,
      fileType: 'SANTANDER',
      markedAsPaid: true,
      paymentDate: new Date(),
    };
  },
  computed: {
    transferDataIsCorrect() {
      return (
        this.transfersModel.ORDER_CONTRACT.considerInFile ||
        this.transfersModel.DEDUCTION_COST.considerInFile ||
        this.transfersModel.LEASE_CONTRACT.considerInFile ||
        this.transfersModel.INVOICE.considerInFile
      );
    },
    ibanIsVisible() {
      return this.fileType !== 'REVOLUT';
    },
    fileStandards() {
      if (this.formModel.iban && this.isPolandIban(this.formModel.iban)) {
        return [
          {
            value: 'SANTANDER',
            label: 'Santander',
          },
          {
            value: 'ELIXIR',
            label: 'Elixir',
          },
          {
            value: 'REVOLUT',
            label: 'Revolut',
          },
          {
            value: 'DANSKE_BANK',
            label: 'Danske Bank',
          },
        ];
      } else {
        return [
          {
            value: 'REVOLUT',
            label: 'Revolut',
          },
          {
            value: 'DANSKE_BANK',
            label: 'Danske Bank',
          },
        ];
      }
    },
  },
  watch: {
    fileStandards: {
      handler: function() {
        if (this.fileStandards.length == 2 && this.fileType !== 'DANSKE_BANK' && this.fileType !== 'REVOLUT') {
          this.fileType = 'REVOLUT';
        }
      },
    },
  },
  created() {
    this.formModel.iban = this.partnerIban;
    this.editMode = this.partnerIban ? false : true;
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('settlementsViewStore', ['reloadSettlements']),
    success(uuid) {
      this.close = true;
      this.$message({
        message: this.$t('GenerateBulkTransfers.success'),
        type: 'success',
        center: true,
      });
    },
    failed() {
      this.$message({
        message: this.$t('GenerateBulkTransfers.failed'),
        type: 'error',
        center: true,
      });
    },
    createTransfersFile() {
      this.toggleDataLoading(true);
      const paymentDate = `${this.paymentDate.getFullYear()}-${this.paymentDate.getMonth() +
        1}-${this.paymentDate.getDate()}`;
      const settlementsUUIDs = this.settlements.map((settlement) => settlement.uuid);
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.markedAsPaid) {
            this.toggleDataLoading(true);
            postGenerateFileTransfers(
              settlementsUUIDs,
              this.fileType,
              paymentDate,
              this.transfersModel,
              this.formModel.iban
            ).then((response) => {
              if (response.ok) {
                window.open(`/api/settlements/paid/files/${response.data}`, '_self');
                putPaidStatus(settlementsUUIDs, true)
                  .then((response) => {
                    if (response.ok) {
                      this.success();
                      this.reloadSettlements();
                    } else {
                      this.failed();
                    }
                  })
                  .finally(() => {
                    this.toggleDataLoading(false);
                  });
              } else {
                this.failed();
                this.toggleDataLoading(false);
              }
            });
          } else {
            this.toggleDataLoading(true);
            postGenerateFileTransfers(
              settlementsUUIDs,
              this.fileType,
              paymentDate,
              this.transfersModel,
              this.formModel.iban
            )
              .then((response) => {
                if (response.ok) {
                  this.success();
                  window.open(`/api/settlements/paid/files/${response.data}`, '_self');
                } else {
                  this.failed();
                }
              })
              .finally(() => {
                this.toggleDataLoading(false);
              });
          }
        }
        this.toggleDataLoading(false);
      });
    },
    isPolandIban(iban) {
      return iban.startsWith('PL') || iban.match(/^\b([0-9]{26})\b/);
    },
  },
};
</script>
