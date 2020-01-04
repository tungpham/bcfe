import {
	ALL_PROJECT_LOADED,
	CLEAR_ALL_PROJECTS,
	CLEAR_MESSAGES,
	CLEAR_PROJECTS,
	CLEAR_TEMPLATES,
	PROJECT_LOADED,
	TEMPLATES_LOADED,
	PROJECT_INVITED_LOADED,
	LEVELS_LOADED,
	PROJECTS_LOAD_BY_SPE,
	LOADING_PROJECT,
} from '../constants/gen-action-types';
import { handleActions } from 'redux-actions';

const initialState = {
	messages: [],
	projects: null,
	allprojects: null,
	templates: null,
	invited: null,
	levels: null,
	projectsWithSpecialties: null,
	projectLoading: false,
};

const genReducer = handleActions(
	{
		[ALL_PROJECT_LOADED]: (state, action) => ({
			...state,
			allprojects: action.payload,
		}),
		[PROJECTS_LOAD_BY_SPE]: (state, action) => ({
			...state,
			projectsWithSpecialties: action.payload,
			projectLoading: false
		}),
		[CLEAR_ALL_PROJECTS]: (state, action) => ({
			...state,
			allprojects: action.payload,
		}),
		[PROJECT_LOADED]: (state, action) => ({
			...state,
			projects: action.payload,
			projectLoading: false
		}),
		[TEMPLATES_LOADED]: (state, action) => ({
			...state,
			templates: action.payload,
		}),
		[CLEAR_PROJECTS]: (state, action) => ({
			...state,
			projects: action.payload,
			projectLoading: false
		}),
		[CLEAR_TEMPLATES]: (state, action) => ({
			...state,
			templates: action.payload,
		}),
		[CLEAR_MESSAGES]: (state, action) => ({ ...state, messages: [] }),
		[PROJECT_INVITED_LOADED]: (state, action) => ({
			...state,
			invited: action.payload,
		}),
		[LEVELS_LOADED]: (state, action) => ({
			...state,
			levels: action.payload
		}),
		[LOADING_PROJECT]: (state, action) => ({
			...state,
			projectLoading: true
		})
	},
	initialState
);
export default genReducer;
