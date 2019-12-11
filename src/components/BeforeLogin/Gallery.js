/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Modal from '@material-ui/core/Modal';
import { useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import Axios from 'axios';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function Gallery(props) {

    useEffect(() => {
        getimagelist();
    }, [])

    const [galleryId] = useState(props.Idprops);
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

    const [imagelist, setImagelist] = useState([]);
    const [Image, setImage] = useState([]);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = Image.length;

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleStepChange = step => {
        setActiveStep(step);
    };

    function getimagelist() {
        Axios.get(process.env.REACT_APP_PROJECT_API + 'contractors/' + galleryId).then((data) => {
            setImagelist(data.data.contractorFiles);
            data.data.contractorFiles.map((i) => {
                i.type === "PICTURE" ? Image.push(i.name) : null
                setImage(Image);
            })
        })
    }

    return (
        <div>
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
                itemClass="carousel-item-padding-40-px">
                {imagelist.map((image) => {
                    return image.type === "PICTURE" ? <div key={image.name}>
                        <div className="">
                            <div className="slider-gallery-img" onClick={handleOpen}>
                                <img alt="no" src={process.env.REACT_APP_PROJECT_API + 'contractors/' + galleryId + '/files/' + image.name} alt="past-project"></img>
                            </div>
                        </div>
                    </div> : image.type === "LINK" ? <iframe frameborder="0" allowfullscreen="1" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title="YouTube video player" width="256" height="208" src="https://www.youtube.com/embed/sHsFIv8VA7w?enablejsapi=1&amp;origin=http%3A%2F%2Flocalhost%3A4000&amp;widgetid=1" id="widget2"></iframe> : null
                })}
                {/* https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DsHsFIv8VA7w */}
            </Carousel>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}>
                <div className="modal-gallery">
                    <div className="rootclass">
                        <img
                            className="imageclass"
                            src={process.env.REACT_APP_PROJECT_API + 'contractors/' + galleryId + '/files/' + Image[activeStep]} />
                        <AutoPlaySwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={activeStep}
                            onChangeIndex={handleStepChange}
                            enableMouseEvents>
                            {imagelist.map((step, index) => (
                                <div key={index} className="steeper">
                                    {Math.abs(activeStep - index) <= 2 ? (
                                        <img className="" src={step.imgPath} alt={step.label} />
                                    ) : null}
                                </div>
                            ))}
                        </AutoPlaySwipeableViews>
                        <MobileStepper
                            className="stepper-divider"
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