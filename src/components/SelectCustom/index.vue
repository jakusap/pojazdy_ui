<template>
  <div :class="['select-custom-wrapper', customClass, { 'dark-theme': darkTheme }]">
    <el-form-item :ref="name" :prop="name" class="form-item">
      <span v-if="iconName" class="svg-container">
        <i :class="`el-icon-${iconName}`"></i>
      </span>
      <el-select
        :value="value"
        :multiple="multiple"
        :clearable="clearable"
        :filterable="filterable"
        :placeholder="placeholder"
        :allow-create="allowCreate"
        :collapse-tags="collapseTags"
        :remote-method="remoteMethod"
        :remote="remote"
        :popper-class="darkMode"
        :disabled="disabled"
        :loading="loading"
        default-first-option
        class="select-input"
        @input="handleChange"
      >
        <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <el-tooltip v-if="tooltip" class="tooltip" effect="dark" :content="tooltip" placement="top-end">
        <span><i class="el-icon-info "></i></span>
      </el-tooltip>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'SelectCustom',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    name: String,
    iconName: String,
    reference: String,
    label: String,
    tabindex: String,
    multiple: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    collapseTags: Boolean,
    disabled: Boolean,
    tooltip: String,
    remoteMethod: Function,
    onSelectOption: {
      type: Function,
      default: () => null,
    },
    remote: Boolean,
    darkTheme: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    customClass: String,
    value: [String, Object, Number, Boolean, Array, Date],
  },
  computed: {
    darkMode: function() {
      return this.darkTheme ? 'dark-theme' : '';
    },
  },
  methods: {
    handleChange: function(value) {
      this.$emit('input', value);
      this.onSelectOption(value);
    },
  },
};
</script>

<style lang="scss">
.select-custom-wrapper {
  margin: 0 11px 22px 11px;
  flex: 1;

  .form-item {
    border: 1px solid var(--gray-border);
    background: var(--light-gray-background);
    border-radius: 8px;
    color: var(--brand-gray-color);
    min-height: 50px;
    margin: 0px;

    &:hover {
      border: 1px solid rgba(79, 87, 138, 1);
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

    .select-input {
      min-height: 50px;
      width: 100%;

      .el-input {
        min-height: 50px;

        input {
          background: transparent;
          border: none;
          color: var(--brand-gray-color);
          min-height: 50px;

          &::placeholder {
            color: var(--gray-color);
          }
        }
      }

      .el-select__tags {
        .el-select__input {
          color: var(--brand-gray-color);
        }
        .el-tag {
          background: var(--brand-yellow-background);
          border: 1px solid var(--brand-gray-border);
          max-width: 100%;
          overflow-x: hidden;

          .el-select__tags-text {
            color: var(--brand-gray-color);
            font-weight: bold;
          }
          .el-tag__close {
            background: var(--gray-background);
            &:hover {
              background: var(--brand-gray-background-hover);
            }
          }
        }
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
      &:hover {
        border: 1px solid rgba(79, 87, 138, 1);
      }
      .svg-container {
        color: var(--dark-gray-color);
      }
      .select-input {
        .el-input {
          input {
            background: transparent;
            color: var(--light-gray-color);
            &::placeholder {
              color: var(--gray-color);
            }
          }
        }
        .el-select__tags {
          .el-select__input {
            color: var(--gray-color);
          }
          .el-tag {
            background: var(--brand-gray-background);
            border: 1px solid rgba(255, 255, 255, 0.1);
            .el-select__tags-text {
              color: var(--gray-color);
            }
            .el-tag__close {
              &:hover {
                background: var(--brand-yellow-background);
              }
            }
          }
        }
      }
    }
  }
}

.el-select-dropdown {
  background: var(--light-gray-background);
  border: 1px solid var(--gray-border);
  max-height: 180px;
  overflow: hidden;
  .el-scrollbar {
    max-height: 180px;
    .el-select-dropdown__wrap {
      max-height: 180px;
      .el-scrollbar__view {
        max-height: 180px;
      }
    }
  }
  .el-select-dropdown__list {
    background: var(--light-gray-background);
    border-radius: 4px;
    .el-select-dropdown__item {
      color: var(--brand-gray-color);

      &.hover {
        background: var(--gray-background-hover);
      }

      &.selected {
        background: var(--gray-background-active);
        color: var(--brand-yellow-color-active);

        &.hover {
          background: var(--gray-background-hover);
        }
      }

      &:hover {
        background: var(--gray-background-hover);
        font-weight: bold;
      }
    }
  }

  .popper__arrow {
    &::after {
      top: 0px !important;
      border-bottom-color: var(--gray-border) !important;
    }
  }
}

.el-select-dropdown {
  &.dark-theme {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: var(--brand-gray-background);
    .el-select-dropdown__list {
      background: var(--brand-gray-background);
      border-radius: 4px;
      .el-select-dropdown__item {
        color: var(--light-gray-color);

        &.hover {
          background: var(--brand-gray-background-hover);
        }

        &.selected {
          background: var(--brand-gray-background-active);
          color: var(--brand-yellow-color-active);

          &.hover {
            background: var(--brand-gray-background-hover);
          }
        }

        &:hover {
          background: var(--brand-gray-background);
          font-weight: bold;
        }
      }
    }

    .popper__arrow {
      &::after {
        top: 0px !important;
        border-bottom-color: var(--gray-border) !important;
      }
    }
  }
}
</style>
