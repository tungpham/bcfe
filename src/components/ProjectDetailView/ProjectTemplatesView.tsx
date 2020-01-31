import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProjectTemplatesSearchBox from './ProjectTemplateSearchBox';
import { NodeInfo } from 'types/global';
import { ProjectLevel, ProjectInfo } from 'types/project';
import ProjApi from 'services/project';
import * as GenActions from 'store/actions/gen-actions';
interface ProjectTemplatesViewProps{
    selectedLevelId: string;
    selectedRoomId:  string;
    roots: NodeInfo[];
    project: ProjectInfo;
    levels: ProjectLevel[];
    getLevels: (id: string) => Promise<void>;
}
interface ProjectTemplatesViewState {
    categoryList: NodeInfo[];
    addTemplatesModalShow: boolean;
    selectedCategories: string[];
    isBusy: boolean;
}
class ProjectTemplatesView extends React.Component<ProjectTemplatesViewProps,ProjectTemplatesViewState>{
    constructor(props)
    {
        super(props)
        this.state = {
            categoryList : this.props.roots ? [...this.props.roots]:[],
            addTemplatesModalShow: false,
            selectedCategories: [],
            isBusy: false,
        }
    }
    selectCategories = (event) => {
        var _temp = this.state.selectedCategories;
        if(event.target.checked)
        {   
            if(!_temp.includes(event.target.value)) _temp.push(event.target.value)
        } else {
            if(_temp.includes(event.target.value)) {
                _temp = _temp.filter(_cat => _cat !== event.target.value);
            }
        }
        this.setState({
            selectedCategories: _temp
        })
    }
    handleClose = () => {
        this.setState({
            addTemplatesModalShow: false,
            selectedCategories: []
        })
    }
    handleSelectTemplate = async () => {
        this.handleClose();
        this.setState({isBusy:true});
        try{
            for(var i = 0 ;i < this.state.selectedCategories.length; i++)
            {
                var _root = null;
                for( var j = 0 ; j <  this.props.roots.length; j++ )
                {
                    if( this.props.roots[j].id === this.state.selectedCategories[i] ){
                        _root = this.props.roots[j];
                        break;
                    }
                }
                if(_root === null ) continue;
                await ProjApi.createSelection(this.props.selectedRoomId, _root.children[0].id,  _root.children[0].id, {}, []);
            }
            this.props.getLevels(this.props.project.id);
            this.setState({isBusy:false});
        } catch(error){
            this.props.getLevels(this.props.project.id);
            this.setState({isBusy:false});
        }
    }
    componentDidMount(){
        const level = this.props.levels.filter(_level => _level.id === this.props.selectedLevelId);
        if(level.length === 0) return;
        const room = level[0].rooms.filter(_room => _room.id === this.props.selectedRoomId);
        if(room.length === 0) return;
        var _categoryList = [];
        for(var i = 0 ;i < this.props.roots.length; i++)
        {
            var flag = false;
            for(var j = 0; j < this.props.roots[i].children.length; j++)
            {
                for(var k = 0 ; k < room[0].selectionList.length; k++ )
                {
                    if(room[0].selectionList[k].category.id === this.props.roots[i].children[j].id)
                    {
                        flag = true;
                        break;
                    }
                }
            }
            if(!flag) _categoryList.push(this.props.roots[i])
            
        }
        this.setState({
            categoryList:_categoryList
        })
    }
    componentDidUpdate(prevProps : ProjectTemplatesViewProps){
        if( (prevProps.selectedRoomId !== this.props.selectedRoomId && this.props.selectedRoomId !== null && this.props.selectedRoomId !== undefined && this.props.selectedRoomId !== "" && this.props.roots && this.props.roots.length > 0 ) || prevProps.levels !== this.props.levels)
        {   
            const level = this.props.levels.filter(_level => _level.id === this.props.selectedLevelId);
            if(level.length === 0) return;
            const room = level[0].rooms.filter(_room => _room.id === this.props.selectedRoomId);
            if(room.length === 0) return;
            var _categoryList = [];
            for(var i = 0 ;i < this.props.roots.length; i++)
            {
                var flag = false;
                for(var j = 0; j < this.props.roots[i].children.length; j++)
                {
                    for( var k = 0; k <  room[0].selectionList.length; k++ )
                    {
                        if(room[0].selectionList[k].category.id === this.props.roots[i].children[j].id)
                        {
                            flag = true;
                            break;
                        }
                    }
                }
                if(!flag) _categoryList.push(this.props.roots[i])
                
            }
            this.setState({
                categoryList:_categoryList
            })
        }
    }
    render(){
        if(this.props.selectedRoomId === null || this.props.selectedRoomId === undefined || this.props.selectedRoomId === "") {
            return null;
        }
        return(
            <React.Fragment>
                <div style = {{display:"flex"}}>

                    <ProjectTemplatesSearchBox
                        options = {this.state.categoryList}
                        roomId = {this.props.selectedRoomId}
                        project = {this.props.project}
                    />
                     <Button  variant = "contained" size = "small"
                      
                        onClick = {()=>{
                            this.setState({
                                addTemplatesModalShow: true
                            })
                        }}
                        style = {{marginLeft:"10px", backgroundColor:"#1752a8", color:"white"}}
                    ><ListIcon/>Show All</Button>
                </div>
                <Dialog
                    open={this.state.addTemplatesModalShow}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">TEMPLATE SELECT</DialogTitle>
                    <DialogContent>
                         <Grid container direction='row-reverse'>
                         {
                              this.state.categoryList && this.state.categoryList.length > 0 ? this.state.categoryList.map((root, index) => (
                                    <Grid item md = {6} key = {`template-item-${index}`}>
                                       <FormControlLabel 
                                            checked={this.state.selectedCategories.includes(root.id)}
                                            value={root.id}
                                            control={<Checkbox/>}
                                            label={root.name}
                                            name="radio-button-demo"
                                            onChange = {this.selectCategories}
                                        />
                                    </Grid>
                              )) : (null)
                          }
                          </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.handleSelectTemplate}
                            color="primary"
                            defaultChecked
                        >
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
                <div>
                    {
                        this.state.isBusy === true ? (
                            <CircularProgress/>
                        ) : (null)
                    }
                </div>           
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => ({
    roots: state.tem_data.roots,
    project: state.global_data.project,
    levels: state.gen_data.levels,
});
const mapDispatchToProps = dispatch => ({
	getLevels: id => dispatch(GenActions.getLevels(id)),
});
export default compose(
    connect(mapStateToProps, mapDispatchToProps )
)(ProjectTemplatesView);
