import ViewSelector from '../components/ViewSelector';
import tableNavigationMixin from './tableNavigationMixin';

const tableTitleMixin = {
  mixins: [tableNavigationMixin],
  components: {
    ViewSelector,
  },
  methods: {
    showSettings() {
      document.getElementById('settings').classList.toggle('active');
    },
  },
};

export default tableTitleMixin;
