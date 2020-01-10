import axios from 'axios';
import auth0Client from './auth0/auth';
const CONTENT_TYPES = [
  'application/json',
  'multipart/form-data',
  'application/x-www-form-urlencoded',
  //------------------------------------------
  'application/java-archive',
  'application/EDI-X12',  
  'application/EDIFACT',  
  'application/javascript',   
  'application/octet-stream',   
  'application/ogg',   
  'application/pdf',  
  'application/xhtml+xml',   
  'application/x-shockwave-flash',    
  'application/json',  
  'application/ld+json',  
  'application/xml',   
  'application/zip', 
  'multipart/mixed',    
  'multipart/alternative',   
  'multipart/related' 
  //-------------------------------------------
]
export const xapi = (_content_type = 0) => {
  let token = null;
  if (auth0Client.getAccessToken()) {
    token = auth0Client.getAccessToken();
  }
  let headers = {
    'X-Requested-With': 'XMLHttpRequest',
     charset: 'UTF-8',
    'Content-Type':CONTENT_TYPES[_content_type]
  };
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