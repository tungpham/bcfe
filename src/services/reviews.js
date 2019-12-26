import Axios from 'axios';

const REVIEWS_API_PATH = process.env.REACT_APP_PROJECT_API + 'reviews/';

export default {
	submit: (id, params) => Axios.post(REVIEWS_API_PATH + "write" , params),
};
