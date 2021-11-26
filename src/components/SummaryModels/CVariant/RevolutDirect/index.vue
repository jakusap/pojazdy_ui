<template>
  <div class="revolut-message" @click="revolutRedirect">
    <ProviderBadge provider="REVOLUT" :large="true" />
    <span> {{ $t('TransactionsC.revolut_message') }}</span>
  </div>
</template>

<script>
export default {
  components: { ProviderBadge },
  methods: {
    revolutRedirect() {
      window.open('https://www.revolut.com/pl-PL', '_blank');
    },
  },
};
import ProviderBadge from '@/components/ProviderBadge';
</script>

<style lang="scss" scoped>
.revolut-message {
  display: flex;
  flex-flow: row;
  justify-content: left;
  width: 350px;
  align-items: center;
  text-align: center;
  cursor: pointer;
  &:hover {
    border-bottom: #3a68b2 solid 3px;
  }
  img {
    display: inline-block;
    justify-items: left;
    width: 80px;
    height: 60px;
  }
}
</style>
