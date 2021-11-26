<template>
  <div v-loading="viewLoading" class="driver-details">
<!--    <el-row :gutter="16">-->
<!--      <el-col :sm="12">-->
    <div>
      <PersonalDetails />
<!--          <ProfileStatus />-->
    </div>
<!--      </el-col>-->
<!--      <el-col v-if="!viewLoading" :sm="12">-->
<!--        <Identifiers />-->
<!--        <SchemaInfo />-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row> </el-row>-->
<!--    <el-row>-->
<!--      <SentMessages />-->
<!--    </el-row>-->
<!--    <el-row class="settlements">-->
<!--      <Settlements />-->
<!--    </el-row>-->
<!--    <el-row> <SignedContracts /> </el-row>-->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import Identifiers from './components/Identifiers';
import PersonalDetails from './components/PersonalDetails';
import ProfileStatus from './components/ProfileStatus';
import SchemaInfo from './components/SchemaInfo';
import SentMessages from './components/SentMessages';
import Settlements from './components/Settlements';
import SignedContracts from './components/SignedContracts';
import driverDetailsStore from './store/driverDetailsStore';

export default {
  components: {
    SignedContracts,
    Settlements,
    PersonalDetails,
    Identifiers,
    ProfileStatus,
    SchemaInfo,
    SentMessages,
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
