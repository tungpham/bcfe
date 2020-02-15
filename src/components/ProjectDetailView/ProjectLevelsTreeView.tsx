import React from 'react';
import { connect } from 'react-redux';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import withConfirm, { withConfirmProps } from 'components/HOCs/withConfirm';
//import types;
import { ProjectLevel, ProjectLevelCategory, ProjectInfo } from 'types/project';
import { UserProfile } from 'types/global';
import { NodeInfo } from 'types/global';
//import Materail UI components;
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import * as GenActions from 'store/actions/gen-actions';
import 'assets/css/projectLevelTreeview.css';
const styles = createStyles(theme => ({
    treeViewWrapper: {
       color:"black",
       width:"300px",
       position: 'relative',
       backgroundColor:"white",
       boxShadow:"0px 10px 10px rgba(0,0,0,.05)",
       minHeight:"50vh"
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
        padding:"15px 20px",
        borderLeft:"5px solid #1752a8",
        backgroundColor: "whitesmoke",
        boxShadow:"0px -10px 10px rgba(0,0,0,.05)"
    },
    title:{
        flex:1,
        fontSize:"1.2rem",
        fontWeight: 700
    },
    levelsView:{
        padding:"20px !important"
    },
    actionIcon:{
        borderRadius:"4px",
        display:"flex",
        "&:hover":{
            backgroundColor:"#efe8e8",
            boxShadow:"0px 10px 10px rgba(0,0,0,.1)"
        },
        "& svg":{
            width:"20px",
            height:"20px"
        }
    },
    addIcon:{
        width:"23px",
        height:"23px",
        display:"flex",
        justifyContent:"center",
        border:"2px solid #1de091",
        borderRadius:"50%",
        fontWeight:"bold",
        fontSize:"14px",
        color:"#1de091",
        "&:hover":{
            cursor:"pointer"
        }
    },
    levelItem:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        padding:"5px !important",
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
            height: "100%",
            padding:"0px !important"
        }
    },
    roomItem:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        margin:"5px 0px",
        borderRadius:"3px",
        padding:"0px !important",
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
    addRoomBtn:{
        marginLeft:"15px"
    },
    
}));
interface ProjectLevelsTreeViewProps{
    viewOnly: boolean;
    levels: ProjectLevel[];
    project: ProjectInfo;
    userProfile: UserProfile;
    classes: ClassNameMap<string>;
    roots: NodeInfo[];
    levelGettingLoading: boolean;
    createLevel: (id: string, level: { number: number, name: string, description: string }) => Promise<any>;
    changeLevel: (id: string, level: { number: number, name: string, description: string }) => Promise<any>;
    deleteLvl: (id: string) => Promise<any>;
    getLevels: (id: string) => Promise<void>;
    createRoom: (id: string, room: {
		number: number,
		name: string,
		type: string,
		description: string,
		w: number,
		h: number,
		l: number
    }) => Promise<any>;
    updateRoom: (id: string, cat: {
		number: number,
		name: string,
		type: string,
		description: string,
		w: number,
		h: number,
		l: number
    }) => Promise<any>;
    deleteRoom: (id: string) => Promise<void>;
    deleteTemplate: (projectId:string, templateId:string) => Promise<void>;
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
    //add - level;
    number: any;
    name  : any;
    desc  : any;
    editId: string;
    isBusy: boolean;
    showModal: boolean;
    addRoomModalShow: boolean;
    //add-room
    number_room: any;
    type: any;
    name_room:any;
    desc_room: any;
    width: any;
    height: any;
    length: any;

