<template>
  <span v-if="limit">
    <el-popover trigger="hover" placement="right">
      <span>
        {{ $t('LimitStatus.available_settlements') }} <b>{{ limit }}</b>
      </span>
      <i slot="reference" class="el-icon-success icon-success" />
    </el-popover>
  </span>
  <span v-else>
    <el-popover trigger="hover" placement="right">
      <span>
        {{ $t('LimitStatus.limit_used') }}
      </span>
      <i slot="reference" class="el-icon-warning icon-warning" />
    </el-popover>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters('partnerProfile', ['settlementsLimits']),
    limit() {
      return this.settlementsLimits.limit - this.settlementsLimits.usage;
    },
  },
};
</script>

<style lang="scss" scoped></style>
