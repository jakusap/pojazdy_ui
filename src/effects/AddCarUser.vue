<template>
  <ModalGateway :title="$t('CarUsers.title')" :close="close">
    <div v-if="carDriver.length" style="margin-bottom: 20px">
      <div class="driver-info">
        {{ $t('AddCarUser.active_car_user') }}
        {{ carDriver[0].driver.firstName }} {{ carDriver[0].driver.lastName }}
        <span v-if="!mobile"
          ><i v-if="carDriver[0].driver.email" style="margin-left: 5px" class="el-icon-message"
        /></span>
        {{ carDriver[0].driver.email }}
        <span v-if="!mobile"
          ><i v-if="carDriver[0].driver.phoneNumber" style="margin-left: 5px" class="el-icon-phone"
        /></span>
        {{ carDriver[0].driver.phoneNumber }}
      </div>
    </div>
    <div v-if="!validatedDropOff" style="margin-bottom: 20px">
      <span class="driver-warning">
        {{ $t('AddCarUser.car_not_dropped_off') }}
      </span>
    </div>
    <div v-loading="loading">
      <el-select v-model="selectedDriverUUID" filterable style="margin-bottom: 10px">
        <el-option
          v-for="(loadedDriver, idx) in driversList"
          :key="idx"
          :disabled="loadedDriver.driverUUID === (carDriver.length ? carDriver[0].driver.driverUUID : null)"
          :value="loadedDriver.driverUUID"
          :label="loadedDriver.firstName + ' ' + loadedDriver.lastName"
        >
          <div class="">
            {{ loadedDriver.firstName }}
            {{ loadedDriver.lastName }}
            <i v-if="loadedDriver.email" class="el-icon-message" />
            {{ loadedDriver.email }}
            <i v-if="loadedDriver.phoneNumber" class="el-icon-phone" />
            {{ loadedDriver.phoneNumber }}
          </div>
        </el-option>
      </el-select>
      <el-form v-if="selectedDriver" ref="addCarUserForm" :model="carUserDetails" :rules="rules" @submit.native.prevent>
        <el-form-item prop="pickUpDate" :label="$t('AddCarUser.pick_up_date')">
          <el-date-picker v-model="carUserDetails.pickUpDate" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item prop="responsibilityStatus" :label="$t('AddCarUser.all_responsibility_statuses')">
          <el-select v-model="carUserDetails.responsibilityStatus">
            <el-option
              v-for="(status, id) in supportedResponsibilityStatuses"
              :key="id"
              :value="status.value"
              :label="status.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!validatedDropOff" prop="dropOffDate" :label="$t('AddCarUser.drop_off_date')">
          <el-date-picker v-model="carUserDetails.dropOffDate" type="datetime"></el-date-picker>
        </el-form-item>
        <el-form-item prop="pickUpComment" :label="$t('AddCarUser.pick_up_comment')">
          <el-input v-model="carUserDetails.pickUpComment" type="textarea"></el-input>
        </el-form-item>
        <el-form-item v-if="!validatedDropOff" prop="dropOffComment" :label="$t('AddCarUser.drop_off_comment')">
          <el-input v-model="carUserDetails.dropOffComment" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close = true">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="addCarUser">{{ $t('CarUsers.add_car_user') }}</el-button>
      </div>
    </div>
  </ModalGateway>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { editCarUser, putAddCarUser } from '@/api/carsApi';
import { getDriversList } from '@/api/driversApi';
import ModalGateway from '@/modals/ModalGateway';

export default {
  components: {
    ModalGateway,
  },
  props: {
    carDriver: {
      type: Array,
    },
  },
  data() {
    return {
      close: false,
      selectedDriverUUID: null,
      driversList: [],
      loading: false,
      supportedResponsibilityStatuses: [
        {
          value: 'EXCLUSIVELY',
          label: 'KIEROWCA',
        },
        {
          value: 'SHARED',
          label: 'KIEROWCA-PARTNER',
        },
        {
          value: 'NONE',
          label: 'PARTNER',
        },
      ],
      carUserDetails: {
        pickUpDate: null,
        dropOffDate: null,
        pickUpComment: null,
        dropOffComment: null,
        responsibilityStatus: null,
      },
      rules: {
        pickUpDate: [{ required: true, message: this.$t('validation.pick_up_date_required') }],
        responsibilityStatus: [{ required: true, message: this.$t('validation.responsibility_status_required') }],
      },
    };
  },
  computed: {
    ...mapActions('carsDetailsStore', ['getCarDetails', 'getViewInfo']),
    carId() {
      return String(this.$route.params.carId);
    },
    selectedDriver() {
      return this.driversList.find((driver) => driver.driverUUID === this.selectedDriverUUID);
    },
    validatedDropOff() {
      if (this.carDriver.length) {
        return this.carDriver[0].dropOffDate !== null;
      }
      return true;
    },
  },
  async created() {
    this.loading = true;
    await getDriversList()
      .then((response) => {
        response.data.sort((driver, nextDriver) => {
          if (driver.lastName < nextDriver.lastName) {
            return -1;
          }
          if (nextDriver.lastName < driver.lastName) {
            return 1;
          }
          return 0;
        });
        this.driversList = response.data;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    addCarUser() {
      const carId = this.carId;
      const validatedDropOff = this.validatedDropOff;
      const driverUUID = this.selectedDriverUUID;
      if (this.$refs.addCarUserForm) {
        this.$refs.addCarUserForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            if (this.carDriver.length) {
              if (!validatedDropOff) {
                if (this.carUserDetails.dropOffDate) {
                  this.carDriver[0].dropOffDate = this.carUserDetails.dropOffDate;
                  this.carDriver[0].dropOffComment = this.carUserDetails.dropOffComment;
                } else {
                  this.carDriver[0].dropOffDate = this.carUserDetails.pickUpDate;
                  this.carDriver[0].dropOffComment = this.carUserDetails.dropOffComment;
                }
                this.carUserDetails.dropOffDate = null;
                this.carUserDetails.dropOffComment = null;
              }
              editCarUser(this.carDriver[0]).then((response) => {
                if (!response.ok) {
                  this.editFailed();
                }
              });
            }
            const editedCarUser = { ...this.carDriver, ...this.carUserDetails };
            putAddCarUser(carId, driverUUID, editedCarUser)
              .then((response) => {
                if (response.ok) {
                  this.$message({ message: this.$t('CarUsers.success'), type: 'success', center: true });
                  this.close = true;
                } else {
                  this.$message({ message: this.$t('CarUsers.failed'), type: 'error', center: true });
                }
              })
              .finally(() => {
                this.getCarDetails;
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
