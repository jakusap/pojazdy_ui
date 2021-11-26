<template>
  <div v-if="!editMode">
    <div class="provider-identifier">
      <div class="provider-identifier__text">
        <ProviderBadge v-if="badgeAvailable" :provider="identifier.provider" />
        <span v-else>{{ identifier.provider }}</span>
        <code class="provider-identifier__id">{{ identifier.id || '-' }}</code>
      </div>
    </div>
  </div>

  <div v-else>
    <div class="provider-identifier active">
      <el-button
        :circle="true"
        type="danger"
        size="mini"
        class="provider-identifier__remove"
        icon="el-icon-close"
        @click="$emit('remove-identifier', { idx: idx })"
      >
      </el-button>

      <el-select v-if="identifier.new" v-model="identifier.provider" class="provider-identifier__text">
        <el-option
          v-for="(provider, id) in supportedProviders"
          :key="id"
          :value="provider.value"
          :label="provider.label"
        />
      </el-select>

      <div v-else>
        <div class="provider-identifier__text">
          <ProviderBadge v-if="badgeAvailable" :provider="identifier.provider" />
          <span v-else>{{ identifier.provider }}</span>
        </div>
      </div>
      <el-form-item prop="id">
        <el-input
          v-model="identifier.id"
          :placeholder="$t('DriverDetails.info_iban')"
          class="provider-identifier__id"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script>
import ProviderBadge from '@/components/ProviderBadge';

export default {
  components: {
    ProviderBadge,
  },
  props: {
    identifier: {
      type: Object,
      required: true,
    },
    idx: {
      type: Number,
      default: 0,
    },
    editMode: {
      type: Boolean,
    },
  },
  data() {
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
    badgeAvailable() {
      return [
        'ORLEN',
        'BOLT',
        'UBER',
        'FLOTEX',
        'CIRCLEK',
        'FREENOW',
        'UBER_EATS',
        'GLOVO',
        'STUART',
        'REVOLUT',
        'BOLT_FOOD',
      ].includes(this.identifier.provider);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  flex: 3;
  margin-right: 8px;
  margin-bottom: 16px;
}
.el-select {
  flex: 1;
}
.provider-identifier {
  display: flex;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid $brand-gray;
  background: whitesmoke;
  border-radius: 4px;
  position: relative;
  &.active {
    align-items: center;
    justify-content: center;
    background: white;
    .provider-identifier__text {
      margin-bottom: 16px;
    }
  }
  &__remove {
    height: 20px;
    width: 20px;
    position: absolute;
    right: -10px;
    bottom: calc(100% - 10px);
    z-index: 99;
    font-size: 14px;
    padding: 0;
    & > i {
      font-weight: bold;
    }
  }
  &__text {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__id {
    margin-left: 8px;
  }
}
</style>
