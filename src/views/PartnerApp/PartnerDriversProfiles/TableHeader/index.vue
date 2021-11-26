<template>
  <div class="">
    <h1 class="linked-drivers__title">
      <span>
        {{ $t('DriversProfiles.title') }}
      </span>
      <el-button v-if="mobile" size="mini" type="info" @click="showSettings()">
        <i class="el-icon-setting" />
      </el-button>
    </h1>
    <div id="settings" class="table__settings">
      <el-radio v-model="filters.linkType" label="EMAIL">
        {{ $t('DriversProfiles.email') }}
      </el-radio>
      <el-radio v-model="filters.linkType" label="UUID">
        {{ $t('DriversProfiles.uuid') }}
      </el-radio>
      <el-radio v-model="filters.linkType" label="BLOCKED">
        {{ $t('DriversProfiles.blocked') }}
      </el-radio>
    </div>
    <div>
      <el-input
        v-model="filters.driver"
        :placeholder="$t('driver')"
        class="linked-drivers__filter-item"
        clearable
      ></el-input>
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
.linked-drivers {
  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span {
      margin-right: 0px;
    }
  }
  &__filter-item {
    width: 100%;
  }
}
.table__settings {
  display: flex;
  flex-flow: column;
  .el-radio {
    padding: 16px;
  }
}
@media screen and (min-width: 992px) {
  .linked-drivers {
    &__title {
      display: flex;
      align-items: center;
      justify-content: initial;
      & > span {
        margin-right: 16px;
      }
    }
    &__filter-item {
      width: 350px;
    }
  }
  .table__settings {
    display: flex;
    align-items: center;
    flex-flow: row;
    margin: 16px 0;
    .el-radio {
      padding: 0;
    }
  }
}
</style>
