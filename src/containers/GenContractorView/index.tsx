import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';

import CustomTabs from "components/shared/CustomTabs";
import SecuredRoute from 'routers/SecuredRoute';
import ProjectDetailView from 'components/ProjectDetailView';
import ProposalDetailView from 'components/ProposalDetailView';
import ContractorDetailView from 'components/ContractorDetailView';
import AddProjectView from './AddProjectView';
import CurrentProjectView from './CurrentProjectView';
import ArchivedProject from './ArchivedProjectView';
import { UserProfile } from 'types/global';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AssignmentReturnOutlinedIcon from '@material-ui/icons/AssignmentReturnOutlined';
import { Button, InputAdornment, TextField, Grid, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import { useTheme } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ModalArea from '../../components/modals/modalArea';
import ModalService from '../../components/modals/modalService';
import ModalBudjet from '../../components/modals/modalBudjet';
import ModalDisc from '../../components/modals/modalDesc';
import ModalCity from '../../components/modals/modalCity';
import ModalProperty from '../../components/modals/modalProperty';
import ModalMaterial from '../../components/modals/modalMaterial';
import ModalSpecialty from '../../components/modals/modalSpecialty';
import auth0Client from 'services/auth0/auth';

interface IGenContractorViewProps extends RouteComponentProps {
    userProfile: UserProfile;
    defaultProps
}

const GenContractorView: React.SFC<IGenContractorViewProps> = (props, defaultProps) => {

    const [getvalue, setgetvalue] = useState('');
    const [getcheck1, setgetcheck1] = useState('');
    const [getcheck2, setgetcheck2] = useState('');
    const [getradio, setgetradio] = useState('');
    const [getarearadio, setgetarearadio] = useState('');
    const [getbudjet, setgetbudjet] = useState('');
    const [getbudjetvalue, setgetbudjetvalue] = useState('');
    const [getmaterial, setgetmaterial] = useState('');
    const [getdisc, setgetdisc] = useState('');
    const [specialities, setSpecialties] = useState([]);
    const [validation, setvalidation] = useState("");
    const data = [getvalue, getradio, getarearadio, getbudjet, getmaterial, getcheck1, getcheck2];
    const theme = useTheme();
    const [open, setOpen] = React.useState(false); 
    const [activeStep, setActiveStep] = React.useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [_searchTerm, _setSearchTerm] = useState("");
    const callback = (value) => {
        setgetvalue(value); // For Getting the value from modal(parent to child).
    } 

    const serviceCallvalue1 = (value1) => {
        setgetcheck1(value1);
    }

    const serviceCallvalue2 = (value2) => {
        setgetcheck2(value2);
    }

    const propertyCall = (value) => {
        setgetradio(value);
        if (value !== '') {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }
    const areaCall = (value) => {
        setgetarearadio(value);
        if (value !== '') {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }

    const budjetCallvalue = (value) => {
        setgetbudjetvalue(value);
    }
    const budjetCall = (value) => {
        setgetbudjet(value);
        if (value !== '') {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }
    const MaterialCall = (value) => {
        setgetmaterial(value);
        if (value !== '') {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }
    const discCall = (value) => {
        setgetdisc(value);
    }
    const handleNext = () => {
        if (((activeStep === 0 && getvalue === '') || getvalue === null)
        || (activeStep === 1 && getcheck1 === '' && getcheck2 === '')
        || (activeStep === 2 && getradio === '')
        || (activeStep === 3 && getarearadio === '')
        || (activeStep === 4 && getbudjet === '' && (getbudjetvalue === '' || getbudjetvalue === null)) || (activeStep === 5 && getmaterial === '')
        || (activeStep === 6 && specialities.length === 0)
        || (activeStep === 7 && getdisc.length < 40)) {
        setvalidation('Please fill the field');
        }
        else {
            setvalidation('');
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
        if ((activeStep === 8 && getdisc === '') || getdisc === null) {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
            handleClose();
        }
    };
    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }; 
    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        if (activeStep === 8) {
            auth0Client.signIn();
            var project_name = "";
            var services = [];
            var specialtyIds = [];
            var estimateArea = getarearadio.split("-");
            if(estimateArea[0] === "0") estimateArea[0] = "";
            if(estimateArea[1] === "inf") estimateArea[1] = "";
            specialities.forEach((item, index)=>{
                project_name += item.name;
                specialtyIds.push(item.id);
                if(index < specialities.length - 1) project_name += ","
            })
            if(getcheck1 !== "") services.push(getcheck1);
            if(getcheck2 !== "") services.push(getcheck2);
            const payload = {
                "project":{
                    "title": project_name + " project",
                    "description": getdisc,
                    "city": getvalue,
                    "budget": getbudjetvalue,
                    "due": new Date(),
                    "budgetFrom": getbudjet.split('-')[0],
                    "budgetTo": getbudjet.split('-')[1],
                    "propertyType": getradio,
                    "services": services,
                    "estimatedArea": estimateArea,
                    "provideMaterial": getmaterial
                },
                "specialtyIds":specialtyIds
            };
            localStorage.setItem("modalData", JSON.stringify(payload));
        }
        setActiveStep(0);
        setgetvalue("");
        setgetcheck1("");
        setgetcheck2("");
        setgetradio("");
        setgetarearadio("");
        setgetbudjet("");
        setgetbudjetvalue("");
        setgetdisc("");
        setgetmaterial("");
        setSpecialties([]);        
        setOpen(false);
    };
    const onSearchFun = (e) => {
        if (e.keyCode === 13) {
            setSearchTerm(e.target.value);
        }
    }

    const { userProfile, match, location } = props;
    if (
        !userProfile.user_metadata.roles.includes('Gen') &&
        !userProfile.user_metadata.roles.includes('GenSub') &&
        !userProfile.user_metadata.roles.includes('SuperAdmin')
    )
        return <Box> Access Forbidden </Box>;

    let tab = 0;
    if (location.pathname.includes('add_project')) tab = 1;
    if (location.pathname.includes('archived')) tab = 2;
    let tabViewStatus = true;
    if( location.pathname.includes("project_detail") ) tabViewStatus = false;
    return (
        <Box style={{ flexGrow: 1, backgroundColor: 'white', color: '#68e191'}}>
            {
                tabViewStatus === true ? (
                    <React.Fragment>
                        <CustomTabs
                            tabs={[{
                                className: 'icon-size',
                                label: 'New',
                                href: `${match.url}/current_pros`,
                                icon: ViewComfyIcon
                            }, {
                                className: 'icon-size',
                                label: 'Ongoing',
                                href: `${match.url}/add_project`,
                                icon: DateRangeIcon
                            },
                            {
                                className: 'icon-size',
                                label: 'Completed',
                                href: `${match.url}/archived`,
                                icon: AssignmentReturnOutlinedIcon
                            }
                            ]}
                            init={tab}
                            onClickFun = {[
                                setSearchTerm,
                                _setSearchTerm
                            ]}
                        />
                        <div style={{ position: 'fixed', backgroundColor: 'white', width: '98%', zIndex: 10 }}>
                            <div className="gen-contractor-add-btn" style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 30px ', margin: '20px 0px', position: 'fixed' }}>
                                <TextField
                                    id="outlined-start-adornment"
                                    placeholder="Search"
                                    className="gensearch"
                                    InputProps={{
                                        startAdornment: <InputAdornment style={{ height: 40 }} position="start"><SearchIcon className="searchicon" /></InputAdornment>,
                                    }}
                                    onKeyDown = {onSearchFun}
                                    onChange = {(e)=>_setSearchTerm(e.target.value)}
                                    value    = {_searchTerm}
                                    variant = "outlined"
                                />
                                <Button onClick={handleOpen} color="default" variant="contained"  ><AddIcon className="Addicon" />Add Project</Button>
                            </div>
                        </div>
                    </React.Fragment>
                ):(null)
            }
           
            <Box style={{ paddingTop: tabViewStatus=== true?'75px':'0px', overflow: 'auto', height:"100%"}}>
                <Switch >
                    <SecuredRoute
                        path={`${match.url}/current_pros`}
                        render={props => <CurrentProjectView {...props} searchTerm = {searchTerm}/>}
                    />
                    <SecuredRoute
                        path={`${match.url}/add_project`}
                        render={props => <AddProjectView {...props} searchTerm = {searchTerm}/>}
                    />
                    <SecuredRoute
                        path={`${match.url}/archived`}
                        render={props => <ArchivedProject {...props} searchTerm = {searchTerm}/>}
                    />
                    <SecuredRoute
                        path={`${match.url}/proposal_detail/:id`}
                        component={ProposalDetailView}
                    />
                    <SecuredRoute
                        path={`${match.url}/project_detail/:id`}
                        component={ProjectDetailView}
                    />
                    <SecuredRoute
                        path={`${match.url}/contractor_detail/:id`}
                        component={ContractorDetailView}
                    />
                    <Redirect path={`${match.url}`} to={`${match.url}/current_pros`} />
                </Switch>
            </Box>
            <Box>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={open}
                    onClose={handleClose}>
                    <div className="service-modal" style = {{width:"600px"}} >
                        <CloseIcon onClick={handleClose} className="modal-close" />
                        <Grid className="modal-page-col" item xs={10}>
                            <Typography variant="subtitle2" color="textSecondary">
                                {activeStep === 0 ? 1
                                    : activeStep === 1 ? 2
                                        : activeStep === 2 ? 3
                                            : activeStep === 3 ? 4
                                                : activeStep === 4 ? 5
                                                    : activeStep === 5 ? 6
                                                        : activeStep === 6 ? 7
                                                            : activeStep === 7 ? 8
                                                                : ''} of 8
                            </Typography>
                        </Grid>
                        <React.Fragment>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12}>
                                      {/* Receiving the value from Child */}
                                    {
                                        <div> {activeStep === 0 ? <ModalCity parentCallback={callback} errorMessage={validation} />
                                            : activeStep === 1 ? <ModalService data={data} serviceCallbackvalue1={serviceCallvalue1} serviceCallbackvalue2={serviceCallvalue2} errorMessage={validation} />
                                                : activeStep === 2 ? <ModalProperty
                                                    data={data}
                                                    propertyCallback={propertyCall} errorMessage={validation} />
                                                    : activeStep === 3 ? <ModalArea data={data} areaCallback={areaCall} errorMessage={validation} />
                                                        : activeStep === 4 ? <ModalBudjet
                                                            data={data}
                                                            budjetCallbackvalue={budjetCallvalue}
                                                            budjetCallback={budjetCall}
                                                            errorMessage={validation} />
                                                            : activeStep === 5 ? < ModalMaterial
                                                                data={data} MaterialCallback={MaterialCall} errorMessage={validation} />
                                                                : activeStep === 6 ?  <ModalSpecialty specialities = {specialities} setSpecialties = {setSpecialties}/>  
                                                                    : activeStep === 7 ? <ModalDisc
                                                                    discCallback={discCall} errorMessage={validation} /> :  handleClose()
                                                }
                                        </div>
                                    }
                                </Grid>
                            </Grid>

                            <MobileStepper
                                {...defaultProps}
                                variant="progress"
                                steps={8}
                                position="static"
                                activeStep={activeStep}
                            />
                        </React.Fragment>
                        <Grid container spacing={0}>
                            <Grid item xs={12} style={{ textAlign: 'center', margin: '20px 0px' }}>
                                <Button variant="contained" className="service-modal-prev"
                                    onClick={handleBack} disabled={activeStep === 0}
                                >
                                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                    Prev
                                   </Button>
                                <Button variant="contained" className="service-modal-next"
                                    onClick={handleNext}
                                >
                                    {activeStep === 7 ? 'Submit' : 'Next'}
                                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Modal>
            </Box>
        </Box>
    );
};

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
});

export default connect(mapStateToProps)(GenContractorView);

