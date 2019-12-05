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
import Axios from 'axios';
import HttpUrlConstant from 'apis/global';

interface IGenContractorViewProps extends RouteComponentProps {
    userProfile: UserProfile;
    defaultProps
}

const GenContractorView: React.SFC<IGenContractorViewProps> = (props, defaultProps) => {

    const [Id] = useState(props.userProfile.user_metadata.contractor_id);
    const [getvalue, setgetvalue] = useState('');
    const [getcheck, setgetcheck] = useState(false);
    const [getredio, setgetredio] = useState('');
    const [getarearedio, setgetarearedio] = useState('');
    const [getbudjet, setgetbudjet] = useState('');
    const [getbudjetvalue, setgetbudjetvalue] = useState('');
    const [getmaterial, setgetmaterial] = useState('');
    const [getdisc, setgetdisc] = useState('');
    const [validation, setvalidation] = useState("");
    const [getChar, setgetChar] = useState(0);
    const [Newdata] = useState([]);


    const theme = useTheme();

    const callback = (value) => {
        setgetvalue(value);
    }
    const data = [getvalue, getredio, getarearedio, getbudjet, getmaterial, getcheck];

    const serviceCall = (value) => {
        setgetcheck(value);
    }
    const propertyCall = (value) => {
        setgetredio(value);
        if (value !== '') {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }
    const areaCall = (value) => {
        setgetarearedio(value);
        if (value !== '') {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }
    const charCount = (value) => {
        setgetChar(value);
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
            || (activeStep === 1 && getcheck === false)
            || (activeStep === 2 && getredio === '')
            || (activeStep === 3 && getarearedio === '')
            || (activeStep === 4 && getbudjet === '' && (getbudjetvalue === '' || getbudjetvalue === null)) || (activeStep === 5 && getmaterial === '')
            || (activeStep === 6 && getChar < 40)) {
            setvalidation('Please fill the field');
        }
        else {
            setvalidation('');
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
        if ((activeStep === 7 && getdisc === '') || getdisc === null) {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
            handleClose();
        }

    };
    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const [open, setOpen] = React.useState(false);

    const [activeStep, setActiveStep] = React.useState(0);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        var apiPath = `/contractors/${Id}/projects`;
        if (activeStep === 7) {
            const payload = {
                "title": "A project",
                "description": getdisc,
                "budget": Number(getbudjet),
                "endDate": new Date(),
            };
            if (payload) {
                Axios.post(process.env.REACT_APP_PROJECT_API + apiPath,
                    payload, { headers: HttpUrlConstant.headers }).then(response => {
                        Newdata.push(response.data);
                    })
            }
        }
        setActiveStep(0);
        setOpen(false);
    };

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

    return (
        <Box style={{ flexGrow: 1, backgroundColor: 'white', color: '#68e191' }}>
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
            />
          <div style={{position:'fixed',backgroundColor:'white',width:'98%',zIndex:10}}>
          <div className="gen-contractor-add-btn" style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 30px ' , margin: '20px 0px',position:'fixed' }}>
                <TextField
                    id="outlined-start-adornment"
                    placeholder="Search"
                    className="gensearch"
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon className="searchicon" /></InputAdornment>,
                    }}
                    variant="outlined"
                />
                <Button onClick={handleOpen} color="default" variant="contained"  ><AddIcon className="Addicon" />Add Project</Button>
            </div>
          </div>
            <Box style={{ height: 'calc(100vh - 64px - 56px)', paddingTop: '10%', overflow: 'auto' }}>
                <Switch >
                    <SecuredRoute
                        path={`${match.url}/current_pros`}
                        component={CurrentProjectView}
                    />
                    <SecuredRoute
                        path={`${match.url}/add_project`}
                        component={AddProjectView}
                    />
                    <SecuredRoute
                        path={`${match.url}/archived`}
                        component={ArchivedProject}
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
                    <div className="service-modal" >
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
                                                            : ''} of 7
                            </Typography>
                        </Grid>
                        <React.Fragment>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12}>
                                    {
                                        <div> {activeStep === 0 ? <ModalCity parentCallback={callback} errorMessage={validation} />
                                            : activeStep === 1 ? <ModalService data={data} serviceCallback={serviceCall} errorMessage={validation} />
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
                                                                : activeStep === 6 ? <ModalDisc
                                                                    charCountback={charCount}
                                                                    discCallback={discCall} errorMessage={validation} /> : handleClose()}</div>
                                    }
                                </Grid>
                            </Grid>

                            <MobileStepper
                                {...defaultProps}
                                variant="progress"
                                steps={7}
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
                                    {activeStep === 6 ? 'Submit' : 'Next'}
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

