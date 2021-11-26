<template>
  <ModalGateway :large="!modalSize" :slight="modalSize" :title="$t('AddServicePlan.add_servicePlan')" :close="close">
    <el-form
      ref="addServicePlanForm"
      v-loading="dataLoading"
      class="add-car"
      :model="addServicePlanForm"
      :rules="rules"
      label-position="top"
    >
      <DescriptionFormField :add-car-form="addServicePlanForm"></DescriptionFormField>
      <CarFormFields :add-car-form="addServicePlanForm" :cars-make="carsMake"></CarFormFields>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="dataLoading" @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button :disabled="dataLoading" type="success" @click="submitNewServicePlan">
        {{ $t('confirm') }}
      </el-button>
    </span>
  </ModalGateway>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getCarMake } from '@/api/carsApi';
import { addServicePlan } from '@/api/servicePlansApi';
import ModalGateway from '@/modals/ModalGateway';

import CarFormFields from './components/CarFormFields';
import DescriptionFormField from './components/DescriptionFormField';

export default {
  components: {
    ModalGateway,
    CarFormFields,
    DescriptionFormField,
  },
  props: {
    servicePlan: {
      type: Object,
    },
  },
  data() {
    return {
      carsMake: [],
      close: false,
      addServicePlanForm: {
        servicePlanName: null,
        carMake: null,
        carModel: null,
        isActive: true,
      },
      rules: {
        carMake: [{ required: true, message: this.$t('validation.car_make_required') }],
        carModel: [{ required: true, message: this.$t('validation.car_model_required') }],
        servicePlanName: [{ max: 50, message: this.$t('validation.car_description_max') }],
      },
    };
  },
  computed: {
    ...mapGetters(['dataLoading']),
    modalSize() {
      return this.mobile === true;
    },
  },
  mounted() {
    if (this.servicePlan) {
      const { servicePlanName, servicePlanCarMake, servicePlanCarModel, isActive } = this.servicePlan;
      this.addServicePlanForm = {
        ...this.addServicePlanForm,
        servicePlanName,
        servicePlanCarMake,
        servicePlanCarModel,
        isActive,
      };
    }
  },
  async created() {
    await this.getCarsMake();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('servicePlansListViewStore', ['reloadServicePlans']),
    getCarsMake() {
      this.toggleDataLoading(true);
      getCarMake(true)
        .then((response) => {
          if (response.ok) {
            this.carsMake = response.data;
          } else {
            this.$message({
              message: this.$t('AddCar.car_make_failed'),
              type: 'error',
              center: true,
            });
          }
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
    submitNewServicePlan() {
      const newServicePlan = { ...this.servicePlan, ...this.addServicePlanForm };
      this.$refs.addServicePlanForm.validate((valid) => {
        if (valid) {
          this.toggleDataLoading(true);
          addServicePlan(newServicePlan).then((response) => {
            if (response.ok) {
              this.reloadServicePlans();
              this.addingServicePlanSuccess();
            } else {
              this.addingServicePlanFailed();
            }
          });
        }
      });
    },
    addingServicePlanSuccess() {
      this.$message({
        message: this.$t('AddServicePlan.add_servicePlan_success'),
        type: 'success',
        center: true,
      });
      this.toggleDataLoading(false);
      this.close = true;
    },
    addingServicePlanFailed() {
      this.$message({
        message: this.$t('AddServicePlan.add_servicePlan_failed'),
        type: 'error',
        center: true,
      });
      this.toggleDataLoading(false);
    },
  },
};
</script>

<style scoped></style>
