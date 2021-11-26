<template>
  <div class="cost-list__wrapper">
    <div class="cost-list__header">
      <h2>{{ $t('Schemas.monthly_costs') }}</h2>
      <el-button v-if="editMode" type="text" circle @click="addListElement()">
        <i class="el-icon-circle-plus"
      /></el-button>
    </div>
    <ul class="cost-list">
      <li v-for="(listElement, id) in editedList" :key="id">
        <el-form :id="`monthlyForm${id}`" :rules="monthlyRules" :model="listElement" class="cost-list__element">
          <el-form-item prop="name">
            <el-input
              v-model="listElement.name"
              :placeholder="$t('cost_name')"
              :disabled="!editMode"
              class="element__name"
            />
          </el-form-item>
          <el-form-item prop="amount">
            <el-input v-model="listElement.amount" :disabled="!editMode" class="element__amount">
              <template slot="append">{{ currencySymbol }}</template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
          v-if="editMode"
          type="danger"
          size="mini"
          icon="el-icon-minus"
          circle
          @click="removeListElement(id)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { validateNumber, validateValue } from '@/validators';
export default {
  props: {
    listElements: {
      type: Array,
      default: () => [],
    },
    editMode: {
      type: Boolean,
    },
  },
  data() {
    return {
      monthlyRules: {
        name: [
          {
            required: true,
            message: this.$t('validation.cost_name_not_empty'),
            trigger: 'blur',
          },
          {
            max: 150,
            message: this.$t('validation.cost_name_too_long'),
            trigger: 'blur',
          },
        ],
        amount: [
          {
            required: true,
            validator: validateNumber,
            message: this.$t('validation.cost_not_empty'),
            trigger: 'blur',
          },
          {
            validator: validateValue,
            maxValue: 99999999.99,
            minValue: -99999999.99,
            trigger: 'blur',
          },
        ],
      },
      editedList: [],
    };
  },
  computed: {
    ...mapGetters('app', ['currencySymbol']),
  },
  watch: {
    listElements: {
      handler() {
        this.editedList = [...this.listElements];
      },
      immediate: true,
    },
    editMode: {
      handler() {
        this.editedList = [...this.listElements];
      },
    },
    editedList: {
      handler(value) {
        this.$emit('listUpdate', value);
      },
      deep: true,
    },
  },
  methods: {
    addListElement() {
      this.editedList.unshift({ name: '', placeholder: this.$t('additional_cost'), amount: 0 });
    },
    removeListElement(id) {
      this.editedList.splice(id, 1);
    },
  },
};
</script>
<style lang="scss">
.element__amount {
  & .el-input__inner {
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
.cost-list__header {
  & > .el-button {
    padding: 0;
    i {
      font-size: 24px;
      color: $brand-gray;
      transition: 0.1s ease all;
      &:hover {
        color: $brand-yellow;
      }
    }
  }
  display: flex;
  h2 {
    font-size: 22px;
    margin: 0;
    padding-right: 8px;
  }
}
.cost-list {
  padding: 0;
  list-style-type: none;
  margin-top: 0;
  margin-bottom: 32px;
  & .el-button {
    margin-bottom: 8px;
  }
  li {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    margin-bottom: 8px;
  }
}
.cost-list__element {
  display: flex;
  flex-wrap: wrap;
  margin-right: 8px;
  .element__name {
    min-width: 250px;
  }
  .element__amount {
    width: 150px;
    & .el-input__inner {
      text-align: center;
    }
  }
}
</style>
