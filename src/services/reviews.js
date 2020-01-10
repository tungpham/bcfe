import {xapi} from './utils';
const REVIEWS_API_PATH = '/contractors/reviews';
                  
export default {
	submit: (id, params) =>  xapi(1).post(`${REVIEWS_API_PATH}/${id}/write` , params).then((success) =>  window.location.href = "/"),
};