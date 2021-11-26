<template>
  <ModalGateway :title="$t('ImportInformations.title')" :close="close">
    <el-form>
      <div class="el-row">
        <el-form-item :label="$t('ImportInformations.file_type')">
          <el-select v-model="currentProvider">
            <el-option
              v-for="provider in providersInFiles"
              :key="provider"
              :label="getProviderLabel(provider)"
              :value="provider"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <table v-if="dataIsReady" style="width:100%;">
      <tr>
        <th>{{ $t('ImportInformations.drivers') }}</th>
      </tr>
      <tr>
        <td>{{ $t('ImportInformations.drivers_all') }}</td>
        <td>{{ stats.allDrivers }}</td>
      </tr>
      <tr
        v-if="
          currentProvider === 'UBER' ||
            currentProvider === 'BOLT' ||
            currentProvider === 'FREENOW' ||
            currentProvider === 'GLOVO' ||
            currentProvider === 'STUART' ||
            currentProvider === 'BOLT_FOOD'
        "
      >
        <td>{{ $t('ImportInformations.drivers_new') }}</td>
        <td>{{ stats.newDrivers }}</td>
      </tr>
      <tr v-if="currentProvider === 'ORLEN' || currentProvider === 'FLOTEX' || currentProvider === 'CIRCLEK'">
        <td>{{ $t('ImportInformations.drivers_nonassigned') }}</td>
        <td>
          {{ stats.nonAssignedDrivers }}
          <el-tooltip v-if="stats.nonAssignedDrivers > 0" placement="top">
            <div slot="content">
              {{ $t('ImportInformations.drivers_nonassigned_description') }}
            </div>
            <i class="el-tooltip el-icon-warning icon-warning" />
          </el-tooltip>
        </td>
      </tr>
    </table>

    <table v-if="dataIsReady" style="width:100%">
      <tr>
        <th>{{ $t('ImportInformations.transactions') }}</th>
      </tr>
      <tr>
        <td>{{ $t('ImportInformations.transactions_all') }}</td>
        <td>{{ stats.allTransactions }}</td>
      </tr>
      <tr>
        <td>{{ $t('ImportInformations.transactions_new') }}</td>
        <td>{{ stats.newTransactions }}</td>
      </tr>
      <tr>
        <td>{{ $t('ImportInformations.transactions_old') }}</td>
        <td>{{ stats.oldTransactions }}</td>
      </tr>
      <tr v-if="currentProvider === 'ORLEN' || currentProvider === 'FLOTEX' || currentProvider === 'CIRCLEK'">
        <td>{{ $t('ImportInformations.transactions_nonadded') }}</td>
        <td>
          {{ stats.nonAddedTransactions }}
          <el-tooltip v-if="stats.nonAddedTransactions > 0" placement="top">
            <div slot="content">
              {{ $t('ImportInformations.transactions_nonadded_description') }}
            </div>
            <i class="el-tooltip el-icon-question" />
          </el-tooltip>
        </td>
      </tr>
    </table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close = true">{{ $t('ImportInformations.close') }}</el-button>
    </span>
  </ModalGateway>
</template>

<script>
import ModalGateway from '@/modals/ModalGateway';
export default {
  components: {
    ModalGateway,
  },
  props: {
    informations: {
      type: Array,
    },
  },
  data() {
    return {
      close: false,
      currentProvider: null,
      dataIsReady: false,
    };
  },
  computed: {
    stats() {
      return this.informations.find((x) => x.provider === this.currentProvider);
    },
    providersInFiles() {
      return this.informations.map((x) => x.provider).sort();
    },
  },
  mounted() {
    this.currentProvider = this.providersInFiles[0];
    this.dataIsReady = true;
  },
  methods: {
    getProviderLabel(provider) {
      switch (provider) {
        case 'UBER':
          return 'Uber';
        case 'BOLT':
          return 'Bolt';
        case 'ORLEN':
          return 'Orlen';
        case 'FLOTEX':
          return 'Flotex';
        case 'CIRCLEK':
          return 'Circle K';
        case 'FREENOW':
          return 'Free Now';
        case 'GLOVO':
          return 'Glovo';
        case 'STUART':
          return 'Stuart';
        case 'BOLT_FOOD':
          return 'Bolt Food';
      }
      return null;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-form-item {
  width: 100%;
  margin: 0;
  + .el-form-item {
    padding-left: 8px;
  }
  &__label {
    text-align: left;
  }
}
tr {
  text-align: left;
}
td:first-child {
  width: 20%;
}
</style>
