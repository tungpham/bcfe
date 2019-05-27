import React, { Component } from 'react';
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import SecuredRoute from '../../routers/SecuredRoute';

// Redux
import { connect } from 'react-redux';

// material ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import { CircularProgress } from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import BallotIcon from '@material-ui/icons/Ballot';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

// local components
import CurrentProjectView from './CurrentProjectView';
import ProjectDetailView from './ProjectDetailView';
import ProposalDetailView from './ProposalDetailView';
import AddProjectView from './AddProjectView'

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	toolbarstyle: {
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.primary.dark
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

class ConnectedGenContView extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { classes, userProfile, match, location } = this.props;

		const tabNo = {
			'/g_cont': 0,
			'/g_cont/current_pros': 0,
			'/g_cont/project_detail': 1,
			'/g_cont/propose_detail': 2,
			'/g_cont/add_project': 3
		};

		let curTabPos = tabNo[location.pathname];

		if (location.pathname.includes('/g_cont/project_detail'))
			curTabPos = 1;

		if (!userProfile.user_metadata.roles.includes("Gen") &&
			!userProfile.user_metadata.roles.includes("GenSub") &&
			!userProfile.user_metadata.roles.includes("SuperAdmin"))
			return (<div> Access Forbidden </div>);

		return (
			<NoSsr>
				<div className={classes.root}>
					<AppBar position="static" className={classes.toolbarstyle}>
						<Tabs
							value={curTabPos}
							variant="scrollable"
							scrollButtons="on">

							<Tab component={Link} to={`${match.url}/current_pros`} label="Current Projects" icon={<AppsIcon />} />
							<Tab component={Link} to={`${match.url}/project_detail`} label="Project Detail" icon={<BallotIcon />} />
							<Tab component={Link} to={`${match.url}/propose_detail`} label="Proposal Detail" icon={<DoneAllIcon />} />
							<Tab component={Link} to={`${match.url}/add_project`} label="Add Project" icon={<PlaylistAddIcon />} />
						</Tabs>
					</AppBar>

					<Switch>
						<SecuredRoute path={`${match.url}/current_pros`} component={CurrentProjectView} />
						<SecuredRoute path={`${match.url}/project_detail`} component={ProjectDetailView} />
						<SecuredRoute path={`${match.url}/propose_detail`} component={ProposalDetailView} />
						<SecuredRoute path={`${match.url}/add_project`} component={AddProjectView} />
						<Redirect path={`${match.url}`} to={`${match.url}/current_pros`} />
					</Switch>
				</div>
			</NoSsr>
		);
	}
}

const mapStateToProps = state => {
	return {
		userProfile: state.global_data.userProfile,
	};
};

const GeneralContractorView = connect(mapStateToProps, null)(ConnectedGenContView);

GeneralContractorView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(GeneralContractorView));