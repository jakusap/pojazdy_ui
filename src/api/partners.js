import request from './request.js';

export const getPartnersList = () =>
  request({
    url: '/api/driver-accounts/partners',
    method: 'get',
  });
