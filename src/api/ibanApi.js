import request from './request';

export const validateIban = (iban) =>
  request({
    url: '/api/ibans',
    params: { number: iban },
    method: 'get',
  });
