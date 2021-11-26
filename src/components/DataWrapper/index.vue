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
  <!-- <DataWrapper>
  <template slot="table-header"></template>
  <template slot="table-body"></template>
  <template slot="table-footer"></template>
  </DataWrapper> -->
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
