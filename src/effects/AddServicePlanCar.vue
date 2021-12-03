<template>
  <ModalGateway :title="$t('CarUsers.title')" :close="close">
    <el-form ref="addServicePlanCarForm" :model="carDetails" :rules="rules" @submit.native.prevent>
      <el-form-item prop="carId" :label="$t('AddCarUser.all_responsibility_statuses')">
        <el-select v-model="carDetails.carId" clearable>
          <el-option
            v-for="(car, id) in carsList"
            :key="id"
            :value="car.carId"
            :label="car.carMake + ' ' + car.carModel + ' ' + car.registrationNumber"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="addServicePlanCar">{{ $t('CarUsers.add_car_user') }}</el-button>
    </div>
  </ModalGateway>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { addCarForServicePlanCarsList, getServicePlansCarsList } from '@/api/carsApi';
import ModalGateway from '@/modals/ModalGateway';

export default {
  components: {
    ModalGateway,
  },
  props: {
    servicePlan: {
      type: Object,
    },
  },
  data() {
    return {
      close: false,
      carsList: [],
      loading: false,
      carDetails: {
        carId: null,
      },
      rules: {
        pickUpDate: [{ required: true, message: this.$t('validation.pick_up_date_required') }],
        responsibilityStatus: [{ required: true, message: this.$t('validation.responsibility_status_required') }],
      },
    };
  },
  computed: {},
  watch: {
    async reloadServicePlanCars(reload) {
      if (reload === true) {
        this.reloadedServicePlanCars();
      }
    },
  },
  async created() {
    this.loading = true;
    await getServicePlansCarsList(this.servicePlan)
      .then((response) => {
        this.carsList = response.data;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    ...mapActions('servicePlansDetailsStore', ['reloadServicePlanCars', 'reloadedServicePlanCars']),
    addServicePlanCar() {
      if (this.$refs.addServicePlanCarForm) {
        this.$refs.addServicePlanCarForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            addCarForServicePlanCarsList(this.carDetails.carId, this.servicePlan.servicePlanId)
              .then((response) => {
                if (response.ok) {
                  this.$message({ message: this.$t('CarUsers.success'), type: 'success', center: true });
                  this.close = true;
                } else {
                  this.$message({ message: this.$t('CarUsers.failed'), type: 'error', center: true });
                }
              })
              .finally(() => {
                this.reloadServicePlanCars();
                this.loading = false;
              });
          }
        });
      }
    },
  },
};
</script>

<style lang="scss">
.driver-info {
  display: flex;
  word-break: break-word;
  margin-bottom: 4px;
  padding: 8px;
  border: 1px solid $borderColor;
  background: #f5f7fa;
  border-radius: 4px;
}
.driver-warning {
  display: flex;
  word-break: initial;
  margin-bottom: 4px;
  padding: 8px;
  border: 1px solid $borderColor;
  border-radius: 4px;
  color: black;
  background: #dc3545;
}
</style>
