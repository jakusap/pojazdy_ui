<template>
  <div :class="{ large: large }" class="provider-badge">
    <SvgIcon v-if="svgProvider" :icon-class="provider.toLowerCase()" />
    <img v-else-if="large && provider === 'ORLEN'" src="../../assets/orlenLogo.png" alt="ORLEN" />
    <img v-else-if="provider === 'ORLEN'" src="../../assets/orlenLogo30.png" alt="ORLEN" />
    <img v-else-if="large && provider === 'CIRCLEK'" src="../../assets/circlekLogo.png" alt="FLOTEX" />
    <img v-else-if="provider === 'CIRCLEK'" src="../../assets/circlekLogo30.png" alt="FLOTEX" />
    <img v-else-if="large && provider === 'FREENOW'" src="../../assets/freenowLogo.png" alt="FREENOW" />
    <img v-else-if="provider === 'FREENOW'" src="../../assets/freenowLogo30.png" alt="FREENOW" />
    <img v-else-if="large && provider === 'FLOTEX'" src="../../assets/flotexLogo.png" alt="FLOTEX" />
    <img v-else-if="provider === 'FLOTEX'" src="../../assets/flotexLogo30.png" alt="FLOTEX" />
    <img v-else-if="large && provider === 'GLOVO'" src="../../assets/glovoLogo.png" alt="GLOVO" />
    <img v-else-if="provider === 'GLOVO'" src="../../assets/glovoLogo30.png" alt="GLOVO" />
    <img v-else-if="large && provider === 'STUART'" src="../../assets/stuartLogo.png" alt="STUART" />
    <img v-else-if="provider === 'STUART'" src="../../assets/stuartLogo30.png" alt="STUART" />
    <img v-else-if="large && provider === 'REVOLUT'" src="../../assets/revolutLogo.png" alt="REVOLUT" />
    <img v-else-if="provider === 'REVOLUT'" src="../../assets/revolutLogo30.png" alt="REVOLUT" />
    <img v-else-if="large && provider === 'BOLT_FOOD'" src="../../assets/boltFoodLogo.png" alt="BOLT FOOD" />
    <img v-else-if="provider === 'BOLT_FOOD'" src="../../assets/boltFoodLogo30.png" alt="BOLT FOOD" />
    <img v-else-if="large && provider === 'WOLT'" src="../../assets/woltLogo.png" alt="WOLT" />
    <img v-else-if="provider === 'WOLT'" src="../../assets/woltLogo30.png" alt="WOLT" />
    <template v-else>{{ $te(provider) ? $t(provider) : provider.toUpperCase() }}</template>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon';

export default {
  components: {
    SvgIcon,
  },
  props: {
    provider: {
      type: String,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    svgProvider() {
      if (this.provider === 'UBER' || this.provider === 'BOLT' || this.provider === 'UBER_EATS') return true;
      else return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.provider-badge {
  @include flex-center;

  min-width: 40px;
  height: 30px;

  .svg-icon {
    width: 40px;
    height: 18px;
  }

  img {
    width: 40px;
    height: 30px;
  }

  &.large {
    min-width: 100px;
    height: 75px;

    .svg-icon {
      width: 80px;
      height: 36px;
    }

    img {
      width: 100px;
      height: 75px;
    }
  }
}
</style>
