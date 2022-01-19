<template>
  <ModalGateway :large="!modalSize" :slight="modalSize" :title="$t('AddCarEvent.add_car_event')" :close="close">
    <el-form
      ref="addCarEventForm"
      v-loading="dataLoading"
      class="-event"
      :model="addCarEventForm"
      :rules="rules"
      label-position="top"
    >
      <CarFormFields
        :add-car-event-form="addCarEventForm"
        :cars-list="carsList.carUsers"
        :events-list="eventTypesList"
      />
      <CarEventFeaturesFields :add-car-event-form="addCarEventForm"/>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :disabled="dataLoading" @click="close = true">{{ $t('cancel') }}</el-button>
      <el-button :disabled="dataLoading" type="success" @click="submitNewCarEvent">
        {{ $t('confirm') }}
      </el-button>
    </span>
  </ModalGateway>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { addCarEvent } from '@/api/carEventsApi';
import { addCar, getCar, getCarMake, getCarsList } from '@/api/carsApi';
import { getEventTypes } from '@/api/eventTypesApi';
import ModalGateway from '@/modals/ModalGateway';

import CarFormFields from './components/CarFormFields';
import CarEventFeaturesFields from './components/CarEventFeaturesFields';

export default {
  components: {
    ModalGateway,
    CarFormFields,
    CarEventFeaturesFields,
  },
  props: {
    car: {
      type: Object,
    },
    carEvent: {
      type: Object,
    },
  },
  data() {
    return {
      carsList: [],
      eventTypesList: [],
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
      rules: {
        eventCode: [{ required: true, message: this.$t('validation.event_type_required') }],
        dateTime: [{ required: true, message: this.$t('validation.date_required') }],
        mileage: [{ required: true, message: this.$t('validation.mileage_required') }],
        carUserId: [{ required: true, message: this.$t('validation.driver_required') }],
        cost: [{ required: true, message: this.$t('validation.cost_required') }],
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
    await this.getEventTypesList();
    this.addCarEventForm.carId = this.car.carId;
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('carsDetailsStore', ['reloadCarEvents']),
    getCarsList() {
      this.toggleDataLoading(true);
      getCar(this.car.carId)
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
    getEventTypesList() {
      this.toggleDataLoading(true);
      getEventTypes()
        .then((response) => {
          if (response.ok) {
            this.eventTypesList = response.data;
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
    submitNewCarEvent() {
      const newCarEvent = { ...this.carEvent, ...this.addCarEventForm };
      this.$refs.addCarEventForm.validate((valid) => {
        if (valid) {
          this.toggleDataLoading(true);
          addCarEvent(newCarEvent).then((response) => {
            if (response.ok) {
              this.reloadCarEvents();
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
        message: this.$t('AddCarEvent.add_car_event_success'),
        type: 'success',
        center: true,
      });
      this.toggleDataLoading(false);
      this.close = true;
    },
    addingCarEventFailed() {
      this.$message({
        message: this.$t('AddCarEvent.car_make_event_failed'),
        type: 'error',
        center: true,
      });
      this.toggleDataLoading(false);
    },
  },
};
</script>

<style scoped></style>
