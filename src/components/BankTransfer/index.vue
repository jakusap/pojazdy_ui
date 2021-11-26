<template>
  <div class="bank-transfer">
    <el-input v-model="transferData.title" :disabled="!editMode" :placeholder="transferData.title">
      <template slot="append">
        {{ $amount(transferData.amount) }}
      </template>
    </el-input>
    <el-button
      v-if="showQr"
      :disabled="transferData.amount === 0 || !iban"
      class="bank-transfer__qr"
      type="primary"
      @click="(qr = !qr), (editMode = !editMode)"
      >{{ `QR` }}
    </el-button>
    <div v-if="qr" class="bank-transfer__qr-image">
      <img
        v-loading="!qr"
        :src="
          `/api/settlements/${settlementUUID}/qr?transferType=${transferData.type}&title=${transferData.title.trim()}`
        "
        alt="QR Code"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    transferData: {
      type: Object,
    },
    settlementUUID: {
      type: String,
    },
    showQr: {
      type: Boolean,
    },
    iban: {
      type: String,
    },
  },
  data() {
    return {
      editMode: false,
      qr: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.bank-transfer {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  & > .el-input {
    margin-bottom: 10px;
  }
  &__actions {
    position: relative;
  }
  &__qr {
    width: 100%;
    font-weight: 700;
  }
  &__qr-image {
    width: 100%;
  }
}
@media screen and (min-width: 768px) {
  .bank-transfer {
    & > .el-input {
      max-width: 500px;
      margin-right: 10px;
      margin-bottom: 0;
    }
    &__qr {
      width: auto;
    }
  }
}
</style>
