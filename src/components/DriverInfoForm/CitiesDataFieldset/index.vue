<template>
  <fieldset class="form-group">
    <div class="row-wrapper">
      <SelectCustom
        v-model="model.cities"
        :placeholder="$t('DriverInfoForm.input_placeholder_cities')"
        :remote-method="searchForSuggestions"
        :options="suggestionsCities"
        :dark-theme="darkTheme"
        remote
        name="citiesData.cities"
        icon-name="location"
        multiple
        allow-create
        clearable
        filterable
      />
    </div>
    <InputCustomCheckbox
      v-if="!avalonForm"
      v-model="model.newsletterSubscription"
      :label="$t('DriverInfoForm.input_placeholder_newsletter_subscription')"
      :dark-theme="darkTheme"
      border
    />
  </fieldset>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import InputCustomCheckbox from '@/components/InputCustomCheckbox';
import SelectCustom from '@/components/SelectCustom';

const { mapGetters, mapActions } = createNamespacedHelpers('suggestions');

export default {
  name: 'CitiesDataFieldset',
  components: { SelectCustom, InputCustomCheckbox },
  props: {
    model: Object,
    darkTheme: Boolean,
    avalonForm: Boolean,
  },
  computed: {
    suggestionsCities: function() {
      return this.getSuggestionsCities().map((suggestion) => {
        return {
          label: suggestion,
          value: suggestion,
        };
      });
    },
  },
  methods: {
    ...mapGetters(['getSuggestionsCities']),
    ...mapActions(['fetchSuggestionsCities']),
    searchForSuggestions: async function(query) {
      if (query != '') await this.fetchSuggestionsCities(query);
    },
  },
};
</script>
