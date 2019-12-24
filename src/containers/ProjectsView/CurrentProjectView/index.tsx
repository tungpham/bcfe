import React from 'react';
import { connect } from 'react-redux';
import { compose } from "redux";
import { RouteComponentProps } from 'react-router-dom';
//import Material ui components;
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import TablePagination from '@material-ui/core/TablePagination';
//import Material ui icons;
import AutoRenewIcon from '@material-ui/icons/Autorenew';
import ClearIcon from '@material-ui/icons/Clear';
//import Custom components;
import ProjectCardItem from './components/projectItemCard';
//import Actions;
import {  getProjectsBySpecialty } from 'store/actions/gen-actions';
import { selectContractor } from 'store/actions/cont-actions';
import {  ProjectsWithSpecialties } from 'types/project';
import {   UserProfile, SpecialtyInfo } from 'types/global';
import { ContractorInfo } from 'types/contractor';
import './style.scss';

export interface ICurrentProjectViewProps extends RouteComponentProps {
    dirty: boolean;
    getProjectsBySpecialty: (page: number, size: number, specialities: string) => Promise<void>;
    selectContractor: (id: String) => Promise<void>;    
    projects: ProjectsWithSpecialties;
    userProfile: UserProfile;
    selectedContractor : ContractorInfo;
}
export interface FilterParam {
    name : String;
    id : String;
}
export interface ICurrentProjectViewState {
    rowsPerPage: number;
    currentPage: number;
    filterParams: FilterParam[];
    activeFilterParams: FilterParam[],
    isBusy: boolean,
    isBusyForLoadingProjects: boolean;
    specialties: SpecialtyInfo[];
    sort_value: number;
}

class CurrentProjectView extends React.Component<ICurrentProjectViewProps, ICurrentProjectViewState> {
    constructor(props: ICurrentProjectViewProps) {
        super(props);

        this.state = {
            rowsPerPage: 10,
            currentPage: 0,
            filterParams: [],
            activeFilterParams: [],
            isBusy: false,
            isBusyForLoadingProjects: false,
            specialties: null,
            sort_value: 1
        }
        this.handleChangeFilterParams = this.handleChangeFilterParams.bind(this);
    }

    async componentDidMount() {
        if ( !this.state.specialties) {
			this.setState({ isBusy: true });
            await this.props.selectContractor(this.props.userProfile.user_metadata.contractor_id);
			this.setState({ 
                isBusy: false, 
                specialties: this.props.selectedContractor.contractorSpecialties
            });
        }
        this.setState({
            isBusyForLoadingProjects: true
        })
        await this.props.getProjectsBySpecialty(0, 0,'');
        this.setState({
            rowsPerPage: this.props.projects ? this.props.projects.pageable.pageSize : this.state.rowsPerPage,
            currentPage: this.props.projects ? this.props.projects.pageable.pageNumber : this.state.currentPage,
            isBusyForLoadingProjects: false,
        })
    }

    handleChangePage =   async (page) => {
        var spe_params_string = "";
        this.state.activeFilterParams.map((_spe, index)=>{
            spe_params_string += "specialty=" + _spe.id ;
            if(this.state.activeFilterParams.length - 1 > index) spe_params_string += "&";
        })
        this.setState({ 
            isBusyForLoadingProjects: true,
        });
        await this.props.getProjectsBySpecialty(page, this.state.rowsPerPage, spe_params_string);
        this.setState({
            isBusyForLoadingProjects: false,
            currentPage: page,
        })
    }

