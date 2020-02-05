import * as React from 'react';
import {useState} from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from "react-markdown";
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';

import { ProjectLevel, ProjectLevelCategory, ProjectInfo } from 'types/project';
import { NodeInfo } from 'types/global';

import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import Section from './Section';
import * as GenActions from 'store/actions/gen-actions';
const DES_LIMIT_COUNT = 120;
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        minHeight: '100%',
        position: 'relative',
        paddingTop: theme.spacing(1)
    },
    titlebar: {
        padding: "0px 8px",
        fontSize: '1.5em',
    },
    levelbar: {
        padding: theme.spacing(1, 0)
    },
    title: {
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    bold: {
        fontWeight: 600
    },
    subtitle: {
        fontWeight: 500,
        fontSize: '1rem',
        paddingRight: theme.spacing(1.5),
        color: '#222'
    },
    value: {
        fontWeight: 500,
        fontSize: '1.0em',
        padding: theme.spacing(0, 1),
        color: '#222',
        flexGrow: 1,
        textAlign: 'right',
    },
    showMoreLess:{
        color:"blue",
        "&:hover":{
            cursor: "pointer"
        }
    },
    description1:{
        display:"inline",
        "& p":{
            display:"inline"
        }
    }
}));

interface IProjectOptionEditProps {
    root: NodeInfo;
    level: ProjectLevel;
    room: ProjectLevelCategory;
    project: ProjectInfo;
    roomUpdated: () => Promise<void>;
    getLevels: (id: string) => Promise<void>;
}

const ProjectOptionEdit: React.SFC<IProjectOptionEditProps & withSnackbarProps> = (props) => {
    const classes = useStyles({});
    const [isExpandedDes, setIsExpandedDes] = useState(false);
    const { root, level, room } = props;
    function render_des(_des, classes){
        if(_des === null || _des === undefined || _des === "") return ""
        if(_des.length > DES_LIMIT_COUNT) {
            if(isExpandedDes !== true){
                return (
                    <React.Fragment>
                            <Box  className = {classes.description1}>
                                <ReactMarkdown
                                    source={_des.substr(0,DES_LIMIT_COUNT)}
                                    skipHtml={false}
                                    escapeHtml={false}
                                />
                            </Box>
                            <span className = {classes.showMoreLess}
                                onClick = {() => {
                                    setIsExpandedDes(true)
                                }}
                            >&nbsp;...more</span>
                    </React.Fragment>
                )
            } else {
                return (
                    <React.Fragment>
                            <Box  className = {classes.description1}>
                                <ReactMarkdown
                                    source={_des}
                                    skipHtml={false}
                                    escapeHtml={false}
                                />
                            </Box>
                            <span className = {classes.showMoreLess}
                                onClick = {() => {
                                    setIsExpandedDes(false)
                                }}
                            >&nbsp; less</span>
                    </React.Fragment>
                )
            }
        } else {
            return _des
        }
    }
    if (!level || !room) {
        return <Box className={classes.root}>No level or room selected</Box>
    }

    return (
        <Box className={classes.root}>
            <Box aria-label='project-options'>
                <Box className={classes.titlebar}>
                    <Box className={classes.title}>
                        {root.name}&nbsp;&nbsp;&nbsp;
                        <span className={classes.subtitle}>{render_des(root.description, classes)}</span>
                    </Box>
                </Box>
            </Box>
            {root && root.children && root.children.length > 0 && root.children.map(item => (
                <Section
                    key={item.id}
                    component={item}
                    room={room}
                    project  = {props.project}
                    getLevels = {props.getLevels}
                />
            ))}
        </Box>
    );
};

const mapStateToProps = state => ({
    project: state.global_data.project,
});

const mapDispatchToProps = dispatch => ({
    getLevels: id => dispatch(GenActions.getLevels(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar<IProjectOptionEditProps>(ProjectOptionEdit));