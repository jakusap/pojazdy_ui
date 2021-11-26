import request from './request';

export const getGeneralStats = () => {
  return request({
    url: '/api/partner-statistics/general',
    method: 'get',
  });
};

export const getFullStats = (type, dateFrom, dateTo) => {
  return request({
    url: '/api/partner-statistics/',
    method: 'get',
    params: { type: type, dateFrom: dateFrom, dateTo: dateTo },
  });
};

export const getMonthlyStats = (type, dateFrom, dateTo) => {
  return request({
    url: '/api/partner-statistics/by-month',
    method: 'get',
    params: { type: type, dateFrom: dateFrom, dateTo: dateTo },
  });
};
