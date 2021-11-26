<template>
  <section class="driver-statistics-section">
    <h1 class="driver-statistics-title">{{ $t('DriverStats.title') }}</h1>
  </section>
</template>

<script>
export default {
  name: 'DriverStats',
};
</script>

<style lang="scss" scoped>
.driver-statistics-section {
  min-height: 400px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0.25;
    background-image: url('../../../assets/stats.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  .driver-statistics-title {
    text-align: center;
    position: relative;
    font-size: 42px;
    color: var(--brand-gray-color);
  }
}
</style>
