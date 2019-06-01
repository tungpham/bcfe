import {
	ADD_PROJECT,
	SET_CUR_TAB_POS,
	ALL_PROJECT_LOADED,
	PROJECT_DETAIL_LOADED,
	PROPOSALS_LOADED,
	PROJECT_FILES_LOADED,
	MESSAGE_LOADED,
	TEMPLATES_LOADED,
	SET_PROPOSALID,
	SET_PROPOSAL,
	CLEAR_PROPOSAL
} from "../constants/gen-action-types";

const initialState = {
	selectedProject: null,
	messages: [],
	projects: null,
	allprojects: null,
	templates: null,
	proposals: null,
	proposalId: '',
	selectedProposal: {}
};

function gen_reducer(state = initialState, action) {
	switch (action.type) {
		case SET_CUR_TAB_POS:
			return Object.assign({}, state, {
				curTabPos: action.payload
			});
		case SET_PROPOSAL:
			return { ...state, selectedProposal: action.payload };
		case SET_PROPOSALID:
			return { ...state, proposalId: action.payload };
		case PROPOSALS_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				proposals: action.payload
			});
		case "PROJECT_LOADED":
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				projects: action.payload
			});
		case ALL_PROJECT_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				allprojects: action.payload
			});
		case PROJECT_DETAIL_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				selectedProject: action.payload
			});
		case MESSAGE_LOADED:
			return Object.assign({}, state, {
				messages: action.payload
			});
		case "CLEAR_PROJECTS":
			return Object.assign({}, state, {
				projects: null,
			});
		case "CLEAR_ALL_PROJECTS":
			return Object.assign({}, state, {
				allprojects: null,
			});
		case "CLEAR_PROPOSALS":
			return Object.assign({}, state, {
				proposals: null,
			});
		case "CLEAR_TEMPLATES":
			return Object.assign({}, state, {
				templates: null,
			});
		case "CLEAR_MESSAGES":
			return Object.assign({}, state, {
				messages: [],
			});
		case "SET_SELECTED_NULL":
			return Object.assign({}, state, {
				selectedProject: {
					budget: "",
					description: "",
					title: ""
				}
			});
		case CLEAR_PROPOSAL:
			return Object.assign({}, state, {
				proposalId: '',
				selectedProposal: {}
			});
		case TEMPLATES_LOADED:
			return Object.assign({}, state, {
				//projects: state.projects.concat(action.payload)
				templates: action.payload
			});
		default:
			return state;
	}
}

export default gen_reducer;