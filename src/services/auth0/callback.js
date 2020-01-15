import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import auth0Client from './auth';

import { connect } from 'react-redux';
import { setUserProfile } from 'store/actions/global-actions';
import {xapi} from 'services/utils';
class connectedCallback extends Component {

	async componentDidMount() {
		console.log("Callback");
		await auth0Client.handleAuthentication();
		const data = await auth0Client.getUserInfo();
		this.props.setUserProfileAction(data);
		localStorage.setItem('User_Id', data.user_id);
		localStorage.setItem("contractor_ID", data.user_metadata.contractor_id);

		if (localStorage.getItem("modalData")) {
			var payload = JSON.parse(localStorage.getItem("modalData"));
			var apiPath = `contractors/${data.user_metadata.contractor_id}/projects`;
			if (payload) {
				xapi().post( apiPath,	payload).then(response => {
						localStorage.setItem("modalData", null);
						this.props.history.replace('/gen-contractor');
				}).catch(error => {
					localStorage.setItem("modalData", null);
					this.props.history.replace('/');
				})
			}
		} else {
			this.props.history.replace('/');
		}
	}

	render() {
		return (
			<div className="lds-ring"><div></div><div></div><div></div><div></div></div>
		)
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
