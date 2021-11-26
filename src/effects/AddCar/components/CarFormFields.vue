<template>
  <div v-if="!mobile" class="el-row">
    <el-form-item :label="$t('DocumentsWizard.formLabels.make')" prop="carMake">
      <el-select v-model="addCarForm.carMake" filterable @change="getCarModel">
        <el-option v-for="(carMake, id) in carsMake" :key="id" :value="carMake" :label="carMake" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('DocumentsWizard.formLabels.model')" prop="carModel">
      <el-select v-model="addCarForm.carModel" filterable>
        <el-option v-for="(carModel, id) in carModels" :key="id" :value="carModel" :label="carModel" />
      </el-select>
    </el-form-item>
  </div>
  <div v-else-if="mobile">
    <div class="">
      <el-form-item :label="$t('DocumentsWizard.formLabels.make')" prop="carMake">
        <el-select v-model="addCarForm.carMake" filterable @change="getCarModel">
          <el-option v-for="(carMake, id) in carsMake" :key="id" :value="carMake" :label="carMake" />
        </el-select>
      </el-form-item>
    </div>
    <div class="">
      <el-form-item :label="$t('DocumentsWizard.formLabels.model')" prop="carModel">
        <el-select v-model="addCarForm.carModel" filterable>
          <el-option v-for="(carModel, id) in carModels" :key="id" :value="carModel" :label="carModel" />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { getCarModel } from '@/api/carsApi';

export default {
  props: {
    addCarForm: {
      type: Object,
    },
    carsMake: {
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
      this.addCarForm.carModel = null;
      if (this.addCarForm.carMake) {
        this.toggleDataLoading(true);
        const carMake = this.addCarForm.carMake;
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
