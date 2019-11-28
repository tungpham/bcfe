import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import auth0Client from './auth';

import { connect } from 'react-redux';
import { setUserProfile } from 'store/actions/global-actions';
import { CircularProgress } from '@material-ui/core/es';
import HttpUrlConstant from 'apis/global';
import Axios from 'axios';

class connectedCallback extends Component {
	async componentDidMount() {
		await auth0Client.handleAuthentication();
		const data = await auth0Client.getUserInfo();
		this.props.setUserProfileAction(data);
		localStorage.setItem('User_Id', data.user_id);
		localStorage.setItem("contractor_ID", data.user_metadata.contractor_id);

		if (localStorage.getItem("modalData")) {
			JSON.parse(localStorage.getItem("modalData")).forEach(element => {
				var apiPath = `/contractors/${data.user_metadata.contractor_id}/projects`;
				const payload = {
					"title": element.modalTitle,
					"description": element.description,
					"budget": Number(element.getbudjetvalue) | Number(element.budgetCustomValue),
					"endDate": new Date(),
				};
				if (payload) {
					Axios.post(process.env.REACT_APP_PROJECT_API + apiPath,
						payload, { headers: HttpUrlConstant.headers }).then(response => {
							this.props.history.replace('/gen-contractor');
						})
				}
			});
		} else {
			this.props.history.replace('/');
		}
	}

	render() {
		return <CircularProgress />;
	}
}

const mapDispatchToProps = dispatch => ({
	setUserProfileAction: profile => dispatch(setUserProfile(profile)),
});

const Callback = connect(
	undefined,
	mapDispatchToProps
)(connectedCallback);

export default withRouter(Callback);
