<template>
  <div class="">
    <h1 class="drivers__title">
      {{ $t('Drivers.drivers_title') }}
      <el-button v-if="mobile" size="mini" type="info" @click="showSettings()">
        <i class="el-icon-setting" />
      </el-button>
    </h1>
    <div id="settings" class="table__settings">
      <el-input v-model="filters.driver" :placeholder="$t('driver')" clearable class="drivers__filter-item" />
      <el-input
        v-model="filters.email"
        :placeholder="$t('DocumentsWizard.formLabels.email_address')"
        clearable
        class="drivers__filter-item"
      />
      <el-input
        v-model="filters.phoneNumber"
        :placeholder="$t('DocumentsWizard.formLabels.phone_number')"
        clearable
        class="drivers__filter-item"
      />
<!--      <el-select-->
<!--        v-model="filters.schemaNumbers"-->
<!--        :placeholder="$t('all_schemas')"-->
<!--        class="drivers__filter-item"-->
<!--        multiple-->
<!--        filterable-->
<!--      >-->
<!--        <el-option-->
<!--          v-for="schema in settlementsSchemas"-->
<!--          :key="schema.schemaNumber"-->
<!--          :label="schema.name"-->
<!--          :value="schema.schemaNumber"-->
<!--        >-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--      <el-select v-model="filters.profile" class="drivers__filter-item">-->
<!--        <el-option :value="null" :label="$t('all_profiles')"></el-option>-->
<!--        <el-option :label="$t('linked')" value="LINKED"></el-option>-->
<!--        <el-option :label="$t('not_linked')" value="NOT_LINKED"></el-option>-->
<!--      </el-select>-->

<!--      <el-select v-model="filters.active" class="drivers__filter-item">-->
<!--        <el-option :value="null" :label="$t('Drivers.all')"></el-option>-->
<!--        <el-option value="ACTIVE" :label="$t('Drivers.active_filter')"></el-option>-->
<!--        <el-option value="INACTIVE" :label="$t('Drivers.inactive_filter')"></el-option>-->
<!--      </el-select>-->

<!--      <el-select-->
<!--        v-model="extendedFilters.provider"-->
<!--        :placeholder="$t('all_providers')"-->
<!--        clearable-->
<!--        class="drivers__filter-item"-->
<!--        @input="getDriversList"-->
<!--      >-->
<!--        <el-option-->
<!--          v-for="(provider, id) in supportedProviders"-->
<!--          :key="id"-->
<!--          :value="provider.value"-->
<!--          :label="provider.label"-->
<!--        />-->
<!--      </el-select>-->
<!--      <el-input-->
<!--        v-model="extendedFilters.identifier"-->
<!--        :placeholder="$t('iban')"-->
<!--        clearable-->
<!--        class="drivers__filter-item"-->
<!--        @input="getDriversList"-->
<!--      />-->
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
export default {
  props: {
    filters: {
      type: Object,
    },
    extendedFilters: {
      type: Object,
    },
    getFilteredDrivers: {
      type: Function,
    },
  },
  data: function() {
    return {
      supportedProviders: [
        {
          value: 'UBER',
          label: 'Uber',
        },
        {
          value: 'UBER_EATS',
          label: 'Uber Eats',
        },
        {
          value: 'BOLT',
          label: 'Bolt',
        },
        {
          value: 'ORLEN',
          label: 'Orlen',
        },
        {
          value: 'FLOTEX',
          label: 'Flotex',
        },
        {
          value: 'CIRCLEK',
          label: 'Circle K',
        },
        {
          value: 'FREENOW',
          label: 'Free Now',
        },
        {
          value: 'GLOVO',
          label: 'Glovo',
        },
        {
          value: 'STUART',
          label: 'Stuart',
        },
        {
          value: 'REVOLUT',
          label: 'Revolut',
        },
        {
          value: 'BOLT_FOOD',
          label: 'Bolt Food',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['settlementsSchemas']),
  },
  methods: {
    showSettings() {
      document.getElementById('settings').classList.toggle('active');
    },
    getDriversList: _.debounce(function() {
      this.getFilteredDrivers();
    }, 1000),
  },
};
</script>

<style lang="scss" scoped>
.drivers {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__filter-item {
    width: 100%;
  }
}
@media screen and (min-width: 576px) {
  .drivers {
    &__filter-item {
      width: 180px;
    }
  }
}
</style>
