import React from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { compose } from 'redux';
import Box from '@material-ui/core/Box';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import LocationIcon from '@material-ui/icons/LocationOn';
import {  ProjectInfo } from 'types/project';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DES_LIMIT_COUNT = 100;
const styles = createStyles(theme => ({
    overViewWrapper: {
        position: 'relative',
        border:"1px solid #e6e8ea",
        padding:"10px 30px !important",
        color : "black"
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
    }
    
}));


export interface IProjectOverviewProps {
    project: ProjectInfo;
    classes: ClassNameMap<string>;
    levelGettingLoading: boolean;
}
interface IProjectOverviewState{
    isExpandedDes: boolean;
}
class ProjectOverview extends React.Component<IProjectOverviewProps, IProjectOverviewState> {

    constructor(props) {
        super(props);
        this.state = {
            isExpandedDes: false
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
    render() {
        const {classes} = this.props;
        return(
            <React.Fragment>
                {
                    this.props.levelGettingLoading === false ? (
                        <Box className = {classes.overViewWrapper}>
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
                        </Box>
                    ): (null)
                }
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
)(ProjectOverview);
