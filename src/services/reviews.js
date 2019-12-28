import Axios from 'axios';

const REVIEWS_API_PATH = process.env.REACT_APP_PROJECT_API + 'contractors/reviews/';
const config = {
	headers: { 'content-type': 'multipart/form-data' }
}                         
export default {
	submit: (id, params) =>  Axios.post(`${REVIEWS_API_PATH}${id}/write` , params, config).then((success) => window.location.href = "/"),
};
