import React from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import CustomTabs from "components/shared/CustomTabs";
import SecuredRoute from 'routers/SecuredRoute';
import InvitedProView from './InvitedProView';
import SubmittedProView from './SubmittedProView';
import WonProView from './WonProView';
import AppsIcon from '@material-ui/icons/Apps';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

const styles = createStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
    }
}));

interface ISCVPipelineViewProps extends RouteComponentProps {
    classes: ClassNameMap<string>;
}

class SCVPipelineView extends React.Component<ISCVPipelineViewProps> {
    render() {
        const { classes, match, location } = this.props;
        const tabPaths = [
            `${match.url}/submitted`,
            `${match.url}/invited`,
            `${match.url}/awarded`
        ]
        let tab = tabPaths.indexOf(location.pathname);
        if (tab < 0) tab = 0
        return (
            <Box className={classes.root}>
                <Paper square>
                    <CustomTabs
                        init={tab}
                        tabs={[
                            {
                                href: tabPaths[0],
                                label: 'New',
                                icon: AppsIcon,
                            },
                            {
                                href: tabPaths[1],
                                label: 'Ongoing',
                                icon: CalendarTodayIcon,
                            },
                            {
                                href: tabPaths[2],
                                label: 'Completed',
                                icon: AssignmentTurnedInIcon,
                            }
                        ]}
                    />
                    <Switch>
                        <SecuredRoute
                            path={tabPaths[0]}
                            component={SubmittedProView}
                        />
                        <SecuredRoute
                            path={tabPaths[1]}
                            component={InvitedProView}
                        />
                        <SecuredRoute
                            path={tabPaths[2]}
                            component={WonProView}
                        />
                        <Redirect path={`${match.url}`} to={tabPaths[0]} />
                    </Switch>
                </Paper>
            </Box>
        );
    }
}

export default withStyles(styles)(SCVPipelineView);
