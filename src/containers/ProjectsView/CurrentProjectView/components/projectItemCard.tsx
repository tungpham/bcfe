import React from 'react';
import {Link} from 'react-router-dom';
//import Material ui components;
import Box from '@material-ui/core/Box';
import Typography  from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import LocationIcon from '@material-ui/icons/LocationOn';
import Button from 'components/CustomButtons/Button';
import { ProjectWithSpecialty } from '../../../../types/project';
import './style.scss';
export interface ProjectItemProps{
    project: ProjectWithSpecialty,
    history: any
}
export interface ProjectItemState{
    checkExpandForDes: boolean;
    checkExpandForSpe: boolean;
    isExpandedDes    : boolean;
    isExpandedSpe    : boolean;
}
const DES_LIMIT_COUNT = 256;
const SPE_LIMIT_COUNT = 150;
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
class ProjectItemCard extends React.Component<ProjectItemProps, ProjectItemState>{
    constructor(props:any)
    {
        super(props);
        this.state = {
            checkExpandForDes:  false,
            checkExpandForSpe:  false,
            isExpandedDes    :  false,
            isExpandedSpe    :  false
        }
    }
    render_des = (_des) => {
        if(_des === null || _des === undefined || _des === "") return ""
        if(_des.length > DES_LIMIT_COUNT) {
            if(!this.state.isExpandedDes){
                return (
                    <React.Fragment>
                            <React.Fragment>{_des.substr(0,DES_LIMIT_COUNT) }</React.Fragment>
                            <span className = "show-more-des"
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
                            <span className = "show-more-des"
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
    render_date = (_due) => {
        if(_due === null || _due === undefined || _due === "") return "";
        var due_date = new Date(_due);
        return MONTH_NAMES[due_date.getMonth()].substr(0,3) + " " + due_date.getDay() + ", " + due_date.getFullYear();
    }
    render()
    {
        var project_id = this.props.project.project.id;
        var spe_string_length = 0;
        return(
            <Box className = "project-item-card-view">
                <Box className = "project-item-card-header">
                    <Typography className = "posted-date-and-bids">
                        Posted on { this.render_date(this.props.project.project.submittedDate)}- {this.props.project.numberOfBids} Bids Received |
                    </Typography>
                    <Typography className = "name-text">
                        <Link to = {`/contractordetails/${this.props.project.project.genContractor.id}`}>
                            {this.props.project.project && this.props.project.project.genContractor && this.props.project.project.genContractor.address ? this.props.project.project.genContractor.address.name : ""}
                        </Link>
                        
                    </Typography>
                    <Typography className = "location-text">
                        <LocationIcon className = "location-icon"/>&nbsp;{this.props.project.project.city}
                    </Typography>
                    <Typography className = "bids-due-view">
                        <strong>Bids Due: </strong>
                            <span> {this.render_date(this.props.project.project.due)}</span>
                    </Typography>
                </Box>
                <Box className = "project-item-card-body">
                    <Box className = "details-view">
                        <Box>
                            <Typography className = "project-title">{this.props.project.project.title}</Typography>
                            <Typography><strong>Start Date: </strong><span>{this.render_date(this.props.project.project.startDate)}</span></Typography>
                        </Box>
                        <Typography className = "project-des">
                            {
                               this.render_des(this.props.project.project.description)
                            }
                        </Typography>
                    </Box>
                    <Box className = "view-details">
                        <Button  color = "primary"
                            style = {{padding: "6px 8px"}}
                            onClick = {()=>{
                                this.props.history.push('/projects/project_detail/' + this.props.project.project.id);
                            }}
                        >View Details</Button>
                    </Box>
                    
                </Box>
                <Box className = "project-item-card-footer">
                    {
                        this.props.project.project.projectSpecialties.map((item, index) => {
                            spe_string_length += item.specialty.name.length;
                            if(spe_string_length > SPE_LIMIT_COUNT && !this.state.isExpandedSpe) return null;
                            else {
                                return(
                                    <Chip
                                    key = {project_id + "-" + index}
                                    variant="outlined"
                                    label = {item.specialty.name}
                                    // color="primary"
                                    size = "small"
                                    style = {{margin:'3px'}}
                                />
                                )
                            }
                        })
                    }
                    {
                        spe_string_length > SPE_LIMIT_COUNT && !this.state.isExpandedSpe ? (
                            <span className = "show-more-spe"
                                onClick = {()=>{
                                    this.setState({
                                        isExpandedSpe: true
                                    })
                                }}
                            >&nbsp;...more</span>
                        ) : spe_string_length > SPE_LIMIT_COUNT && this.state.isExpandedSpe ? (
                            <span className = "show-more-spe"
                                onClick = {() => {
                                    this.setState({
                                        isExpandedSpe: false
                                    })
                                }}
                            >&nbsp;less</span>
                        ) : (null)
                    }
                </Box>
            </Box>
        )
    }
}
export default ProjectItemCard;