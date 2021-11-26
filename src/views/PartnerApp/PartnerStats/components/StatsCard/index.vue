<template>
  <div class="box-card__wrapper">
    <div class="box-card">
      <div :class="iconColor" class="box-card__svg">
        <SvgIcon :class-name="'box-card__icon'" :icon-class="icon" />
      </div>
      <div class="box-card__element">
        <h1 class="box-card__title">{{ title }}</h1>
        <br />
        <span class="box-card__count">
          {{ currency ? $amount(count) : count }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon';
export default {
  components: {
    SvgIcon,
  },
  props: {
    title: {
      type: String,
    },
    count: {
      type: [String, Number],
    },
    iconColor: {
      type: String,
    },
    currency: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card__wrapper {
  padding: 16px;
}
.box-card__icon {
  font-size: 48px;
}
.box-card {
  @include flex-center;
  background: white;
  box-shadow: 2px 2px 6px 1px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  height: 108px;
  &__element {
    @include flex-center;
    flex-flow: column;
    flex: 0.6;
    height: 100%;
    border-left: 1px solid $borderColor;
    text-align: center;
  }
  &__title {
    display: inline;
    font-size: 16px;
    margin: 0;
  }
  &__count {
    font-weight: 700;
    font-size: 20px;
    color: #324157;
  }
  &__svg {
    @include flex-center;
    flex: 0.4;
    height: 100%;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background: whitesmoke;
    transition: all 0.3s linear;
    &.success {
      color: #13ce66;
    }
    &.warning {
      color: #ffba00;
    }
    &.primary {
      color: #1890ff;
    }
    &.secondary {
      color: #1e1e1e;
    }
  }
  &:hover {
    .box-card {
      &__svg {
        color: white;
        &.success {
          background: #13ce66;
        }
        &.warning {
          background: #ffba00;
        }
        &.primary {
          background: #1890ff;
        }
        &.secondary {
          background: #1e1e1e;
        }
      }
    }
  }
}
</style>
