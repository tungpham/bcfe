import {xapi} from './utils';
const SPEC_API_PATH = '/specialties';

export default {
	loadPage: (page, size) => {
		return xapi().get(SPEC_API_PATH, {
			params: { page, size }
		}).then(res => res.data);
	},
    getAllSpecialties: () => xapi().get(SPEC_API_PATH),
	load:   specId =>   xapi().get(   `${SPEC_API_PATH}/${specId}`).then(res => res.data),
	update: spec   =>	xapi().put(   `${SPEC_API_PATH}/${spec.id}`, spec).then(res => res.data),
	delete: specid =>   xapi().delete(`${SPEC_API_PATH}/${specid}`),
	create: spec   =>   xapi().post(  `${SPEC_API_PATH}`, spec),
};
