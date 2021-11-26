<template>
  <div class="provider-identifier__wrapper">
    <div class="provider-identifier">
      <div>
        {{ $t(contractData.numberProvider) }}
      </div>

      <code v-if="!editMode" class="provider-identifier__contractNumber">{{ contractData.contractNumber || '-' }}</code>
      <el-form-item v-else prop="contractNumber">
        <el-input
          v-model="contractData.contractNumber"
          maxlength="50"
          :placeholder="$t('DriverDetails.contract_number')"
          class="provider-identifier__contractNumber"
        />
      </el-form-item>
    </div>
    <div class="provider-identifier">
      <span v-if="contractData.bailiffSeizure && !editMode" class="provider-identifier__bailiffSeizure">
        {{ $t('DriverDetails.bailiff_seizure') }}
      </span>

      <span v-if="!contractData.bailiffSeizure && !editMode" class="provider-identifier__bailiffSeizure">
        {{ $t('DriverDetails.lack_of_bailiff_seizure') }}
      </span>
      <el-form-item prop="bailiffSeizure">
        <el-switch
          v-if="editMode"
          v-model="contractData.bailiffSeizure"
          class="provider-identifier__bailiffSeizure"
          :active-text="$t('DriverDetails.bailiff_seizure')"
          :inactive-text="$t('DriverDetails.lack_of_bailiff_seizure')"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    contractData: {
      type: Object,
    },
    editMode: {
      type: Boolean,
    },
  },
  computed: {
    bailiffSeizureType() {
      if (this.$props.contractData.bailiffSeizure) return 'primary';
      else return '';
    },
  },
};
</script>

<style scoped lang="scss">
.el-form-item {
  flex: 3;
  margin-right: 8px;
  margin-bottom: 0px;
}
.provider-identifier__wrapper {
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid $brand-gray;
  background: whitesmoke;
  border-radius: 4px;
  position: relative;
}
.provider-identifier {
  display: flex;
  flex-flow: row;
  align-items: center;

  &__contractNumber {
    margin-left: 8px;
  }

  &__bailiffSeizure {
    margin-top: 10px;
  }
}
</style>
