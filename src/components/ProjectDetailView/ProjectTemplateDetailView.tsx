import React from 'react';
import { connect } from 'react-redux';
//import Material ui components;
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
//import types;
import { ProjectLevel, ProjectInfo , ProjectLevelCategory} from 'types/project';
import { NodeInfo } from 'types/global';
import ProjApi from 'services/project';
//import components;
import ProjectOptionView from 'components/OptionsView';
const styles = createStyles(theme => ({
   roomInfo:{
       border:"1px solid #e6e8ea",
       padding:"20px",
       margin:"15px 0px",
       display:"flex"
   },
   roomDesc:{
       flex:1
   },
   roomInfoTitle:{
       fontWeight:"bold",
   },
   roomInfoDesc:{

   },
   roomInfoDetails:{
        display:"flex",
        justifyContent:"center",
   },
   roomInfoDetailView:{
       border:"1px solid #e6e8ea",
       padding:"5px",
       borderRadius:"5px",
       display:"flex",
       justifyContent:"center",
       alignItems:"center",
       marginRight:"20px",
       minWidth:"90px"
   },
    roomInfoDetailsDesc:{
        flex:1,
        paddingLeft:"30px"
    },
    showMoreLess:{
        color:"blue",
        "&:hover":{
            cursor: "pointer"
        },
    },
    templateDetails:{
        border:"1px solid #e6e8ea",
        padding:"20px",
        margin:"15px 0px"
    }
}));
interface ProjectTemplateDetailProps{
    selectedLevelId: string;
    selectedRoomId: string;
    selectedTemplateId: string;
    levels: ProjectLevel[];
    roots:  NodeInfo[];
    project: ProjectInfo;
    classes: ClassNameMap<string>;
}

