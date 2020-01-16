import React, { useState, useEffect } from 'react';
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
import ModalSpecialty from '../modals/modalSpecialty';
import auth0Client from 'services/auth0/auth';
import {xapi} from 'services/utils';
const useStyles = makeStyles({
    card: {
        maxWidth: 179,
    },
    media: {
        height: 130,
    },
    content:{
        height:"50px",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    root: {
        maxWidth: 1200,
        flexGrow: 1,
    },
});

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

function HomePageMid() {
    const theme = useTheme();
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
    const [activeStep, setActiveStep] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [carouselItems, setCarouselItems] = useState([]);
    const classes = useStyles();
    const data = [getvalue, getradio, getarearadio, getbudjet, getmaterial, getcheck1, getcheck2];
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

    const handleOpen = (e) => {
        var _specialty = {
            name: e.target.title,
            id: e.target.id
        }
        setSpecialties([_specialty]);
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

    async function getCarouselItems(){
        var data = await xapi().get('/specialties/carousel');
        if(data.data)
        {
            setCarouselItems(data.data);
        }
    }
    useEffect(()=>{
        getCarouselItems();
    },[])
    return (<div className="container home-mid-bg">
        <h2 className="font-color">Contact  Local Professional</h2>
        {
            carouselItems.length > 0 ? (
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
                itemClass="carousel-item-padding-40-px">
                {
                    carouselItems.map((item, index)=>{
                        return(
                            <Card className={classes.card}  key = {`carousel-item-${item.id}`} data-index={index} >
                                <div className="popUpModal" onClick={handleOpen} >
                                    <CardActionArea>
                                        <CardMedia
                                            className={classes.media}
                                            image={window.location.origin + "/interial-images/" + item.id+".jpeg"}
                                            title={item.name}
                                            id = {item.id} />
                                        <CardContent className = {classes.content}>
                                            <Typography gutterBottom variant="h5" component="h2" id="title">
                                                {item.name}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </div>
                            </Card> 
                        )
                    })
                }
                </Carousel >
            ):(null)
        }
       
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
            // containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px" >
            <div>
                <Card className={classes.card} >
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
                <Card className={classes.card} >
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
                <Card className={classes.card} >
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
                <Card className={classes.card} >
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
                <Card className={classes.card} >
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
                <Card className={classes.card} >
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
                    onClose={handleClose}
                >
                    <div className="service-modal" style = {{width:"600px"}}>
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
                        <Grid container spacing={2}>
                            {/* Receiving the value from Child */}
                            {activeStep === 0 ? <ModalCity parentCallback={callback} errorMessage={validation} />
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
            </Grid>
        </Grid>
    </div>
    )
}

export default HomePageMid;