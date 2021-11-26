<template>
  <div class="merging-driver__wrapper">
    <div class="merging-driver">
      <div class="merging-driver__data">
        <i class="el-icon-user" />
        <span class="merging-driver__field">
          {{ driver.firstName }}
          {{ driver.lastName }}
        </span>
      </div>
      <div class="merging-driver__data">
        <i class="el-icon-message" />
        <span class="merging-driver__field">
          {{ driver.email || '-' }}
        </span>
      </div>
      <div class="merging-driver__data">
        <i class="el-icon-phone"></i>
        <span class="merging-driver__field">
          {{ driver.phoneNumber || '-' }}
        </span>
      </div>
      <div class="merging-driver__data">
        <span>{{ $t('IBAN') }} </span>
        <span class="merging-driver__field">
          {{ driver.iban || ' -' }}
        </span>
      </div>
      <div class="merging-driver__data">
        <span>{{ $t('Drivers.link_status') }} </span>
        <span class="merging-driver__link-status">
          <el-tooltip v-if="driver.linkStatus && !driver.linkStatus.blocked" placement="top">
            <span slot="content">
              {{ $t('has_profile') }}
            </span>
            <i class="el-icon-success icon-success" />
          </el-tooltip>
          <el-tooltip v-else-if="driver.linkStatus && driver.linkStatus.blocked" placement="top">
            <span slot="content">
              {{ $t('blocked_profile') }}
            </span>
            <i class="el-icon-warning icon-warning" />
          </el-tooltip>
          <el-tooltip v-else placement="top">
            <span slot="content">
              {{ $t('no_profile') }}
            </span>
            <i class="el-icon-error icon-warning" />
          </el-tooltip>
        </span>
      </div>
      <ul>
        <li v-for="(identifier, idx) in driver.identifiers" :key="idx" class="merging-driver__data">
          <ProviderBadge :provider="identifier.provider" />
          <span class="merging-driver__field">
            {{ identifier.id }}
          </span>
        </li>
      </ul>
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
    driver: {
      type: Object,
    },
    resultDriver: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.merging-driver {
  &__wrapper {
    flex: 1;
    padding: 4px;
  }
  border: 1px solid var(--dirty-white-border);
  border-radius: 8px;
  height: 100%;
  &__data {
    display: flex;
    align-items: center;
    font-size: 16px;
    padding: 8px;
  }
  &__field {
    flex: 1;
    padding: 4px;
    border-radius: 4px;
    margin-left: 8px;
    background: $subMenuActiveText;
    border: 1px solid var(--dirty-white-border);
  }
  &__link-status {
    margin-left: 8px;
  }
  ul {
    padding: 0;
    list-style: none;
    li {
      display: flex;
      padding: 4px;
      & span {
        margin-left: 8px;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