interface ProjectTemplateDetailState{
    currentLevel: ProjectLevel;
    currentRoom:  ProjectLevelCategory;
    currentTemplate: NodeInfo;
    isExpandedDes1: boolean;
    isExpandedDes2: boolean;
}
class ProjectTemplateDetailView extends React.Component<ProjectTemplateDetailProps, ProjectTemplateDetailState>{
    constructor(props)
    {
        super(props);
        this.state = {
            currentLevel: null,
            currentRoom: null,
            currentTemplate: null,
            isExpandedDes1: false,
            isExpandedDes2: false
        }
    }
    setAllState = () => {
        if(!this.props.project || !this.props.roots || !this.props.levels) return;
        var _tempLevel = null;
        var _tempRoom  = null;
        var _tempTemplate = null;
        for(var i = 0; i < this.props.levels.length; i++)
        {
            if(this.props.selectedLevelId !== null && this.props.selectedLevelId !== "" && this.props.selectedLevelId !== undefined && this.props.selectedLevelId === this.props.levels[i].id)
            {
                _tempLevel = this.props.levels[i];
                for(var j = 0 ; j < this.props.levels[i].rooms.length; j++)
                {
                    if( this.props.selectedRoomId !== null && this.props.selectedRoomId !== "" && this.props.selectedRoomId !== undefined &&  this.props.levels[i].rooms[j].id === this.props.selectedRoomId){
                        _tempRoom = this.props.levels[i].rooms[j];
                        break;
                    }
                }
                break;
            }
        }
        for(var k = 0 ;k < this.props.roots.length; k++)
        {
            if(this.props.roots[k].id === this.props.selectedTemplateId)
            {
                _tempTemplate = this.props.roots[k]
            }
        }
        this.setState({
            currentLevel: _tempLevel,
            currentRoom: _tempRoom,
            currentTemplate:_tempTemplate
        })
    }
    render_des_1 = (_des,DES_LIMIT_COUNT, classes) => {
        if(_des === null || _des === undefined || _des === "") return ""
        if(_des.length > DES_LIMIT_COUNT) {
            if(this.state.isExpandedDes1 !== true){
                return (
                    <React.Fragment>
                            <React.Fragment>{_des.substr(0,DES_LIMIT_COUNT) }</React.Fragment>
                            <span className = {classes.showMoreLess}
                                onClick = {() => {
                                    this.setState({
                                        isExpandedDes1: true
                                    })
                                }}
                            >&nbsp;...more</span>
                    </React.Fragment>
                )
            } else {
                return (
                    <React.Fragment>
                            <React.Fragment>{_des}</React.Fragment>
                            <span className = {classes.showMoreLess}
                                onClick = {() => {
                                    this.setState({
                                        isExpandedDes1: false
                                    })
                                }}
                            >&nbsp; less</span>
                    </React.Fragment>
                )
            }
        } else {
            return _des
        }
    }
    render_des_2 = (_des,DES_LIMIT_COUNT, classes) => {
        if(_des === null || _des === undefined || _des === "") return ""
        if(_des.length > DES_LIMIT_COUNT) {
            if(this.state.isExpandedDes2 !== true){
                return (
                    <React.Fragment>
                            <React.Fragment>{_des.substr(0,DES_LIMIT_COUNT) }</React.Fragment>
                            <span className = {classes.showMoreLess}
                                onClick = {() => {
                                    this.setState({
                                        isExpandedDes2: true
                                    })
                                }}
                            >&nbsp;...more</span>
                    </React.Fragment>
                )
            } else {
                return (
                    <React.Fragment>
                            <React.Fragment>{_des}</React.Fragment>
                            <span className = {classes.showMoreLess}
                                onClick = {() => {
                                    this.setState({
                                        isExpandedDes2: false
                                    })
                                }}
                            >&nbsp; less</span>
                    </React.Fragment>
                )
            }
        } else {
            return _des
        }
    }
    componentDidUpdate(prevProps: ProjectTemplateDetailProps)
    {
        if(prevProps.selectedLevelId !== this.props.selectedLevelId ||
           prevProps.selectedRoomId !== this.props.selectedRoomId  ||
           prevProps.selectedTemplateId !== this.props.selectedTemplateId ||
           prevProps.levels !== this.props.levels ||
           prevProps.roots !== this.props.roots ||
           prevProps.project !== this.props.project  ){
               this.setAllState();
           }
    }
    componentDidMount(){
        this.setAllState();
    }
    roomUpdated = async () => {
        try {
            const data = await ProjApi.getRoom(this.state.currentRoom.id);
            this.setState({ currentRoom: data });
        } catch (error) {
            console.log('ProjectSelect.RoomUpdated: ', error);
        }
    }
    render(){
        const {classes} = this.props;
        if(this.state.currentLevel === null || this.state.currentRoom === null) return(<div></div>)
        return(
            <React.Fragment>
                <Box className = {classes.roomInfo}>
                    <Box style = {{flex:0.5}}>
                    <Box style = {{display:"flex"}}>
                        <Box className = {classes.roomInfoTitle}>
                            {
                                this.state.currentRoom ? this.state.currentRoom.name : ""
                            }&nbsp;&nbsp;&nbsp;
                        </Box>
                        <Box className = {classes.roomInfoDesc}>
                            {
                                this.state.currentRoom && this.state.currentLevel ? this.state.currentRoom.type + " ( " + this.state.currentLevel.name + ": "  : ""
                            }
                            {
                                this.render_des_1(this.state.currentLevel.description, 100, classes)
                            }
                            )
                        </Box>
                    </Box>
                    <Box style = {{display:"flex", marginTop:"10px"}}>
                        <Box  className = {classes.roomInfoDetails}>
                            <Box style = {{display:"flex"}}>
                                <Box style = {{fontWeight:500}}>Length: </Box>
                                <span>{this.state.currentRoom && this.state.currentRoom.l ? this.state.currentRoom.l : ""}&nbsp;&nbsp;&nbsp;</span>
                            </Box>
                            <Box style = {{display:"flex"}}>
                                <Box  style = {{fontWeight:500}}>Width: </Box>
                                <span>{this.state.currentRoom && this.state.currentRoom.w ? this.state.currentRoom.w : ""}&nbsp;&nbsp;&nbsp;</span>
                            </Box>
                            <Box style = {{display:"flex"}}>
                                <Box  style = {{fontWeight:500}}>Height: </Box>
                                <span>{this.state.currentRoom && this.state.currentRoom.h ? this.state.currentRoom.h : ""}&nbsp;&nbsp;&nbsp;</span>
                            </Box>
                        </Box>
                      
                    </Box>
                    </Box>
                    <Box className = {classes.roomDesc}>
                    <Box className = {classes.roomInfoDetailsDesc}>
                        <Box  style = {{fontWeight:500}}>Description:</Box>
                        <Box>
                            {this.state.currentRoom && this.state.currentRoom.description ?  this.render_des_2(this.state.currentRoom.description, 150, classes) : ""}
                        </Box>
                    </Box>
                </Box>
                </Box>
               
                    {
                        this.state.currentRoom && this.state.currentTemplate && (
                            <Box className = {classes.templateDetails}>
                                <ProjectOptionView
                                    root={this.state.currentTemplate}
                                    level={this.state.currentLevel}
                                    room={this.state.currentRoom}
                                    roomUpdated={this.roomUpdated}
                                />
                           </Box>
                        )
                    }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
	levels: state.gen_data.levels,
    project: state.global_data.project,
    roots: state.tem_data.roots,
});

export default connect(mapStateToProps, null)( withStyles(styles)( ProjectTemplateDetailView ));