    editRoomId: string;
    //select-view;
    selectList: any[];
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
            levelExpanded: false,
            roomExpanded: false,
            number : {
                value: '1',
                errMsg: undefined
            },
            name : {
                value: '',
                errMsg: undefined
            },
            desc: {
                value: '',
                errMsg: undefined
            },
            editId: '',
            isBusy: false,
            showModal: false,
            addRoomModalShow: false,
            number_room:{
                value: '1',
                errMsg: undefined
            },
            name_room:{
                value: '',
                errMsg: undefined
            },
            desc_room:{
                value: '',
                errMsg: undefined
            },
            width:{
                value: '0',
                errMsg: undefined
            },
            height:{
                value: '0',
                errMsg: undefined
            },
            length:{
                value: '0',
                errMsg: undefined
            },
            type: "BATHROOM",
            editRoomId: null,
            selectList: [],
            levelExpandeds : [],
            roomExpandeds: []
        }
    }
    showAddDialog = () => {
        this.setState({
            showModal: true,
            editId: '',
            number : {
                value: '1',
                errMsg: undefined
            },
            name : {
                value: '',
                errMsg: undefined
            },
            desc: {
                value: '',
                errMsg: undefined
            },
        });
    };
    initExpandes = () => {
        var _selectedLevelId    = null;
        var _selectedRoomId     = null;
        var _selectedTemplateId = null;
        var findIniteTemplate   = false;
        for(var i = 0 ;i < this.props.levels.length; i++)
        {
            if(findIniteTemplate) break;
            for( var j = 0; j < this.props.levels[i].rooms.length; j++ )
            {
                var templates = this.getSelectLists(this.props.levels[i], this.props.levels[i].rooms[j]);
                if( templates.length > 0 ) {
                    _selectedLevelId = this.props.levels[i].id;
                    _selectedRoomId  = this.props.levels[i].rooms[j].id;
                    _selectedTemplateId = templates[0].id;
                    findIniteTemplate = true;
                    break;
                }
            }
        }
        var _levelExpandes = [];
        var _roomExpandes  = [];
        for(var i1 = 0 ;i1 < this.props.levels.length; i1++)
        {
            if(this.props.levels[i1].id === _selectedLevelId)  _levelExpandes.push(true);
            else _levelExpandes.push(this.props.viewOnly);
            var _roomExpandOfLevel = [];
            for(var j1 = 0 ; j1 < this.props.levels[i1].rooms.length; j1++)
            {
                if(this.props.levels[i1].rooms[j1].id === _selectedRoomId)  _roomExpandOfLevel.push(true)
                else _roomExpandOfLevel.push(this.props.viewOnly)
            }
            _roomExpandes.push(_roomExpandOfLevel);
        }
        this.setState({
            levelExpandeds: _levelExpandes,
            roomExpandeds: _roomExpandes,
            selectedLevelId: findIniteTemplate === true ? _selectedLevelId : null,
            selectedRoomId : findIniteTemplate === true ? _selectedRoomId : null,
            selectedTemplateId: findIniteTemplate === true ? _selectedTemplateId : null
        },()=>{
            this.props.setLevelId(this.state.selectedLevelId);
            this.props.setRoomId(this.state.selectedRoomId);
            this.props.setTemplateId(this.state.selectedTemplateId);
        })
    }
    addLevel = async (number, name, desc) => {
        if (!this.props.project) return;
		try {
            const levelNo = parseInt(number.value);
            if(this.state.editId.length === 0)
            {
                if (this.props.levels && this.props.levels.some(item => item.number === levelNo)) {
                    this.setState({
                        number:{
                            value: this.state.number.value,
                            errMsg: 'This level number is already taken'
                        }
                    });
                    return;
                }
                if (this.state.name.value.length === 0) {
                    this.setState({
                        name: {
                            value: this.state.name.value,
                            errMsg: 'Name is required'
                        }
                    });
                    return;
                }
                this.setState({isBusy: true})
                await this.props.createLevel(this.props.project.id, { number, name, description: desc });
                await this.props.getLevels(this.props.project.id);
                var _levelExpandes = this.state.levelExpandeds;
                var _roomExpandes = this.state.roomExpandeds;
                _levelExpandes.push(false);
                _roomExpandes.push([]);
                _roomExpandes[_roomExpandes.length - 1] = [];
                this.setState({
                    isBusy: false,
                    showModal: false,
                    name:{
                        value: '',
                        errMsg: undefined
                    },
                    desc: {
                        value: '',
                        errMsg: undefined
                    },
                    levelExpandeds: _levelExpandes,
                    roomExpandeds: _roomExpandes
                });
                this.props.showMessage(true, 'Add Level success');
            } else {
                if (this.state.name.value.length === 0) {
                    this.setState({
                        name:{
                            value: this.state.name.value,
                            errMsg: 'Name is required'
                        }
                    });
                   
                    return;
                }
                this.setState({isBusy: true})
                this.updateLvl(this.state.editId,  this.state.number.value, this.state.name.value, this.state.desc.value);
                await this.props.getLevels(this.props.project.id);
                this.setState({
                    isBusy: false,
                    showModal: false,
                    name:{
                        value: '',
                        errMsg: undefined
                    },
                    desc: {
                        value: '',
                        errMsg: undefined
                    }
                });
            }
			
		} catch (error) {
			console.log('ProjectLevelWrapper.AddLevel: ', error);
			this.setState({isBusy: false});
			this.props.showMessage(false, 'Add Level failed');
		}
    }
    removeLevel =  (id: string) => {
        this.props.showConfirm('Confirm', 'Do you really want to delete this level?', async () => {
            this.props.hideConfirm();
            const { deleteLvl, getLevels } = this.props;
            if (!this.props.project) return;
            this.setState({isBusy: true});
            var _levelExpandes = this.state.levelExpandeds;
            var _roomExpandes  = this.state.roomExpandeds;
            for(var i = 0 ;i < this.props.levels.length; i++)
            {
                if(this.props.levels[i].id === id)
                {   
                    _levelExpandes.splice(i,1);
                    _roomExpandes.splice(i,1);
                    break;
                }
            }
            try {
                await deleteLvl(id);
                await getLevels(this.props.project.id);
                this.setState({
                    isBusy: false,
                    levelExpandeds:_levelExpandes,
                    roomExpandeds: _roomExpandes
                });
                this.props.setRoomId(null);
                this.props.setLevelId(null);
                this.props.setTemplateId(null);
                this.props.showMessage(true, 'Delete Level success');
            } catch (error) {
                console.log('ProjectLevelWrapper.RemoveLevel: ', error);
                this.setState({isBusy: false});
                this.props.showMessage(false, 'Delete Level failed');
            }
        }, true);
		
	}
    closeDialog = () => {
        this.setState({showModal:false})
    }
    setLevel = (level, indexOfLevel) => {
        var _levelExpandes = this.state.levelExpandeds;
        var _roomExpandes  = this.state.roomExpandeds;
        if(this.state.selectedLevelId !== level.id) _levelExpandes[indexOfLevel] = true;
        else _levelExpandes[indexOfLevel] = !_levelExpandes[indexOfLevel];
        for(var i = 0 ; i < _roomExpandes[indexOfLevel].length; i++)
        {
            _roomExpandes[indexOfLevel][i] = false;
        }
        this.setState({
            selectedLevelId: level.id,
            selectedRoomId: null,
            selectedTemplateId: null,
            levelExpandeds: _levelExpandes,
            roomExpandeds: _roomExpandes
        }, ()=>{
            this.props.setRoomId(null);
            this.props.setTemplateId(null);
            if(this.state.levelExpandeds[indexOfLevel] === true)
            {
                this.props.setLevelId(this.state.selectedLevelId);
                this.props.setRoomId(null);
                this.props.setTemplateId(null);
            } else {
                this.props.setLevelId(null)
                this.props.setRoomId(null);
                this.props.setTemplateId(null);
            }
        })
    }
    updateLvl = async (id: string, no: number, name: string, desc: string) => {
        if (!this.props.project) return;
        this.setState({isBusy: true})
		try {
			await this.props.changeLevel(id, {
				number: no, name, description: desc
			});
			await this.props.getLevels(this.props.project.id);
			this.setState({isBusy: false})
			this.props.showMessage(true, 'Update Level success');
		} catch (error) {
			console.log('ProjectLevelWrapper.UpdateLevel: ', error);
			this.setState({isBusy: false})
			this.props.showMessage(false, 'Update Level failed');
		}
	}
    showEditDialog = (id) => {
        const editing = this.props.levels.filter(level => level.id === id);
        this.setState({
            number:{
                value: editing[0].number.toString(),
                errMsg: undefined
            },
            name : {
                value: editing[0].name.toString(),
                errMsg: undefined
            },
            desc: {
                value: editing[0].description.toString(),
                errMsg: undefined
            },
            editId: id,
            showModal: true
        })
    }
    showEditRoomDialog = (room) => {
        this.setState({
            number_room: {
                value:room.number,
                errMsg: undefined
            },
            type: room.type,
            name_room: {
                value:room.name,
                errMsg: undefined
            },
            desc_room: {
                value:room.description,
                errMsg: undefined
            },
            width: {
                value:room.w,
                errMsg: undefined
            },
            height:{
                value: room.h,
                errMsg: undefined
            },
            length: {
                value: room.l,
                errMsg: undefined
            },
            editRoomId: room.id,
            addRoomModalShow: true
        })

    }
    addCategory = async (id: string, cat: ProjectLevelCategory) => {
        if (!this.props.project) return;
        this.setState({isBusy: true});
		try {
			await this.props.createRoom(id, {
				number: cat.number,
				name: cat.name,
				type: cat.type,
				description: cat.description,
				w: cat.w,
				l: cat.l,
				h: cat.h
            });
            var _roomExpandes = this.state.roomExpandeds;
            for(var i = 0 ; i < this.props.levels.length; i++)
            {
                if(this.props.levels[i].id === id)
                {
                    _roomExpandes[i].push(false);
                }
            }
			await this.props.getLevels(this.props.project.id);
            this.setState({
                isBusy: false,
                roomExpandeds:_roomExpandes
            });
			this.props.showMessage(true, 'Create Room success');
		} catch (error) {
			console.log('ProjectLevelWrapper.AddRoom: ', error);
			this.setState({isBusy: false});
			this.props.showMessage(false, 'Create Room failed');
		}
    }
    updateCategory = async (id: string, cat: ProjectLevelCategory) => {
        if (!this.props.project) return;
        this.setState({isBusy: true});
		try {
			await this.props.updateRoom(id, {
				number: cat.number,
				name: cat.name,
				type: cat.type,
				description: cat.description,
				w: cat.w,
				l: cat.l,
				h: cat.h
			});
			await this.props.getLevels(this.props.project.id);
            this.setState({isBusy: false});
			this.props.showMessage(true, 'Change Room success');
		} catch (error) {
			console.log('ProjectLevelWrapper.AddRoom: ', error);
			this.setState({isBusy: false});
			this.props.showMessage(false, 'Change Room failed');
		}
    }
    removeRoom =  (id: string) => {
        this.props.showConfirm('Confirm', 'Do you really want to delete this room?', async () => {
            this.props.hideConfirm();
            const { deleteRoom, getLevels } = this.props;
            if (!this.props.project) return;
            this.setState({isBusy: true})
            try {
                await deleteRoom(id);
                var _roomExpandes = this.state.roomExpandeds;
                for(var i = 0; i < this.props.levels.length; i++)
                {
                    for(var j = 0; j < this.props.levels[i].rooms.length; j++)
                    {
                        if(this.props.levels[i].rooms[j].id === id){
                            _roomExpandes[i].splice(j,1);
                            break;
                        }
                    }
                }
                await getLevels(this.props.project.id);
                this.setState({
                    isBusy: false,
                    roomExpandeds: _roomExpandes
                });
                this.props.setRoomId(null);
                this.props.showMessage(true, 'Delete room success');
            } catch (error) {
                console.log('ProjectLevelWrapper.RemoveRoom: ', error);
                this.setState({isBusy: false});
                this.props.showMessage(false, 'Delete Room failed');
            }
        }, true);
    }
    removeTemplate = (id:string) => {
            this.props.showConfirm('Confirm', 'Do you really want to delete this template?', async () => {
                this.props.hideConfirm();
                if (!this.props.project) return;
                this.setState({isBusy: true})
                try {
                    await this.props.deleteTemplate(this.props.project.id, id);
                    await this.props.getLevels(this.props.project.id);
                    this.setState({
                        isBusy: false,
                        selectedTemplateId: null
                    });
                    this.props.setTemplateId(null)
                    this.props.showMessage(true, 'Delete template success');
                } catch (error) {
                    console.log('ProjectLevelWrapper.RemoveRoom: ', error);
                    this.setState({isBusy: false});
                    this.props.showMessage(false, 'Delete template failed');
                }
            }, true);
    }
    handleAddRoom = () => {
        const roomNo = parseInt(this.state.number_room.value);
        const level = this.props.levels.filter(levelItem => levelItem.id === this.state.selectedLevelId)[0];
        if (level.rooms && level.rooms.some(item => item.number === roomNo) && !(this.state.editRoomId !== null && this.state.editRoomId !== '' && this.state.editRoomId !== undefined)) {
            this.setState({
                number_room:{
                    value: this.state.number_room.value,
                    errMsg: 'This room number is already taken'
                }
            })
            return;
        }
        if( this.state.number_room.value.length === 0 )
        {
            this.setState({
                number_room:{
                    value: this.state.number_room.value,
                    errMsg: 'Number is required'
                }
            })
            return;
        }
        if (this.state.name_room.value.length === 0) {
            this.setState({
                name_room:{
                    value: this.state.name_room.value,
                    errMsg: 'Name is required'
                }
            })
            return;
        }
        if (this.state.width.value === '' || this.state.width.value === '0') {
            this.setState({
                width:{
                    value : this.state.width.value,
                    errMsg: 'width is required'
                }
            });
            return;
        }
        if (this.state.height.value === '' || this.state.height.value === '0') {
            this.setState({
                height:{
                    value : this.state.width.value,
                    errMsg: 'height is required'
                }
            });
            return;
        }
        if (this.state.length.value === '' || this.state.length.value === '0') {
            this.setState({
                length:{
                    value : this.state.width.value,
                    errMsg: 'length is required'
                }
            });
            return;
        }

        const cat: ProjectLevelCategory = {
            id: '',
            number: parseInt(this.state.number_room.value),
            name: this.state.name_room.value,
            type: this.state.type,
            description: this.state.desc_room.value,
            w: parseFloat(this.state.width.value),
            h: parseFloat(this.state.height.value),
            l: parseFloat(this.state.length.value)
        };
        if(this.state.editRoomId !== ''  && this.state.editRoomId !== null && this.state.editRoomId !== undefined)
        {
            this.updateCategory(this.state.editRoomId, cat)
        } else {
            this.addCategory(level.id, cat);
        }
        this.setState({
            addRoomModalShow: false,
            name_room: {
                value: '',
                errMsg: undefined
            },
            desc_room:{
                value: '',
                errMsg: undefined
            },
            width:{
                value: '0',
                errMsg: undefined
            },
            height:{
                value: '0',
                errMsg: undefined
            },
            length:{
                value: '0',
                errMsg: undefined
            },
            editRoomId: null
        })
    }
    setRoom = (level,room, indexOfLevel, indexOfRoom) => {
        var _roomExpandes  = this.state.roomExpandeds;
        _roomExpandes[indexOfLevel][indexOfRoom] = !_roomExpandes[indexOfLevel][indexOfRoom];
        this.setState({
           selectedLevelId: level.id,
           selectedRoomId: room.id,
           selectedTemplateId: null,
           roomExpandeds: _roomExpandes
        }, ()=>{
            this.props.setLevelId(this.state.selectedLevelId)
            this.props.setRoomId(this.state.selectedRoomId);
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
    componentDidMount(){
        if(this.props.levels)
        {
           this.initExpandes();
        }
    }
    
    componentDidUpdate(prevProps:ProjectLevelsTreeViewProps){
        if( prevProps.levelGettingLoading !== this.props.levelGettingLoading && this.props.levels){
            this.initExpandes();
        }
    }
    deleteCategory = async (id: string) => {
		const { deleteRoom, getLevels } = this.props;
		if (!this.props.project) return;
        this.setState({isBusy: true});
		try {
			await deleteRoom(id);
			await getLevels(this.props.project.id);
            this.setState({isBusy: false});
			this.props.showMessage(true, 'Delete Room success');
		} catch (error) {
			console.log('ProjectLevelWrapper.DeleteRoom: ', error);
            this.setState({isBusy: false});
			this.props.showMessage(false, 'Delete Room failed');
		}
	}
    render(){
        const {levels, classes} = this.props;
        const cats = [
            { name: 'Bath Room', value: 'BATHROOM' },
            { name: 'Bed Room', value: 'BEDROOM' },
            { name: 'Living Room', value: 'LIVINGROOM' },
            { name: 'Kitchen', value: 'KITCHEN' },
            { name: 'Rooftop', value: 'ROOFTOP' },
            { name: 'Hallway', value: 'HALLWAY' },
            { name: 'Stairs', value: 'STAIRS' },
            { name: 'Other', value: 'OTHER' }
        ];
        return(
            <React.Fragment>
                <div className = {classes.treeViewWrapper}>
                    <Box className = {classes.titleView}>
                        <div className = {classes.title}>Levels</div>
                        {
                            !this.props.viewOnly && (
                                <div className = {classes.addIcon}
                                    onClick = {this.showAddDialog}
                                >+</div>
                            )
                        }
                    </Box>
                    <Box className = {classes.levelsView}>
                        {
                           this.props.levelGettingLoading === false && levels && levels.length > 0 ? levels.map((level,index)=>(
                                <React.Fragment key = {`level-tree-parent-${index}`}>
                                    <Box  className = {this.state.selectedLevelId === level.id && this.state.levelExpandeds[index] === true ? `${classes.levelItem} ${classes.levelItemSelected}` : classes.levelItem}  onClick = {()=>{ this.setLevel(level, index) }}>
                                        <div className = {  classes.levelItemTitle} >                               
                                        <div><strong>{`Level ${level.number} - ${level.name}`}</strong></div>
                                        <div><small>{`( ${level.rooms.length} rooms )`}</small></div>
                                        </div>
                                        <div>
                                            {
                                               !this.props.viewOnly && this.state.selectedLevelId === level.id ? (
                                                    <div style = {{display:"flex"}}>
                                                        <span className = {classes.actionIcon}>
                                                            <EditIcon fontVariant = "small" 
                                                                onClick = {e =>{
                                                                    this.showEditDialog(level.id);
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                }}
                                                            />
                                                        </span>
                                                        <span className = {classes.actionIcon}>
                                                            <DeleteIcon fontVariant = "small" style = {{color:"#a94442"}}
                                                                onClick = {e =>{
                                                                    this.removeLevel(level.id);
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                }}
                                                            />
                                                        </span>
                                                    </div>
                                                ) : (null)
                                            }
                                        </div>
                                    </Box>
                                    <div className = {classes.roomItemsBox}>
                                    {
                                        this.state.levelExpandeds &&  this.state.levelExpandeds.length > index && this.state.levelExpandeds[index] === true && level.rooms ? level.rooms.map((room, indexRoom) => (
                                            <React.Fragment key = {`room-item-${indexRoom}`}>
                                                <Box  className = {classes.roomItem}
                                                    onClick = {()=>{this.setRoom(level, room, index, indexRoom)}}
                                                >
                                                    <FormControlLabel 
                                                        checked={this.state.selectedRoomId === room.id }
                                                        value={room.name}
                                                        control={<Radio size = "small"/>}
                                                        label={room.name}
                                                        name="radio-button-demo"
                                                        className = {classes.roomItemTitle}
                                                    />
                                                        {
                                                            !this.props.viewOnly && this.state.selectedRoomId === room.id && this.state.levelExpandeds[index] === true ? (
                                                                <div style = {{display:"flex"}}>
                                                                     <span className = {classes.actionIcon}>
                                                                        <EditIcon fontVariant = "small" 
                                                                            onClick = {e =>{
                                                                                this.showEditRoomDialog(room);
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                            }}
                                                                        />
                                                                    </span>
                                                                    <span className = {classes.actionIcon}>
                                                                        <DeleteIcon fontVariant = "small" style = {{color:"#a94442"}}
                                                                            onClick = {e =>{
                                                                                this.removeRoom(room.id);
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                            }}
                                                                    />
                                                            </span>
                                                                </div>
                                                            ) : (null)
                                                        }
                                                </Box>
                                                {
                                                     this.state.roomExpandeds && this.state.roomExpandeds.length > index && this.state.roomExpandeds[index].length > indexRoom && this.state.roomExpandeds[index][indexRoom] === true ?  this.getSelectLists(level, room).map((select,index)=>(
                                                        <Box className = {classes.templateItem} key = {`template-item-${index}`}
                                                            onClick = {()=>{this.setTemplate(level, room, select)}}
                                                        >
                                                             {/* <div className = {classes.templateItemTitle}>{ select.name }</div> */}
                                                             <FormControlLabel 
                                                                checked={this.state.selectedTemplateId === select.id }
                                                                value={select.name}
                                                                control={<Radio size = "small" color = "secondary"/>}
                                                                label={select.name}
                                                                name="radio-button-demo"
                                                                className = {classes.templateItemTitle}
                                                            />
                                                            {
                                                               !this.props.viewOnly && this.state.selectedTemplateId === select.id ? (
                                                                    <span className = {classes.actionIcon}>
                                                                        <DeleteIcon fontVariant = "small" style = {{color:"#a94442"}}
                                                                            onClick = {e =>{
                                                                                this.removeTemplate(select.id);
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                            }}
                                                                        />
                                                                    </span>
                                                                ) : (null)
                                                            }
                                                             
                                                        </Box>
                                                    )):(null)
                                                }
                                            </React.Fragment>
                                        )):(null)
                                    }
                                    {
                                       !this.props.viewOnly && this.state.selectedLevelId === level.id && this.state.levelExpandeds[index] === true ? (
                                            <Button className = {classes.addRoomBtn}
                                                onClick = {()=>{
                                                    this.setState({addRoomModalShow: true})
                                                }}
                                            > + Add room</Button>
                                        ) : (null)
                                    }
                                    </div>
                                </React.Fragment>
                            )) : (null)
                        }
                    </Box>
                </div>
                <Dialog
                    open={this.state.showModal}
                    onClose={this.closeDialog}
                    aria-labelledby='form-dialog-title'
                >
                    <DialogTitle id='form-dialog-title'>
                    {
                        this.state.editId.length === 0 ? "Add a Level" : "Change a Level"
                    }
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please input the level information
                        </DialogContentText>
                        <TextField
                            autoFocus
                            fullWidth
                            margin='dense'
                            label='Level Number'
                            type='number'
                            error={this.state.number.errMsg !== undefined}
                            helperText={this.state.number.errMsg}
                            value={parseInt(this.state.number.value)}
                            onChange={event => this.setState({ number:{ value: event.target.value, errMsg: undefined }})}
                        />
                        <TextField
                            fullWidth
                            required
                            margin='dense'
                            label='Name'
                            error={this.state.name.errMsg !== undefined}
                            helperText={this.state.name.errMsg}
                            value={this.state.name.value}
                            onChange={event => this.setState({ name:{ value: event.target.value, errMsg: undefined } })}
                        />
                        <TextField
                            fullWidth
                            margin='dense'
                            label='Description'
                            value={this.state.desc.value}
                            onChange={event => this.setState({ desc:{ value: event.target.value, errMsg: undefined }})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog}>
                            Cancel
                        </Button>
                        <Button
                            onClick={()=>this.addLevel(this.state.number.value, this.state.name.value, this.state.desc.value)}
                            color='primary'
                            defaultChecked
                        >
                            {this.state.editId.length === 0 ? 'Add' : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={this.state.addRoomModalShow}
                    onClose={() => this.setState({ addRoomModalShow: false })}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                        {
                            this.state.editRoomId === '' || this.state.editRoomId === null || this.state.editRoomId === undefined ? "Add a Room" : "Change Room"
                        }
                    </DialogTitle>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12} md={6} style={{ padding: '8px 0px' }}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    required
                                    margin='dense'
                                    label='Room Number'
                                    type='number'
                                    error={!!this.state.number_room.errMsg}
                                    helperText={this.state.number_room.errMsg}
                                    value={parseInt(this.state.number_room.value)}
                                    onChange={event => 
                                        this.setState({
                                             number_room:{
                                                value: event.target.value, 
                                                errMsg: undefined
                                            } 
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6} style={{ padding: '29px 0px 8px 24px' }}>
                                <Select
                                    style={{ minWidth: 180 }}
                                    value={this.state.type}
                                    onChange={(e)=>{
                                        this.setState({
                                            type: e.target.value 
                                        })
                                    }}
                                    name="level-categories"
                                    fullWidth
                                >
                                    {cats.map((cat, index) => (
                                        <MenuItem value={cat.value} key={index}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                        <Box>
                            <TextField
                                required
                                label="Name"
                                margin="dense"
                                error={!!this.state.name_room.errMsg}
                                helperText={this.state.name_room.errMsg}
                                value={this.state.name_room.value}
                                fullWidth={true}
                                onChange={(e)=>{
                                    this.setState({
                                        name_room:{
                                            value:e.target.value,
                                            errMsg: undefined 
                                        }  
                                    })
                                }}
                            />
                        </Box>
                        <Box>
                            <Grid container direction='row-reverse'>
                                <Grid item xs={12} md={8} style={{ padding: '8px 0px 8px 24px' }}>
                                    <TextField
                                        label="Description"
                                        margin="dense"
                                        value={this.state.desc_room.value}
                                        fullWidth={true}
                                        multiline={true}
                                        rowsMax={12}
                                        onChange={(e)=>{
                                            this.setState({
                                                desc_room:{
                                                    value:e.target.value,
                                                    errMsg: undefined 
                                                }  
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4} style={{ padding: '8px 0px' }}>
                                    <TextField
                                        label="Width"
                                        margin="dense"
                                        required
                                        type='number'
                                        fullWidth={true}
                                        error={!!this.state.width.errMsg}
                                        helperText={this.state.width.errMsg}
                                        value={this.state.width.value}
                                        onChange={(e)=>{
                                            this.setState({
                                                width:{
                                                    value:e.target.value,
                                                    errMsg: undefined 
                                                }  
                                            })
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                        }}
                                    />
                                    <TextField
                                        label="Height"
                                        margin="dense"
                                        required
                                        type='number'
                                        fullWidth={true}
                                        error={!!this.state.height.errMsg}
                                        helperText={this.state.height.errMsg}
                                        value={this.state.height.value}
                                        onChange={(e)=>{
                                            this.setState({
                                                height:{
                                                    value:e.target.value,
                                                    errMsg: undefined 
                                                }  
                                            })
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                        }}
                                    />
                                    <TextField
                                        label="Length"
                                        margin="dense"
                                        required
                                        type='number'
                                        fullWidth={true}
                                        error={!!this.state.length.errMsg}
                                        helperText={this.state.length.errMsg}
                                        value={this.state.length.value}
                                        onChange={(e)=>{
                                            this.setState({
                                                length:{
                                                    value:e.target.value,
                                                    errMsg: undefined 
                                                }  
                                            })
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">m</InputAdornment>,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.setState({
                                addRoomModalShow: false
                            })
                        }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.handleAddRoom}
                            color="primary"
                            defaultChecked
                        >
                            {
                                this.state.editRoomId === '' || this.state.editRoomId === null || this.state.editRoomId === undefined ? "Add" : "Save"
                            }
                        </Button>
                    </DialogActions>
                </Dialog>
                {
                    this.state.isBusy === true ? (
                        <CircularProgress className={classes.busy}/>
                    ) : (null)
                }
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
	createLevel: (id, level) => dispatch(GenActions.createLevel(id, level)),
	createRoom: (id, room) => dispatch(GenActions.createRoom(id, room)),
	changeLevel: (id, data) => dispatch(GenActions.updateLevel(id, data)),
	updateRoom: (id, cat) => dispatch(GenActions.updateRoom(id, cat)),
	deleteLvl: id => dispatch(GenActions.deleteLevel(id)),
	deleteRoom: id => dispatch(GenActions.deleteRoom(id)),
    getLevels: id => dispatch(GenActions.getLevels(id)),
    deleteTemplate: (projectId, templateId) => dispatch(GenActions.deleteTemplate(projectId, templateId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)( withSnackbar<ProjectLevelsTreeViewProps>(withConfirm<ProjectLevelsTreeViewProps>(ProjectLevelsTreeView)) ));
