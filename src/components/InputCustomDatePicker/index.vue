<template>
  <div :class="['input-custom-wrapper', customClass, { 'dark-theme': darkTheme }]">
    <el-form-item :prop="name" class="form-item">
      <span v-if="iconName" class="svg-container">
        <i :class="`el-icon-${iconName}`"></i>
      </span>
      <el-date-picker
        :ref="reference"
        :value="value"
        type="date"
        :placeholder="placeholder"
        :name="name"
        :tabindex="tabindex"
        :disabled="disabled"
        class="input"
        auto-complete="on"
        @input="handleInput"
      ></el-date-picker>
      <el-tooltip v-if="tooltip" class="tooltip" effect="dark" :content="tooltip" placement="top-end">
        <span><i class="el-icon-info "></i></span>
      </el-tooltip>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'InputCustomDatePicker',
  props: {
    name: String,
    iconName: String,
    reference: String,
    label: String,
    tabindex: String,
    tooltip: String,
    type: {
      type: String,
      default: 'text',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    darkTheme: {
      type: Boolean,
      default: false,
    },
    customClass: String,
    value: [String, Object, Number, Boolean, Array, Date],
  },
  methods: {
    handleInput: function(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss">
.input-custom-wrapper {
  margin: 0 11px 22px 11px;
  min-width: 250px - 22px;
  flex: 1;

  .form-item {
    border: 1px solid var(--gray-border);
    background: var(--light-gray-background);
    border-radius: 8px;
    color: var(--brand-gray-color);
    height: 50px;
    margin: 0px;

    &:hover {
      border: 1px solid var(--light-blue-border-hover);
    }

    &.is-error {
      border: 1px solid var(--red-border);
    }

    .el-form-item__content {
      display: flex;
    }

    .svg-container {
      padding: 0px 5px 0px 15px;
      color: var(--gray-color);
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      display: flex;
      align-items: center;
    }

    .input {
      display: inline-block;
      height: 50px;
      flex: 1;

      .el-input__inner {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: var(--brand-gray-color);
        height: 50px;
        caret-color: var(--brand-gray-color);

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px var(--brand-gray-color) inset !important;
          -webkit-text-fill-color: var(--white-color) !important;
        }

        &::placeholder {
          color: var(--gray-color);
        }
      }

      .el-input__prefix {
        display: none;
      }

      .el-input__suffix {
        display: none;
      }
    }

    .tooltip {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 8px;
      outline: none;

      &:hover {
        i {
          color: var(--brand-gray-color-hover);
        }
      }

      i {
        font-size: 18px;
        color: var(--gray-color);
        transition: 0.2s all ease-in-out;
      }
    }
  }

  &.dark-theme {
    .form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      color: var(--brand-gray-color);
      .svg-container {
        color: var(--dark-gray-color);
      }
      .input {
        .el-input__inner {
          caret-color: var(--white-color);
          color: var(--gray-color);
          &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px var(--brand-gray-color) inset !important;
            -webkit-text-fill-color: var(--white-color) !important;
          }
          &::placeholder {
            color: var(--gray-color);
          }
        }
      }
    }
  }
}
</style>
