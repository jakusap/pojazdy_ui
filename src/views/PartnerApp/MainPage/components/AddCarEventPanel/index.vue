<template>
  <div class="button-panel">
    <SvgIcon :class-name="'box-card__icon'" icon-class="plus" @click="showAddCarEventModal" />
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon';
import AddCarEvent from '@/effects/AddCarEvent';

export default {
  components: {
    SvgIcon,
  },
  methods: {
    showAddCarEventModal() {
      this.$modalOn(AddCarEvent);
    },
  },
};
</script>

<style lang="scss" scoped>
.button-panel {
  margin: auto;
  height: 300px;
  width: 50%;
  border: 3px solid green;
  padding: 10px;
  display: flex;
  justify-content: center;
}
.big-button {

}
.box-card__icon {
  font-size: 48px;

  &:hover {
    cursor: pointer;
  }
}
</style>
