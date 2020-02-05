import React from 'react';
import { connect } from 'react-redux';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import withConfirm, { withConfirmProps } from 'components/HOCs/withConfirm';
//import types;
import { ProjectLevel, ProjectInfo } from 'types/project';
import { UserProfile } from 'types/global';
import { NodeInfo } from 'types/global';
//import Materail UI components;
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import * as GenActions from 'store/actions/gen-actions';
import 'assets/css/projectLevelTreeview.css';
const styles = createStyles(theme => ({
    treeViewWrapper: {
       color:"black",
       width:"300px",
       padding:"20px",
       position: 'relative',
    },
    busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)'
	},
    titleView:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        marginBottom:"20px",
    },
    title:{
        flex:1,
        fontSize:"1.2rem",
        fontWeight: 700
    },
    levelItem:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:"5px",
        border:"1px solid gray",
        borderRadius:"3px",
        margin:"10px 0px",
        transition:"all 0.4s ease",
        "&:hover":{
            cursor:"pointer",
        }
    },
    levelItemSelected:{
        boxShadow:"0px 10px 10px rgba(0,0,0,.3)"
    },
    levelItemTitle:{
        flex:1,
        fontSize:"0.875rem"
    },
    roomItemsBox:{
        '&::before':{
            content: "",
            position: "absolute",
            top: "-26px",
            left: "-31px",
            borderLeft: "2px dashed #a2a5b5",
            width: "1px",
            height: "100%"
        }
    },
    roomItem:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        margin:"5px 0px",
        borderRadius:"3px",
        "&:hover":{
            cursor:"pointer",
        },
        "& span":{
            padding:"2px 5px"
        },
        "&:first-child":{
            marginTop:"10px"
        }
    },
    roomItemTitle:{
        flex:1,
        fontSize:"0.875rem",
        "& svg":{
            color:"#1752a8"
        }
    },
    templateItem:{
        display:"flex",
        margin:"5px 0px 5px 30px",
        alignItems:"center",
        "&:hover":{
            cursor:"pointer",
        },
        "& span":{
            padding:"2px 5px"
        },
        "&:first-child":{
            marginTop:"10px"
        }
    },
    templateItemTitle:{
        flex:1,
        fontSize:"0.875rem",
        "& svg":{
            width:"0.7em",
            color:"#43a047"
        }
    },
}));
interface ProjectLevelsTreeViewProps{
    levels: ProjectLevel[];
    project: ProjectInfo;
    userProfile: UserProfile;
    classes: ClassNameMap<string>;
    roots: NodeInfo[];
    levelGettingLoading: boolean;
    getLevels: (id: string) => Promise<void>;
    setLevelId: (id: string) => void;
    setRoomId: (id: string) => void;
    setTemplateId: (id: string) => void;
}
interface ProjectLevelsTreeViewState {
    selectedLevelId: string;
    selectedRoomId:  string;
    selectedTemplateId : string;
    levelExpanded: boolean;
    roomExpanded: boolean;
    levelExpandeds: boolean[];
    roomExpandeds:  boolean[][];
}
class ProjectLevelsTreeView extends React.Component<ProjectLevelsTreeViewProps & withSnackbarProps & withConfirmProps, ProjectLevelsTreeViewState>{
    constructor(props)
    {
        super(props);
        this.state = {
            selectedLevelId: null,
            selectedRoomId:  null,
            selectedTemplateId: null,
            levelExpanded: true,
            roomExpanded: true,
            levelExpandeds : [],
            roomExpandeds: []
        }
    }
    initExpandes = () => {
        var _levelExpandes = [];
        var _roomExpandes  = [];
        for(var i = 0 ;i < this.props.levels.length; i++)
        {
            _levelExpandes.push(true);
            var _roomExpandOfLevel = [];
            for(var j = 0 ; j < this.props.levels[i].rooms.length; j++)
            {
                _roomExpandOfLevel.push(true)
            }
            _roomExpandes.push(_roomExpandOfLevel);
        }
        this.setState({
            levelExpandeds: _levelExpandes,
            roomExpandeds: _roomExpandes
        })
    }
    componentDidMount(){
        if(this.props.levels)
        {
           this.initExpandes();
        }
    }
    componentDidUpdate(prevProps: ProjectLevelsTreeViewProps){
       if( prevProps.levelGettingLoading !== this.props.levelGettingLoading && this.props.levels){
           this.initExpandes();
       }
    }
    setLevel = (level , indexOfLevel) => {
        var _levelExpandes = this.state.levelExpandeds;
        var _roomExpandes  = this.state.roomExpandeds;
        _levelExpandes[indexOfLevel] = !_levelExpandes[indexOfLevel];
        for(var i = 0 ; i < _roomExpandes[indexOfLevel].length; i++)
        {
            _roomExpandes[indexOfLevel][i] = false;
        }
        this.setState({
            selectedLevelId: level.id,
            selectedRoomId: null,
            levelExpandeds: _levelExpandes,
            roomExpandeds: _roomExpandes
        }, ()=>{
            this.props.setRoomId(null);
            this.props.setTemplateId(null);
            if(this.state.levelExpandeds[indexOfLevel] === true)
            {
                this.props.setLevelId(this.state.selectedLevelId)
            } else {
                this.props.setLevelId(null)
            }
        })
    }
    
