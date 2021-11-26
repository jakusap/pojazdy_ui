<template>
  <div class="card-wrapper">
    <el-button
      :type="editMode ? 'warning' : 'primary'"
      class="card-edit"
      size="small"
      icon="el-icon-edit"
      circle
      @click="toggleEdit()"
    />
    <div v-if="settlementSchema.name" class="schema-info">
      <h3 v-if="!editMode" class="schema-info__title">{{ settlementSchema.name }}</h3>
      <el-select v-if="editMode" v-model="form.schemaNumber" class="select" filterable>
        <el-option
          v-for="item in settlementsSchemas"
          :key="item.schemaNumber"
          :label="item.name"
          :value="item.schemaNumber"
        >
        </el-option>
      </el-select>
      <section class="schema-info__details">
        <div class="schema-info__field">
          <span>{{ $t('SchemaInfo.contract_type') }}</span
          ><span class="schema-info__value">{{ $t(`SchemaInfo.${settlementSchema.contractType}`) }}</span>
        </div>
        <div class="schema-info__field">
          <span>{{ $t('SchemaInfo.monthly_contract_costs') }}</span>
          <span class="schema-info__value">{{ $amount(settlementSchema.monthlyCosts) }}</span>
        </div>
        <div class="schema-info__field">
          <span>{{ $t('SchemaInfo.settlement_cost') }} </span>
          <span class="schema-info__value">{{ $amount(settlementSchema.additionalCosts) }}</span>
        </div>
        <div class="schema-info__field">
          <span>{{ $t('SchemaInfo.vat_split') }}</span
          ><span class="schema-info__value">{{ `${settlementSchema.vatSplitRate * 100}%` }}</span>
        </div>
      </section>
      <div v-if="editMode" class="form-buttons">
        <el-button type="primary" size="small" @click="submit()">{{ $t('save') }}</el-button>
        <el-button size="small" @click="toggleEdit()">{{ $t('cancel') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { editDriver } from '@/api/driversApi';

export default {
  data() {
    return {
      editMode: false,
      form: {
        schemaNumber: null,
      },
    };
  },
  computed: {
    ...mapGetters(['settlementsSchemas']),
    ...mapGetters('driverDetailsStore', ['driver']),
    settlementSchema() {
      if (this.driver.settlementSchema) {
        const schema = this.settlementsSchemas.find(
          (schema) => schema.schemaNumber === this.driver.settlementSchema.schemaNumber
        );

        const { additionalCosts, monthlyCosts } = schema;

        return {
          ...schema,
          additionalCosts: additionalCosts ? additionalCosts.reduce((acc, val) => acc + val.amount, 0) : 0,
          monthlyCosts: additionalCosts ? monthlyCosts.reduce((acc, val) => acc + val.amount, 0) : 0,
        };
      }
      return {};
    },
  },

  methods: {
    ...mapActions('driverDetailsStore', ['getDriverDetails', 'setViewLoading']),
    toggleEdit() {
      if (!this.editMode) {
        this.form.schemaNumber = this.driver.settlementSchema.schemaNumber;
      }
      this.editMode = !this.editMode;
    },

    submit() {
      const successMessage = this.$t('DriverDetails.edit_driver_success');
      const failedMessage = this.$t('DriverDetails.edit_driver_failed');

      this.setViewLoading(true);
      const driverSchema = this.settlementsSchemas.find((schema) => schema.schemaNumber === this.form.schemaNumber);
      const editedDriver = { ...this.driver, settlementSchema: driverSchema };
      editDriver(editedDriver).then((response) => {
        if (response.ok) {
          this.$message({ message: successMessage, type: 'success', center: true });
          this.toggleEdit();
          this.getDriverDetails();
        } else {
          this.setViewLoading(false);
          this.$message({
            message: failedMessage,
            type: 'error',
            center: true,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.schema-info {
  width: 100%;
  &__wrapper {
    display: flex;
    height: 100%;
    box-sizing: border-box;
    padding: 16px;
    background: white;
  }
  &__title {
    margin: 0;
    font-size: 20px;
    padding: 8px 0;
    margin-bottom: 8px;
    width: 100%;
  }
  &__details {
    display: flex;
    flex-flow: column;
    height: calc(100% - 32px);
  }
  &__field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    padding: 12px 0;
    &:not(:last-child) {
      border-bottom: 1px solid $borderColor;
    }
  }
  &__value {
    font-weight: 700;
  }
}
@media screen and (min-width: 500px) {
  .schema-info {
    &__wrapper {
      box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
    }
  }
}
.select {
  margin-bottom: 8px;
}
.form-buttons {
  text-align: center;
  margin-top: 16px;
}
</style>
