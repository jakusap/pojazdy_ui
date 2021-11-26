import request from './request.js';

export const postInvoice = (formData) =>
  request({
    url: '/api/invoice-images',
    method: 'post',
    data: formData,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });

export const postInvoiceOcr = (formData) =>
  request({
    url: '/api/ocr/invoices',
    method: 'post',
    data: formData,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });

export const putInvoice = (invoiceImageUUID, formData) =>
  request({
    url: `/api/invoice-images/${invoiceImageUUID}`,
    method: 'put',
    data: formData,
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });

export const deleteInvoice = (invoiceImageUUID) =>
  request({
    url: `/api/invoice-images/${invoiceImageUUID}`,
    method: 'delete',
  });

export const getInvoices = (partnerUUID, approvedOnly, from, to) =>
  request({
    url: `/api/invoice-images`,
    method: 'get',
    params: {
      partnerUUID: partnerUUID,
      approvedOnly: approvedOnly,
      from: from,
      to: to,
    },
  });

export const getPreviewInvoice = (invoiceImageUUID) =>
  request({
    url: `/api/invoice-images/${invoiceImageUUID}/preview`,
    responseType: 'blob',
    method: 'get',
  });

export const getPartnerInvoiceProvision = () =>
  request({
    url: `/api/invoice-images/provision`,
    method: 'get',
  });

export const postInvoiceFeedback = (invoiceImageUUID, feedback) =>
  request({
    url: `/api/invoice-images/feedback/${invoiceImageUUID}`,
    method: 'post',
    data: feedback,
  });

export const postValidationData = (imageDescription) =>
  request({
    url: `/api/invoice-images/validate-number`,
    method: 'post',
    data: imageDescription,
  });

export const postInvoiceDetailsValidation = (imageDescription) =>
  request({
    url: `/api/invoice-images/verify-details`,
    method: 'post',
    data: imageDescription,
  });
