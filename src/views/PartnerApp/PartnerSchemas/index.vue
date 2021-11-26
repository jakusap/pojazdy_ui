<template>
  <div v-loading="dataLoading" class="schemas">
    <DataWrapper>
      <template slot="table-header">
        <SchemasTitle />
      </template>
      <template slot="table-body">
        <SchemaSelect :form="$refs.form" />
      </template>
    </DataWrapper>

    <DataWrapper>
      <template slot="table-body">
        <el-form
          ref="form"
          :model="editedSchema"
          :rules="schemaRules"
          :disabled="!disableActions"
          label-position="right"
        >
          <el-form-item :label="$t('Schemas.schema_name')" prop="name">
            <el-input v-model="editedSchema.name" />
          </el-form-item>
          <el-form-item :label="$t('Schemas.settlement_form')" prop="contractType" class="schemas__contract-type">
            <el-radio v-model="editedSchema.contractType" label="B2B_VAT">{{ $t('B2B_VAT') }}</el-radio>
            <el-radio v-model="editedSchema.contractType" label="B2B_NO_VAT">{{ $t('B2B_NO_VAT') }}</el-radio>
            <el-radio v-model="editedSchema.contractType" label="CIVIL_CONTRACT">
              {{ $t('CIVIL_CONTRACT') }}
            </el-radio>
          </el-form-item>

          <section v-if="editedSchema.maxDailySettlementCosts1" class="schemas__values">
            <MonthlyList
              v-show="(editedSchema.monthlyCosts && editedSchema.monthlyCosts.length) || disableActions"
              ref="monthlyList"
              :edit-mode="disableActions"
              :list-elements="editedSchema.monthlyCosts"
              @listUpdate="(e) => setMonthlyCosts(e)"
            />

            <CostList
              v-show="(editedSchema.additionalCosts && editedSchema.additionalCosts.length) || disableActions"
              ref="costList"
              :edit-mode="disableActions"
              :list-elements="editedSchema.additionalCosts"
              @listUpdate="(e) => setAdditionalCosts(e)"
            />
            <el-collapse v-model="activeNames">
              <el-collapse-item v-for="(schemaSection, idx) in schemaSections" :key="idx" :name="schemaSection.title">
                <template slot="title">
                  <h2>{{ $t(`Schemas.${schemaSection.title}`) }}</h2>
                </template>
                <el-form-item
                  v-for="(schemaElement, id) in schemaSection.schemaElements"
                  :key="id"
                  :prop="schemaElement.prop"
                  class="schemas__cost"
                >
                  <span v-if="schemaElement.prop === 'vatSplitRate'" slot="label">
                    {{ $t('Schemas.vat_split') }}
                    <el-tooltip placement="top">
                      <div slot="content">
                        {{ $t('PARTNER') }} {{ `${Number(editedSchema.vatSplitRate).toFixed(2)}%` }}
                        {{ `/` }}
                        {{ $t('driver') }}{{ ` ${Number(100 - editedSchema.vatSplitRate).toFixed(2)}%` }}
                      </div>
                      <i class="el-icon-question" />
                    </el-tooltip>
                  </span>

                  <span v-else-if="schemaElement.prop === 'payoutRate'" slot="label">
                    {{ $t(`Schemas.${schemaElement.label}`) }}
                    <el-radio
                      v-model="editedSchema.payoutRateReference"
                      :label="schemaElement.radio[0].label"
                      style="margin-left:8px"
                    >
                      {{ $t(`Schemas.${schemaElement.radio[0].text}`) }}
                    </el-radio>
                    <el-radio v-model="editedSchema.payoutRateReference" :label="schemaElement.radio[1].label">
                      {{ $t(`Schemas.${schemaElement.radio[1].text}`) }}
                    </el-radio>
                  </span>

                  <span v-else slot="label">{{ $t(`Schemas.${schemaElement.label}`) }}</span>

                  <div v-if="schemaElement.prop === 'payoutCashIncluded'">
                    <el-radio v-model="editedSchema[schemaElement.prop]" :label="schemaElement.radio[0].label">
                      {{ $t(`Schemas.${schemaElement.radio[0].text}`) }}
                    </el-radio>
                    <el-radio v-model="editedSchema[schemaElement.prop]" :label="schemaElement.radio[1].label">
                      {{ $t(`Schemas.${schemaElement.radio[1].text}`) }}
                    </el-radio>
                  </div>
                  <el-input v-else v-model="editedSchema[schemaElement.prop]" type="text">
                    <template slot="append">{{ schemaElement.append === 'currency' ? currencySymbol : `%` }}</template>
                  </el-input>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </section>
        </el-form>

        <SchemasControl :form="$refs.form" :cost-list="$refs.costList" :monthly-list="$refs.monthlyList" />
      </template>
    </DataWrapper>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { getDriversList } from '@/api/driversApi';
