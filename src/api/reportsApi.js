import request from '@/api/request';

export const getPayoutReport = (from, to) => {
  return request({
    url: '/api/reports/payout',
    method: 'get',
    responseType: 'blob',
    params: { from: from, to: to },
  });
};

export const getReportsForPartner = () => {
  return request({
    url: '/api/reports',
    method: 'get',
  });
};

export const generateReport = (datasource, parameters) =>
  request({
    url: `/api/reports/${datasource}`,
    method: 'POST',
    data: parameters,
  });
