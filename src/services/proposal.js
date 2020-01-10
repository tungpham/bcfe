import {xapi} from './utils';
const PROP_API_PATH = '/proposals';
const MSG_API_PATH  = '/messages';

export default {
	award: id => xapi().put(`${PROP_API_PATH}/${id}`, {
		status: 'AWARDED',
	}).then(res => res.data),

	submit: (contId, projId, desc) => xapi().post(`contractors/${contId}/projects/${projId}/proposals`,
		desc
	).then(res => res.data),
	delete: id             => xapi().delete(`${PROP_API_PATH}/${id}`).then(res => res.data),
	update: (id, proposal) => xapi().put(  `${PROP_API_PATH}/${id}`, proposal).then(res => res.data),

	getDetail: id          => xapi().get(   `${PROP_API_PATH}/${id}/temCatOptionDetail`).then(res => res.data),
	getInfo:   id          => xapi().get(   `${PROP_API_PATH}/${id}`).then(res => res.data),

	addFiles: (id, files) => {
		const formData = new FormData();
		files.forEach(async file => {
			formData.append('file', file);
		});

		return xapi(1).post(`${PROP_API_PATH}/${id}/files/upload/multiple`, formData).then(response => response.data);
	},
	deleteFile:   (id, name)          => xapi().delete(`${PROP_API_PATH}/${id}/files/${name}`).then(res => res.data),

	addOption:    (id, catid, option) => xapi().post(  `${PROP_API_PATH}/${id}/categories/${catid}/options`, option).then(res => res.data),
	updateOption: (id, option)        => xapi().put(   `${PROP_API_PATH}/options/${id}`, option).then(res => res.data),
	deleteOption: id                  => xapi().delete(`${PROP_API_PATH}/options/${id}`).then(res => res.data),
	getOption:    id                  => xapi().get(   `${PROP_API_PATH}/options/${id}`).then(res => res.data),

	getMessages: (id, page, size)     => xapi().get(   `${MSG_API_PATH}/proposals/${id}`, {
		params: { page, size }
	}).then(res => res.data),
	addMessage: (id, message, type)   => xapi().post(  `${MSG_API_PATH}/proposals/${id}` + (type === 's_cont') ? '/togencon' : 'tosubcon',
		message
	).then(res => res.data),
	addFileToMessage: (msgId, files) => {
		const formData = new FormData();
		files.forEach(async file => {
			await formData.append('file', file);
		});

		return xapi(1).post(`${MSG_API_PATH}/${msgId}/files/upload/multiple`,	formData).then(res => res.data);
	}
};