import DataWrapper from '@/components/DataWrapper';
import { validateNumber, validateValue } from '@/validators';

import CostList from './components/CostList';
import MonthlyList from './components/MonthlyList';
import SchemasControl from './components/SchemasControl';
import SchemaSelect from './components/SchemaSelect';
import SchemasTitle from './components/SchemasTitle';
import schemaRules from './mixins/schemaRules';
import schemasViewStore from './schemasViewStore';

export default {
  components: {
    DataWrapper,
    SchemasTitle,
    SchemaSelect,
    SchemasControl,
    MonthlyList,
    CostList,
  },
  mixins: [schemaRules],
  data() {
    return {
      activeNames: [],
    };
  },
  computed: {
    ...mapGetters(['dataLoading']),
    ...mapGetters('schemasViewStore', ['editedSchema', 'addMode', 'editMode']),
    ...mapGetters('app', ['currencySymbol']),
    disableActions() {
      return this.addMode || this.editMode;
    },
  },
  watch: {
    addMode(value) {
      if (value) {
        this.activeNames = ['transfers', 'payout', 'taxes', 'trip_fees', 'daily_fees'];
      }
    },
    editMode(value) {
      if (value) {
        this.activeNames = ['transfers', 'payout', 'taxes', 'trip_fees', 'daily_fees'];
      }
    },
  },
  beforeCreate() {
    this.$store.registerModule('schemasViewStore', schemasViewStore);
  },
  destroyed() {
    this.$store.unregisterModule('schemasViewStore', schemasViewStore);
  },
  async created() {
    await this.fetchDriversList();
  },
  methods: {
    ...mapActions('app', ['toggleDataLoading']),
    ...mapActions('schemasViewStore', ['setAdditionalCosts', 'setMonthlyCosts', 'loadDriversList']),

    async fetchDriversList() {
      this.toggleDataLoading(true);
      await getDriversList()
        .then((response) => {
          if (response.ok) {
            this.loadDriversList(response.data);
          } else {
            this.$message({
              type: 'error',
              message: this.$t('loading_drivers_error'),
              center: true,
            });
          }
        })
        .finally(() => {
          this.toggleDataLoading(false);
        });
    },
  },
};
</script>
<style lang="scss">
.el-collapse-item__content {
  padding-bottom: 0;
}
.schemas__contract-type {
  .el-form-item {
    margin: 0;
  }
}
.schemas__values {
  .el-form-item {
    padding-top: 8px;
    margin: 0;
    padding-bottom: 16px;
    &__error {
      padding-top: 2px !important;
    }
    &__label {
      text-align: center !important;
      grid-column-start: 1;
      grid-row-start: 1;
    }
    &__content {
      text-align: center !important;
      grid-row-start: 2;
      grid-column-start: 1;
    }
  }
}
.schemas__cost,
.schemas__vat {
  & .el-input__inner {
    text-align: center;
  }
}
@media screen and (min-width: 768px) {
  .schemas__values {
    .el-form-item {
      &__label {
        text-align: left !important;
        grid-column-start: 1;
        grid-row-start: 1;
      }
      &__content {
        grid-row-start: 1;
        grid-column-start: 2;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.el-input {
  max-width: 500px;
}
h2 {
  font-size: 22px;
}
.schemas {
  height: 100%;
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__cost {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
    &:not(:last-of-type) {
      border-bottom: 1px solid #dfe4ed;
    }
  }
  &__vat {
    & .el-input {
      width: 150px;
      margin-bottom: 8px;
    }
  }
  &__vat-info {
    display: inline-flex;
    color: #606266;
    background: rgba($brand-gray, 0.15);
    border: 1px solid #dfe4ed;
    font-weight: bold;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 14px;
  }
}
@media screen and (min-width: 768px) {
  .schemas__cost {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
