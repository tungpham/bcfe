import React                      from 'react';
import { Link, Redirect, Switch } from 'react-router-dom';
import SecuredRoute               from '../../routers/SecuredRoute';
import { connect }                from 'react-redux';
import { withStyles }             from '@material-ui/core/styles';
import AppBar                     from '@material-ui/core/AppBar';
import Tabs                       from '@material-ui/core/Tabs';
import NoSsr                      from '@material-ui/core/NoSsr';
import Tab                        from '@material-ui/core/Tab';
import AppsIcon                   from '@material-ui/icons/Apps';
import PlaylistAddIcon            from '@material-ui/icons/PlaylistAdd';
import ContractorDetailView       from './ContractorDetailView';
import CurrentProjectView         from './CurrentProjectView';
import AddProjectView             from './AddProjectView';
import ProjectDetailView          from '../../components/ProjectDetailView';
import ProposalDetailView         from '../../components/ProposalDetailView';
import { compose }                from 'redux';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  toolbarstyle: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark,
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
});

class ConnectedGenContView extends React.Component {
  render() {
    const { classes, userProfile, match, location } = this.props;

    const tabNo = {
      '/gen-contractor': 0,
      '/gen-contractor/current_pros': 0,
      '/gen-contractor/add_project': 1,
    };

    let curTabPos = tabNo[location.pathname];

    if (
      location.pathname.includes('proposal_detail') ||
      location.pathname.includes('project_detail')
    )
      curTabPos = 0;

    if (
      !userProfile.user_metadata.roles.includes('Gen') &&
      !userProfile.user_metadata.roles.includes('GenSub') &&
      !userProfile.user_metadata.roles.includes('SuperAdmin')
    )
      return <div> Access Forbidden </div>;

    return (
      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static" className={classes.toolbarstyle}>
            <Tabs value={curTabPos} variant="scrollable" scrollButtons="on">
              <Tab
                component={Link}
                to={`${match.url}/current_pros`}
                label="Current Projects"
                icon={<AppsIcon />}
              />
              <Tab
                component={Link}
                to={`${match.url}/add_project`}
                label="Add Project"
                icon={<PlaylistAddIcon />}
              />
            </Tabs>
          </AppBar>

          <Switch>
            <SecuredRoute
              path={`${match.url}/current_pros`}
              component={CurrentProjectView}
            />
            <SecuredRoute
              path={`${match.url}/add_project`}
              component={AddProjectView}
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
              path={`${match.url}/contractor_detail`}
              component={ContractorDetailView}
            />
            <Redirect path={`${match.url}`} to={`${match.url}/current_pros`} />
          </Switch>
        </div>
      </NoSsr>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps
  ),
)(ConnectedGenContView)
