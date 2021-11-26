<template>
  <ModalGateway :large="!modalSize" :slight="modalSize" :title="$t('AddCar.add_car')" :close="close">
    <el-form
      ref="addCarForm"
      v-loading="dataLoading"
      class="add-car"
      :model="addCarForm"
      :rules="rules"
      label-position="top"
    >
      <CarFormFields :add-car-form="addCarForm" :cars-make="carsMake"></CarFormFields>
      <RegistrationFormFields :add-car-form="addCarForm"></RegistrationFormFields>
      <CarDatesFormFields :add-car-form="addCarForm"></CarDatesFormFields>
      <DescriptionFormField :add-car-form="addCarForm"></DescriptionFormField>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="dataLoading" @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button :disabled="dataLoading" type="success" @click="submitNewCar">
        {{ $t('confirm') }}
      </el-button>
    </span>
  </ModalGateway>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { addCar, getCarMake } from '@/api/carsApi';
import ModalGateway from '@/modals/ModalGateway';

import CarDatesFormFields from './components/CarDatesFormFields';
import CarFormFields from './components/CarFormFields';
import DescriptionFormField from './components/DescriptionFormField';
import RegistrationFormFields from './components/RegistrationFormFields';

export default {
  components: {
    ModalGateway,
    CarFormFields,
    CarDatesFormFields,
    DescriptionFormField,
    RegistrationFormFields,
  },
  props: {
    car: {
      type: Object,
    },
  },
  data() {
    return {
      carsMake: [],
      close: false,
      addCarForm: {
        carMake: null,
        carModel: null,
        carVin: null,
        registrationNumber: null,
        registrationDate: null,
        description: null,
        productionYear: null,
        admissionDate: null,
        withdrawalDate: null,
      },
      rules: {
        carMake: [{ required: true, message: this.$t('validation.car_make_required') }],
        carModel: [{ required: true, message: this.$t('validation.car_model_required') }],
        carVin: [{ max: 17, message: this.$t('validation.car_vin_max') }],
        registrationNumber: [
          { required: true, message: this.$t('validation.registration_number_required') },
          { max: 7, message: this.$t('validation.registration_number_max') },
        ],
        registrationDate: [{ required: true, message: this.$t('validation.registration_date_required') }],
        admissionDate: [{ required: true, message: this.$t('validation.admission_date_required') }],
        description: [{ max: 499, message: this.$t('validation.car_description_max') }],
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
    if (this.car) {
      const {
        carMake,
        carModel,
        carVin,
        registrationNumber,
        registrationDate,
        description,
        productionYear,
        admissionDate,
        withdrawalDate,
      } = this.car;
      this.addCarForm = {
        ...this.addCarForm,
        carMake,
        carModel,
        carVin,
        registrationNumber,
        registrationDate,
        description,
        productionYear,
        admissionDate,
        withdrawalDate,
      };
    }
  },
  async created() {
    await this.getCarsMake();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('carsListViewStore', ['reloadCars']),
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
    submitNewCar() {
      const newCar = { ...this.car, ...this.addCarForm };
      newCar.carVin ? (newCar.carVin = newCar.carVin.toUpperCase()) : newCar.carVin;
      newCar.registrationNumber
        ? (newCar.registrationNumber = newCar.registrationNumber.toUpperCase())
        : newCar.registrationNumber;
      this.$refs.addCarForm.validate((valid) => {
        if (valid) {
          this.toggleDataLoading(true);
          addCar(newCar).then((response) => {
            if (response.ok) {
              this.reloadCars();
              this.addingCarSuccess();
            } else {
              this.addingCarFailed();
            }
          });
        }
      });
    },
    addingCarSuccess() {
      this.$message({
        message: this.$t('AddCar.add_car_success'),
        type: 'success',
        center: true,
      });
      this.toggleDataLoading(false);
      this.close = true;
    },
    addingCarFailed() {
      this.$message({
        message: this.$t('AddCar.add_car_failed'),
        type: 'error',
        center: true,
      });
      this.toggleDataLoading(false);
    },
  },
};
</script>

<style scoped></style>