    handleChangeRowsPerPage = event => {
        const { projects } = this.props;
        const rowsPerPage = event.target.value;
        const currentPage = (rowsPerPage >= projects.totalElements)
            ? 0 : this.state.currentPage;

        this.setState({
            rowsPerPage: rowsPerPage,
            currentPage: currentPage,
        },
        ()=>{
            this.handleChangePage(0);
        });

        // this.props.getAllProjects(currentPage, rowsPerPage);
    };
    isExist = (params, item) => {
        var result = false;
        for(var i = 0 ;i < params.length; i++)
        {
            if(params[i].id == item.id) result = true;
        }
        return result;
    }
    handleChangeFilterParams = (checked, specialityParam, activeIs) => {
        if(specialityParam.name == 'All Specialities' && checked)
        {
            this.setState({
                filterParams: []
            })
            return;
        }
        var _filterParams = this.state.filterParams;
        var _activeFilterParams = this.state.activeFilterParams;
        if(activeIs){
            if(checked)
            {
                if(!this.isExist(_activeFilterParams,specialityParam)){
                    _activeFilterParams.push(specialityParam);
                }
                if(!this.isExist(_filterParams,specialityParam)){
                    _filterParams.push(specialityParam);
                }
            } else {
                if(this.isExist(_activeFilterParams,specialityParam)){
                    _activeFilterParams = _activeFilterParams.filter(filter_item => filter_item.id != specialityParam.id)
                }
                if(this.isExist(_filterParams,specialityParam)){
                    _filterParams = _filterParams.filter(filter_item => filter_item.id != specialityParam.id)
                }
            }
        } else {
            if(checked)
            {
                if(!this.isExist(_filterParams,specialityParam)){
                    _filterParams.push(specialityParam);
                }
            } else {
                if(this.isExist(_filterParams,specialityParam)){
                    _filterParams = _filterParams.filter(filter_item => filter_item.id != specialityParam.id)
                }
            }
        }
        this.setState({
            filterParams: _filterParams,
            activeFilterParams: _activeFilterParams
        },
        ()=>{
            if(activeIs)
            {
                this.handleChangePage(0);
            }
        })
       
    }
    makePagenationItems = (totalPage) => {
        var list = [];
        var startPage =  Math.max(0, 5 * Math.floor(this.state.currentPage / 5) - 1);
        var endPage = Math.min(totalPage - 1,   5 * Math.floor(this.state.currentPage / 5 + 1));
        
        for(var i = startPage ; i <= endPage; i++)
        {
          list.push(i);
        }
        return(
          <React.Fragment>
            {
              list.map((item,index)=>(
                <Box key = {index} className={item==this.state.currentPage ? "pagenation-item-selected" : "pagenation-item"}
                  onClick = {()=>{
                     if(this.state.currentPage == item) return;
                     this.handleChangePage(item)
                  }}
                >
                   {item + 1}
                </Box>
              ))
            }
          </React.Fragment>
        )
      }
    public render() {
        return (
            <Box  className="project-list-view">
                <Box className = "filter-view">
                    <Typography className = "main-title">Filters:</Typography>
                    <Typography>
                        <Button  variant = "contained" size="small" color = "primary"
                            onClick = {()=>{

                                this.setState({
                                    activeFilterParams: [...this.state.filterParams]
                                },
                                ()=>{
                                    this.handleChangePage(0);
                                })
                            }}
                        ><AutoRenewIcon/><small>Apply filters</small></Button>
                        <Button  color="primary" size="small" style = {{color:"#366cd9"}}
                            onClick = {() => { 
                                this.setState({
                                    filterParams: [],
                                    activeFilterParams: []
                                },
                                ()=>{
                                    this.handleChangePage(0);
                                })
                             }}
                        ><ClearIcon/><small>Clear filters</small></Button>
                    </Typography>
                    <Typography className = "sub-title">City</Typography>
                    <TextField
						label=""
						defaultValue=""
						margin="normal"
						variant="outlined"
                        fullWidth
                        className = "city-input"
					/>
                    <Typography className = "sub-title">Sort By</Typography>
                    <Select
                        id="demo-customized-select"
                        variant="outlined"
                        fullWidth
                        value = {this.state.sort_value}
                        className = "sort-by-select"
                    >
                        <MenuItem value={1}><strong>Upload Date:</strong> Earliest</MenuItem>
                        <MenuItem value={2}><strong>Upload Date:</strong> Latest</MenuItem>
                    </Select>
                    <Typography className = "sub-title">Specialties</Typography>
                    <Box className = "specialty-select-view">
                        {
                            this.state.isBusy == true ? (
                                <CircularProgress disableShrink />
                            ) : (null)
                        }
                         <FormControlLabel
                            style = {{display:"block"}}
                            className = {this.state.filterParams.length == 0 ? "select-item selected" : "select-item"}
                            control={
                            <Checkbox
                                className = "checkbox-icon"
                                checked = {this.state.filterParams.length == 0  ? true : false}
                                onChange = {(e) => {this.handleChangeFilterParams(e.target.checked, {name:"All Specialities", id:""}, false)}}
                            />
                            }
                            label = "All Specialities"
                        />
                        {
                            this.state.specialties && this.state.specialties.length && this.state.specialties.map((item, index) => (
                                <FormControlLabel
                                    key = {index}
                                    style = {{display:"block"}}
                                    className = {this.isExist(this.state.filterParams, {"name":item.specialty.name, "id":item.specialty.id}) ? "select-item selected" : "select-item"}
                                    control={
                                    <Checkbox
                                       className = "checkbox-icon"
                                       checked = {this.state.filterParams.length == 0 && item.specialty.name == "All Specialities" ? true : this.isExist(this.state.filterParams, {"name":item.specialty.name, "id":item.specialty.id})}
                                       onChange = {(e) => {this.handleChangeFilterParams(e.target.checked, {"name":item.specialty.name, "id":item.specialty.id}, false)}}
                                    />
                                    }
                                    label = {item.specialty.name}
                                />
                            ))
                        }
                        
                    </Box>
                </Box>
                <Box className = "projects-view">
                    <Box className = "active-filter-view">
                        {
                            this.state.isBusyForLoadingProjects == true ? (
                                 <CircularProgress  />
                            ) : ( null )
                        }
                        {
                            this.state.activeFilterParams.length && !this.state.isBusyForLoadingProjects ? (
                                <Typography className = "active-filter-title"><strong>Active Filters: </strong></Typography>
                            ): (null)
                        }
                        {
                            !this.state.isBusyForLoadingProjects && this.state.activeFilterParams.map((item, index) => (
                                <Chip
                                    key = {index}
                                    variant="outlined"
                                    label = {item.name}
                                    color="secondary"
                                    onDelete = {()=>{this.handleChangeFilterParams(false, item, true)}}
                                    className = "active-filter-item"
                                />
                            ))
                        }
                    
                    </Box>
                    <Box>
                        {
                           !this.state.isBusyForLoadingProjects && this.props.projects && this.props.projects.content && this.props.projects.content.map((item, index) => {
                                return(
                                     <ProjectCardItem project = {item} key = {item.project.id} {...this.props}/>
                                )
                            })
                        }
                    </Box>
                    <Box className = "page-info-view">
                        {
                            !this.state.isBusyForLoadingProjects && this.props.projects && this.props.projects.content && this.props.projects.content.length > 0? (
                                <TablePagination
                                    style={{ overflow: 'auto' }}
                                    rowsPerPageOptions={[5, 10, 20]}
                                    component="div"
                                    count={this.props.projects.totalElements}
                                    rowsPerPage={this.state.rowsPerPage}
                                    page={this.state.currentPage}
                                    backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                                    nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />
                            ) : (null)
                        }
                        {
                            !this.state.isBusyForLoadingProjects && (!this.props.projects || (this.props.projects && this.props.projects.content && this.props.projects.content.length == 0)) ? (
                                "0 results"
                            ) : (null)
                        }
                       
                    </Box>
                </Box>

            </Box>
        );
    }
}

const mapDispatchToProps = {
    getProjectsBySpecialty,
    selectContractor
};

const mapStateToProps = state => ({
    projects: state.gen_data.projectsWithSpecialties,
    dirty: state.spec_data.dirty,
    selectedContractor: state.cont_data.selectedContractor,
    userProfile: state.global_data.userProfile
});

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
)(CurrentProjectView)
