<template>
  <router-view :height="height" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import settlementsViewStore from './settlementsViewStore';
export default {
  name: 'PartnerSettlements',
  props: {
    status: {
      type: String,
    },
    height: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters('settlementsViewStore', ['radio']),
  },
  beforeCreate() {
    this.$store.registerModule('settlementsViewStore', settlementsViewStore);
  },
  created() {
    if (this.$route.name === 'PendingSettlements') {
      this.changeView('pendingSettlements');
    }
    if (this.$route.name === 'SettledSettlements') {
      this.changeView('settledSettlements');
    }
    if (this.$route.name === 'PaidSettlements') {
      this.changeView('paidSettlements');
    }
  },
  destroyed() {
    this.$store.unregisterModule('settlementsViewStore');
  },
  methods: {
    ...mapActions('settlementsViewStore', ['changeView']),
  },
};
</script>
<style lang="scss">
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.settlements {
  & .filter-item {
    &--period {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 8px;
      & > .el-select {
        flex: 1;
      }
    }
  }
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0 16px 0;
    height: 40px;
    & .el-radio {
      transition: all 0.15s ease-in;
      &__label {
        font-size: 20px;
      }
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
  }

  &__action {
    width: 100%;
    margin-left: 0 !important;
  }
  .buttons {
    display: flex;
    justify-content: center;
    flex-flow: wrap;
    width: 100% !important;
  }
}

@media screen and (min-width: 576px) {
  .settlements {
    &__action {
      width: 200px;
    }
    .buttons {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100% !important;
      & > .el-button {
        min-width: 180px;
        max-width: 180px;
      }
      & > .pagination {
        flex: 1;
        min-width: 200px;
        text-align: right;
      }
    }
  }
}
@media screen and (min-width: 992px) {
  .settlements {
    & .filter-item {
      width: auto;
      &.reset {
        width: 120px !important;
      }
    }
  }
}
</style>
