export default {
  install(Vue) {
    Vue.prototype.$modalOn = function(component, props) {
      const modalGateway = document.getElementById('modal-gateway');
      const modal = Vue.extend(component);
      const t = new modal({
        propsData: props,
        i18n: this.$i18n,
        router: this.$router,
        store: this.$store,
      }).$mount();
      modalGateway.appendChild(t.$el);
    };
    Vue.prototype.$modalOff = function() {
      const modalGateway = document.getElementById('modal-gateway');
      while (modalGateway.firstChild) {
        modalGateway.removeChild(modalGateway.firstChild);
      }
    };
  },
};
