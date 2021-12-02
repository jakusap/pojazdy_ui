<template>
  <div>
    <CarsDetails />
    <CarUsersDetails />
    <div v-if="car.servicePlanId > 0" class="">
      <div class="radio-buttons">
        <el-radio-group v-model="picked">
          <el-radio-button v-model="picked" :label="$t('DocumentsWizard.formLabels.carEvents')"></el-radio-button>
          <el-radio-button v-model="picked" :label="$t('DocumentsWizard.formLabels.serviceEvents')"></el-radio-button>
        </el-radio-group>
      </div>
      <div v-if="picked === 'Zdarzenia serwisowe'">
        <CarDetailsServicePlanEvents />
      </div>
      <div v-else>
        <CarDetailsCarEvents />
      </div>
    </div>
    <div v-else class="">
      <h1>Dodaj samochód do planu serwisowego</h1>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import CarDetailsCarEvents from './components/CarDetailsCarEvents';
import CarDetailsServicePlanEvents from './components/CarDetailsServicePlanEvents';
import CarsDetails from './components/CarsDetails';
import CarUsersDetails from './components/CarUsersDetails';
import carsDetailsStore from './store/carsDetailsStore';

export default {
  components: {
    CarUsersDetails,
    CarsDetails,
    CarDetailsCarEvents,
    CarDetailsServicePlanEvents,
  },
  data() {
    return {
      picked: null,
    };
  },
  computed: {
    ...mapGetters('carsDetailsStore', ['car', 'carId']),
    carId() {
      return String(this.$route.params.carId);
    },
  },
  beforeCreate() {
    this.$store.registerModule('carsDetailsStore', carsDetailsStore);
  },
  beforeDestroy() {
    this.$store.unregisterModule('carsDetailsStore');
  },
  async created() {
    this.setCarId(this.carId);
    await this.getViewInfo(this.carId);
  },
  methods: {
    ...mapActions('carsDetailsStore', ['getViewInfo', 'setCarId']),
  },
};
</script>

<style lang="scss">
.cars-details {
  & .card-wrapper {
    @extend .table-wrapper;
    position: relative;
    & > .card-edit {
      position: absolute;
      right: 12px;
    }
  }
}
</style>

<style lang="scss" scoped>
.cars-details {
  min-height: inherit;

  &__wrapper {
    display: flex;
    width: 100%;
  }
}
.schema-info {
  margin: 16px 0;
}
.radio-buttons {
  margin-top: 10px;
  margin-left: 16px;
  display: flex;
  align-content: flex-end;
}
</style>
