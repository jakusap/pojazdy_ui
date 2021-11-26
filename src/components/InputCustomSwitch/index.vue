<template>
  <div :class="['input-custom-switch-wrapper', customClass, { 'dark-theme': darkTheme }]">
    <el-form-item :prop="name" class="form-item">
      <el-switch
        :value="value"
        :active-text="activeText"
        :inactive-text="inactiveText"
        :disabled="disabled"
        @change="handleChange"
      ></el-switch>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'InputCustomSwitch',
  props: {
    name: String,
    label: String,
    tabindex: String,
    customClass: String,
    value: Boolean,
    disabled: Boolean,
    activeText: String,
    inactiveText: String,
    darkTheme: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleChange: function(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss">
.input-custom-switch-wrapper {
  .form-item {
    margin: 0px;

    &.is-error {
      border: 1px solid var(--red-border);
    }

    .el-switch {
      margin: 0px 11px 22px 11px;

      .el-switch__core {
        background: var(--brand-gray-background);
        border: 1px solid var(--brand-gray-border);

        &::after {
          background: var(--light-gray-background);
        }
      }

      .el-switch__label {
        color: var(--brand-gray-color);
      }

      &.is-checked {
        .el-switch__core {
          background: var(--brand-yellow-background);
          border: 1px solid var(--brand-yellow-border);

          &::after {
            background: var(--brand-gray-background);
          }
        }

        .el-switch__label {
          color: var(--brand-gray-color);
          &.is-active {
            color: var(--brand-yellow-color);
          }
        }
      }
    }
  }

  &.dark-theme {
    .form-item {
      .el-switch {
        .el-switch__core {
          background: var(--brand-gray-background);
          border: 1px solid rgba(255, 255, 255, 0.1);

          &::after {
            background: var(--light-gray-background);
          }
        }

        .el-switch__label {
          color: var(--light-gray-color);
        }

        &.is-checked {
          .el-switch__core {
            background: var(--brand-yellow-background);

            &::after {
              background: var(--brand-gray-background);
            }
          }

          .el-switch__label {
            &.is-active {
              color: var(--brand-yellow-color);
            }
          }
        }
      }
    }
  }
}
</style>
