import {xapi} from './utils';
const PROJ_API_PATH       = '/projects';
const LEVEL_API_PATH      = '/levels';
const ROOM_API_PATH       = '/rooms';
const SELECTION_API_PATH  = '/selections';

export default {
	addFiles: (id, files) => {
		const formData = new FormData();
		files.forEach(file => {
			formData.append('file', file);
		});
		return xapi(1).post(`${PROJ_API_PATH}/${id}/files/upload/multiple`, formData).then(response => response.data);
	},
	deleteFile: (id, name) => xapi().delete(`${PROJ_API_PATH}/${id}/files/${name}`).then(res => res.data),
	getFiles:   (id)     => xapi().get(`${PROJ_API_PATH}/${id}/files/`).then(res => res.data),
    getFileByName: (id, name) => xapi().get(`${PROJ_API_PATH}/${id}/files/${name}`),
	delete:  id          => xapi().delete(`${PROJ_API_PATH}/${id}`).then(res => res.data),
	getInfo: id          => xapi().get(   `${PROJ_API_PATH}/${id}`).then(res => res.data),
	archive: id          => xapi().put(   `${PROJ_API_PATH}/${id}/archive`).then(res => res.data),
	update: (id, proj)   => xapi().put(   `${PROJ_API_PATH}/${id}`, proj).then(res => res.data),
	getAll: (page, size) => xapi().get(    PROJ_API_PATH, {
		params: {
			page: page,
			size: size
		},
	}).then(res => res.data),
	getAllBySpecialties: (page, size,specialties) => xapi().get(PROJ_API_PATH+'/available?' + (specialties !== "" ?  specialties + "&" : "") + "page=" + page + "&size=" + size ).then(res => res.data).catch(error => null),
	invite:      (id, contid)        =>  xapi().post(`${PROJ_API_PATH}/${id}/invite/${contid}`).then(res => res.data),
	getInvites:  (id, page, size)    =>  xapi().get(`${PROJ_API_PATH}/${id}/invites`, {
		params: {
			page: page,
			size: size
		},
	}).then(res => res.data),
	getProposals:   (id, page, size) =>  xapi().get(`${PROJ_API_PATH}/${id}/proposals`, {
		params: {
			page: page,
			size: size
		},
	}).then(res => res.data),

	addTemplate:    (projId, tempId) =>  xapi().post(`${PROJ_API_PATH}/${projId}/templates/${tempId}`).then(
		res => res.data
	),
	deleteTemplate: (projId, tempId) =>  xapi().delete(`${PROJ_API_PATH}/${projId}/templates/${tempId}`).then(
		res => res.data
	),

	createLevel: (id, level) =>  xapi().post(`${PROJ_API_PATH}/${id}/levels`, {
		number: level.number,
		name: level.name,
		description: level.description
	}).then(res => res.data),
	updateLevel: (lvlId, data) =>  xapi().put(   `${LEVEL_API_PATH}/${lvlId}`, data).then(res => res.data),
	deleteLevel: id =>             xapi().delete(`${LEVEL_API_PATH}/${id}`).then(res => res.data),
	getLevel:    id =>             xapi().get(   `${LEVEL_API_PATH}/${id}`).then(res => res.data),
	createRoom:  (lvlId, room) =>  xapi().post(  `${LEVEL_API_PATH}/${lvlId}/rooms`, {
		number: room.number,
		type: room.type,
		name: room.name,
		description: room.description,
		w: room.w,
		h: room.h,
		l: room.l
	}).then(res => res.data),
	updateRoom: (roomId, room) =>  xapi().put(`${ROOM_API_PATH}/${roomId}`, {
		name: room.name,
		description: room.description,
		w: room.w,
		h: room.h,
		l: room.l
	}).then(res => res.data),
	deleteRoom: id    =>  xapi().delete(`${ROOM_API_PATH}/${id}`).then(res => res.data),
	getRoom:    id    =>  xapi().get(   `${ROOM_API_PATH}/${id}`).then(res => res.data),
	getLevels: projId =>  xapi().get(   `${PROJ_API_PATH}/${projId}/levels`).then(res => res.data),

	createSelection: (roomId, catId, selId, option, path) =>  xapi().post(`${ROOM_API_PATH}/${roomId}/categories/${catId}/selections/${selId}`, {
			option,
			breadcrumb: path
		}
	).then(res => res.data),
	deleteSelection: id           =>  xapi().delete(`${SELECTION_API_PATH}/${id}`).then(res => res.data),
	updateSelection: (id, option) =>  xapi().put(   `${SELECTION_API_PATH}/${id}`, {
		option
	}).then(res => res.data),
	getSelection:    id           =>  xapi().get(   `${SELECTION_API_PATH}/${id}`).then(res => res.data),
};