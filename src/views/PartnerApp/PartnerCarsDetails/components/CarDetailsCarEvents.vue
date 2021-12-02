<template>
<<<<<<< HEAD
  <div class="event-list">
    <el-table :data="paginatedData" :empty-text="$t('CarEvents.no_carEvents_placeholder')">
      <el-table-column :label="$t('DocumentsWizard.formLabels.name')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.eventCodeName }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.driver')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.driverName ? scope.row.driverName : $t('dash') }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.date')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.dateTime }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.mileage')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.mileage }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.cost')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.cost }}</template>
      </el-table-column>
    </el-table>
    <div class="buttons">
      <el-button type="primary" style="margin-top: 15px" @click="showAddCarEventModal">
        {{ $t('AddCarEvent.add_car_event') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getCarEventsForPartnerCarList } from '@/api/carEventsApi';
import AddCarEvent from '@/effects/AddCarEvent';

export default {
  data() {
    return {
      carEventsList: [],
      pagination: {
        limit: 30,
        currentPage: 1,
      },
    };
  },
  computed: {
    ...mapGetters('carsDetailsStore', ['car', 'carId']),
    paginatedData() {
      const limit = this.pagination.limit;
      const currentPage = this.pagination.currentPage;
      return this.carEventsList.slice(limit * (currentPage - 1), limit * currentPage);
    },
  },
  async created() {
    this.setCarId(this.carId);
    await this.getViewInfo(this.carId);
    await this.getCarEvents();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('carsDetailsStore', ['getViewInfo', 'setCarId']),
    showAddCarEventModal() {
      const car = this.car;
      this.$modalOn(AddCarEvent, { car: car });
    },
    getCarEvents() {
      if (this.car.servicePlanId > 0) {
        this.toggleDataLoading(true);
        getCarEventsForPartnerCarList(this.carId)
          .then((response) => {
            if (response.ok) {
              this.carEventsList = response.data;
              for (let i = 0; i < this.carEventsList.length; i++) {
                this.carEventsList[i].dateTime = this.dateFormat(this.carEventsList[i].dateTime);
              }
            }
          })
          .finally(() => {
            this.toggleDataLoading(false);
          });
      }
    },
    dateFormat(date) {
      date = new Date(date);
      let dateMonth = date.getMonth() + 1;
      let dateDay = date.getDate();
      let dateHour = date.getHours();
      let dateMinutes = date.getMinutes();
      let dateString = date.getFullYear() + '-';
      if (dateMonth <= 9) {
        dateString += '0' + dateMonth + '-';
      } else {
        dateString += dateMonth + '-';
      }
      if (dateDay <= 9) {
        dateString += '0' + dateDay;
      } else {
        dateString += dateDay;
      }
      if (dateHour <= 9) {
        dateString += ', ' + '0' + dateHour + ':';
      } else {
        dateString += ', ' + dateHour + ':';
      }
      if (dateMinutes <= 9) {
        dateString += '0' + dateMinutes;
      } else {
        dateString += dateMinutes;
      }
      return dateString;
    },
  },
};
</script>

<style lang="scss">
.cell {
  word-break: initial !important;
}
.el-collapse {
  border-top: none;
}
.el-collapse-item {
  &__content {
    border: none;
  }
}
</style>

<style lang="scss" scoped>
.car-form {
  & >>> .el-input {
    margin-left: 8px;
  }
}
.car-item {
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 12px 0;
  margin: 10px 10px;
  & .el-form-item {
    width: 40%;
    & + .el-form-item {
      padding-left: 8px;
    }
  }
  & h2 {
    margin: 0;
  }
}

.car-details {
  &__edit {
    & > div {
      display: flex;
      align-items: center;
      border-bottom: 0;
    }
  }
  & > div {
    padding: 12px 0;
    &:not(:last-child) {
      padding-bottom: 18px;
      border-bottom: 1px solid $borderColor;
    }
  }
  & .el-form-item {
    width: 100%;
    margin: 0;
  }
  & i {
    margin-right: 8px;
  }
}
.form-buttons {
  text-align: center;
  margin-top: 16px;
}
.less-actions {
  font-size: 22px;
  background: none;
  border: 0;
  border-radius: 16px;
  cursor: pointer;
}

.event-list {
  margin: 10px 0 10px 16px;
}
</style>
=======
$END$
</template>

<script>
export default {
name: "CarDetailsCarEvents"
}
</script>

<style scoped>

</style>
>>>>>>> master
