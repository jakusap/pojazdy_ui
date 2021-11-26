<template>
  <div class="modal-gateway" :class="{ large: large, invoice: invoice, slight: slight, document: document }">
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" :title="title">
      <slot />
      <slot name="footer" />
    </el-dialog>
  </div>
</template>

<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  mixins: [modalMixin],
  props: {
    title: {
      type: String,
    },
    close: {
      type: Boolean,
    },
    large: {
      type: Boolean,
      default: false,
    },
    invoice: {
      type: Boolean,
      default: false,
    },
    slight: {
      type: Boolean,
      default: false,
    },
    document: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.modal-gateway {
  &.invoice {
    .el-dialog {
      margin-top: 0 !important;
      position: fixed;
      left: 0;
      margin: 0;
      height: 100%;
    }
  }
  &.document {
    .el-dialog {
      height: 100%;
      width: 90%;
      &__body {
        height: 100%;
        width: 100%;
      }
    }
  }

  .el-dialog {
    margin-top: 2vh !important;
    overflow: auto;
    width: 100%;
    &__body {
      padding: 16px;
    }
    &__input {
      &--small {
        width: 225px;
      }
      &--large {
        width: 450px;
      }
    }
    & .el-row {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
    }
  }
  &.slight {
    .el-dialog {
      max-width: 500px;
    }
  }

  &.large {
    .el-dialog {
      min-width: 768px;
    }
  }

  @media screen and (min-width: 768px) {
    .el-dialog {
      width: 50%;
    }
    &.document {
      .el-dialog {
        height: 100%;
        width: 60%;
        &__body {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
}
.modal-list {
  display: flex;
  flex-flow: row wrap;
  margin-bottom: 8px;
  margin-left: 8px;
  span {
    margin-bottom: 4px;
    padding: 8px;
    border: 1px solid $borderColor;
    background: #f5f7fa;
    border-radius: 4px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-right: 8px;
}
</style>
