import React from 'react';
//import Material UI components;
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
//import Componetns;
// import ProjectTemplatesView from './ProjectTemplatesView';
import ProjectTemplateDetailView from './ProjectTemplateDetailView';
import ProjectFilesView from './ProjectFilesView';
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
      >
        {value === index && <Box p={3}>{children}</Box>}
      </Typography>
    );
  }
interface ProjectDetailsViewProps {
    setLevelId: (id: string) => void;
    setRoomId: (id: string) => void;
    setTemplateId: (id: string) => void;
    selectedLevelId : string;
    selectedRoomId : string;
    selectedTemplateId: string;
}
class ProjectDetailsView extends React.Component<ProjectDetailsViewProps,any>{
    constructor(props)
    {
        super(props);
        this.state = {
            value : 0
        }
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
            <div style = {{color:"black"}}>
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
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}
                >
                    {/* <ProjectTemplatesView
                        selectedLevelId = {this.props.selectedLevelId}
                        selectedRoomId = {this.props.selectedRoomId}
                    /> */}
                    <ProjectTemplateDetailView
                        selectedLevelId = {this.props.selectedLevelId}
                        selectedRoomId = {this.props.selectedRoomId}
                        selectedTemplateId = {this.props.selectedTemplateId}
                    />
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    <ProjectFilesView/>
                </TabPanel>
            </div>
        )
    }
}

export default ProjectDetailsView;