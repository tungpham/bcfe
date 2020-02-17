import React from 'react';
import withConfirm  from 'components/HOCs/withConfirm';
import withSnackbar  from 'components/HOCs/withSnackbar';
import {withRouter} from 'react-router-dom';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import LocationIcon from '@material-ui/icons/LocationOn';
import {  ProjectInfo } from 'types/project';
//import api
import ProjApi from 'services/project';
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DES_LIMIT_COUNT = 100;
const styles = createStyles(theme => ({
    overViewWrapper: {
        position: 'relative',
        padding:"20px 30px !important",
        color : "black",
        backgroundColor:"white",
        zIndex:10,
        minHeight:"128px",
        display:"flex"
    },
    title:{
        fontSize:"1.2rem",
        fontWeight:600,
        color:"black"
    },
    locationIcon:{
            fontSize:"1rem !important"
    },
    showMoreLess:{
        color:"blue",
        "&:hover":{
            cursor: "pointer"
        }
    },
    deleteBusy:{
        position:"fixed",
        top:"50vh",
        left:"50vw"
    }
    
}));


export interface IProjectOverviewProps {
    project: ProjectInfo;
    classes: ClassNameMap<string>;
    levelGettingLoading: boolean;
    viewOnly: boolean;
}
interface IProjectOverviewState{
    isExpandedDes: boolean;
    askQuestionModal: boolean;
    message: string;
    postMessageLoading: boolean;
    deleteBusy: boolean;
}
class ProjectOverview extends React.Component<any, IProjectOverviewState> {

    constructor(props) {
        super(props);
        this.state = {
            isExpandedDes: false,
            askQuestionModal: false,
            message: "",
            postMessageLoading: false,
            deleteBusy: false
        }
    }
    render_date = (_due) => {
        if(_due === null || _due === undefined || _due === "") return "";
        var due_date = new Date(_due);
        return MONTH_NAMES[due_date.getMonth()].substr(0,3) + " " + due_date.getDay() + ", " + due_date.getFullYear();
    }
    render_des = (_des, classes) => {
        if(_des === null || _des === undefined || _des === "") return ""
        if(_des.length > DES_LIMIT_COUNT) {
            if(this.state.isExpandedDes !== true){
                return (
                    <React.Fragment>
                            <React.Fragment>{_des.substr(0,DES_LIMIT_COUNT) }</React.Fragment>
                            <span className = {classes.showMoreLess}
                                onClick = {() => {
                                    this.setState({
                                        isExpandedDes: true
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
                                        isExpandedDes: false
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
    handleChangeMessage = (e) => {
        this.setState({
            message: e.target.value
        })
    }
    handleSubmitMessage = async () => {
        var contractor_id = localStorage.getItem("contractor_ID");
        if(this.state.message === null || this.state.message === undefined || this.state.message === "" || contractor_id === null || contractor_id === "") return;
        this.setState({
            postMessageLoading: true
        })
        await ProjApi.postMessageToProject(this.props.project.id, contractor_id, this.state.message);
        this.setState({
            postMessageLoading: false
        })
    }
    componentDidUpdate(prevProps, prevState)
    {
        if(prevState.postMessageLoading === true && this.state.postMessageLoading === false)
        {
            this.setState({
                askQuestionModal: false
            })
        }
    }
    deleteProject = () => {
        this.props.showConfirm('Confirm', 'Do you really want to delete this template?', async () => {
            this.props.hideConfirm();
            if(!this.props.project) return;
            try{
                this.setState({
                    deleteBusy: true
                })
                await ProjApi.delete(this.props.project.id);
                this.props.showMessage(true, "Delete prject success")
                this.setState({
                    deleteBusy: false
                });
                this.props.history.push('/gen-contractor');
            } catch(error) {
                this.setState({
                    deleteBusy: false
                })
                this.props.showMessage(false, "Delete project failed");
            }
           
        }, true);
    }
    render() {
        const {classes} = this.props;
        console.log(this.props)
        return(
            <React.Fragment>
                <Box className = {classes.overViewWrapper}>
                {
                    this.props.levelGettingLoading === false ? (
                        <React.Fragment>    
                            <div style = {{flex:1}}>                       
                                <div  className = {classes.title}>{this.props.project.title}</div>
                                <div style = {{display:"flex", margin:"10px 0px", alignItems:"center"}}>
                                    <strong>Project Date: </strong>
                                    <span>&nbsp;{this.render_date(this.props.project.due)}&nbsp;</span>
                                    <span style = {{color:"#4f7fde"}}>{this.props.project.genContractor.address && this.props.project.genContractor.address.name ? this.props.project.genContractor.address.name : ""}</span>
                                    <LocationIcon  className = {classes.locationIcon}/>&nbsp;{this.props.project.city}
                                    <span style = {{marginLeft:"10px", fontWeight:500}}>
                                        <Link to = {`/contractordetails/${this.props.project.genContractor.id}`}>
                                            {this.props.project && this.props.project.genContractor && this.props.project.genContractor.address && this.props.project.genContractor.address.name ? this.props.project.genContractor.address.name : "Owner" }    
                                        </Link>
                                    </span>
                                </div>
                                <div style = {{color:"#a1a1a1"}}>
                                    {this.render_des(this.props.project.description, classes)}
                                </div>
                            </div>
                            {
                                this.props.viewOnly === true ? (
                                        <div><Button variant = "contained" color = "primary"
                                            onClick = {()=>{
                                                this.setState({
                                                    askQuestionModal: true,
                                                    message: ""
                                                })
                                            }}
                                        >Ask Question</Button></div>
                                ) : (
                                    <div><Button variant = "contained" color = "primary"
                                        onClick = {()=>{
                                           this.deleteProject();
                                        }}
                                    >Delete Project</Button></div>
                                )
                            }
                        </React.Fragment>
                    ): (null)
                }
                </Box>
                <Dialog
                    open={this.state.askQuestionModal}
                    onClose={() => this.setState({ askQuestionModal: false })}
                    aria-labelledby="form-dialog-title"
                >
                     <DialogTitle id="form-dialog-title">
                         Ask Question
                    </DialogTitle>
                    <DialogContent style = {{width:"500px"}}>
                        {
                            this.state.postMessageLoading && (
                                <CircularProgress/>
                            )
                        }
                        <Grid container>
                                <TextField
                                    fullWidth
                                    multiline
                                    rowsMax = {10}
                                    rows = {10}
                                    variant = "outlined"
                                    label = ""
                                    onChange = {this.handleChangeMessage}
                                    value = {this.state.message}
                                />
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            this.setState({
                                askQuestionModal: false
                            })
                        }}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            defaultChecked
                            onClick = {this.handleSubmitMessage}
                            disabled = {this.state.postMessageLoading}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
            
        )
    }
}

const mapStateToProps = state => ({
    project: state.global_data.project,
})


export default compose(
    withStyles(styles),
    connect(mapStateToProps)
)(withRouter(withConfirm<IProjectOverviewProps>(withSnackbar<IProjectOverviewProps>(ProjectOverview))));
