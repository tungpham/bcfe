import {xapi} from './utils';
const TEMPL_API_PATH    =  '/templates';
const CATEGORY_API_PATH =  '/categories';
const OPTION_API_PATH   =  '/options';
export default {
	get: (page, size) => xapi().get(TEMPL_API_PATH, {
		params: { page: page, size: size },
	}).then(res => res.data),
	getById:    (id) => xapi().get(`${TEMPL_API_PATH}/${id}`).then(res => res.data),
	getCatById: (id) => xapi().get(`${CATEGORY_API_PATH}/${id}`).then(res => res.data),
	getOptById: (id) => xapi().get(`${OPTION_API_PATH}/${id}`).then(res => res.data),

	create: (data)     => xapi().post(`${TEMPL_API_PATH}`, data).then(res => res.data),

	addCat: (id, data) => xapi().post(`${TEMPL_API_PATH}/${id}/categories`, data).then(res => res),
	addOpt: (id, data) => xapi().post(`${CATEGORY_API_PATH}/${id}/options`, data).then(res => res),

	editTemplate: (id, data) => xapi().put( `${TEMPL_API_PATH}/${id}`, data ).then(res => res.data),
	editCategory: (id, data) => xapi().put( `${CATEGORY_API_PATH}/${id}`, data ).then(res => res.data),
	editOption:   (id, data) => xapi().put( `${OPTION_API_PATH}/${id}`, data ).then(res => res.data),

	delete:        (id) => xapi().delete( `${TEMPL_API_PATH}/${id}` ).then(res => res.data),
	deleteCategory: id  => xapi().delete( `${CATEGORY_API_PATH}/${id}` ).then(res => res.data),
	deleteOption:   id  => xapi().delete( `${OPTION_API_PATH}/${id}`).then(res => res.data),

	// new apis
	createRoot: (name, type, value, desc)         => xapi().post(  `${TEMPL_API_PATH}/nodes`, { name, type, value, description: desc }).then(res => res.data),
	createNode: (parent, name, type, value, desc) => xapi().post(  `${TEMPL_API_PATH}/nodes/${parent}`, {name, type, value, description: desc }).then(res => res.data),
	getNode:    id                                => xapi().get(   `${TEMPL_API_PATH}/nodes/${id}`).then(res => res.data),
	updateNode: (id, name, type, value, desc)     => xapi().put(   `${TEMPL_API_PATH}/nodes/${id}`, { name, type, value, description: desc }),
	deleteNode: id                                => xapi().delete(`${TEMPL_API_PATH}/nodes/${id}`),
	getRoots:   ()                                => xapi().get(   `${TEMPL_API_PATH}/nodes`).then(res => res.data)
};
