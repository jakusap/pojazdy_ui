<template>
  <div class="car-details card-wrapper">
    <DataWrapper v-if="!editMode">
      <div slot="table-body">
        <el-table
          v-if="!editMode"
          :empty-text="$t('Cars.no_cars_placeholder')"
          :data="tableData"
          :height="mobile ? 'calc(15vh)' : '110px'"
        >
          <el-table-column :label="$t('DocumentsWizard.formLabels.make_model')" min-width="60px" align="center">
            <template slot-scope="scope"> {{ scope.row.carMake }} {{ scope.row.carModel }} </template>
          </el-table-column>
          <MobileCarsDetails />
          <el-table-column
            v-if="!mobile"
            :label="$t('DocumentsWizard.formLabels.registrationNumber')"
            min-width="60px"
            align="center"
            ><template slot-scope="scope">{{ scope.row.registrationNumber }} </template>
          </el-table-column>
          <el-table-column
            v-if="!mobile"
            :label="$t('DocumentsWizard.formLabels.identificationNumber_tooltip')"
            min-width="60px"
            align="center"
          >
            <template slot-scope="scope">{{ scope.row.carVin ? scope.row.carVin : $t('dash') }} </template>
          </el-table-column>
          <el-table-column
            v-if="!mobile"
            :label="$t('DocumentsWizard.formLabels.productionYear')"
            min-width="60px"
            align="center"
          >
            <template slot-scope="scope"
              >{{ scope.row.productionYear ? scope.row.productionYear.substr(0, 4) : $t('dash') }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="!mobile"
            :label="$t('DocumentsWizard.formLabels.registrationDate')"
            min-width="60px"
            align="center"
          >
            <template slot-scope="scope"> {{ scope.row.registrationDate }}</template>
          </el-table-column>
          <el-table-column
            v-if="!mobile"
            :label="$t('DocumentsWizard.formLabels.admissionDate')"
            min-width="60px"
            align="center"
          >
            <template slot-scope="scope"> {{ scope.row.admissionDate }}</template>
          </el-table-column>
          <el-table-column v-if="!mobile && car.description" min-width="60px" align="center">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                :title="$t('DocumentsWizard.formLabels.carDescription')"
                trigger="hover"
              >
                <div class="">
                  {{ scope.row.description }}
                </div>
                <el-button slot="reference" class="less-actions"><i class="el-icon-warning-outline"/></el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column :label="$t('edit_car')" width="100px" align="center">
            <el-button
              :type="editMode ? 'warning' : 'primary'"
              class="card-edit"
              size="small"
              icon="el-icon-edit"
              circle
              @click="toggleEdit()"
            />
          </el-table-column>
        </el-table>
      </div>
    </DataWrapper>
    <div v-if="!mobile" class="">
      <el-form
        v-if="editMode"
        ref="carsDetailsForm"
        :model="carsDetails"
        :rules="rules"
        class="car-form"
        @submit.native.prevent
      >
        <div class="car-item">
          <el-form-item prop="carMake" :label="$t('DocumentsWizard.formLabels.make')">
            <el-select v-model="carsDetails.carMake" filterable @change="getCarModel">
              <el-option v-for="(carMake, id) in carsMake" :key="id" :value="carMake" :label="carMake" />
            </el-select>
          </el-form-item>
          <el-form-item prop="carModel" :label="$t('DocumentsWizard.formLabels.model')">
            <el-select v-model="carsDetails.carModel" filterable>
              <el-option v-for="(carModel, id) in carModels" :key="id" :value="carModel" :label="carModel" />
            </el-select>
          </el-form-item>
          <el-form-item prop="registrationNumber" :label="$t('DocumentsWizard.formLabels.registrationNumber')">
            <el-input
              v-model="carsDetails.registrationNumber"
              :placeholder="$t('DocumentsWizard.formLabels.registrationNumber')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="carVin" :label="$t('DocumentsWizard.formLabels.identificationNumber_tooltip')">
            <el-input
              v-model="carsDetails.carVin"
              :placeholder="$t('DocumentsWizard.formLabels.identificationNumber_tooltip')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="productionYear"
            :label="$t('DocumentsWizard.formLabels.productionYear')"
            style="margin-left: 30px"
          >
            <el-date-picker
              v-model="carsDetails.productionYear"
              type="year"
              :placeholder="$t('DocumentsWizard.formLabels.productionYear')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="registrationDate" :label="$t('DocumentsWizard.formLabels.registrationDate')">
            <el-date-picker
              v-model="carsDetails.registrationDate"
              :placeholder="$t('DocumentsWizard.formLabels.registrationDate')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="admissionDate" :label="$t('DocumentsWizard.formLabels.admissionDate')">
            <el-date-picker
              v-model="carsDetails.admissionDate"
              type="datetime"
              :placeholder="$t('DocumentsWizard.formLabels.admissionDate')"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="car-item">
          <el-form-item prop="description" :label="$t('DocumentsWizard.formLabels.carDescription')">
            <el-input
              v-model="carsDetails.description"
              type="textarea"
              :placeholder="$t('DocumentsWizard.formLabels.carDescription')"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div v-if="mobile">
      <el-form
        v-if="editMode"
        ref="carsDetailsForm"
        :model="carsDetails"
        :rules="rules"
        class="car-form"
        @submit.native.prevent
      >
        <div class="car-item">
          <el-form-item prop="carMake" :label="$t('DocumentsWizard.formLabels.make')">
            <el-select v-model="carsDetails.carMake" filterable @change="getCarModel">
              <el-option v-for="(carMake, id) in carsMake" :key="id" :value="carMake" :label="carMake" />
            </el-select>
          </el-form-item>
          <el-form-item prop="carModel" :label="$t('DocumentsWizard.formLabels.model')">
            <el-select v-model="carsDetails.carModel" filterable>
              <el-option v-for="(carModel, id) in carModels" :key="id" :value="carModel" :label="carModel" />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="mobile" class="car-item">
          <el-form-item prop="registrationNumber" :label="$t('DocumentsWizard.formLabels.registrationNumber')">
            <el-input
              v-model="carsDetails.registrationNumber"
              :placeholder="$t('DocumentsWizard.formLabels.registrationNumber')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div v-if="mobile" class="car-item">
          <el-form-item prop="carVin" :label="$t('DocumentsWizard.formLabels.identificationNumber_tooltip')">
            <el-input
              v-model="carsDetails.carVin"
              :placeholder="$t('DocumentsWizard.formLabels.identificationNumber_tooltip')"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <div v-if="mobile" class="car-item">
          <el-form-item prop="productionYear" :label="$t('DocumentsWizard.formLabels.productionYear')">
            <el-date-picker
              v-model="carsDetails.productionYear"
              type="year"
              :placeholder="$t('DocumentsWizard.formLabels.productionYear')"
              style="margin-right: 30px"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div v-if="mobile" class="car-item">
          <el-form-item prop="registrationDate" :label="$t('DocumentsWizard.formLabels.registrationDate')">
            <el-date-picker
              v-model="carsDetails.registrationDate"
              :placeholder="$t('DocumentsWizard.formLabels.registrationDate')"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div v-if="mobile" class="car-item">
          <el-form-item prop="admissionDate" :label="$t('DocumentsWizard.formLabels.admissionDate')">
            <el-date-picker
              v-model="carsDetails.admissionDate"
              type="datetime"
              :placeholder="$t('DocumentsWizard.formLabels.admissionDate')"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="car-item">
          <el-form-item prop="description" :label="$t('DocumentsWizard.formLabels.carDescription')">
            <el-input
              v-model="carsDetails.description"
              type="textarea"
              :placeholder="$t('DocumentsWizard.formLabels.carDescription')"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div v-if="editMode" class="buttons">
      <div class="form-buttons">
        <el-button type="primary" size="small" @click="submit()">{{ $t('save') }}</el-button>
        <el-button size="small" @click="toggleEdit()">{{ $t('cancel') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { editCar, getCarMake, getCarModel } from '@/api/carsApi';
import DataWrapper from '@/components/DataWrapper';
import MobileCarsDetails from '@/views/PartnerApp/PartnerCarsDetails/components/MobileCarsDetails';

export default {
  components: {
    MobileCarsDetails,
    DataWrapper,
  },
  data() {
    return {
      carsMake: [],
      carModels: [],
      editMode: false,
      carsDetails: {
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
        carMake: [
          { required: true, message: this.$t('validation.car_make_required') },
          { max: 50, message: this.$t('validation.car_make_max') },
        ],
        carModel: [
          { required: true, message: this.$t('validation.car_model_required') },
          { max: 50, message: this.$t('validation.car_model_max') },
        ],
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
    ...mapGetters('carsDetailsStore', ['car']),
    tableData() {
      let tableData = JSON.parse(JSON.stringify(this.car));
      if (tableData) {
        tableData.admissionDate = this.dateFormat(tableData.admissionDate);
        tableData.withdrawalDate = this.dateFormat(tableData.withdrawalDate);
      }
      return [tableData];
    },
  },
  async created() {
    await this.getCarsMake();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('carsDetailsStore', ['getCarDetails', 'setViewLoading']),
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
      this.carsDetails.carModel = null;
      if (this.carsDetails.carMake) {
        this.toggleDataLoading(true);
        const carMake = this.carsDetails.carMake;
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
      const editedCar = { ...this.car, ...this.carsDetails };
      this.$refs.carsDetailsForm.validate((valid) => {
        if (valid) {
          this.setViewLoading(true);
          editCar(editedCar).then((response) => {
            if (response.ok) {
              this.$message({ message: this.$t('CarsDetails.edit_car_success'), type: 'success', center: true });
              this.toggleEdit();
              this.getCarDetails();
            } else {
              this.editFailed();
            }
          });
        }
      });
    },
    editFailed() {
      this.$message({
        message: this.$t('CarsDetails.edit_car_failed'),
        type: 'error',
        center: true,
      });
      this.setViewLoading(false);
    },
    toggleEdit() {
      if (!this.editMode) {
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
        this.carsDetails = {
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
