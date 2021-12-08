<template>
  <div v-if="!mobile" class="el-row">
    <el-form-item :label="$t('DocumentsWizard.formLabels.driver')" prop="carUserId">
      <el-select v-model="addCarEventForm.carUserId" filterable>
        <el-option
          v-for="(car, id) in carsList"
          :key="id"
          :value="car.id"
          :label="car.driver.firstName + ' ' + car.driver.lastName"
        >
          <div class="">
            {{ car.driver.firstName }}
            {{ car.driver.lastName }}
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('DocumentsWizard.formLabels.eventType')" prop="eventCode">
      <el-select v-model="addCarEventForm.eventCode" filterable>
        <el-option v-for="(event, id) in eventsList" :key="id" :value="event.code" :label="event.name">
          <div class="">
            {{ event.name }}
          </div>
        </el-option>
      </el-select>
    </el-form-item>
  </div>
  <div v-else-if="mobile">
    <el-form-item :label="$t('DocumentsWizard.formLabels.driver')" prop="carUserId">
      <el-select v-model="addCarEventForm.carUserId" filterable>
        <el-option
          v-for="(car, id) in carsList"
          :key="id"
          :value="car.id"
          :label="car.driver.firstName + ' ' + car.driver.lastName"
        >
          <div class="">
            {{ car.driver.firstName }}
            {{ car.driver.lastName }}
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('DocumentsWizard.formLabels.eventType')" prop="eventCode">
      <el-select v-model="addCarEventForm.eventCode" filterable>
        <el-option v-for="(event, id) in eventsList" :key="id" :value="event.code" :label="event.name">
          <div class="">
            {{ event.name }}
          </div>
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { getCarModel } from '@/api/carsApi';

export default {
  props: {
    addCarEventForm: {
      type: Object,
    },
    carsList: {
      type: Array,
    },
    eventsList: {
      type: Array,
    },
  },
  data() {
    return {
      carModels: [],
    };
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    getCarModel() {
      this.addCarEventForm.carModel = null;
      if (this.addCarEventForm.carMake) {
        this.toggleDataLoading(true);
        const carMake = this.addCarEventForm.carMake;
        getCarModel(carMake).then((response) => {
          if (response.ok) {
            this.carModels = response.data;
            this.toggleDataLoading(false);
          } else {
            this.addingCarFailed();
          }
        });
      }
    },
    addingCarFailed() {
      this.$message({
        message: this.$t('AddCar.car_model_failed'),
        type: 'error',
        center: true,
      });
      this.toggleDataLoading(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 100%;
  margin: 0;
  + .el-form-item {
    padding-left: 8px;
  }
}
</style>
