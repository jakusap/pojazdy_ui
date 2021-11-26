import { validateIban } from '@/api/ibanApi';
import { validateNip } from '@/api/licensesApi';
import { validatePesel } from '@/api/partnerDocumentsApi';
import { i18n } from '@/locales/i18n';

export const validateNumber = (rule, value, callback) => {
  if (!rule.required) return callback();
  if (parseFloat(value) === 0) return callback();
  return Number(String(value).replace(',', '.'))
    ? callback()
    : callback(new Error(i18n.t('validation.number_value_required')));
};

export const validateValue = (rule, value, callback) => {
  if (Number(value) > rule.maxValue) {
    callback(new Error(i18n.t('validation.value_too_big') + ' ' + rule.maxValue));
  } else if (Number(value) < rule.minValue) {
    callback(new Error(i18n.t('validation.value_too_small') + ' ' + rule.minValue));
  } else {
    callback();
  }
};

export const checkIban = async (rule, value, callback) => {
  if (value) {
    await validateIban(value).then((response) => {
      if (response.ok) {
        callback();
      } else {
        if (response.status === 400) callback(new Error(i18n.t('validation.iban_not_valid')));
        else callback();
      }
    });
  } else if (!value || value.length === 0) {
    callback();
  } else {
    callback(new Error(i18n.t('validation.iban_wrong_length')));
  }
};

export const checkForeignIban = async (rule, value, callback) => {
  if (value) {
    await validateIban(value).then((response) => {
      if (response.ok) {
        callback();
      } else {
        if (response.status === 400) callback(new Error(i18n.t('validation.iban_not_valid')));
        else callback();
      }
    });
  } else if (!value || value.length === 0) {
    callback();
  }
};

export const checkNip = async (rule, value, callback) => {
  if (rule.required && !value) {
    callback(new Error(i18n.t('validation.tax_id_cannot_be_empty')));
  } else if (value && value.match(/^\b([0-9]{10})\b/)) {
    await validateNip(value).then((response) => {
      if (response.ok) {
        callback();
      } else {
        if (response.status >= 400 && response.status < 500) callback(new Error(i18n.t('validation.tax_id_not_valid')));
        else callback();
      }
    });
  } else if (!value || value.length === 0) {
    callback();
  } else {
    callback(new Error(i18n.t('validation.tax_id_wrong_length')));
  }
};

export const checkPesel = async (rule, value, callback) => {
  if (rule.required && !value) {
    callback(new Error(i18n.t('validation.pesel_wrong_length')));
  }
  if (value && value.match(/^\b([0-9]{11})\b/)) {
    await validatePesel(value).then((response) => {
      if (response.ok) {
      } else {
        if (response.status >= 400) callback(new Error(i18n.t('validation.pesel_not_valid')));
        else callback();
      }
    });
  } else if (!value || value.length === 0) {
    callback();
  } else {
    callback(new Error(i18n.t('validation.pesel_wrong_length')));
  }
};

export const validatePostCode = (rule, value, callback) => {
  if (rule.allowEmpty && !value) {
    callback();
  }
  if (rule.required && !value) {
    callback(new Error(i18n.t('validation.post_code_wrong_length')));
  }
  if (value && value.match(/\b\d{2}-\d{3}\b/)) {
    callback();
  } else {
    callback(new Error(i18n.t('validation.post_code_wrong_length')));
  }
};
