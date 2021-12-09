import request from './request.js';

export const uploadFile = (formData) =>
  request({
    url: '/api/documents',
    method: 'post',
    data: formData,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });

export const getDocumentPreview = (documentId) =>
  request({
    url: `/api/documents/${documentId}/download`,
    responseType: 'blob',
    method: 'get',
  });

export const getUploadLogs = (name, from) =>
  request({
    url: '/api/files',
    method: 'get',
    params: { name: name, from: from },
  });
