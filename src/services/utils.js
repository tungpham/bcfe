import axios from 'axios';
import auth0Client from './auth0/auth';
const CONTENT_TYPE = [
    '',
    'application/json',
    'multipart/form-data'
]
export const xapi = (_content_type = 0) => {
  let token = null;
  if (auth0Client.getAccessToken()) {
    token = auth0Client.getAccessToken();
  }
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    charset: 'UTF-8'
  };
  if(_content_type !== 0)
  {
      headers = {
          ...headers,
          'Content-Type': CONTENT_TYPE[_content_type]
      }
  }
  if (token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }

  let xapi = axios.create({
    baseURL: process.env.REACT_APP_PROJECT_API,
    headers: headers
  });

  return xapi;
};