import React from 'react';
//import Material UI components;
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
//import Componetns;
import ProjectTemplatesView from './ProjectTemplatesView';
import ProjectTemplateDetailView from './ProjectTemplateDetailView';
import ProjectFilesView from './ProjectFilesView';
import ProjectLevelsTreeView from './ProjectLevelsTreeView';
import MessageBox from 'components/MessageBox/index';

import { ProjectInfo } from 'types/project';
interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
        style = {{
            backgroundColor:"whitesmoke",
            borderTop:"2px solid #d2cece",
            height:"calc(100vh - 223px)",
            overflow:"auto"
        }}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }
interface ProjectDetailsViewProps {
    viewOnly: boolean;
    levelGettingLoading: boolean;
    project: ProjectInfo;
}
interface ProjectDetailsViewState {
    selectedLevelId : string;
    selectedRoomId : string;
    selectedTemplateId: string;
    value: any;
}
class ProjectDetailsView extends React.Component<ProjectDetailsViewProps,ProjectDetailsViewState>{
    constructor(props)
    {
        super(props);
        this.state = {
            value : 0,
            selectedLevelId: "",
            selectedRoomId : "",
            selectedTemplateId: ""
        }
    }
    setLevelId = (id:string) => {
        this.setState({
            selectedLevelId : id
        })
    }
    setRoomId = (id:string) => {
        this.setState({
            selectedRoomId: id
        })
    }
    setTemplateId = (id:string) => {
        this.setState({
            selectedTemplateId: id
        })
    }
    a11yProps = (index: any) => {
        return {
          id: `scrollable-auto-tab-${index}`,
          'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
      }
    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        })
    }
    render(){
        return(
            <div style = {{color:"black", flex:1, display:"flex", flexDirection:"column"}}>
                 <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                    <Tab label="Templates" {...this.a11yProps(0)} />
                    <Tab label="Files" {...this.a11yProps(1)} />
                    <Tab label="Messages" {...this.a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}
                >
                    <Box style = {{display:"flex"}}>
                        <ProjectLevelsTreeView
                                setLevelId = {this.setLevelId}
                                setRoomId = {this.setRoomId}
                                setTemplateId = {this.setTemplateId}
                                levelGettingLoading = {this.props.levelGettingLoading}
                                viewOnly = {this.props.viewOnly}
                        />
                        {
                            !this.props.levelGettingLoading && (
                                <Box style = {{flex:1, marginLeft:"5px", boxShadow:"0px 10px 10px rgba(0,0,0,.05)", backgroundColor:"white", padding:"15px"}}>
                                    {
                                        !this.props.viewOnly && (
                                            <ProjectTemplatesView
                                                selectedLevelId = {this.state.selectedLevelId}
                                                selectedRoomId = {this.state.selectedRoomId}
                                            />
                                        )
                                    }
                                
                                    <ProjectTemplateDetailView
                                        viewOnly = {this.props.viewOnly}
                                        selectedLevelId = {this.state.selectedLevelId}
                                        selectedRoomId = {this.state.selectedRoomId}
                                        selectedTemplateId = {this.state.selectedTemplateId}
                                    />
                                </Box>
                            )
                        }
                    </Box>
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <ProjectFilesView
                        viewOnly = {this.props.viewOnly}
                    />
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                    <MessageBox 
                        contactorType = "contractor"
                        project = {this.props.project}
                    />
                </TabPanel>
            </div>
        )
    }
}

export default ProjectDetailsView;