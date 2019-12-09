/*eslint-disable*/
import React, { useState, useEffect, useRef } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import '../../assets/css/con.css';
import { List, ListItem, Grid, ListItemAvatar, Avatar, Divider, Button, Paper } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { useTheme } from '@material-ui/core';
import PersonOutlineSharpIcon from '@material-ui/icons/PersonOutlineSharp';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
import axios from 'axios';
import InputBase from '@material-ui/core/InputBase';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import BorderLinearProgress from '@material-ui/core/LinearProgress';
import StarRateRoundedIcon from '@material-ui/icons/StarRateRounded';
import SliderPastProject from '../BeforeLogin/SliderPastProject';//Slider of post project with modal
import Gallery from '../BeforeLogin/Gallery.js';//Gallery Slider
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import Modal from '@material-ui/core/Modal';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ModalArea from '../modals/modalArea';
import ModalService from '../modals/modalService';
import ModalBudjet from '../modals/modalBudjet';
import ModalDisc from '../modals/modalDesc';
import ModalCity from '../modals/modalCity';
import ModalProperty from '../modals/modalProperty';
import ModalMaterial from '../modals/modalMaterial';
import { useStyles } from '@material-ui/pickers/views/Month/MonthView';
import HttpUrlConstant from 'apis/global';
import { withRouter } from 'react-router-dom';
import auth0Client from 'services/auth0/auth';
import Axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

console.clear();

