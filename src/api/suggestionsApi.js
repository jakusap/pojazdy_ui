import request from './request';

export const getSettlementPeriods = () => {
  return request({
    url: '/api/settlements/periods',
    method: 'get',
  });
};
