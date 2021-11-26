<template>
  <div>
    <CarsDetails />
    <CarUsersDetails />
    <CarsDetailsServicePlanEvents />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import CarsDetailsServicePlanEvents from './components/CarDetailsServicePlanEvents';
import CarsDetails from './components/CarsDetails';
import CarUsersDetails from './components/CarUsersDetails';
import carsDetailsStore from './store/carsDetailsStore';

export default {
  components: {
    CarUsersDetails,
    CarsDetails,
    CarsDetailsServicePlanEvents,
  },
  computed: {
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
</style>
