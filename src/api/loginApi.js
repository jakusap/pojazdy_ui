import request from './request.js';

export const login = (user, pass) =>
  request({
    url: '/api/auth',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: `login=${user}&password=${pass}`,
  });
