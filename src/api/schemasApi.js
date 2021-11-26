import request from './request';

export const getSchemas = () => {
  return request({
    url: '/api/settlement-schemas',
    method: 'get',
  });
};

export const createSchema = (schema) => {
  return request({
    url: '/api/settlement-schemas',
    method: 'post',
    data: schema,
  });
};

export const updateSchema = (schema) => {
  return request({
    url: `/api/settlement-schemas/${schema.schemaNumber}`,
    method: 'put',
    data: schema,
  });
};

export const deleteSchema = (schemaNumber) => {
  return request({
    url: `/api/settlement-schemas/${schemaNumber}`,
    method: 'delete',
  });
};
