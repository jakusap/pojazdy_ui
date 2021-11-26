<template>
  <div class="car-details card-wrapper">
    <h1 style="margin-left: 15px">{{ $t('drivers_history') }}</h1>
    <el-collapse v-model="activeNames" accordion style="border-bottom: 0; margin: 0 15px 0 15px">
      <el-collapse-item v-for="(carUser, idx) in carUsers.carUsers" :key="idx" :name="idx">
        <template slot="title">
          <table>
            <td v-if="!mobile">
              <span><i class="el-icon-circle-check"></i>{{ carUser.pickUpDate }}</span>
            </td>
            <td v-if="!mobile">
              <el-popover
                v-if="carUser.pickUpComment"
                placement="top-start"
                :title="$t('AddCarUser.pick_up_comment')"
                trigger="hover"
              >
                <div class="" style="word-break: initial">
                  {{ carUser.pickUpComment }}
                </div>
                <el-button slot="reference" class="less-actions" size="mini"
                  ><i class="el-icon-warning-outline"
                /></el-button>
              </el-popover>
            </td>
            <td>
              <span style="margin-left: 10px">{{ carUser.driver.lastName + ' ' + carUser.driver.firstName }}</span>
              <span v-if="!mobile">
                <span v-if="carUser.driver.email" style="margin-left: 20px"
                  ><i v-if="carUser.driver.email" class="el-icon-message" />{{ carUser.driver.email }}</span
                >
              </span>
            </td>
            <td v-if="!mobile">
              <span v-if="carUser.driver.phoneNumber" style="margin-left: 20px"
                ><i v-if="carUser.driver.phoneNumber" class="el-icon-phone" />{{ carUser.driver.phoneNumber }}</span
              >
            </td>
            <td v-if="!mobile">
              <span style="margin: 0 0 0 10px"
                ><i class="el-icon-money"></i>
                {{
                  carUser.responsibilityStatus === 'EXCLUSIVELY' ? $t('CarResponsibilityStatuses.EXCLUSIVELY') : $t('')
                }}
                {{ carUser.responsibilityStatus === 'SHARED' ? $t('CarResponsibilityStatuses.SHARED') : $t('') }}
                {{ carUser.responsibilityStatus === 'NONE' ? $t('CarResponsibilityStatuses.NONE') : $t('') }}
              </span>
            </td>
            <td v-if="!mobile">
              <span v-if="carUser.dropOffDate" style="margin: 0 0 0 20px"
                ><i v-if="carUser.dropOffDate" class="el-icon-circle-close"></i>{{ carUser.dropOffDate }}</span
              >
            </td>
            <td v-if="!mobile">
              <el-popover
                v-if="carUser.dropOffComment"
                placement="top-start"
                :title="$t('AddCarUser.drop_off_comment')"
                trigger="hover"
              >
                <div class="" style="word-break: initial">
                  {{ carUser.dropOffComment }}
                </div>
                <el-button slot="reference" class="less-actions" size="mini"
                  ><i class="el-icon-warning-outline"
                /></el-button>
              </el-popover>
            </td>
            <td v-if="mobile">
              <el-popover placement="top-start" trigger="click">
                <div v-if="carUser.driver.email" class="" style="word-break: initial">
                  {{ $t('DocumentsWizard.formLabels.email_address') }}{{ `:` }}
                  {{ carUser.driver.email }}
                </div>
                <div v-if="carUser.driver.phoneNumber" class="" style="word-break: initial">
                  {{ $t('DocumentsWizard.formLabels.phone_number') }}{{ `:` }}
                  {{ carUser.driver.phoneNumber }}
                </div>
                <div v-if="carUser.pickUpDate" class="" style="word-break: initial">
                  {{ $t('AddCarUser.pick_up_date') }}{{ `:` }}
                  {{ carUser.pickUpDate }}
                </div>
                <div v-if="carUser.dropOffDate" class="" style="word-break: initial">
                  {{ $t('AddCarUser.drop_off_date') }}{{ `:` }}
                  {{ carUser.dropOffDate }}
                </div>
                <div class="">
                  {{ $t('AddCarUser.all_responsibility_statuses') }}{{ `:` }}
                  {{
                    carUser.responsibilityStatus === 'EXCLUSIVELY'
                      ? $t('CarResponsibilityStatuses.EXCLUSIVELY')
                      : $t('')
                  }}
                  {{ carUser.responsibilityStatus === 'SHARED' ? $t('CarResponsibilityStatuses.SHARED') : $t('') }}
                  {{ carUser.responsibilityStatus === 'NONE' ? $t('CarResponsibilityStatuses.NONE') : $t('') }}
                </div>
                <el-button slot="reference" class="less-actions" size="mini"
                  ><i class="el-icon-warning-outline"
                /></el-button>
              </el-popover>
            </td>
          </table>
        </template>
        <el-form
          v-if="!mobile"
          ref="carUsersDetailsForm"
          :model="carUserDetails"
          :rules="rules"
          class="carUser-form"
          @submit.native.prevent
        >
          <div class="car-item">
            <el-form-item :label="$t('AddCarUser.pick_up_date')" prop="pickUpDate">
              <el-date-picker v-model="carUserDetails.pickUpDate" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('AddCarUser.all_responsibility_statuses')" prop="responsibilityStatus">
              <el-select v-model="carUserDetails.responsibilityStatus">
                <el-option
                  v-for="(status, id) in supportedResponsibilityStatuses"
                  :key="id"
                  :value="status.value"
                  :label="status.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('AddCarUser.drop_off_date')" prop="dropOffDate">
              <el-date-picker v-model="carUserDetails.dropOffDate" prop="dropOffDate" type="datetime"></el-date-picker>
            </el-form-item>
          </div>
          <div class="car-item">
            <el-form-item :label="$t('AddCarUser.pick_up_comment')" prop="pickUpComment">
              <el-input v-model="carUserDetails.pickUpComment" type="textarea"></el-input>
            </el-form-item>
            <el-form-item :label="$t('AddCarUser.drop_off_comment')" prop="dropOffComment">
              <el-input v-model="carUserDetails.dropOffComment" type="textarea"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <el-form
          v-if="mobile"
          ref="carUsersDetailsForm"
          :model="carUserDetails"
          :rules="rules"
          class="carUser-form"
          @submit.native.prevent
        >
          <div class="car-item">
            <el-form-item :label="$t('AddCarUser.pick_up_date')" prop="pickUpDate">
              <el-date-picker v-model="carUserDetails.pickUpDate" type="datetime"></el-date-picker>
            </el-form-item>
          </div>
          <div class="car-item">
            <el-form-item :label="$t('AddCarUser.all_responsibility_statuses')" prop="responsibilityStatus">
              <el-select v-model="carUserDetails.responsibilityStatus">
                <el-option
                  v-for="(status, id) in supportedResponsibilityStatuses"
                  :key="id"
                  :value="status.value"
                  :label="status.label"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="car-item">
            <el-form-item :label="$t('AddCarUser.drop_off_date')" prop="dropOffDate">
              <el-date-picker v-model="carUserDetails.dropOffDate" prop="dropOffDate" type="datetime"></el-date-picker>
            </el-form-item>
          </div>
          <div class="car-item">
            <el-form-item :label="$t('AddCarUser.pick_up_comment')" prop="pickUpComment">
              <el-input v-model="carUserDetails.pickUpComment" type="textarea"></el-input>
            </el-form-item>
          </div>
          <div class="car-item">
            <el-form-item :label="$t('AddCarUser.drop_off_comment')" prop="dropOffComment">
              <el-input v-model="carUserDetails.dropOffComment" type="textarea"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="buttons">
          <div class="form-buttons">
            <el-button type="primary" size="small" @click="submit(idx)">{{ $t('save') }}</el-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-button type="primary" style="margin-left: 15px" @click="showAddCarUserModal">
      {{ $t('Drivers.drivers_add') }}
    </el-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { editCarUser } from '@/api/carsApi';
