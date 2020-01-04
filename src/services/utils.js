import axios from 'axios';
import auth0Client from './auth0/auth';
export const xapi = (_content_type = 0) => {
  let token = null;
  if (auth0Client.getAccessToken()) {
    token = auth0Client.getAccessToken();
  }
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
    charset: 'UTF-8',
  };
  if(_content_type < 2)
  {
      headers = {
          ...headers,
          'Content-Type':'application/x-www-form-urlencoded'
      }
  } else {
    headers = {
      ...headers,
      'Content-Type':'multipart/form-data'
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