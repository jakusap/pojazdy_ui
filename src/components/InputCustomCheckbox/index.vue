<template>
  <div :class="['input-custom-checkbox-wrapper', customClass, { 'dark-theme': darkTheme }]">
    <el-form-item :prop="name" class="form-item">
      <el-checkbox-group :name="name" :value="value" :min="minSelected" :max="maxSelected" @input="handleChange">
        <el-checkbox v-if="!options.length" :class="[{ bordered: border }]" :border="border">
          {{ label }}
          <el-tooltip v-if="tooltip" class="tooltip" effect="dark" :content="tooltip" placement="top-end">
            <span><i class="el-icon-info "></i></span>
          </el-tooltip>
        </el-checkbox>
        <el-checkbox
          v-for="(option, idx) in options"
          v-else-if="!!options.length"
          :key="idx"
          :class="[{ bordered: border }]"
          :label="option.value"
          :border="border"
          @change="handleChangeGroupCheckbox(option)"
        >
          {{ option.label }}
          <el-tooltip v-if="tooltip" class="tooltip" effect="dark" :content="tooltip" placement="top-end">
            <span><i class="el-icon-info "></i></span>
          </el-tooltip>
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'InputCustomCheckbox',
  props: {
    name: String,
    label: String,
    minSelected: Number,
    maxSelected: Number,
    tabindex: String,
    tooltip: String,
    customClass: String,
    value: [Boolean, Array],
    border: Boolean,
    darkTheme: Boolean,
    options: {
      type: Array,
      default: () => [],
    },
  },
  data: function() {
    return {
      selectedOptions: [],
    };
  },
  methods: {
    handleChange: function(value) {
      if (this.options.length) this.$emit('input', this.selectedOptions);
      else this.$emit('input', value);
    },
    handleChangeGroupCheckbox: function(option) {
      const isSelected = this.selectedOptions.includes(option.value);
      if (isSelected) {
        this.selectedOptions.splice(this.selectedOptions.indexOf(option.value), 1);
      } else {
        this.selectedOptions.push(option.value);
      }
    },
  },
};
</script>

<style lang="scss">
.input-custom-checkbox-wrapper {
  .form-item {
    margin: 0;
    &.is-error {
      border: 1px solid var(--red-border);
    }

    .el-checkbox {
      border-radius: 8px;
      color: var(--brand-gray-color);
      min-height: 50px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0px 11px 22px 11px;

      &.bordered {
        background: var(--light-gray-background);
        margin: 0px 11px 22px 11px;
        border: 1px solid var(--gray-border);
        &:hover {
          border: 1px solid rgba(79, 87, 138, 1);
        }
      }

      &.is-bordered {
        height: auto;
        min-height: 40px;
      }

      &.is-checked {
        .el-checkbox__label {
          color: var(--brand-yellow-color);
        }
      }

      .el-checkbox__input {
        .el-checkbox__inner {
          background: var(--white-disabled);
          &::after {
            border-color: var(--brand-gray-border-disabled);
          }
        }
        &.is-checked {
          .el-checkbox__inner {
            background: var(--brand-yellow-background-active);
            border-color: var(--brand-yellow-border-active);
            &::after {
              border-color: var(--white-border-active);
            }
          }
        }
      }
      .el-checkbox__label {
        white-space: normal;
      }

      .el-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        .el-checkbox {
          flex: 1;
        }
      }

      .tooltip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 8px;
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
  }

  &.dark-theme {
    .form-item {
      margin: 0;

      .el-checkbox {
        color: var(--gray-color);

        &.bordered {
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          &:hover {
            border: 1px solid rgba(79, 87, 138, 1);
          }
        }

        .el-checkbox__input {
          .el-checkbox__inner {
            &::after {
              border-color: var(--brand-gray-border);
            }
          }
        }
      }
    }
  }
}
</style>
