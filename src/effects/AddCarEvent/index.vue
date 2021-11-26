<template>
  <ModalGateway :large="!modalSize" :slight="modalSize" :title="$t('AddCarEvent.add_car_event')" :close="close">
    <el-form ref="addCarEventForm" v-loading="dataLoading" class="-event" :model="addCarEventForm" label-position="top">
      <CarFormFields :add-car-event-form="addCarEventForm" :cars-list="carsList"></CarFormFields>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="dataLoading" @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button :disabled="dataLoading" type="success" @click="komentarz">
        {{ $t('confirm') }}
      </el-button>
    </span>
  </ModalGateway>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { addCar, getCarMake, getCarsList } from '@/api/carsApi';
import ModalGateway from '@/modals/ModalGateway';

import CarFormFields from './components/CarFormFields';

export default {
  components: {
    ModalGateway,
    CarFormFields,
  },
  props: {
    carEvent: {
      type: Object,
    },
  },
  data() {
    return {
      carsList: [],
      close: false,
      addCarEventForm: {
        carId: null,
        eventCode: null,
        planId: null,
        orderNumber: null,
        dateTime: null,
        mileage: null,
        carUserId: null,
        cost: null,
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
    if (this.carEvent) {
      const { carId, eventCode, planId, orderNumber, dateTime, mileage, carUserId, cost } = this.carEvent;
      this.addCarForm = {
        ...this.addCarEventForm,
        carId,
        eventCode,
        planId,
        orderNumber,
        dateTime,
        mileage,
        carUserId,
        cost,
      };
    }
  },
  async created() {
    await this.getCarsList();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('carsListViewStore', ['reloadCars']),

    komentarz() {
      const newCarEvent = { ...this.carEvent, ...this.addCarEventForm };
      console.log(this.carsList);
    },
    getCarsList() {
      this.toggleDataLoading(true);
      getCarsList()
        .then((response) => {
          if (response.ok) {
            this.carsList = response.data;
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
              this.addingCarEventSuccess();
            } else {
              this.addingCarEventFailed();
            }
          });
        }
      });
    },
    addingCarEventSuccess() {
      this.$message({
        message: this.$t('AddCar.add_car_success'),
        type: 'success',
        center: true,
      });
      this.toggleDataLoading(false);
      this.close = true;
    },
    addingCarEventFailed() {
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
