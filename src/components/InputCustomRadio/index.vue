<template>
  <div :class="['input-custom-radio-wrapper', customClass, { 'dark-theme': darkTheme }]">
    <el-form-item :prop="name" class="form-item">
      <el-radio-group :disabled="disabled" :value="value" @input="handleChange">
        <el-radio v-for="(option, idx) in options" :key="idx" :label="option.value" :border="border">
          {{ option.label }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'InputCustomRadio',
  props: {
    name: String,
    label: String,
    tabindex: String,
    customClass: String,
    value: [String, Number, Boolean],
    border: Boolean,
    darkTheme: Boolean,
    disabled: Boolean,
    modelValue: [String, Number, Boolean, Array, Object],
    options: {
      type: Array,
      default: () => [],
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
.input-custom-radio-wrapper {
  width: 100%;
  .form-item {
    margin: 0px;

    &.is-error {
      border: 1px solid var(--red-border);
    }

    .el-radio-group {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .el-radio {
        border-radius: 8px;
        color: var(--brand-gray-color);
        height: 50px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0 11px 22px 11px;
        flex: 1;

        &.is-bordered {
          padding: 9px 20px 9px 10px;
          margin: 0 11px 22px 11px;
          background: var(--light-gray-background);
          border: 1px solid var(--gray-border);
          &:hover {
            border: 1px solid rgba(79, 87, 138, 1);
          }
        }

        &.is-checked {
          .el-radio__label {
            color: var(--brand-yellow-color);
          }
        }

        .el-radio__input {
          .el-radio__inner {
            background: var(--white-background-disabled);
            border-color: var(--white-border);
            &::after {
              background: var(--brand-gray-background);
            }
          }

          &.is-checked {
            .el-radio__inner {
              background: var(--brand-yellow-background-active);
              border-color: var(--brand-yellow-border-active);
              &::after {
                background: var(--white-border-active);
              }
            }
          }
        }
      }
    }
  }

  &.dark-theme {
    .form-item {
      margin: 0px;
      .el-radio-group {
        .el-radio {
          color: var(--gray-color);
          &.is-bordered {
            background: rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            &:hover {
              border: 1px solid rgba(79, 87, 138, 1);
            }
          }
          .el-radio__input {
            .el-radio__inner {
              &::after {
                background: var(--brand-gray-background);
              }
            }
          }
        }
      }
    }
  }
}
</style>
