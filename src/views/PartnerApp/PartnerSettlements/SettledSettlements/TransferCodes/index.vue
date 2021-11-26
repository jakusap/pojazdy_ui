<template>
  <div class="transfer-codes">
    <div v-for="transfer in transfers" :key="transfer.type" class="transfer-codes__qr">
      <h3 class="transfer-codes__title">
        <el-input v-model="transfer.title" :disabled="!transfer.amount || !iban" :maxlength="40">
          <template slot="append"> {{ $amount(transfer.amount) }} </template>
        </el-input>
      </h3>
      <div v-if="transfer.amount && iban" v-loading="qrLoading" class="transfer-codes__image">
        <img
          :src="`/api/settlements/${settlementUUID}/qr?transferType=${transfer.type}&title=${transfer.title.trim()}`"
          alt="QR Code"
          @load="handleQrLoad"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getSettlementDetails } from '@/api/settlementsApi.js';

export default {
  props: {
    settlementUUID: {
      type: String,
    },
  },
  data() {
    return {
      transfers: [],
      iban: null,
      qrLoading: false,
    };
  },
  created() {
    this.getDetails();
  },
  methods: {
    handleQrLoad(e) {
      e && this.iban && (this.qrLoading = false);
    },
    getDetails() {
      this.qrLoading = true;
      getSettlementDetails(this.settlementUUID)
        .then((response) => {
          if (response.ok) {
            this.transfers = response.data.transfers;
            this.iban = response.data.driver.iban;
          }
        })
        .catch(() => {
          this.qrLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer-codes {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  min-height: 200px;

  &__qr {
    width: 250px;
  }
  &__title {
    display: flex;
    justify-content: space-around;
  }
  &__image {
    height: 250px;
  }
}
</style>
