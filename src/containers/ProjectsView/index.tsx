import * as React from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import ProjectDetailView from 'components/ProjectDetailView';
import ProposalDetailView from 'components/ProposalDetailView';
import SecuredRoute from 'routers/SecuredRoute';
import CurrentProjectView from './CurrentProjectView/index';
import ContractorDetailView from 'components/ContractorDetailView';
import { UserProfile } from 'types/global'


const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		overflow: 'auto',
	},
	contentWrapper: {
		paddingTop: theme.spacing(1)
	},
	buttonAdditional: {
		position: 'absolute',
		float: 'right',
		right: 0,
	}
}));

interface IProjectsViewProps extends RouteComponentProps {
	userProfile: UserProfile;
}

const ProjectsView: React.FunctionComponent<IProjectsViewProps> = (props) => {

	const classes = useStyles({});
	const { userProfile, match } = props;

	if (!userProfile.user_metadata.roles.includes('Gen') &&
		!userProfile.user_metadata.roles.includes('GenSub') &&
		!userProfile.user_metadata.roles.includes('SuperAdmin')) {
		return <div> Access Forbidden </div>;
	}

	return (
		<Box className={classes.root}>
			{/* <CustomTabs
				tabs={[{
					href: `/projects/current`,
					label: "New",
					icon: AppsIcon,
				}]}
			/> */}
			<Box className={classes.contentWrapper}>
				<Switch>
					<SecuredRoute
						path={`${match.url}/current`}
						component={CurrentProjectView}
					/>
					<SecuredRoute
						path={`${match.url}/proposal_detail/:id`}
						component={ProposalDetailView}
					/>
					<SecuredRoute
						path={`${match.url}/project_detail/:id`}
						component={ProjectDetailView}
					/>
					<SecuredRoute
						path={`${match.url}/contractor_detail/:id`}
						component={ContractorDetailView}
					/>
					<Redirect path='/projects' to='/projects/current' />
				</Switch>
			</Box>
		</Box>
	)
};

const mapStateToProps = state => ({
	userProfile: state.global_data.userProfile,
})

export default connect(mapStateToProps)(ProjectsView);


