<template>
  <div class="schemas__select">
    <div v-if="addMode">
      <el-select :value="editedSchema.name" disabled />
    </div>
    <el-select v-else v-model="selectedSchema" filterable @change="findSchema(selectedSchema)">
      <el-option
        v-for="schema in settlementsSchemas"
        :key="schema.schemaNumber"
        :value="schema.schemaNumber"
        :label="schema.isDefault ? schema.name + ' ' + $t('Schemas.default') : schema.name"
      ></el-option>
    </el-select>
    <div v-if="!disableActions" id="actions" class="schemas__actions">
      <el-button
        :disabled="disableActions"
        icon="el-icon-circle-plus-outline"
        type="success"
        @click="createNewSchema()"
      >
        {{ $t('Schemas.add_schema') }}</el-button
      >
      <el-button :disabled="addMode" icon="el-icon-edit" type="primary" @click="toggleEditedSchema()"
        >{{ $t('Schemas.edit_schema') }}
      </el-button>
      <el-tooltip
        :disabled="(!editedSchema.isDefault && !driversAttached) || addMode"
        :content="editedSchema.isDefault ? $t('Schemas.cannot_remove_default') : $t('Schemas.cannot_remove_attached')"
        placement="top"
      >
        <span class="disabled-button">
          <el-button
            :disabled="editedSchema.isDefault || driversAttached || addMode"
            icon="el-icon-delete"
            type="danger"
            @click="removeSchema()"
          >
            {{ $t('Schemas.remove_schema') }}
          </el-button>
        </span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { deleteSchema } from '@/api/schemasApi';

import schemasActionsMixin from '../../mixins/schemasActionsMixin';

export default {
  mixins: [schemasActionsMixin],
  props: {
    form: {
      type: Object,
    },
  },
  data() {
    return {
      selectedSchema: 0,
    };
  },
  computed: {
    driversAttached() {
      return this.driversList.find((driver) => driver.settlementSchema.schemaNumber === this.editedSchema.schemaNumber)
        ? true
        : false;
    },
  },
  watch: {
    settlementsSchemas: {
      handler(schemas) {
        if (schemas.length) {
          this.selectedNumber
            ? this.loadSchema(schemas.find((schema) => schema.schemaNumber === this.selectedNumber))
            : this.loadSchema(schemas.find((schema) => schema.isDefault === true));
        }
      },
      immediate: true,
    },
  },
  methods: {
    createNewSchema() {
      const newSchema = {
        schemaNumber: this.settlementsSchemas.length + 1,
        name: 'Nowy schemat',
        contractType: 'B2B_VAT',
        monthlyContractCosts: [],
        weekBeginAt: 'MON',
        vatSplitRate: '50.00',
        isDefault: false,
        dailySettlementCost: '0.00',
        payoutRate: '100.00',
        payoutRateReference: 'INCOME',
        payoutCashIncluded: true,
        maxDailySettlementCosts1: '0.00',
        maxDailySettlementCosts2: '0.00',
        maxDailySettlementCosts3: '0.00',
        minContractIncome: '0.00',
        maxTripSettlementCost: '0.00',
        tripSettlementCost: '0.00',
        taxDeductionRate: '75.00',
        additionalCosts: [],
      };
      this.setAddMode(true);
      this.setEditedSchema(newSchema);
    },
    removeSchema() {
      this.$store.dispatch('app/toggleDataLoading', true);
      deleteSchema(this.editedSchema.schemaNumber).then((response) => {
        response.ok ? (this.deleteSuccess(), this.resetView(true)) : this.requestFailed();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.schemas__select {
  display: flex;
  flex-flow: wrap;
  & > .el-select {
    min-width: 250px;
    max-width: 700px;
    flex: 1;
  }
}
.schemas__actions {
  display: flex;
  position: absolute;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 16px;
  transform: translateX(-150%);
  z-index: 99;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.18);
  margin-left: -16px;
  padding: 16px;
  transition: 0.5s all ease-in-out;
  background: white;
  & .el-button {
    display: block;
    width: calc(100% - 32px);
    margin: 4px 0;
  }
  &.active {
    transform: none;
  }
}
.disabled-button {
  width: 100%;
}
@media screen and (min-width: 576px) {
  .schemas__actions {
    margin-top: 8px;
    .el-button {
      display: inline-block;
      margin: 0;
      width: auto;
      & + .el-button {
        margin-left: 10px;
      }
    }
  }
  .disabled-button {
    width: auto;
    margin-left: 10px;
  }
}
@media screen and (min-width: 992px) {
  .schemas__actions {
    transform: none;
    position: relative;
    display: inline-flex;
    flex-flow: nowrap;
    padding: 0;
    box-shadow: none;
    margin-left: 8px;
    flex: 1;
    margin-top: 0;
  }
}
</style>
