<template>
  <div class="event-list">
    <el-table :data="servicePlan.serviceEvents" :empty-text="$t('ServiceEvents.no_serviceEvents_placeholder')">
      <el-table-column :label="$t('DocumentsWizard.formLabels.serviceEvent_name')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.comments }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.notify_mileage')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.mileageNotification }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.max_mileage')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.mileage }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.notify_period')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.periodNotification }}</template>
      </el-table-column>
      <el-table-column :label="$t('DocumentsWizard.formLabels.period')" min-width="60px" align="center">
        <template slot-scope="scope">{{ scope.row.period }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getSpecificServicePlan } from '@/api/servicePlansApi';

export default {
  data() {
    return {
      servicePlan: [],
    };
  },
  computed: {
    ...mapGetters('carsDetailsStore', ['car', 'carId']),
  },
  async created() {
    this.setCarId(this.carId);
    await this.getViewInfo(this.carId);
    await this.getServicePlan();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('carsDetailsStore', ['getViewInfo', 'setCarId']),
    getServicePlan() {
      if (this.car.servicePlanId > 0) {
        this.toggleDataLoading(true);
        getSpecificServicePlan(this.carId)
          .then((response) => {
            if (response.ok) {
              this.servicePlan = response.data;
            }
          })
          .finally(() => {
            this.toggleDataLoading(false);
          });
      }
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
  margin: 10px 0 0 16px;
}
</style>
