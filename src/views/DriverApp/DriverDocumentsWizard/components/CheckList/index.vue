<template>
  <section class="checklistSection">
    <el-checkbox-group :name="name" :value="value" @input="handleChange">
      <el-checkbox
        v-for="(option, idx) in options"
        :key="idx"
        class="checkboxWrapper"
        :label="option.value"
        @change="handleChangeGroupCheckbox(option)"
      >
        <span class="label">{{ option.label }}</span>
        <el-input
          v-if="showInput(option.value)"
          class="optionalInput"
          :value="statementsRequiredValues[option.value]"
          @input="(e) => handleInput(e, option.value)"
        ></el-input>
      </el-checkbox>
    </el-checkbox-group>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'CheckList',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: [Boolean, Array],
    name: String,
  },
  data: function() {
    return {
      selectedOptions: [],
      values: {
        EMPLOYED: '',
        INSURANCE: '',
      },
    };
  },
  computed: {
    statementsRequiredValues() {
      return this.getStatementsRequiredValues();
    },
  },
  methods: {
    ...mapGetters('documentsWizard', ['getStatementsRequiredValues']),
    ...mapActions('documentsWizard', ['updateStatementsRequiredValue']),
    showInput(code) {
      if (code === 'EMPLOYED' || code === 'INSURANCE') {
        return this.selectedOptions.includes(code);
      } else {
        return false;
      }
    },
    handleChange() {
      this.$emit('input', this.selectedOptions);
    },
    handleInput(value, code) {
      this.updateStatementsRequiredValue({
        code,
        value,
      });
    },
    handleChangeGroupCheckbox(option) {
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
.checklistSection {
  border: 1px solid var(--gray-border);
  padding: 16px;
  border-radius: 8px;
  margin-left: 11px;
  margin-bottom: 16px;
  background: var(--light-gray-background);

  .checkboxWrapper {
    width: 100%;
    margin-bottom: 16px;
    display: flex;

    &.el-checkbox {
      .el-checkbox__input {
        &.is-checked {
          .el-checkbox__inner {
            background: var(--brand-yellow-background-active);
            border-color: var(--brand-yellow-border-active);
            &::after {
              border-color: var(--white-border-active);
            }
          }
        }

        .el-checkbox__inner {
          width: 22px;
          height: 22px;
          &::after {
            border-color: var(--brand-gray-border);
            border-width: 2px;
            height: 11px;
            left: 9px;
            top: 2px;
          }
        }
      }
      .label {
        font-size: 16px;
        color: var(--brand-gray-color);
        white-space: break-spaces;
      }
    }

    .optionalInput {
      margin-top: 8px;
    }
  }
}
</style>
