import request from './request';

export const getMessages = () => {
  return request({
    url: '/api/direct-messages',
    method: 'get',
  });
};

export const getMessageDetails = (messageId) => {
  return request({
    url: `/api/direct-messages/${messageId}`,
    method: 'get',
  });
};

export const postMessage = (message) => {
  return request({
    url: '/api/direct-messages',
    method: 'post',
    data: { driverUUIDs: message.driverUUIDs, content: message.content, channel: message.channel },
  });
};
