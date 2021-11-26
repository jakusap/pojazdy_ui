<template>
  <h1 class="settlements__title">
    <div v-if="mobile" class="title-settings">
      {{ $t('settled_settlements') }}
      <el-button size="mini" type="info" @click="showSettings()">
        <i class="el-icon-setting" />
      </el-button>
    </div>
    <div v-else class="change-mode">
      <ViewSelector :view="radio" @change-view="(e) => (radio = e)" />
    </div>
  </h1>
</template>

<script>
import tableTitleMixin from '../../mixins/tableTitleMixin';

export default {
  mixins: [tableTitleMixin],

  data() {
    return {
      radio: 'settledSettlements',
    };
  },
};
</script>

<style lang="scss" scoped>
.title-settings {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
