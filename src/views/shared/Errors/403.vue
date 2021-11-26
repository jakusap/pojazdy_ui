<template>
  <section class="forbbiden-section">
    <h1 class="title">{{ $t('403.title') }}</h1>
    <h3 class="description">{{ $t('403.description') }}</h3>
    <div class="action-btns-wrapper">
      <button class="back-btn" @click="getBack">{{ $t('403.back_btn') }}</button>
      <a href="/" class="home-page-link">{{ $t('403.home_page') }}</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ForbiddenPage',
  created() {
    this.$message({ type: 'error', message: this.$t('403.error_message'), center: true });
  },
  methods: {
    getBack: function() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
.forbbiden-section {
  width: 100%;
  height: 100%;
  background: var(--brand-gray-background);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .title {
    font-size: 12rem;
    margin: 64px 0;
    color: var(--brand-yellow-color);
    font-weight: bold;
    text-shadow: 4px 4px 10px #000;
  }
  .description {
    font-size: 16px;
    color: var(--brand-yellow-color);
  }
  .action-btns-wrapper {
    margin-top: 32px;
    .back-btn {
      font-size: 16px;
      border-radius: 8px;
      background: var(--gray-background);
      border: none;
      padding: 12px 20px;
      font-weight: bold;
      cursor: pointer;
      margin-right: 16px;
    }
    .home-page-link {
      font-size: 16px;
      border-radius: 8px;
      background: var(--brand-yellow-background);
      border: none;
      padding: 12px 20px;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
</style>
