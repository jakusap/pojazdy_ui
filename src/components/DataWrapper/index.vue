<template>
  <section>
    <div class="table-wrapper">
      <div class="table-title">
        <slot name="table-header"></slot>
      </div>
      <slot name="table-body"></slot>
    </div>
    <slot name="table-footer"></slot>
  </section>
</template>

<script>
export default {
  props: {
    closable: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
