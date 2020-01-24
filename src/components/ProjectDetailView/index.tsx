import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { compose } from 'redux';
//import Material UI components;
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
//import Actions;
import { getProjectData } from 'store/actions/global-actions';
import { getLevels } from 'store/actions/gen-actions';
import { loadRoots } from 'store/actions/tem-actions';
//---------------
//import Types;
import { ProjectInfo } from 'types/project';
import { NodeInfo } from 'types/global';
//---------------
//import Form Components;
import ProjectLevelsTreeView from './ProjectLevelsTreeView';
import ProjectOverView from './ProjectOverView';
import ProjectDetailsView from './ProjectDetailsView';
const styles = createStyles(theme => ({
    projectDetailView: {
       display:"flex",
       height:"100%"
    },
    treeViewWrapper:{
        height:"100%"
    },
    projectDetailViewWrapper:{
        flex:1,
        display:"flex",
        flexDirection:"column",
    },
    
}));

export interface IProjectDetailViewProps extends RouteComponentProps<{ id: string }> {
    project: ProjectInfo;
    roots: NodeInfo[];
    getProjectData: (id: string) => Promise<void>;
    getLevels: (id: string) => Promise<void>;
    loadRoots: () => Promise<void>;
    classes: ClassNameMap<string>;
}
interface IProjectDetailViewState{
    selectedLevelId: string;
    selectedRoomId:  string;
}
class ProjectDetailView extends React.Component<IProjectDetailViewProps, IProjectDetailViewState> {
    constructor(props)
    {
        super(props);
        this.state = {
            selectedLevelId: null,
            selectedRoomId:  null
        }
    }
    setLevelId = (_levelId) => {
        this.setState({
            selectedLevelId: _levelId
        })
    }
    setRoomId = (_roomId) => {
        this.setState({
            selectedRoomId: _roomId
        })
    }
    async componentDidMount() {
        const { match } = this.props;
        await this.props.getProjectData(match.params.id);
        await this.props.getLevels(match.params.id);
        await this.props.loadRoots();
    }

    handleBack = () => {
        const { history } = this.props;
        history.goBack();
    };

    public render() {
        const { classes, project, roots } = this.props;
        if (!project || !roots) return <CircularProgress className={classes.waitingSpin} />;
        return (
            <Box className={classes.projectDetailView} >
                <div className = {classes.treeViewWrapper}>
                    <ProjectLevelsTreeView
                        setLevelId = {this.setLevelId}
                        setRoomId = {this.setRoomId}
                    />
                </div>
                <Box className = {classes.projectDetailViewWrapper}>
                    <ProjectOverView/>
                    <ProjectDetailsView
                        selectedLevelId = {this.state.selectedLevelId}
                        selectedRoomId = {this.state.selectedRoomId}
                        setLevelId = {this.setLevelId}
                        setRoomId = {this.setRoomId}
                    />
                </Box>
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    project: state.global_data.project,
    roots: state.tem_data.roots,
});

const mapDispatchToProps = {
    getProjectData,
    getLevels,
    loadRoots
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(ProjectDetailView);
