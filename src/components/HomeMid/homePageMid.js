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
     
    const callback = (value) => {
        setgetvalue(value);
    }
    const data=[getvalue,getredio,getarearedio,getbudjet,getmaterial,getcheck];

    const serviceCall = (value) => {
          setgetcheck(value); 
    }
    const propertyCall = (value) => {
        setgetredio(value);
        if(value !== ''){
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }
    const areaCall = (value) => {
        setgetarearedio(value);
        if(value !== ''){
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
        if(value !== ''){
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        }
    }
    const MaterialCall = (value) => {
        setgetmaterial(value);
        if(value !== ''){
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
        setActiveStep(0);
        setOpen(false);
    };
    


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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="data:image/jpeg;base64,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"
                                title="Contemplative Reptile" />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Bathroom Remodeling
                                </Typography>
                                {/* <Typography variant="body2" color="textSecondary" component="p">
                                 </Typography> */}
                            </CardContent>
                        </CardActionArea>
                    </div>
                </Card>
            </div>
            <div>
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="data:image/jpeg;base64,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"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="data:image/jpeg;base64,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"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://freshome.com/wp-content/uploads/2015/07/online-virtual-room-programs-5d-render.jpg"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6r-nFGkJjRU_X2dd-Lk4W7H-XetUL6PorttraCkS11brJsDfP"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM6k45BnwpjpY7DOBmu5dAYUbRG2e7GpXx7f2mBlkpCTQwRrtvqw"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://www.cadsoftwaredirect.com/media/catalog/product/cache/3/thumbnail/9df78eab33525d08d6e5fb8d27136e95/v/-/v-ray_sketchup_interior_stairs_1.jpg"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6761c1ce-f49b-4be1-985d-1960c742262b/d4azd6z-1a209321-fe22-4903-9e54-d39ca28e854a.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzY3NjFjMWNlLWY0OWItNGJlMS05ODVkLTE5NjBjNzQyMjYyYlwvZDRhemQ2ei0xYTIwOTMyMS1mZTIyLTQ5MDMtOWU1NC1kMzljYTI4ZTg1NGEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.JqNZQOfyImTaiwy75pxN443EqsMID6Go4LtCbzdiPbc"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1AtyXV3mqWkTsUBxWTS82EPp8t0Jb4fPgkiauR6Sx4Ba4tBo3g"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="data:image/jpeg;base64,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"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="data:image/jpeg;base64,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"
                                title="Contemplative Reptile" />
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
                <Card className={classes.card}>
                    <div className="popUpModal" onClick={handleOpen}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="data:image/jpeg;base64,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"
                                title="Contemplative Reptile" />
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
                                        : activeStep === 3 ? <ModalArea  data={data}  areaCallback={areaCall} errorMessage={validation} />
                                            : activeStep === 4 ? <ModalBudjet
                                                data={data}
                                                budjetCallbackvalue={budjetCallvalue}
                                                budjetCallback={budjetCall}
                                                errorMessage={validation} />
                                                : activeStep === 5 ? < ModalMaterial 
                                                data={data}  MaterialCallback={MaterialCall} errorMessage={validation} />
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