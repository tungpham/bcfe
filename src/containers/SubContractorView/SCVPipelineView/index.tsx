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
import { TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

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
            <Box className="">
                {/* <Paper square> */}
                <div className="sub-header-tab" style={{justifyContent:'space-between', display: 'flex', padding: '0px 30px', margin: '20px 0px' }}>
                    <CustomTabs
                        init={tab}
                        tabs={[
                            {
                                href: tabPaths[0],
                                label: 'Submited', 
                            },
                            {
                                href: tabPaths[1],
                                label: 'Awarded', 
                            },
                            {
                                href: tabPaths[2],
                                label: 'Completed', 
                            }
                        ]}
                    />
                    <TextField
                        id="outlined-start-adornment"
                        placeholder="Search"
                        className="sub-textbox"
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon className="searchicon" /></InputAdornment>,
                        }}
                        variant="outlined"
                    />
                </div>
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
            </Box>
        );
    }
}

export default withStyles(styles)(SCVPipelineView);
