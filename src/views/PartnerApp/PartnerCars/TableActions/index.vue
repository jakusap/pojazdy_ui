<template>
  <div class="table__actions">
    <div class="buttons">
      <el-button-group>
        <el-button type="primary" class="cars__action" @click="showAddCarModal()">
          {{ $t('AddCar.add_car') }}
        </el-button>
      </el-button-group>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import AddCar from '@/effects/AddCar';

export default {
  methods: {
    showAddCarModal() {
      this.$modalOn(AddCar);
    },
  },
};
</script>

<style lang="scss" scoped>
.cars {
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
  .cars {
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
