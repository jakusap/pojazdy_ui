<template>
  <div class="not-found">
    <div class="not-found__background">
      <p>
        {{ $t('404.info') }}
      </p>
    </div>
    <div class="not-found__action">
      <a class="return-button" href="/">{{ $t('404.return_home') }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundPage',
};
</script>

<style lang="scss" scoped>
.not-found {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
}
.not-found__background {
  flex: 0.7;
  background: var(--brand-yellow-background);
  box-shadow: var(--box-shadow-medium);
  @include flex-center;
  p {
    padding: 32px;
    font-size: 26px;
    text-align: center;
    line-height: 44px;
    font-weight: bold;
    max-width: 450px;
  }
}
.not-found__action {
  flex: 0.3;
  background: var(--brand-gray-background);
  @include flex-center;
}
.return-button {
  background: var(--brand-yellow-background);
  padding: 16px;
  border-radius: 16px;
  color: var(--brand-gray-color);
  transition: 0.2s linear all;
  box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.15);
  font-weight: bold;
  &:hover {
    background: var(--brand-gray-background);
    color: var(--brand-yellow-color);
  }
}
</style>
