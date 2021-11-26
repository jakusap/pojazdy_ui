<template>
  <div class="car-details">
    <el-form ref="servicePlanDetailsForm" :model="servicePlanDetails" class="car-form" @submit.native.prevent>
      <div class="driver-name">
        <h2 v-if="!editMode">{{ servicePlan.servicePlanName }}</h2>
        <el-form-item v-if="editMode" prop="servicePlanName">
          <el-input v-model="servicePlanDetails.servicePlanName"></el-input>
        </el-form-item>
      </div>
      <div class="car-item">
        <h2 v-if="!editMode">{{ servicePlan.carMake }}</h2>
        <el-form-item v-if="editMode" prop="carMake">
          <el-select v-model="servicePlanDetails.carMake" filterable @change="getCarModel">
            <el-option v-for="(carMake, id) in carsMake" :key="id" :value="carMake" :label="carMake" />
          </el-select>
        </el-form-item>
        <h2 v-if="!editMode">{{ servicePlan.carModel }}</h2>
        <el-form-item v-if="editMode" prop="carModel">
          <el-select v-model="servicePlanDetails.carModel" filterable>
            <el-option v-for="(carModel, id) in carModels" :key="id" :value="carModel" :label="carModel" />
          </el-select>
        </el-form-item>
      </div>
      <div>
        <i v-if="!editMode" class="el-icon-open" />
        <span v-if="servicePlan.isActive && !editMode">{{ $t('ServicePlans.active') }}</span>
        <span v-if="!servicePlan.isActive && !editMode">{{ $t('ServicePlans.inactive') }}</span>
        <el-form-item prop="active">
          <el-switch
            v-if="editMode"
            v-model="servicePlanDetails.isActive"
            :active-text="$t('ServicePlans.active')"
            :inactive-text="$t('ServicePlans.inactive')"
          >
          </el-switch>
        </el-form-item>
      </div>
      <div v-if="editMode" class="form-buttons">
        <el-button type="primary" size="small" @click="submit()">{{ $t('save') }}</el-button>
        <el-button size="small" @click="toggleEdit()">{{ $t('cancel') }}</el-button>
      </div>
    </el-form>
    <el-button
      :type="editMode ? 'warning' : 'primary'"
      class="card-edit"
      size="small"
      icon="el-icon-edit"
      circle
      @click="toggleEdit()"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getCarMake, getCarModel } from '@/api/carsApi';
import { editServicePlan } from '@/api/servicePlansApi';

export default {
  data() {
    return {
      carsMake: [],
      carModels: [],
      editMode: false,
      servicePlanDetails: {
        servicePlanName: null,
        carMake: null,
        carModel: null,
        isActive: null,
      },
    };
  },
  computed: {
    ...mapGetters('servicePlansDetailsStore', ['servicePlan']),
    tableData() {
      let tableData = JSON.parse(JSON.stringify(this.servicePlan));
      return tableData.serviceEvents;
    },
  },
  async created() {
    await this.getCarsMake();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('servicePlansDetailsStore', ['getServicePlanDetails', 'setViewLoading']),
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
    getCarModel() {
      this.servicePlanDetails.carModel = null;
      if (this.servicePlanDetails.carMake) {
        this.toggleDataLoading(true);
        const carMake = this.servicePlanDetails.carMake;
        getCarModel(carMake)
          .then((response) => {
            if (response.ok) {
              this.carModels = response.data;
              this.toggleDataLoading(false);
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
      }
    },
    submit() {
      const editedServicePlan = { ...this.servicePlan, ...this.servicePlanDetails };
      this.$refs.servicePlanDetailsForm.validate((valid) => {
        if (valid) {
          this.setViewLoading(true);
          editServicePlan(editedServicePlan).then((response) => {
            if (response.ok) {
              this.$message({ message: this.$t('AddServicePlan.edit_servicePlan_success'), type: 'success', center: true });
              this.toggleEdit();
              this.getServicePlanDetails();
            } else {
              this.editFailed();
            }
          });
        }
      });
    },
    editFailed() {
      this.$message({
        message: this.$t('AddServicePlan.edit_servicePlan_failed'),
        type: 'error',
        center: true,
      });
      this.setViewLoading(false);
    },
    toggleEdit() {
      if (!this.editMode) {
        const { servicePlanName, carMake, carModel, isActive } = this.servicePlan;
        this.servicePlanDetails = {
          servicePlanName,
          carMake,
          carModel,
          isActive,
        };
      }
      this.editMode = !this.editMode;
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
</style>
