export default {
  install(Vue) {
    Vue.prototype.$amount = function(amount) {
      const parsedAmount = parseFloat(amount);
      const symbol = this.$store.state.app.currencySymbol;

      if (isNaN(parsedAmount)) return `${amount || 0} ${symbol}`;
      if (Number.isInteger(parsedAmount)) return `${parsedAmount} ${symbol}`;

      return `${parsedAmount.toFixed(2)} ${symbol}`;
    };
  },
};
