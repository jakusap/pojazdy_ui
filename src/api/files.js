import request from './request.js';

export const uploadDocument = (formData, eventId) =>
  request({
    url: `/api/documents/${eventId}`,
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

export const uploadInvoice = (formData, eventId) =>
  request({
    url: `/api/invoices/${eventId}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });

export const getInvoicePreview = (invoiceUUID) =>
  request({
    url: `/api/invoices/${invoiceUUID}/download`,
    responseType: 'blob',
    method: 'get',
  });

export const getUploadLogs = (name, from) =>
  request({
    url: '/api/files',
    method: 'get',
    params: { name: name, from: from },
  });

export const getPartnerDocuments = () =>
  request({
    url: '/api/documents',
    method: 'get',
  });

export const getPartnerInvoices = () =>
  request({
    url: '/api/invoices',
    method: 'get',
  });
