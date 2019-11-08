/*eslint-disable*/
import React from 'react';
import Modal from '@material-ui/core/Modal';
import 'react-multi-carousel/lib/styles.css';
import { Container, Grid } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
    {
        imgPath:
            'https://zacsgarden.com/wp-content/uploads/2016/10/Landscaping-ideas-for-side-of-house-Landscaped-side-of-house-with-gate.jpg',
    },
    {
        imgPath:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnlGRt-9QgRLiKd7w3ItmtHYpOxbYG8O4ZN6oe5yeK-borr4rT',
    },
    {
        imgPath:
            'https://cdn.decoist.com/wp-content/uploads/2015/10/Lovely-pool-area-of-the-Garden-House-epitomizes-its-indoor-outdoor-interplay.jpg',
    }
];

export default function SimpleModal() {
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = tutorialSteps.length;

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStepChange = step => {
        setActiveStep(step);
    };
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Container>
            <div className="slider">
                <div className="">
                    <div className="project-img">
                        <img src="https://zacsgarden.com/wp-content/uploads/2016/10/Landscaping-ideas-for-side-of-house-Landscaped-side-of-house-with-gate.jpg" onClick={handleOpen} id="project-img" alt="pastproject"></img>
                    </div>
                    <div className="project-details">
                        <h3 className="project-name">McLangan Residence</h3>
                        <p className="price">Approx. $20000</p>
                    </div>
                </div>
                <Divider orientation="vertical" className="myVerticalLine" />
                <div className="">
                    <div className="project-img">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnlGRt-9QgRLiKd7w3ItmtHYpOxbYG8O4ZN6oe5yeK-borr4rT" onClick={handleOpen} id="project-img" alt="pastproject" ></img>
                    </div>
                    <div className="project-details">
                        <h3 className="project-name">Residential backyard privacy fence project</h3>
                        <p className="price">Approx. $16000</p>
                    </div>
                </div>
            </div>


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
                            enableMouseEvents>
                            {tutorialSteps.map((step, index) => (
                                <div key={index}>
                                    {Math.abs(activeStep - index) <= 2 ? (
                                        <img className="makeStyles-img-291" src={step.imgPath} alt={step.label} />
                                    ) : null}
                                </div>
                            ))}
                        </AutoPlaySwipeableViews>
                        <MobileStepper
                            steps={maxSteps}
                            position="static"
                            variant="text"
                            activeStep={activeStep}
                            nextButton={
                                <Button size="small" className="myNextButton" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
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
                    <div className="blackBackground">
                        <Grid item lg={3} xs={12} className="details">
                            <Grid container className="slider-container" >
                                <Grid item lg={12} xs={12}>
                                    <div className="slider-post-txt"><h4>Residensial backyard privacy fence project</h4> </div>
                                    <div className="slider-post-txt"><p className="text-bold">Job type</p> <p>Fense and Gate instalation</p></div>
                                    <div className="slider-post-txt"><p className="text-bold">Location</p> <p>Minneapolis,MN</p></div>
                                    <div className="slider-post-txt"><p className="text-bold">Coast</p> <p>Approx. $16000</p></div>
                                    <div className="slider-post-txt"><p className="text-bold">Duration</p> <p>3 Days</p></div>
                                    <div className="slider-post-txt"><p className="text-bold">year</p> <p>2018</p></div>
                                    <div className="slider-post-txt"><p className=" "> Client was looking for a new,cedar,6'hgt privacy fense for her property</p></div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Modal>
        </Container >

    );
}