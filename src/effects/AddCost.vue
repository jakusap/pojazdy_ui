<template>
  <ModalGateway :title="$t('add_cost_transaction')" :close="close">
    <el-form :model="transaction" :rules="rules">
      <div class="modal-list">
        <span v-for="(driver, idx) in drivers" :key="idx">
          {{ driver.lastName + ' ' + driver.firstName }}
        </span>
      </div>
      <div class="el-row">
        <el-form-item prop="description">
          <el-input v-model="transaction.description" :placeholder="$t('cost_name')" class="el-dialog__input--large" />
        </el-form-item>
      </div>
      <div class="el-row">
        <el-date-picker
          v-model="transaction.transactionDate"
          :placeholder="$t('AddTransaction.transaction_date')"
          class="el-dialog__input--large"
        />
      </div>
      <div class="el-row">
        <el-alert
          v-if="disabledTo(transaction.transactionDate)"
          :title="$t('AddTransaction.future_transaction_date_alert')"
          type="warning"
          show-icon
          class="el-dialog__input--large"
          :closable="false"
        />
      </div>
      <div class="el-row">
        <el-form-item prop="amount">
          <el-input v-model="transaction.amount" :placeholder="$t('amount')" class="el-dialog__input--large">
            <template slot="append"> {{ currencySymbol }} </template>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="dataLoading" @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button
        :disabled="valid || dataLoading || !transaction.description.length"
        type="success"
        @click="submitTransaction()"
        >{{ $t('add') }}</el-button
      >
    </span>
  </ModalGateway>
</template>

<script>
import { mapGetters } from 'vuex';

import addTransactionMixin from './addTransactionMixin';
export default {
  mixins: [addTransactionMixin],
  data() {
    return {
      type: 'COST',
      provider: 'PARTNER',
    };
  },
  computed: {
    ...mapGetters('app', ['currencySymbol']),
  },
};
</script>

<style lang="scss" scoped>
.el-alert {
  margin-bottom: 2vh !important;
  overflow: auto;
  width: 450px;
}
</style>
