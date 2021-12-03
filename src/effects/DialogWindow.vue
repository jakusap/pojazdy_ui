<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" width="30%" center>
      <span>{{ $t('ServicePlans.confirm_delete') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('no') }}</el-button>
        <el-button type="primary" @click="removeCarFromServicePlan">{{ $t('yes') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { removeCarFromServicePlanCarsList } from '@/api/carsApi';

export default {
  props: {
    dialogVisible: {
      Boolean,
    },
    carId: {
      Number,
    },
  },
  watch: {
    async reloadServicePlanCars(reload) {
      if (reload === true) {
        this.reloadedServicePlanCars();
      }
    },
  },
  methods: {
    ...mapActions('servicePlansDetailsStore', ['getServicePlanCars']),
    ...mapActions('servicePlansDetailsStore', ['reloadServicePlanCars', 'reloadedServicePlanCars']),
    removeCarFromServicePlan() {
      this.dialogVisible = false;
      removeCarFromServicePlanCarsList(this.carId);
      this.reloadServicePlanCars();
    },
  },
};
</script>

<style scoped></style>
