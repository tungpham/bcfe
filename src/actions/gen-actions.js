import {
	SET_SELECTED_PROPOSAL,
	ALL_PROJECT_LOADED,
	PROJECT_DETAIL_LOADED,
	PROJECT_FILES_LOADED,
	TEMPLATES_LOADED,
	MESSAGE_LOADED,
	PROPOSALS_LOADED,
	SET_PROPOSAL,
	SET_PROPOSALID,
	CLEAR_PROPOSAL
} from "../constants/gen-action-types";

import PropApi from '../api/proposal';
import ProjApi from '../api/project';
import ContApi from '../api/contractor';
import TempApi from '../api/template';

export const clearSelectedProposal = () => {
	return {
		type: CLEAR_PROPOSAL
	}
}

export const setProposalId = id => dispatch => {
	dispatch({ type: CLEAR_PROPOSAL });
	dispatch({ type: SET_PROPOSALID, payload: id });
}

export const getProposalDetails = id => dispatch => {
	return PropApi.getDetail(id).then(data => {
		dispatch({ type: SET_PROPOSAL, payload: data });
		return data;
	})
}

export const setSelectedProposal = id => dispatch => {
	dispatch({ type: "CLEAR_SELECTED_PROPOSAL" });
	return PropApi.getInfo(id).then(data => {
		dispatch({ type: SET_PROPOSAL, payload: data });
	});
}

export const addOption = (propid, catid, option) => dispatch => {
	return PropApi.addOption(propid, catid, option);
}

export const deleteProposalFile = (id, name) => dispatch => PropApi.deleteFile(id, name)
export const addFilesToProposal = (id, files) => dispatch => PropApi.addFiles(id, files);
export const deleteProposal = id => dispatch => PropApi.delete(id);
export const submitProposal = (cont_id, proj_id, desc) => dispatch => PropApi.submit(cont_id, proj_id, desc);
export const awardProject = (propid) => dispatch => PropApi.award(propid);
export const deleteProject = (id) => dispatch => ProjApi.delete(id);

export const getProjectsByGenId = (id, page, size) => dispatch => {
	dispatch({ type: 'CLEAR_PROJECTS' });
	return ContApi.getProjects(id, page, size).then(data => {
		dispatch({ type: "PROJECT_LOADED", payload: data });
	});
}

export const getAllProjects = (page, size) => dispatch => {
	dispatch({ type: "CLEAR_ALL_PROJECTS" });
	return ProjApi.getAll(page, size).then(data => {
		dispatch({ type: ALL_PROJECT_LOADED, payload: data });
		return data;
	});
}

export const getProjectDetailById = id => dispatch => {
	return ProjApi.getInfo(id).then(data => {
		dispatch({ type: PROJECT_DETAIL_LOADED, payload: data });
	});
}

export const getProposals = (id, page, size) => dispatch => {
	dispatch({ type: "CLEAR_PROPOSALS" });
	return ProjApi.getProposals(id, page, size).then(data => {
		dispatch({ type: PROPOSALS_LOADED, payload: data });
	});
}

export function getProjectMessage(id) {
	return function (dispatch) {
		dispatch({ type: "CLEAR_MESSAGES" });
		return fetch("https://bcbemock.getsandbox.com/" + id + "/messages")
			.then(response => response.json())
			.then(json => {
				dispatch({ type: MESSAGE_LOADED, payload: json });
			})
	}
}

export const addProject = (id, data) => dispatch => ContApi.addProject(id, data);
export const addFiles = (id, files) => dispatch => ProjApi.addFiles(id, files);
export const deleteFile = (id, name) => dispatch => ProjApi.deleteFile(id, name);

export const getTemplates = (page, size) => dispatch => {
	dispatch({ type: "CLEAR_TEMPLATES" });
	return TempApi.get(page, size).then(data => {
		dispatch({ type: TEMPLATES_LOADED, payload: data });
		return data;
	})
}

export const addTemplate = (projectId, templateId) => dispatch => ProjApi.addTemplate(projectId, templateId);
export const deleteTemplate = (projectId, templateId) => dispatch => ProjApi.deleteTemplate(projectId, templateId);

export const updateProject = (id, project) => dispatch => {
	return ProjApi.update(id, project).then(data => {
		dispatch({ type: PROJECT_DETAIL_LOADED, payload: data });
		return data;
	})
}
// export function updateProject(id) {
// 	return function (dispatch) {

// 		return Axios.get(process.env.PROJECT_API + "projects/" + id)
// 			.then(response => {
// 				dispatch({
// 					type: PROJECT_DETAIL_LOADED,
// 					payload: response.data
// 				})
// 			})
// 			.catch(err => console.log(err.message))
// 	}
// }

