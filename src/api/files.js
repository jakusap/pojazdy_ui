import request from './request.js';

export const uploadFile = (formData) =>
  request({
    url: '/api/files',
    method: 'post',
    data: formData,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });

export const getUploadLogs = (name, from) =>
  request({
    url: '/api/files',
    method: 'get',
    params: { name: name, from: from },
  });