    setRoom = (level, room, indexOfLevel, indexOfRoom) => {
        var _roomExpandes  = this.state.roomExpandeds;
        _roomExpandes[indexOfLevel][indexOfRoom] = !_roomExpandes[indexOfLevel][indexOfRoom];

        this.setState({
            selectedLevelId: level.id,
            selectedRoomId:  room.id,
            selectedTemplateId: null,
            roomExpandeds: _roomExpandes
        }, ()=>{
            this.props.setLevelId(this.state.selectedLevelId);
            this.props.setRoomId( this.state.selectedRoomId );
            this.props.setTemplateId(null);
        })
    }
    setTemplate = (level, room, template) => {
        this.setState({
            selectedLevelId: level.id,
            selectedRoomId: room.id,
            selectedTemplateId: template.id
        },()=>{
            this.props.setLevelId(this.state.selectedLevelId);
            this.props.setRoomId(this.state.selectedRoomId);
            this.props.setTemplateId(this.state.selectedTemplateId);
        })
    }
    getSelectLists = (levelP, room) => {
        if(levelP === null || room === null) return [];
        var _selectList = [];
        var _level = this.props.levels.filter(level=>level.id === levelP.id);
        if(_level.length === 0) return [];
        var _currentRoom = _level[0].rooms.filter(_room => _room.id === room.id);
        if(_currentRoom.length === 0) return [];
        for(var i = 0 ; i < this.props.roots.length; i++)
        {
            for(var j = 0 ; j < this.props.roots[i].children.length; j++)
            {
                var flag = false;
                for( var k = 0 ; k < _currentRoom[0].selectionList.length; k++ )
                {
                    if(_currentRoom[0].selectionList[k].category.id === this.props.roots[i].children[j].id){
                        flag = true;
                        break;
                    }
                }
                if( flag ){
                    _selectList.push(this.props.roots[i])
                    break;
                }
            }
        }
        return _selectList;
    }
    render(){
        const {levels, classes} = this.props;
        return(
            <React.Fragment>
                <div className = {classes.treeViewWrapper}>
                    <Box className = {classes.titleView}>
                        <div className = {classes.title}>Levels</div>
                    </Box>
                    <Box>
                        {
                           this.props.levelGettingLoading === false && levels && levels.length > 0 ? levels.map((level,index)=>(
                                <React.Fragment key = {`level-tree-parent-${index}`}>
                                    <Box  className = {this.state.selectedLevelId === level.id  ? `${classes.levelItem} ${classes.levelItemSelected}` : classes.levelItem}  
                                        onClick = {()=>{ this.setLevel(level, index) }}
                                    >
                                        <div className = {  classes.levelItemTitle} >                               
                                        <div><strong>{`Level ${level.number} - ${level.name}`}</strong></div>
                                        <div><small>{`( ${level.rooms.length} rooms )`}</small></div>
                                        </div>
                                    </Box>
                                    <Box className = {classes.roomItemsBox}>
                                    {
                                         this.state.levelExpandeds &&  this.state.levelExpandeds.length > index && this.state.levelExpandeds[index] === true && level.rooms ? level.rooms.map((room, indexRoom) => (
                                            <React.Fragment key = {`room-item-${indexRoom}`}>
                                                <Box  className = {classes.roomItem}
                                                    onClick = {()=>{this.setRoom(level, room, index, indexRoom)}}
                                                >
                                                    <FormControlLabel 
                                                        checked={this.state.selectedRoomId === room.id && this.state.selectedLevelId === level.id }
                                                        value={room.name}
                                                        control={<Radio size = "small"/>}
                                                        label={room.name}
                                                        name="radio-button-demo"
                                                        className = {classes.roomItemTitle}
                                                    />
                                                </Box>
                                                {
                                                    this.state.roomExpandeds && this.state.roomExpandeds.length > index && this.state.roomExpandeds[index].length > indexRoom && this.state.roomExpandeds[index][indexRoom] === true ?  this.getSelectLists(level, room).map((select,index)=>(
                                                        <Box className = {classes.templateItem} key = {`template-item-${index}`}
                                                            onClick = {()=>{this.setTemplate(level, room, select)}}
                                                        >
                                                             <FormControlLabel 
                                                                checked={this.state.selectedTemplateId === select.id &&
                                                                         this.state.selectedRoomId     === room.id   &&
                                                                         this.state.selectedLevelId    === level.id}
                                                                value={select.name}
                                                                control={<Radio size = "small" color = "secondary"/>}
                                                                label={select.name}
                                                                name="radio-button-demo"
                                                                className = {classes.templateItemTitle}
                                                            />
                                                        </Box>
                                                    )) : (null)
                                                }
                                            </React.Fragment>
                                        )):(null)
                                    }
                                    </Box>
                                </React.Fragment>
                            )) : (null)
                        }
                    </Box>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
	userProfile: state.global_data.userProfile,
	levels: state.gen_data.levels,
    project: state.global_data.project,
    roots: state.tem_data.roots,
});

const mapDispatchToProps = dispatch => ({
    getLevels: id => dispatch(GenActions.getLevels(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)( withSnackbar<ProjectLevelsTreeViewProps>(withConfirm<ProjectLevelsTreeViewProps>(ProjectLevelsTreeView)) ));
