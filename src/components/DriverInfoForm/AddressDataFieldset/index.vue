<template>
  <fieldset :class="['form-group', { 'dark-theme': darkTheme }]">
    <div class="form-group-header">
      <p v-if="parent === 'contactData'" class="form-group-title">
        {{ $t('DriverInfoForm.form_group_title_address') }}
      </p>
    </div>
    <div class="form-group-content">
      <div class="row-wrapper">
        <SelectCustom
          v-model="model.address.borough"
          :placeholder="$t('DocumentsWizard.formLabels.borough')"
          :remote-method="searchBoroughsByName"
          :options="suggestionsBoroughs"
          :on-select-option="handleBoroughSelectChanged"
          :dark-theme="darkTheme"
          :loading="boroughsLoading"
          remote
          :name="parent + '.address.borough'"
          icon-name="location"
          clearable
          filterable
        />
      </div>
      <div id="streetRowWrapper" class="row-wrapper">
        <SelectCustom
          v-model="model.address.city"
          :disabled="!model.address.borough.name"
          :placeholder="$t('DocumentsWizard.formLabels.city')"
          :remote-method="searchCitiesByName"
          :options="suggestionsCities"
          :dark-theme="darkTheme"
          :loading="citiesLoading"
          remote
          :name="parent + '.address.city'"
          clearable
          filterable
          allow-create
        />
        <InputCustom
          v-model="model.address.postCode"
          class="postalCodeInput"
          :disabled="!model.address.borough.name"
          :placeholder="$t('DocumentsWizard.formLabels.postCode')"
          :dark-theme="darkTheme"
          :name="parent + '.address.postCode'"
          type="text"
          @input="formatPostCode"
        />
      </div>
      <div id="streetRowWrapper" class="row-wrapper">
        <SelectCustom
          v-model="model.address.street"
          :disabled="!model.address.borough.name"
          :placeholder="$t('DocumentsWizard.formLabels.street')"
          :remote-method="searchStreetsByName"
          :options="suggestionsStreets"
          :dark-theme="darkTheme"
          :loading="streetsLoading"
          remote
          :name="parent + '.address.street'"
          clearable
          filterable
          allow-create
        />
        <InputCustom
          v-model="model.address.houseNumber"
          :disabled="!model.address.borough.name"
          :placeholder="$t('DocumentsWizard.formLabels.houseNumber')"
          :dark-theme="darkTheme"
          class="tinyInput"
          :name="parent + '.address.houseNumber'"
          type="text"
        />
        <InputCustom
          v-model="model.address.apartmentNumber"
          :disabled="!model.address.borough.name"
          :placeholder="$t('DocumentsWizard.formLabels.apartmentNumber')"
          :dark-theme="darkTheme"
          class="tinyInput"
          :name="parent + '.address.apartmentNumber'"
          type="text"
        />
      </div>
    </div>
  </fieldset>
</template>

<script>
import _ from 'lodash';

import { getBoroughs, getCities, getStreets } from '@/api/terytApi';
import InputCustom from '@/components/InputCustom';
import SelectCustom from '@/components/SelectCustom';

export default {
  name: 'AddressDataFieldset',
  components: {
    InputCustom,
    SelectCustom,
  },
  props: {
    model: Object,
    darkTheme: Boolean,
    parent: String,
  },
  data() {
    return {
      boroughs: [],
      streets: [],
      cities: [],
      boroughsLoading: false,
      streetsLoading: false,
      citiesLoading: false,
    };
  },
  computed: {
    suggestionsBoroughs: function() {
      return this.boroughs.map((suggestion) => {
        return {
          label: suggestion.label,
          value: suggestion,
        };
      });
    },
    suggestionsStreets: function() {
      return this.streets.map((suggestion) => {
        return {
          label: suggestion,
          value: suggestion,
        };
      });
    },
    suggestionsCities: function() {
      return this.cities.map((suggestion) => {
        return {
          label: suggestion,
          value: suggestion,
        };
      });
    },
  },
  mounted() {
    var borough = this.model.address.borough;
    if (borough.name) {
      this.boroughs = [{ label: borough.name, value: borough, ...borough }];
      this.model.address.borough = this.boroughs[0];
    }
  },
  methods: {
    searchBoroughsByName: _.debounce(async function(queryString) {
      if (queryString.length >= 3) {
        this.boroughsLoading = true;
        await getBoroughs(queryString).then((response) => {
          this.boroughsLoading = false;
          if (response.ok) {
            this.boroughs = response.data.map((ele) => {
              return {
                label: `${ele.name} (${ele.voivodeshipName}, ${ele.countyName})`,
                value: ele,
              };
            });
          }
        });
      }
    }, 1000),
    handleBoroughSelectChanged(borough) {
      if (borough === '') {
        this.model.address.borough = {};
        this.model.address.city = '';
        this.model.address.postCode = '';
        this.model.address.street = '';
        this.model.address.houseNumber = '';
        this.model.address.apartmentNumber = '';
      } else {
        this.model.address.borough = { label: borough.label, value: borough.value, ...borough.value };
      }
    },
    searchStreetsByName: _.debounce(async function(queryString) {
      var terc = this.model.address.borough.terc;
      if (queryString.length >= 3 && terc) {
        this.streetsLoading = true;
        await getStreets(terc, queryString).then((response) => {
          this.streetsLoading = false;
          if (response.ok) {
            this.streets = response.data;
          }
        });
      }
    }, 1000),
    searchCitiesByName: _.debounce(async function(queryString) {
      var terc = this.model.address.borough.terc;
      if (queryString.length >= 3 && terc) {
        this.citiesLoading = true;
        await getCities(terc, queryString).then((response) => {
          this.citiesLoading = false;
          if (response.ok) {
            this.cities = response.data;
          }
        });
      }
    }, 1000),
    formatPostCode() {
      const postCode = this.$props.model.address.postCode;
      if (postCode.length === 5 && postCode.match(/^\b([0-9]{5})\b/)) {
        this.$props.model.address.postCode = postCode.substring(0, 2) + '-' + postCode.substring(2);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../driverFormStyles';
.postalCodeInput {
  max-width: 180px;
  min-width: 150px;
}
.tinyInput {
  max-width: 120px;
  min-width: 100px;
}
</style>
