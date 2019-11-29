import React, { useState } from 'react';
import '../../assets/css/modal.css';
import { makeStyles, useTheme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../../assets/css/HomePage.css';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
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
import auth0Client from 'services/auth0/auth';
import HttpUrlConstant from 'apis/global';
import Axios from 'axios';

const useStyles = makeStyles({
    card: {
        maxWidth: 179,
    },
    media: {
        height: 130,
    },
    root: {
        maxWidth: 1200,
        flexGrow: 1,
    },
});

function HomePageMid() {
    const theme = useTheme();
    const [title, settitle] = useState('');
    const [getvalue, setgetvalue] = useState('');
    const [getcheck, setgetcheck] = useState(false);
    const [getredio, setgetredio] = useState('');
    const [getarearedio, setgetarearedio] = useState('');
    const [getbudjet, setgetbudjet] = useState('');
    const [getbudjetvalue, setgetbudjetvalue] = useState('');
    const [getmaterial, setgetmaterial] = useState('');
    const [getdisc, setgetdisc] = useState('');
    const [validation, setvalidation] = useState("");
    const [getChar, setgetChar] = useState('');
    const [Newdata] = useState([]);

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

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6,
            slidesToSlide: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4,
            slidesToSlide: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 2,
            slidesToSlide: 1, // optional, default to 1.
        },
    };

    const [open, setOpen] = React.useState(false);
    const classes = useStyles();


    const [activeStep, setActiveStep] = React.useState(0);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        var popupModalArray = [{ "modalTitle": title, "getbudjet": getbudjet, "getbudjetvalue": getbudjet, "description": getdisc, "budgetCustomValue":getbudjetvalue }];
        localStorage.setItem("modalData", JSON.stringify(popupModalArray));
        if (activeStep === 7) {
            auth0Client.signIn();
            var apiPath = `/contractors/${localStorage.getItem("contractor_ID")}/projects`;
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

    const gettitle = (e) => {
        settitle(e.target.title);
    }

    return (<div className="container home-mid-bg">
        <h2 className="font-color">Contact  Local Professional</h2>
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlaySpeed={5000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={100}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
        >
            <div>
                <Card className={classes.card} onClick={gettitle} >
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1AtyXV3mqWkTsUBxWTS82EPp8t0Jb4fPgkiauR6Sx4Ba4tBo3g"
                                title="Bathroom Remodeling" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2" id="title">
                                    Bathroom Remodeling
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1AtyXV3mqWkTsUBxWTS82EPp8t0Jb4fPgkiauR6Sx4Ba4tBo3g"
                                title="Home Remodeling" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Home Remodeling
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1AtyXV3mqWkTsUBxWTS82EPp8t0Jb4fPgkiauR6Sx4Ba4tBo3g"
                                title="Kitchen Remodeling" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Kitchen Remodeling
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://freshome.com/wp-content/uploads/2015/07/online-virtual-room-programs-5d-render.jpg"
                                title="General Contracting" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    General Contracting
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6r-nFGkJjRU_X2dd-Lk4W7H-XetUL6PorttraCkS11brJsDfP"
                                title="New Home Construction" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    New Home Construction
                                </Typography>

                            </CardContent>
                        </CardActionArea>

                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM6k45BnwpjpY7DOBmu5dAYUbRG2e7GpXx7f2mBlkpCTQwRrtvqw"
                                title="Interior Design" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Interior Design
                                </Typography>
                            </CardContent>
                        </CardActionArea>

                    </div>
                </Card>
            </div>
        </Carousel >
        <h2 className="font-color">Browse Ideas by Room</h2>
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlaySpeed={1000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px" >
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://www.cadsoftwaredirect.com/media/catalog/product/cache/3/thumbnail/9df78eab33525d08d6e5fb8d27136e95/v/-/v-ray_sketchup_interior_stairs_1.jpg"
                                title="Bathroom Ideas" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Bathroom Ideas
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1AtyXV3mqWkTsUBxWTS82EPp8t0Jb4fPgkiauR6Sx4Ba4tBo3g"
                                title="Kitchen Ideas" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Kitchen Ideas
                                </Typography>
                            </CardContent>
                        </CardActionArea>

                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1AtyXV3mqWkTsUBxWTS82EPp8t0Jb4fPgkiauR6Sx4Ba4tBo3g"
                                title="Dinning Room Ideas" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Dinning Room Ideas
                                </Typography>

                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1AtyXV3mqWkTsUBxWTS82EPp8t0Jb4fPgkiauR6Sx4Ba4tBo3g"
                                title="Living Room Ideas" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Living Room Ideas
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1AtyXV3mqWkTsUBxWTS82EPp8t0Jb4fPgkiauR6Sx4Ba4tBo3g"
                                title="Bedroom Ideas" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Bedroom Ideas
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card} onClick={gettitle}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1AtyXV3mqWkTsUBxWTS82EPp8t0Jb4fPgkiauR6Sx4Ba4tBo3g"
                                title="Exterior Ideas" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Exterior Ideas
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
        </Carousel>
        <Grid container spacing={0}>
            <Grid item xs={10}>
                <Typography variant="h6">
                </Typography>
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
                        <Grid container spacing={2}>

                            {activeStep === 0 ? <ModalCity parentCallback={callback} errorMessage={validation} />
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
                                                        discCallback={discCall} errorMessage={validation} /> : handleClose()}
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
                                    onClick={handleNext}
                                >
                                    {activeStep === 6 ? 'Submit' : 'Next'}
                                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}

                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Modal>
            </Grid>
        </Grid>
    </div>
    )
}

export default HomePageMid;