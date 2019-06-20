import React                                   from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { withStyles }                          from '@material-ui/styles';
import Card                                    from '@material-ui/core/Card';
import GenContractorView                       from '../containers/GenContractorView';
import SubContractorView                       from '../containers/SubContractorView';
import BidderListingView                       from '../containers/BidderListingView';
import TemplatesView                           from '../containers/TemplateView';
import SpecialtyView                           from '../containers/SpecialtyView';
import ContractorView                          from '../containers/ContractorView';
import ProjectsView                            from '../containers/ProjectsView';
import HomeView                                from '../containers/HomeView';
import ProfileView                             from '../containers/ProfileView';
import SettingsView                            from '../components/SettingsView';
import MenuList                                from '../components/MenuList';
import Header                                  from '../components/Header';
import Callback                                from '../auth0/callback';
import auth0Client                             from '../auth0/auth';
import { connect }                             from 'react-redux';
import { compose }                             from 'redux';
import { setUserProfile }                      from '../actions';
import { CircularProgress }                    from '@material-ui/core/es';

import SecuredRoute                      from './SecuredRoute';
import { MaterialThemeHOC, UserProfile } from '../types/global';

import rootStyles from './AppRouter.style'

interface AppRouterProps extends MaterialThemeHOC {
  location: Location;
  setUserProfile: typeof setUserProfile;
  userProfile: UserProfile;
}

interface AppRouterState {
  checkingSession: boolean;
}

class AppRouterConnect extends React.Component<AppRouterProps, AppRouterState> {
  constructor(props) {
    super(props);

    this.state = {
      checkingSession: true,
    };
  }

  async componentDidMount() {
    if (
      this.props.location.pathname === '/callback' ||
      auth0Client.isAuthenticated()
    ) {
      this.setState({checkingSession: false});
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }

    if (auth0Client.isAuthenticated()) {
      try {
        await auth0Client.getProfile(profile =>
          this.props.setUserProfile(profile)
        );
      } catch (err) {
        console.log(err.error);
      }
    }

    this.setState({checkingSession: false});
  }

  render() {
    const {userProfile, classes} = this.props;
    if (
      this.state.checkingSession ||
      (auth0Client.isAuthenticated() && userProfile === null)
    ) {
      return <CircularProgress className={classes.waitingSpin}/>;
    }

    return (
      <div>
        <Header/>
        <MenuList/>
        <Card className={classes.viewarea}>
          <Switch>
            <Route exact path="/" component={HomeView}/>
            <SecuredRoute path="/g_cont" component={GenContractorView}/>
            <SecuredRoute path="/s_cont" component={SubContractorView}/>
            <SecuredRoute path="/b_list" component={BidderListingView}/>
            <SecuredRoute path="/a_pros" component={ProjectsView}/>
            <SecuredRoute path="/m_temp" component={TemplatesView}/>
            <SecuredRoute path="/m_spec" component={SpecialtyView}/>
            <SecuredRoute path="/m_cont" component={ContractorView}/>
            <SecuredRoute path="/profile" component={ProfileView}/>
            <SecuredRoute path="/settings" component={SettingsView}/>
            <Route exact path="/callback" component={Callback}/>
            <Redirect to="/"/>
          </Switch>
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setUserProfile: profile => dispatch(setUserProfile(profile)),
});

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(rootStyles)
)(AppRouterConnect);