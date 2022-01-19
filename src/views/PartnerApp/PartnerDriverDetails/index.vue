<template>
  <div v-loading="viewLoading" class="driver-details">
    <div>
      <PersonalDetails />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import PersonalDetails from './components/PersonalDetails';
import driverDetailsStore from './store/driverDetailsStore';

export default {
  components: {
    PersonalDetails,
  },
  props: {
    driverUUID: {
      type: String,
    },
  },
  computed: {
    ...mapGetters('driverDetailsStore', ['viewLoading']),
  },
  beforeCreate() {
    this.$store.registerModule('driverDetailsStore', driverDetailsStore);
  },
  beforeDestroy() {
    this.$store.unregisterModule('driverDetailsStore');
  },
  async created() {
    this.setDriverUUID(this.driverUUID);
    await this.getViewInfo(this.driverUUID);
  },

  methods: {
    ...mapActions('driverDetailsStore', ['getViewInfo', 'setDriverUUID']),
  },
};
</script>

<style lang="scss">
.driver-details {
  & .card-wrapper {
    @extend .table-wrapper;
    position: relative;
    & > .card-edit {
      position: absolute;
      right: 12px;
    }
  }
}
</style>

<style lang="scss" scoped>
.driver-details {
  min-height: inherit;
  &__wrapper {
    display: flex;
    width: 100%;
  }

  >>> .settlements {
    min-height: 480px;
    &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    & .el-radio {
      transition: all 0.15s ease-in;
      &__input {
        padding-bottom: 4px;
      }
      &__inner {
        transition: all 0.15s ease-in;
      }
      &:hover {
        color: $brand-yellow;
        & .el-radio__inner {
          border: 1px $brand-yellow solid;
        }
      }
    }
    .el-col {
      margin-top: 16px;
      max-width: 100%;
    }
    &__action {
      width: 100%;
      margin-left: 0 !important;
    }
    & .change-mode {
      margin-left: 0;
      background: #ffffff;
      margin-bottom: 16px;
    }
  }

  @media screen and (min-width: 500px) {
    >>> .settlements {
      .filter-item {
        width: 180px;
      }
      &__action {
        width: 200px;
      }
    }
  }
}
.schema-info {
  margin: 16px 0;
}
</style>
