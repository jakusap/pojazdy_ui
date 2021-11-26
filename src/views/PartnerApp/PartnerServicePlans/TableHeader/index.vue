<template>
  <div class="">
    <h1 class="cars__title">
      {{ $t('ServicePlans.servicePlans_title') }}
      <el-button v-if="mobile" size="mini" type="info" @click="showSettings()">
        <i class="el-icon-setting" />
      </el-button>
    </h1>
    <div id="settings" class="table__settings">
      <el-input
        v-model="filters.servicePlanName"
        :placeholder="$t('DocumentsWizard.formLabels.servicePlan_name')"
        clearable
        class="cars__filter-item"
      />
      <el-input
        v-model="filters.servicePlanMakeModel"
        :placeholder="$t('DocumentsWizard.formLabels.make_model')"
        clearable
        class="cars__filter-item"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filters: {
      type: Object,
    },
  },
  methods: {
    showSettings() {
      document.getElementById('settings').classList.toggle('active');
    },
  },
};
</script>

<style lang="scss" scoped>
.cars {
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__filter-item {
    width: 100%;
  }
}
@media screen and (min-width: 576px) {
  .cars {
    &__filter-item {
      width: 180px;
    }
  }
}
</style>
