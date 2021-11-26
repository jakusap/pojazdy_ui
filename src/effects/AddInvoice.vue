<template>
  <ModalGateway :title="$t('new_invoice')" :close="close">
    <el-form v-loading="dataLoading" :model="transaction" :rules="rules">
      <div class="modal-list">
        <span v-for="(driver, idx) in drivers" :key="idx">
          {{ driver.lastName + ' ' + driver.firstName }}
        </span>
      </div>
      <div class="el-row">
        <el-date-picker
          v-model="transaction.transactionDate"
          :placeholder="$t('AddTransaction.transaction_date')"
          :picker-options="{
            disabledDate: disabledTo,
          }"
          class="el-dialog__input--large"
        />
      </div>
      <div class="el-row">
        <el-form-item prop="amount">
          <el-input
            v-model="transaction.amount"
            :placeholder="amountType === 'net' ? $t('net') : $t('gross')"
            class="el-dialog__input--small"
          />
        </el-form-item>
        <el-select v-model="transaction.vatRate" class="el-dialog__input--small vat-select" placeholder="VAT">
          <el-option value="23%">
            {{ $t('vat23%') }}
          </el-option>
          <el-option value="8%">
            {{ $t('vat8%') }}
          </el-option>
        </el-select>
      </div>
      <div class="el-row">
        <el-radio v-model="amountType" label="gross">{{ $t('gross') }}</el-radio>
        <el-radio v-model="amountType" label="net">{{ $t('net') }}</el-radio>
      </div>
      <div class="el-row">
        <el-input :placeholder="$amount(finalAmount)" class="el-dialog__input--large" disabled />
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="dataLoading" @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button :disabled="valid || dataLoading" type="success" @click="submitTransaction()">
        {{ $t('add') }}
      </el-button>
    </span>
  </ModalGateway>
</template>

<script>
import addTransactionMixin from './addTransactionMixin';
export default {
  mixins: [addTransactionMixin],
  data() {
    return {
      provider: 'OTHER',
      type: 'INVOICE',
      transaction: {
        vatRate: '23%',
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.vat-select {
  margin-bottom: 22px;
}
</style>