function ContractorDetails(props) {
    const theme = useTheme();
    const [apiPath] = useState('contractors/');
    const [Id] = useState(props.match.params.Id);
    const [Detailsdata, setDetailsdata] = useState([]);
    const [PersonReviewList, setPersonReviewList] = useState([]);
    const [Rate, setRate] = useState('');
    const [FaqList, setFaqList] = useState([]);
    const [year] = useState(new Date().getFullYear());
    const [currentPage, setcurrentPage] = useState(1);
    const [ReviewPerPage] = useState(2);
    const [active, setactive] = useState(false);
    const [getvalue, setgetvalue] = useState('');
    const [getcheck, setgetcheck] = useState(false);
    const [getredio, setgetredio] = useState('');
    const [getarearedio, setgetarearedio] = useState('');
    const [getbudjet, setgetbudjet] = useState('');
    const [getbudjetvalue, setgetbudjetvalue] = useState('');
    const [getmaterial, setgetmaterial] = useState('');
    const [getdisc, setgetdisc] = useState('');
    const [validation, setvalidation] = useState("");
    const [radioButton, setRadioButton] = useState("");
    const [aCall, setAreaCall] = useState("");
    const [material, setMaterial] = useState("");
    const [activeStep, setActiveStep] = React.useState(0);
    const [Avtarurl, setAvtarurl] = useState('');
    const [getChar, setgetChar] = useState('');
    const data = [getvalue, getredio, getarearedio, getbudjet, getmaterial, getcheck];
    const classes = useStyles();

    const handleOpen = () => {
        setOpen(true);
    };

    const callback = (value) => {
        setgetvalue(value);
    }


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



    function fetchimage() {
        axios.get(`${HttpUrlConstant.BASE_URL}/contractors/${Id}/avatar`).then((data) => {
            if (data.status === 200) {
                setAvtarurl(`${HttpUrlConstant.BASE_URL}/contractors/${Id}/avatar`);
            }
        })
    }

    useEffect(() => {
        fetchimage()
        if ((!radioButton === '' && activeStep === 2) || (!aCall === '' && activeStep === 3) || (!material === '' && activeStep === 5)) {
            handleNext();
        }
    });
    const handleClose = () => {
        var apiPath = `/contractors/${Id}}/projects`;
        const payload = {
            "title": "A project",
            "description": getdisc,
            "budget": Number(getbudjet),
            "endDate": new Date(),
        };
        var popupModalArray = [{ "modalTitle": "A project", "getbudjet": getbudjet, "getbudjetvalue": getbudjet, "description": getdisc, "budgetCustomValue": getbudjetvalue }];
        localStorage.setItem("modalData", JSON.stringify(popupModalArray));
        if (activeStep === 7) {
            localStorage.getItem('User_Id') === null || localStorage.getItem('User_Id') === '' ? auth0Client.signIn() :
                Axios.post(process.env.REACT_APP_PROJECT_API + apiPath,
                    payload, { headers: HttpUrlConstant.headers }).then(response => {
                        Newdata.push(response.data);
                    });
        }
        setActiveStep(0);
        setOpen(false);
    };

    const handleNext = () => {
        if (((activeStep === 0 && getvalue === '') || getvalue === null)
            || (activeStep === 1 && getcheck === false)
            || (activeStep === 2 && getredio === '')
            || (activeStep === 3 && getarearedio === '')
            || (activeStep === 4 && getbudjet === '' && (getbudjetvalue === '' || getbudjetvalue === null)) || (activeStep === 5 && getmaterial === '')
            || (activeStep === 6 && getdisc.length < 40)) {
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
    const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

    const credentialref = useRef(null)
    const executeScrolltocredential = () => scrollToRef(credentialref)

    const Aboutref = useRef(null)
    const executeScrolltointro = () => scrollToRef(Aboutref)

    const galleryref = useRef(null)
    const executeScrolltoGallery = () => scrollToRef(galleryref);

    const Reviewref = useRef(null);
    const executeScrolltoReview = () => scrollToRef(Reviewref);

    const Faqref = useRef(null);
    const executeScrolltoFAQ = () => scrollToRef(Faqref);

    function fetchdetails() {
        axios.get(process.env.REACT_APP_PROJECT_API + apiPath + Id).then((data) => {
            const detailsdata = [...Detailsdata, data.data];
            setDetailsdata(detailsdata);
        })
    }

    function fetchPersonReviews() {
        axios.get(process.env.REACT_APP_PROJECT_API + apiPath + Id + '/reviews').then((data) => {
            setPersonReviewList(data.data);
        })
    }

    function fetchRating() {
        axios.get(process.env.REACT_APP_PROJECT_API + apiPath + Id + '/get_reviews').then((data) => {
            setRate(data.data);
        })
    }

    function fetchFAQ() {
        axios.get(process.env.REACT_APP_PROJECT_API + apiPath + Id + '/faq').then((data) => {
            setFaqList(data.data);
        })
    }

    function handleClick(event) {
        setcurrentPage(Number(event.target.id))
        setactive(true);
    }

    useEffect(() => {
        if ((radioButton !== '' && activeStep === 2) ||
            (aCall !== '' && activeStep === 3) ||
            (material !== '' && activeStep === 5)) {
            handleNext();
        }
        fetchdetails();
        fetchPersonReviews();
        fetchRating();
        fetchFAQ();
        // eslint-disable-next-line
    }, [])

    // Logic for displaying page numbers

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(PersonReviewList.length / ReviewPerPage); i++) {
        pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <li
                className={currentPage === number ? 'active' : 'pagenumbers'}
                key={number}
                id={number}
                onClick={handleClick}>
                {number}
            </li>
        );
    });

    const indexOfLastReview = currentPage * ReviewPerPage;
    const indexOfFirstReview = indexOfLastReview - ReviewPerPage;
    const currentReview = PersonReviewList.slice(indexOfFirstReview, indexOfLastReview);
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            {Detailsdata.length > 0 ? <List className="loader"><CircularProgress  className="detailsloader"/></List> :
                <div style={{ width: '1290px', marginTop: '-30px' }} className="full-width">
                    {Detailsdata.map((detailsdata) => {
                        return <div key={detailsdata.address.id}
                            className="contractor-details">
                            <div className="see pros" onClick={props.history.goBack} style={{ cursor: 'pointer' }}>
                                <ArrowBackIosIcon className="arrow-left" /><span>See pros</span>
                            </div>
                            <div className="list-menu">
                                <List className="details-ul">
                                    <ListItem onClick={executeScrolltointro} className="details-list" key={1}>About</ListItem>
                                    <ListItem onClick={executeScrolltoGallery} className="details-list" key={2}>Photos</ListItem>
                                    <ListItem onClick={executeScrolltoReview} className="details-list" key={3}>Review</ListItem>
                                    <ListItem onClick={executeScrolltocredential} className="details-list" key={4}>Credentials</ListItem>
                                    <ListItem onClick={executeScrolltoFAQ} className="details-list" key={5}>FAQs</ListItem>
                                </List>
                            </div>
                            <Divider />
                            {active}
                            <Grid container spacing={3} style={{ marginTop: '10px', marginBottom: '10px', marginLeft: '0px' }}>
                                <Grid item xs={12} md={2} lg={2} className="details-info" >
                                    <ListItemAvatar className="details-photo">
                                        {Avtarurl ? <div key={detailsdata.id}>
                                            {<img alt="image" className="displayNone" src={process.env.REACT_APP_PROJECT_API + "contractors/" + Id + "/avatar"} />}
                                        </div> :
                                            <div key={detailsdata.id}>
                                                {<img alt="image" className="displayNone" src={`${HttpUrlConstant.Image_URL}/api/?name=${detailsdata.address.company}`} />}
                                            </div>}
                                    </ListItemAvatar>
                                </Grid>
                                <Grid item xs={12} lg={4} className="details-name">
                                    <div className="details-person">
                                        <h3 className="name">{detailsdata.address.company}</h3>
                                        <div className="details-rating">
                                            <span className="details-rate">{detailsdata.reviewSummary.rating}</span>
                                            <span className="details-stars"><Rating className="details-ratings" name="size-medium" value={detailsdata.reviewSummary.rating} readOnly /></span>
                                            <span className="details-views">({detailsdata.reviewSummary.totalReviews})</span>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>

                            <div className="introduction" ref={Aboutref}>
                                <p className="intro"> <strong> Introduction: </strong> Ben Erickson, Ownar, has haan practicing Landscape Architecture in the Twin Cities for over'. years, first learning the ropes at the office of CLOSE Landscape Architecture until opening lose landscape designs in MU. We do commercial aswellas residential projects and as of 20, Ea. landscape designs offers installation as part of scope of services, so give us a call and let us know how wa can help outwith your nert Project. </p>
                                <p className="intro">Most did a great job at installing a Jack shaft "opener" on my garage door. I appreciate his hard work."I had a garage door installed with very convinient Wi-Fi capabilities! John was very punctual and professional. He...</p>
                            </div>

                            <div className="business-details">
                                <Grid container spacing={3}>
                                    <Grid item lg={6} className="overview">
                                        <h3 className="Introduction-title"> Overview</h3>
                                        <List>
                                            <ListItem className="icons-overview">
                                                <span className="icons">
                                                    <i className="fa fa-trophy" aria-hidden="true"></i>
                                                </span>
                                                <span className="icon-text">Hired {detailsdata.numberOfHires} times</span>
                                            </ListItem>
                                            {
                                                detailsdata.address.backgroundChecked ?
                                                    <div>
                                                        <ListItem className="icons-overview">
                                                            <span className="icons"><PersonOutlineSharpIcon id="matrial-icon" /></span>
                                                            <span className="icon-text">Background Checked</span>
                                                        </ListItem>
                                                    </div> : ''
                                            }
                                            {
                                                detailsdata.licenseVerified ?
                                                    <div>
                                                        <ListItem className="icons-overview">
                                                            <span className="icons"><VerifiedUserOutlinedIcon id="matrial-icon" /></span>
                                                            <span className="icon-text">License Verified</span>
                                                        </ListItem>
                                                    </div> : ''
                                            }

                                            <ListItem className="icons-overview" key={4}>
                                                <span className="icons"><PeopleOutlineIcon id="matrial-icon" /> </span>
                                                <span className="icon-text">{detailsdata.address.employees} employees</span>
                                            </ListItem>
                                            <ListItem className="icons-overview" key={5}>
                                                <span className="icons"><WatchLaterOutlinedIcon id="matrial-icon" /> </span>
                                                <span className="icon-text">{year - detailsdata.address.founded}  years in business</span></ListItem>
                                        </List>
                                    </Grid>

                                    <Grid item lg={6} className="hours">
                                        <h3 className="Introduction-title"> Business hours</h3>
                                        <List>
                                            <ListItem className="businesshours">
                                                <span className="time-zone">(Pacific Time Zone)</span>
                                                <p className="time">Daily {detailsdata.businessHourFrom} to {detailsdata.businessHourTo} </p>
                                            </ListItem>
                                            <ListItem className="payment-method">
                                                <h3 className="Introduction-title">Payment Methods</h3>
                                                <div className="type">{detailsdata.paymentMethods.map((payment, index) => {
                                                    return (<div key={index}>
                                                        {(index ? ', ' : '') + payment}
                                                    </div>)
                                                })}
                                                </div>
                                            </ListItem>

                                            <ListItem className="social-media" key={3}>
                                                <h3 className="Introduction-title">Social media</h3>
                                                <p className="instagram">
                                                    {
                                                        detailsdata.contractorFiles.map((type) => {
                                                            return (<>
                                                                {type.type === "TWITTER" ? "Twitter" : ''}
                                                                {type.type === "INSTAGRAM" ? "Instagram" : ''}
                                                                {type.type === "FACEBOOK" ? "Facebook" : ''}
                                                                {type.type === "LINKEDIN" ? "LinkedIn" : ''}
                                                            </>)

                                                        })
                                                    }
                                                </p>
                                            </ListItem>

                                        </List>
                                    </Grid>
                                </Grid>
                            </div>
                            <Divider />
                            <div className="past-project">
                                <h3 className="past-project">Past Project</h3>
                                <div className="modal-slider">
                                    <SliderPastProject Idprops={Id} />
                                </div>
                                <div className="show-more">
                                    <span>Show more</span>
                                </div>
                            </div>
                            <Divider />
                            <div className="gallery" ref={galleryref} >
                                <h3 className="photos">Photos and Videos</h3>
                                <span style={{ color: '#878c90', fontSize: '15px' }}>15 photos</span>

                                <div className="gallery-slider">
                                    <Gallery Idprops={Id} />
                                </div>
                            </div>
                            <Divider />
                            <div className="Reviews" ref={Reviewref}>
                                <h3 className="reviews">Reviews</h3>
                                <span className="main-review">{detailsdata.reviewSummary.areview}</span>
                                <Grid container className="review-stars">
                                    <Grid item lg={2} xs={12} className="left-review">
                                        <h3 className="rate">{detailsdata.reviewSummary.rating}</h3>
                                        <span className="stars"><Rating name="size-medium" className="lg-stars" value={detailsdata.reviewSummary.rating} readOnly /></span>
                                        <p className="views">{detailsdata.reviewSummary.totalReviews} Reviews</p>
                                    </Grid>
                                    <Divider orientation="vertical" className="sm-divider" />
                                    <Grid item lg={2} xs={12} className="right-review">
                                        <div className="value">
                                            <span className="numbers-rate">5 </span>
                                            <span ><StarRateRoundedIcon className="single-star" /></span>
                                            <BorderLinearProgress
                                                variant="determinate"
                                                color="secondary"
                                                value={Rate.fiveStarRating} />
                                            <span className="numbers-rate">{Rate.fiveStarRating}%</span>
                                        </div>
                                        <div className="value">
                                            <span className="numbers-rate">4</span>
                                            <span><StarRateRoundedIcon className="single-star" /></span>
                                            <BorderLinearProgress
                                                variant="determinate"
                                                color="secondary"
                                                value={Rate.fourStarRating}
                                            />
                                            <span className="numbers-rate">{Rate.fourStarRating}%</span>
                                        </div >
                                        <div className="value">
                                            <span className="numbers-rate">3</span>
                                            <span ><StarRateRoundedIcon className="single-star" /></span>
                                            <BorderLinearProgress
                                                variant="determinate"
                                                color="secondary"
                                                value={Rate.threeStarRating}
                                            />
                                            <span className="numbers-rate">{Rate.threeStarRating}%</span>
                                        </div>
                                        <div className="value">
                                            <span className="numbers-rate">2</span>
                                            <span ><StarRateRoundedIcon className="single-star" /></span>
                                            <BorderLinearProgress
                                                variant="determinate"
                                                color="secondary"
                                                value={Rate.twoStarRating}
                                            />
                                            <span className="numbers-rate">{Rate.twoStarRating}%</span>
                                        </div>

                                        <div className="value">
                                            <span className="numbers-rate">1</span>
                                            <span ><StarRateRoundedIcon className="single-star" /></span>
                                            <BorderLinearProgress
                                                variant="determinate"
                                                color="secondary"
                                                value={Rate.oneStarRating}
                                            />
                                            <span className="numbers-rate">{Rate.oneStarRating}%</span>
                                        </div>
                                    </Grid>
                                </Grid>

                                <Grid container className="search-bar-details">
                                    <Grid item lg={7} xs={12}>
                                        <IconButton aria-label="search">
                                            <SearchIcon className="searchicon" />
                                        </IconButton>
                                        <InputBase
                                            placeholder="Search reviews"
                                            inputProps={{ 'aria-label': 'search google maps' }}
                                        />
                                    </Grid>
                                    <Grid item lg={3} xs={12}>
                                        <select className="dropdown">
                                            <option value="" >Most relevant</option>
                                            <option value="">A</option>
                                            <option value="">B</option>
                                            <option value="">C</option>
                                            <option value="">D</option>
                                        </select></Grid>
                                </Grid>
                            </div>
                            <Divider />
                            <div className="reviews-person">
                                {currentReview.map((Review) => {
                                    return <Grid container key={Review.review}
                                        spacing={3}>
                                        <Divider />
                                        <Grid item lg={12} xs={12}>
                                            <h3 className="person-name">Jim C.</h3>
                                            <span className="Address">Patio Remodel or Addition</span>
                                        </Grid>
                                        <Grid item lg={12} xs={12}>
                                            <Rating name="size-medium" className="lg-stars top-margin" value={Review.rating} readOnly />
                                        </Grid>
                                        <Grid item lg={12} xs={12} className="margintopbot">
                                            <span className="person-review">{Review.review}</span>
                                        </Grid>
                                        <Grid item lg={12} xs={12} className="margintopbot">
                                            <span className="verified-date">Sep 25, 2018 . Verified</span>
                                        </Grid>
                                        <Grid item lg={12} xs={12} className="Reply">
                                            <h4 className="company-name">{detailsdata.address.company} reply</h4>
                                            <span className="Reply-Review">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span>
                                        </Grid>
                                    </Grid>
                                })}
                            </div>
                            <div className="pagination">
                                {renderPageNumbers}
                            </div>
                            <Divider />
                            <div className="credential" ref={credentialref}>
                                <Grid item xs={12}>
                                    <h3 className="reviews">Credentials<InfoOutlinedIcon className="info-icon" /></h3>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item lg={5} xs={12} style={{ paddingLeft: '0px', textAlign: 'left' }} >
                                        <h3 className="credential">License <CheckOutlinedIcon className="tick-mark" /></h3>
                                        <span className="license-type">License Type: Landscape Architecture(MN)</span>
                                    </Grid>
                                    <Grid item lg={3} xs={12} style={{ paddingLeft: '0px', textAlign: 'left' }}>
                                        <h3 className="credential">Background Check <CheckOutlinedIcon className="tick-mark" /></h3>
                                        <span className="license-type">Benjamin Erickson</span>
                                    </Grid>
                                </Grid>
                                <Grid item lg={12} xs={12} className="paddingtopbottom">
                                    <span className="view">View credential details</span>
                                </Grid>
                            </div>
                            <Divider />
                            <div className="FAQs" ref={Faqref}>
                                <Grid container className="que-ans" >
                                    <Grid item lg={12} xs={12}>
                                        <h3 className="reviews">FAQs</h3>
                                    </Grid>
                                    {FaqList.map((Faq) => {
                                        return <Grid key={Faq.question} item lg={12} xs={12}>
                                            <h3 className="question">
                                                {Faq.question}
                                            </h3>
                                            <p className="ans">
                                                {Faq.answer}
                                            </p>
                                            <Divider />
                                        </Grid>
                                    })}
                                </Grid>
                                <div className="show-less">
                                    <span>Show less</span>
                                </div>
                            </div>
                        </div>
                    })}
                    <div className="message-box">
                        <Paper className="msg-box-align">
                            <Button variant="contained" onClick={handleOpen} color="primary" className="msg-box-btn">
                                <ChatBubbleOutlineOutlinedIcon className="message-box-icon" /> Message Pro</Button>
                        </Paper>

                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={open}
                            onClose={handleClose}>
                            <div className="service-modal" >
                                <CloseIcon onClick={handleClose} className="modal-close" />
                                <Grid className="modal-page-col" item xs={10}>
                                    <span variant="subtitle2" color="textSecondary">
                                        {activeStep === 0 ? 1
                                            : activeStep === 1 ? 2
                                                : activeStep === 2 ? 3
                                                    : activeStep === 3 ? 4
                                                        : activeStep === 4 ? 5
                                                            : activeStep === 5 ? 6
                                                                : activeStep === 6 ? 7
                                                                    : ''} of 7
                               </span>
                                </Grid>
                                <Grid container spacing={2}>
                                    {activeStep === 0 ? <ModalCity parentCallback={callback} errorMessage={validation} />
                                        : activeStep === 1 ? <ModalService data={data} serviceCallback={serviceCall} errorMessage={validation} />
                                            : activeStep === 2 ? <ModalProperty data={data} propertyCallback={propertyCall} errorMessage={validation} />
                                                : activeStep === 3 ? <ModalArea data={data} areaCallback={areaCall} errorMessage={validation} />
                                                    : activeStep === 4 ? <ModalBudjet
                                                        data={data} budjetCallbackvalue={budjetCallvalue}
                                                        budjetCallback={budjetCall}
                                                        errorMessage={validation} />
                                                        : activeStep === 5 ? < ModalMaterial data={data}
                                                            MaterialCallback={MaterialCall}
                                                            errorMessage={validation} />
                                                            : activeStep === 6 ? <ModalDisc
                                                                discCallback={discCall}
                                                                errorMessage={validation} /> : handleClose()}
                                </Grid>
                                <MobileStepper
                                    variant="progress"
                                    steps={7}
                                    position="static"
                                    activeStep={activeStep}
                                    className={classes.root}
                                />
                                <Grid container spacing={0}>
                                    <Grid item xs={12} style={{ textAlign: 'center', margin: '20px 0px' }}>
                                        <Button variant="contained" className="service-modal-prev"
                                            onClick={handleBack} disabled={activeStep === 0}
                                        >
                                            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                            Prev
                                   </Button>
                                        <Button variant="contained" className="service-modal-next"
                                            onClick={handleNext} disabled={activeStep === 7}
                                        >
                                            {activeStep === 6 ? 'Submit' : 'Next'}
                                            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}

                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </Modal>
                    </div>
                </div>
            }
        </div>
    )
}

export default withRouter(ContractorDetails)