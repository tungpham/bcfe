/*eslint-enable*/
import React, { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import 'react-multi-carousel/lib/styles.css';
import { Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import { autoPlay } from 'react-swipeable-views-utils';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import SwipeableViews from 'react-swipeable-views';
import CloseIcon from '@material-ui/icons/Close';
import {xapi} from 'services/utils';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function SliderPastProject(props) {
    const [Id] = useState(props.Idprops);
    const [detailsData, setdetailsData] = useState([]);
    const [activeStep, setActiveStep] = React.useState(0);
    const [modalId, setModalId] = useState('');
    const [open, setOpen] = React.useState(false);

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 2,
            slidesToSlide: 1, // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2, // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1, // optional, default to 1.
        },
    };

    useEffect(() => {
        xapi().get(`contractors/${Id}/projects/past`).then((data) => {
            setdetailsData(data.data.content);
        })
        //eslint-disable-next-line
    }, [])

    const handleOpen = (e) => {
        setModalId(e.target.id)
        setOpen(true);
        setActiveStep(0);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleStepChange = step => {
        setActiveStep(step);
        // console.log(step);
    };

    const handleNext = () => {
        activeStep > detailsData[modalId].projectFiles.length - 1 ? setActiveStep(0) : setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    return (<div>
        <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={1000}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px">
            {detailsData.map((item, index1) => {
                return (
                    <div key={index1} style={{ display: 'flex' }}>
                        <div className="pastproject">
                            <div className="pastprojectimg">{item.projectFiles.map((image, index) => {
                                return <img key={index} id={index1} className={index === 0 ? "pastprojectimg" : 'none'} src={`${process.env.REACT_APP_PROJECT_API}/projects/${item.id}/files/${image.name}`} onClick={handleOpen} alt="pastimage"></img>
                            })}
                            </div>
                            <div className="pastprojectdetails">
                                <h3  >{item.title}</h3>
                            </div>
                        </div>
                        <div>  <Divider orientation="vertical" /></div>
                    </div>
                )
            })}
        </Carousel>
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}>
            <div className="moda-pastproject">
                <div className="myRoot">
                    <AutoPlaySwipeableViews
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        className="post-img-height"
                        enableMouseEvents>
                        {modalId && detailsData[modalId].projectFiles.length >= activeStep ?
                            detailsData[modalId].projectFiles.map((step, index) => (
                                <div style={{ overflow: 'hidden' }} className="post-height" key={index}>
                                    {Math.abs(activeStep - index) <= 2 ? (
                                        <img className="post-slider-img" src={`${process.env.REACT_APP_PROJECT_API}/projects/${detailsData[modalId].id}/files/${step.name}`} alt={step.label} />
                                    ) : null}
                                </div>
                            )) : ''}
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                        className="stepper-divider"
                        steps={modalId ? detailsData[modalId].projectFiles.length : ''}
                        position="static"
                        variant="text"
                        activeStep={modalId && detailsData[modalId].projectFiles.length < activeStep ? setActiveStep(0) : activeStep}
                        nextButton={
                            <Button size="small" className="myNextButton" onClick={handleNext} disabled={modalId ? activeStep === detailsData[modalId].projectFiles.length - 1 : false}>
                                <i className="fa fa-chevron-right" aria-hidden="true"></i>
                            </Button>
                        }
                        backButton={
                            <Button size="small" className="myBackButton" onClick={handleBack} disabled={activeStep === 0}>
                                <i className="fa fa-chevron-left" aria-hidden="true"></i>
                            </Button>
                        }
                    />
                </div>
                <div className="whiteBackground">
                    {modalId ? <Grid item lg={12} xs={12} className="details">
                        <Grid container className="slider-container" >
                            <Grid item lg={12} xs={12}>
                                <div className="close-icon"> <CloseIcon onClick={handleClose} /></div>
                                <div className="slider-post-txt"><h4>{detailsData[modalId].title}</h4> </div>
                                <div className="slider-post-txt"><p className="text-bold">Job type</p> <p>{detailsData[modalId].type}</p></div>
                                <div className="slider-post-txt"><p className="text-bold">Location</p> <p>Minneapolis,MN</p></div>
                                <div className="slider-post-txt"><p className="text-bold">Coast</p> <p>Approx. ${detailsData[modalId].budget}</p></div>
                                <div className="slider-post-txt"><p className="text-bold">Duration</p> <p>{detailsData[modalId].duration} Days</p></div>
                                <div className="slider-post-txt"><p className="text-bold">year</p> <p>{detailsData[modalId].year}</p></div>
                                <div className="slider-post-txt"><p className=" "> Client was looking for a new,cedar,6'hgt privacy fense for her property</p></div>
                            </Grid>
                        </Grid>
                    </Grid> : ""}
                </div>
            </div>
        </Modal >
    </div >
    )
}

export default SliderPastProject;