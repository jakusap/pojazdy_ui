import request from './request';

export const getBoroughs = (name) => {
  return request({
    url: '/api/teryt/boroughs',
    method: 'get',
    params: { name: name },
  });
};

export const getStreets = (terc, name) => {
  return request({
    url: `/api/teryt/boroughs/${terc}/streets`,
    method: 'get',
    params: { name: name },
  });
};

export const getCities = (terc, name) => {
  return request({
    url: `/api/teryt/boroughs/${terc}/cities`,
    method: 'get',
    params: { name: name },
  });
};
