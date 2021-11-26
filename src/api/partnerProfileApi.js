import request from './request';

export const getPartnerProfile = () => {
  return request({
    url: `/api/partners`,
    method: 'get',
  });
};

export const putPartnerProfile = (profile) => {
  return request({
    url: `/api/partners`,
    method: 'put',
    data: profile,
  });
};

export const getSettlementsLimits = () =>
  request({
    url: `/api/settlements/limits`,
    method: 'get',
  });
