import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Modal from '@material-ui/core/Modal';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Gallery() {
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
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
    const SliderResponsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
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

    const [imagelist] = useState([
        {
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnlGRt-9QgRLiKd7w3ItmtHYpOxbYG8O4ZN6oe5yeK-borr4rT',
            title: 'image 1'
        },
        {
            image: 'https://zacsgarden.com/wp-content/uploads/2016/10/Landscaping-ideas-for-side-of-house-Landscaped-side-of-house-with-gate.jpg',
            title: 'image 2'
        },
        {
            image: 'https://cdn.decoist.com/wp-content/uploads/2015/10/Lovely-pool-area-of-the-Garden-House-epitomizes-its-indoor-outdoor-interplay.jpg',
            title: 'image 3'
        },
    ])

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = imagelist.length;

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStepChange = step => {
        setActiveStep(step);
    };

    return (
        <div>
            <Carousel
                swipeable={false}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true} // means to render carousel on server-side.
                infinite={true}
                // autoPlay={this.props.deviceType !== "mobile" ? true : false}
                autoPlaySpeed={1000}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                // deviceType={this.props.deviceType}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
            >
                <div className="">
                    <div className="slider-gallery-img" onClick={handleOpen}>
                        <img src="https://zacsgarden.com/wp-content/uploads/2016/10/Landscaping-ideas-for-side-of-house-Landscaped-side-of-house-with-gate.jpg" alt="past-project"></img>
                    </div>
                </div>
                <div className="">
                    <div className="slider-gallery-img" onClick={handleOpen}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnlGRt-9QgRLiKd7w3ItmtHYpOxbYG8O4ZN6oe5yeK-borr4rT" alt="past-project"></img>
                    </div>
                </div>
                <div className="">
                    <div className="slider-gallery-img" onClick={handleOpen}>
                        <img src="https://cdn.decoist.com/wp-content/uploads/2015/10/Lovely-pool-area-of-the-Garden-House-epitomizes-its-indoor-outdoor-interplay.jpg" alt="past-project"></img>
                    </div>
                </div>
                <div className="">
                    <div className="slider-gallery-img" onClick={handleOpen}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6PKaEbNe2goekkQsuhKzJfkoE-RwrYKUGyNR5KiQpzMK2Wll2fQ" alt="past-project"></img>
                    </div>
                </div>
                <div className="">
                    <div className="slider-gallery-img" onClick={handleOpen}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmk78L3F14diJGQmfz4wnBq2pc2JJtkcNnmmqP5tJ1jFtWvXyZ" alt="past-project"></img>
                    </div>
                </div>
                <div className="">
                    <div className="slider-gallery-img" onClick={handleOpen}>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnlGRt-9QgRLiKd7w3ItmtHYpOxbYG8O4ZN6oe5yeK-borr4rT" alt="past-project"></img>
                    </div>
                </div>
            </Carousel>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}>
                <div className="modal-gallery">
                    <Paper square elevation={0}>
                        <Typography>{imagelist[activeStep].title}</Typography>
                    </Paper>
                    <div className="customRootSlider">
                        <img
                            className="imageclass"
                            src={imagelist[activeStep].image}
                            alt={imagelist[activeStep].title}
                        />
                        <AutoPlaySwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={activeStep}
                            onChangeIndex={handleStepChange}
                            enableMouseEvents
                        >
                            {imagelist.map((step, index) => (
                                <div key={index} className="steeper">
                                    {Math.abs(activeStep - index) <= 2 ? (
                                        <img className="" src={step.imgPath} alt={step.label} />
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
                                <Button className="myNextButton" size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
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
                </div>
            </Modal>
        </div>
    )
}

export default Gallery;