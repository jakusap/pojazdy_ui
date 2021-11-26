import request from './request.js';

export const getSuggestionsCities = (query) =>
  request({
    url: `/api/suggestions/cities?name=${query}`,
    method: 'get',
  });

export const getSuggestionsDictionary = () =>
  request({
    url: `/api/suggestions/dictionary`,
    method: 'get',
  });
