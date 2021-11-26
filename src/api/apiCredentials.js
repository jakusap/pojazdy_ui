import request from './request.js';

export const getOrlenApi = () =>
  request({
    url: '/api/api-credentials/orlen',
    method: 'get',
  });

export const postOrlenApi = (orlenCredentials) =>
  request({
    url: '/api/api-credentials/orlen',
    method: 'post',
    data: {
      ...orlenCredentials,
    },
  });

export const deleteOrlenApi = () =>
  request({
    url: `/api/api-credentials/orlen`,
    method: 'delete',
  });
