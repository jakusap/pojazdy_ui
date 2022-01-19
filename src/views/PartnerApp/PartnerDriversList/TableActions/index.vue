<template>
  <div class="table__actions">
    <div class="buttons">
      <el-button-group>
        <el-button type="primary" class="drivers__action" @click="showAddDriverModal()">
          {{ $t('Drivers.drivers_add') }}
        </el-button>
      </el-button-group>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import AddDriver from '@/effects/AddDriver';

export default {
  props: {
    selectedDrivers: {
      type: Array,
    },
  },
  methods: {
    showAddDriverModal() {
      this.$modalOn(AddDriver);
    },
  },
};
</script>

<style lang="scss" scoped>
.drivers {
  .buttons {
    display: flex;
    justify-content: center;
    flex-flow: wrap;
    width: 100% !important;
    .el-button-group {
      width: 100%;
    }
  }
  &__action {
    width: 100%;
    margin-left: 0 !important;
  }
}
@media screen and (min-width: 576px) {
  .drivers {
    .buttons {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100% !important;
      .el-button-group {
        width: auto;
      }
      & .el-button {
        min-width: 180px;
        max-width: 200px;
      }
      & .pagination {
        flex: 1;
        min-width: 200px;
        text-align: right;
      }
    }
    &__action {
      width: 200px;
    }
  }
}
</style>