import AddCarUser from '@/effects/AddCarUser';

export default {
  data() {
    return {
      activeNames: '',
      carUserDetails: {
        pickUpDate: null,
        dropOffDate: null,
        pickUpComment: null,
        dropOffComment: null,
        responsibilityStatus: null,
      },
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
      rules: {
        pickUpDate: [{ required: true, message: this.$t('validation.pick_up_date_required') }],
        responsibilityStatus: [{ required: true, message: this.$t('validation.responsibility_status_required') }],
        pickUpComment: [{ max: 499, message: this.$t('validation.car_comment_max') }],
        dropOffComment: [{ max: 499, message: this.$t('validation.car_comment_max') }],
      },
    };
  },
  computed: {
    ...mapGetters('carsDetailsStore', ['car']),
    carUsers() {
      let car = JSON.parse(JSON.stringify(this.car));
      for (let id in car.carUsers) {
        if (car.carUsers[id].pickUpDate) {
          car.carUsers[id].pickUpDate = this.dateFormat(car.carUsers[id].pickUpDate);
        }
        if (car.carUsers[id].dropOffDate) {
          car.carUsers[id].dropOffDate = this.dateFormat(car.carUsers[id].dropOffDate);
        }
      }
      return car;
    },
  },
  watch: {
    activeNames(newVal, oldVal) {
      if (newVal !== '') {
        this.setFormData(newVal);
      }
    },
  },
  methods: {
    ...mapActions('carsDetailsStore', ['getCarDetails', 'setViewLoading']),
    showAddCarUserModal() {
      const carDriver = this.car.carUsers;
      this.$modalOn(AddCarUser, { carDriver: carDriver });
    },
    submit(idx) {
      const editedCarUser = { ...this.car.carUsers[idx], ...this.carUserDetails };
      this.$refs.carUsersDetailsForm[0].validate((valid) => {
        if (valid) {
          this.setViewLoading(true);
          editCarUser(editedCarUser)
            .then((response) => {
              if (response.ok) {
                this.$message({ message: this.$t('DriverDetails.edit_driver_success'), type: 'success', center: true });
              } else {
                this.editFailed();
              }
            })
            .finally(() => {
              this.getCarDetails();
            });
        }
      });
    },
    editFailed() {
      this.$message({
        message: this.$t('DriverDetails.edit_driver_failed'),
        type: 'error',
        center: true,
      });
      this.setViewLoading(false);
    },
    setFormData(idx) {
      const { pickUpDate, dropOffDate, pickUpComment, dropOffComment, responsibilityStatus } = this.car.carUsers[idx];
      this.carUserDetails = {
        pickUpDate,
        dropOffDate,
        pickUpComment,
        dropOffComment,
        responsibilityStatus,
      };
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
.el-form-item__error {
  margin-left: 10px;
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
  font-size: 18px;
  background: none;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}
</style>
