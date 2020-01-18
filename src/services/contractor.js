import {xapi} from './utils';
const CONT_API_PATH = '/contractors';

export default {
	// create, select, delete contractor
	createContractor: contractor => xapi().post(   CONT_API_PATH, contractor),
	selectContractor: id         => xapi().get(   `${CONT_API_PATH}/${id}`).then(res => res.data),
	deleteContractor: id         => xapi().delete(`${CONT_API_PATH}/${id}`),

	// approve/reject contractor
	approve:          (id, data) => xapi().post(`${CONT_API_PATH}/${id}`, data),
	// get contractor information
	getContractors: (page, size) => xapi().get(CONT_API_PATH, {
		params: {
			page,
			size
		}
	}).then(res => res.data),
	search:        (name, city, specialties) => xapi().post(`${CONT_API_PATH}/search`, {
		name,
		city,
		specialties
	}).then(res => res.data),
	getContractorById: id                    => xapi().get(`${CONT_API_PATH}/${id}`).then(res => res.data),

	// update user
	update:     (id, email, editor, address) => xapi().post(`${CONT_API_PATH}/${id}`, {
		email,
		updatedBy: editor,
		address
	}).then(res => res.data),
	getReviews:     id          => xapi().get( `${CONT_API_PATH}/${id}/get_reviews`).then(res => res.data),
	requestReview: (id, emails) => xapi().post(`${CONT_API_PATH}/${id}/request_reviews`, emails).then(res => res.data),
	uploadLicense: (id, file, city, type, number) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('note', `${city}__${type}__${number}`);
		return xapi(1).post(`${CONT_API_PATH}/${id}/files/upload/document`, formData).then(res => res.data);
	},
	getLicenses: id => xapi().get(`${CONT_API_PATH}/${id}/files/document`).then(res => res.data),
	uploadPastProject: (id, title, desc, price, year, duration, specId) => xapi().post(
		`${CONT_API_PATH}/${id}/projects/past`, {
			project: {
				title,
				description: desc,
				budget: price,
				year,
				duration
			},
			specialtyId: specId
		}).then(res => res.data),
	getPastProjects: id => xapi().get(`${CONT_API_PATH}/${id}/projects/past`).then(res => res.data),
	uploadAvatar: (id, file) => {
		const formData = new FormData();
		formData.append('file', file);
		return xapi(1).post(`${CONT_API_PATH}/${id}/files/upload/avatar`, formData).then(res => res.data);
	},
	getAvatar: id => `${process.env.REACT_APP_PROJECT_API}/contractors/${id}/avatar`,
	uploadPhoto: (id, file) => {
		const formData = new FormData();
		formData.append('file', file);
		return xapi(1).post(`${CONT_API_PATH}/${id}/files/upload/photo`, formData).then(res => res.data);
	},
	updateTitle: (fileId, title) => xapi().post(`${CONT_API_PATH}/files/${fileId}/note`, {
		note: title
	}).then(res => res.data),
	getPhotos: id              => xapi().get( `${CONT_API_PATH}/${id}/photos`).then(res => res.data),
	addLink:  (id, link, type) => xapi().post(`${CONT_API_PATH}/${id}/link`, {}, {
		params: {
			url: link,
			type
		}
	}).then(res => res.data),
	getLinks: id               => xapi().get(`${CONT_API_PATH}/${id}/link`).then(res => res.data),

	// upload/delete file
	uploadFiles: (id, files) => {
		const formData = new FormData();
		files.forEach(async file => {
			formData.append('file', file);
		});
		return xapi(1).post(`${CONT_API_PATH}/${id}/files/upload/multiple`, formData).then(res => res.data);
	},
	deleteFile:      (id, name)   => xapi().delete(`${CONT_API_PATH}/${id}/files/${name}`),

	// specialty
	addSpecialty:    (id, specid) => xapi().post(`${CONT_API_PATH}/${id}/specialties/${specid}`),
	deleteSpecialty: (id, specid) => xapi().delete(`${CONT_API_PATH}/${id}/specialties/${specid}`),

	// general contractor
	addProject:     (id, project) => xapi().post(`${CONT_API_PATH}/${id}/projects`, project).then(res => res.data),
	getProjects:    (id, page, size, status) => xapi().get(`${CONT_API_PATH}/${id}/projects`, {
		params: {
			page,
			size,
			status
		},
	}).then(res => res.data),
    getContractorsWithSearchTerm: (contractorType, id, page, size, searchTerm, status) => {
		var _api = `${CONT_API_PATH}/${id}/`;
		if(contractorType === "gen") _api += "projects";
		else _api += "proposals";
		if(searchTerm !== "" && searchTerm !== null && searchTerm !== undefined) 
		{
			_api =  _api + `/search?term=${searchTerm}&page=${page}&size=${size}`;
		}
		else {
			_api += `?page=${page}&size=${size}`
		}
		if(status !== "" && status !== null && status !== undefined) _api += `&status=${status}`;
		return xapi().get(_api)
	},
	// sub contractor
	getProposals: (id, page, size, status) => xapi().get(`${CONT_API_PATH}/${id}/proposals`, {
		params: {
			page,
			size,
			status
		}
	}).then(res => res.data),
	getInvitedProjects: (id, page, size) => xapi().get(`projects/invites/${id}`, {
		params: {
			page,
			size
		}
	}).then(res => res.data),
	// FAQs
	getFaqs: (id) => xapi().get(`${CONT_API_PATH}/${id}/faq`),
	updateFaqs: (id, data) => xapi().post(`${CONT_API_PATH}/${id}/faq`, data),
};