/*eslint-enable*/
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import '../../assets/css/contractor.css';
import { List, ListItem, Grid, ListItemAvatar, Divider, Button, Paper, CircularProgress } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { useTheme } from '@material-ui/core';
import PersonOutlineSharpIcon from '@material-ui/icons/PersonOutlineSharp';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import WatchLaterOutlinedIcon from '@material-ui/icons/WatchLaterOutlined';
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
import ModalSpecialty from '../modals/modalSpecialty';
import { useStyles } from '@material-ui/pickers/views/Month/MonthView';
import { withRouter } from 'react-router-dom';
import auth0Client from 'services/auth0/auth';
import {xapi} from '../../services/utils';
import * as ContActions from 'store/actions/cont-actions';
console.clear();

function ContractorDetails(props) {
    const theme = useTheme();
    const [apiPath] = useState('contractors/');
    const [Id] = useState(props.match.params.Id);
    const [Detailsdata, setDetailsdata] = useState([]);
    const [introduction, setIntroduction] = useState(null);
    const [PersonReviewList, setPersonReviewList] = useState([]);
    const [Rate, setRate] = useState('');
    const [FaqList, setFaqList] = useState([]);
    const [year] = useState(new Date().getFullYear());
    const [currentPage, setcurrentPage] = useState(1);
    const [ReviewPerPage] = useState(2);
    const [active, setactive] = useState(false);
    const [getvalue, setgetvalue] = useState('');
    const [getcheck1, setgetcheck1] = useState('');
    const [getcheck2, setgetcheck2] = useState('');
    const [getredio, setgetredio] = useState('');
    const [getarearadio, setgetarearadio] = useState('');
    const [getbudjet, setgetbudjet] = useState('');
    const [getbudjetvalue, setgetbudjetvalue] = useState('');
    const [getmaterial, setgetmaterial] = useState('');
    const [getdisc, setgetdisc] = useState('');
    const [specialities, setSpecialties] = useState([]);
    const [validation, setvalidation] = useState("");
    const [radioButton] = useState("");
    const [aCall] = useState("");
    const [material] = useState("");
    const [activeStep, setActiveStep] = React.useState(0);
    const [Avtarurl, setAvtarurl] = useState('');
    const [Galleryarr, setGalleryarr] = useState([]);
    const data = [getvalue, getredio, getarearadio, getbudjet, getmaterial, getcheck1, getcheck2];
    const classes = useStyles();
    const HandleOpen = () => {
        setOpen(true);// For Getting the value from modal(parent to child).
    };

    // Callback functions from child components modal.
    const Callback = (value) => {
        setgetvalue(value);
    }

    const ServiceCallValue1 = (value1) => {
        setgetcheck1(value1);
    }

    const ServiceCallValue2 = (value2) => {
        setgetcheck2(value2);
    }

    const PropertyCall = (value) => {
        setgetredio(value);
        if (value !== '') {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }
    const AreaCall = (value) => {
        setgetarearadio(value);
        if (value !== '') {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }

    const BudjetCallValue = (value) => {
        setgetbudjetvalue(value);
    }
    const BudjetCall = (value) => {
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
    const DiscCall = (value) => {
        setgetdisc(value);
    }

    function FetchImage() {
        xapi().get(`contractors/${Id}/avatar`).then((data) => {
            if (data.status === 200) {
                setAvtarurl(process.env.REACT_APP_PROJECT_API + `/contractors/${Id}/avatar`);
            }
        })
    }

    const HandleClose = () => {
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
                    "propertyType": getredio,
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
        setgetredio("");
        setgetarearadio("");
        setgetbudjet("");
        setgetbudjetvalue("");
        setgetdisc("");
        setgetmaterial("");
        setSpecialties([]);        
        setOpen(false);
    };


    const HandleNext = () => {
        if (((activeStep === 0 && getvalue === '') || getvalue === null)
            || (activeStep === 1 && getcheck1 === '' && getcheck2 === '')
            || (activeStep === 2 && getredio === '')
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
            HandleClose();
        }
    };

    const HandleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const ScrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

    const CredentialRef = useRef(null)
    const executeScrolltocredential = () => ScrollToRef(CredentialRef)

    const AboutRef = useRef(null)
    const executeScrolltointro = () => ScrollToRef(AboutRef)

    const GalleryRef = useRef(null)
    const executeScrolltoGallery = () => ScrollToRef(GalleryRef);

    const ReviewRef = useRef(null);
    const executeScrolltoReview = () => ScrollToRef(ReviewRef);

    const FaqRef = useRef(null);
    const executeScrolltoFAQ = () => ScrollToRef(FaqRef);

    function FetchDetails() {
        xapi().get(apiPath + Id).then((data) => {
            const detailsdata = [...Detailsdata, data.data];
            setDetailsdata(detailsdata);
            data.data.contractorFiles.map((i, index) => {
                return i.type === "PICTURE" ? Galleryarr.push(i.name) : i.type === "LINK" ? Galleryarr.push(i.name) : null
            })
            setGalleryarr(Galleryarr);
        })
    }

    function FetchPersonReviews() {
        xapi().get( apiPath + Id + '/reviews').then((data) => {
            setPersonReviewList(data.data);
        })
    }

    function FetchRating() {
        xapi().get(apiPath + Id + '/get_reviews').then((data) => {
            setRate(data.data);
        })
    }

    function FetchFAQ() {
        xapi().get( apiPath + Id + '/faq').then((data) => {
            setFaqList(data.data);
        })
    }
    function getIntroduction(){
        xapi().get(apiPath + Id).then((data)=>{
            setIntroduction(data.data.address && data.data.address.introduction ? data.data.address.introduction : "")
        })
    }
    function HandleClick(event) {
        setcurrentPage(Number(event.target.id))
        setactive(true);
    }

    useEffect(() => {
        setRate({ fiveStarRating: 0, fourStarRating: 0, oneStarRating: 0, reviews: 0, threeStarRating: 0, twoStarRating: 0 });
        if ((radioButton !== '' && activeStep === 2) ||
            (aCall !== '' && activeStep === 3) ||
            (material !== '' && activeStep === 5)) {
            HandleNext();
        }
        FetchDetails();
        FetchPersonReviews();
        FetchRating();
        FetchFAQ();
        FetchImage();
        getIntroduction();
        // eslint-disable-next-line
    }, [])
    // Implimentation of Pagination.
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(PersonReviewList.length / ReviewPerPage); i++) {
        pageNumbers.push(i);
    }
    const RenderPageNumbers = pageNumbers.map(number => {
        return (
            <li
                className={currentPage === number ? 'active' : 'pagenumbers'}
                key={number}
                id={number}
                onClick={HandleClick}>
                {number}
            </li>
        );
    });


    const indexOfLastReview = currentPage * ReviewPerPage;
    const indexOfFirstReview = indexOfLastReview - ReviewPerPage;
    const currentReview = PersonReviewList.slice(indexOfFirstReview, indexOfLastReview);
    const [open, setOpen] = React.useState(false);
    //End of Pagination.

    return (
        <div style = {{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <div className="full-width" style = {{display:'flex'}}>
             <div className="loader">{Detailsdata.length === 0 ? <CircularProgress /> : ''}</div>
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
                                        {<img alt="image1" className="displayNone" src={process.env.REACT_APP_PROJECT_API + "/contractors/" + Id + "/avatar"} />}
                                    </div> :
                                        <div key={detailsdata.id}>
                                            {<img alt="image22" className="displayNone" src={`https://ui-avatars.com/api/api/?name=${detailsdata.address.company}`} />}
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
                        <div className="introduction" ref={AboutRef}>
                            <p className="intro"> <strong> Introduction: </strong> 
                            {
                                introduction
                            }
                            </p>
                        </div>
                        <div className="business-details">
                            <Grid container spacing={3}>
                                <Grid item lg={6} className="overview">
                                    <h3 className="Introduction-title"> Overview</h3>
                                    <List>
                                        <ListItem className="icons-overview" key={detailsdata.numberOfHires}>
                                            <span className="icons">
                                                <i className="fa fa-trophy" aria-hidden="true"></i>
                                            </span>
                                            <span className="icon-text">Hired {detailsdata.numberOfHires} times</span>
                                        </ListItem>
                                        {detailsdata.address.backgroundChecked ?
                                            <div>
                                                <ListItem className="icons-overview" key={detailsdata.address.backgroundChecked}>
                                                    <span className="icons"><PersonOutlineSharpIcon id="matrial-icon" /></span>
                                                    <span className="icon-text">Background Checked</span>
                                                </ListItem>
                                            </div> : ''}
                                        {detailsdata.licenseVerified ?
                                            <div>
                                                <ListItem className="icons-overview" key={detailsdata.licenseVerified}>
                                                    <span className="icons"><VerifiedUserOutlinedIcon id="matrial-icon" /></span>
                                                    <span className="icon-text">License Verified</span>
                                                </ListItem>
                                            </div> : ''}
                                        <ListItem className="icons-overview" key={detailsdata.address.employees}>
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
                                            <div className="instagram">
                                                {detailsdata.contractorFiles.map((type, index) => {
                                                    return (<div key={index}>
                                                        {type.type === "TWITTER" ? <a className="socialmediallink" href={decodeURIComponent(type.name)} target="blank">Twitter</a> : ''}
                                                        {type.type === "INSTAGRAM" ? <a className="socialmediallink" href={decodeURIComponent(type.name)} target="blank">Instagram</a> : ''}
                                                        {type.type === "FACEBOOK" ? <a className="socialmediallink" href={decodeURIComponent(type.name)} target="blank">Facebook</a> : ''}
                                                        {type.type === "LINKEDIN" ? <a className="socialmediallink" href={decodeURIComponent(type.name)} target="blank">LinkedIn</a> : ''}
                                                    </div>)
                                                })}
                                            </div>
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
                        <div className="gallery" ref={GalleryRef} >
                            <h3 className="photos">Photos and Videos</h3>
                            <span style={{ color: '#878c90', fontSize: '15px' }}>{Galleryarr.length} photos</span>

                            <div className="gallery-slider">
                                <Gallery Idprops={Id} />
                            </div>
                        </div>
                        <Divider />
                        <div className="Reviews" ref={ReviewRef}>
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
                            {RenderPageNumbers}
                        </div>
                        <Divider />
                        <div className="credential" ref={CredentialRef}>
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
                        <div className="FAQs" ref={FaqRef}>
                            <Grid container className="que-ans" >
                                <Grid item lg={12} xs={12} style = {{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                    <h3 className="reviews">
                                       FAQs
                                    </h3>
                                </Grid>
                                {FaqList.map((Faq, index) => {
                                    return <Grid key={`faq-question${index}`} item lg={12} xs={12}>
                                        <h3 className="question">
                                            {Faq.question}
                                        </h3>
                                        <p className="ans">{Faq.answer === "" || Faq.answer === null ? "Not Answered" : Faq.answer}</p>
                                        <Divider/>
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
                        <Button variant="contained" onClick={HandleOpen} color="primary" className="msg-box-btn">
                            <ChatBubbleOutlineOutlinedIcon className="message-box-icon" /> Message Pro</Button>
                    </Paper>

                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={open}
                        onClose={HandleClose}
                    >
                        <div className="service-modal" style = {{width:"600px"}} >
                            <CloseIcon onClick={HandleClose} className="modal-close" />
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
                                {/* Receiving the value from Child */}
                                {activeStep === 0 ? <ModalCity parentCallback={Callback} errorMessage={validation} />
                                    : activeStep === 1 ? <ModalService data={data} serviceCallbackvalue1={ServiceCallValue1} serviceCallbackvalue2={ServiceCallValue2} errorMessage={validation} />
                                        : activeStep === 2 ? <ModalProperty data={data} propertyCallback={PropertyCall} errorMessage={validation} />
                                            : activeStep === 3 ? <ModalArea data={data} areaCallback={AreaCall} errorMessage={validation} />
                                                : activeStep === 4 ? <ModalBudjet
                                                    data={data} budjetCallbackvalue={BudjetCallValue}
                                                    budjetCallback={BudjetCall}
                                                    errorMessage={validation} />
                                                    : activeStep === 5 ? < ModalMaterial data={data}
                                                        MaterialCallback={MaterialCall}
                                                        errorMessage={validation} />
                                                        : activeStep === 6 ?  <ModalSpecialty specialities = {specialities} setSpecialties = {setSpecialties}/>  
                                                            : activeStep === 7 ? <ModalDisc
                                                               discCallback={DiscCall} errorMessage={validation} /> :  HandleClose()
                                    }
                            </Grid>
                            <MobileStepper
                                variant="progress"
                                steps={8}
                                position="static"
                                activeStep={activeStep}
                                className={classes.root}
                            />
                            <Grid container spacing={0}>
                                <Grid item xs={12} style={{ textAlign: 'center', margin: '20px 0px' }}>
                                    <Button variant="contained" className="service-modal-prev"
                                        onClick={HandleBack} disabled={activeStep === 0}
                                    >
                                        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                        Prev
                                    </Button>
                                    <Button variant="contained" className="service-modal-next"
                                        onClick={HandleNext} disabled={activeStep === 8}
                                    >
                                        {activeStep === 7 ? 'Submit' : 'Next'}
                                        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}

                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Modal>
                </div>
                
            </div>
        </div>
    )
}
const mapDispatchToProps = {
	selectContractor: ContActions.selectContractor,
};

const mapStateToProps = state => ({
	contractor: state.cont_data.selectedContractor,
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContractorDetails))
