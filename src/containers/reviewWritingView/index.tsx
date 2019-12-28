import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Formik } from "formik";
import * as Yup from "yup";
import {withRouter} from 'react-router-dom';
//import Material ui components;
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Button from 'components/CustomButtons/Button';
import Rating from '@material-ui/lab/Rating';
import DeleteIcon from "@material-ui/icons/Delete";
import CameraIcon from '@material-ui/icons/CameraAlt';
import CircularProgress from '@material-ui/core/CircularProgress';
import './style.scss';
//import actions;
import {selectContractor} from 'store/actions/cont-actions';
import { submiteReview } from 'store/actions/global-actions';
//import apis;
import  ContApis from 'services/contractor';
//import types;
import { ContractorInfo } from 'types/contractor'
import {   UserProfile } from 'types/global';
//custom components;
import LoginForSubmit from './loginBeforeSubmit';
interface ReviewWriteViewProps {
	selectContractor: (id: String) => Promise<void>;    
	submiteReview: (id:String, params : any) => Promise<void>;    
	selectedContractor: ContractorInfo;
	userProfile: UserProfile;
}
interface ReviewWriteViewState {
	rating: number;
	qualities: String[];
	review: String;
	images: any;
	isBusyForGettingContractorDetails: boolean;
	selectedContractor: ContractorInfo;
	loginShow: boolean;
}
class ReviewWritingView extends React.Component<any, ReviewWriteViewState> {
	public fileUploader:any;
	constructor(props: any) {
		super(props);
		this.state = {
			rating : 0,
			qualities: [],
			review: "",
			images: [],
			isBusyForGettingContractorDetails: false,
			selectedContractor: null,
			loginShow: false,
		}
		this.setExp = this.setExp.bind(this);
		this.handleChangeImages = this.handleChangeImages.bind(this);
		this.hideLoginModal = this.hideLoginModal.bind(this);
		this.fileUploader = null;
	}
	setExp = (exp) => {
		var _qualities = this.state.qualities;
		if(!_qualities.includes(exp))
		{
			_qualities.push(exp)
		} else {
			_qualities = _qualities.filter((item) => item !== exp)
		}
		this.setState({
			qualities: _qualities
		})
	}
	handleChangeImages = (event) => {
		var _images = this.state.images;
		_images.push(event.target.files[0]);
		this.fileUploader.value = null;
		this.setState({
			images: _images
		})
		
	}
	hideLoginModal = () => {
		this.setState({
			loginShow: false
		})
	}
	async componentDidMount()
	{
		this.setState({isBusyForGettingContractorDetails: true});
		await this.props.selectContractor(this.props.match.params.id);
		this.setState({
			isBusyForGettingContractorDetails: false,
			selectedContractor: this.props.selectedContractor
		})
	}
	render() {
		var Rating_Strs = ['', 'very bad', 'bad', 'good', 'very good', 'excellent'];
		if(this.state.isBusyForGettingContractorDetails === true){
			return (
				<CircularProgress/>
			)
		} else if (this.state.selectedContractor === null || this.state.selectedContractor === undefined)
		{
			return (
				<div></div>
			)
		}
		return (
			<Box className = "review-view-root">
				<Box className = "contents">
					
					<Formik
                        initialValues={{ rating: "", review: ""}}
                        onSubmit={(values, { setSubmitting }) => {
							if(this.props.userProfile === null){
								this.setState({
									loginShow : true
								})
							} else {
								let data = new FormData();
								this.state.images.forEach((img) => {
									data.append('file', img)
								})
								data.set('reviewerEmail',this.props.userProfile.email);
								data.set('reviewerFirstName',this.props.userProfile.user_metadata.firstname);
								data.set('reviewerLastName',this.props.userProfile.user_metadata.lastname);
								data.set('rating', values.rating);
								data.set('qualities',this.state.qualities.toString());
								data.set('review',values.review);
								this.props.submiteReview(this.props.match.params.id,  data);
							}
                        }}
                        validationSchema={Yup.object().shape({
							rating: Yup.number().required("Please make your score"),
							review:  Yup.string().required("Please leave your feedback")
						})}
                    >
                        {props => {
                        const {
                            values,
                            touched,
                            errors,
                            handleChange,
                            handleBlur,
                            handleSubmit
                        } = props;
                        return (
                            <form onSubmit={handleSubmit} className = "content">
                               <Paper className = "reviewContainer">
									<Box className = "review-score">
										<img src = {ContApis.getAvatar(this.props.match.params.id) ? ContApis.getAvatar(this.props.match.params.id) : null} alt = "" className = "review-image"/>
										<Typography className = "review-title">How would you rate your overall experience with {this.state.selectedContractor && this.state.selectedContractor.address  ? this.state.selectedContractor.address.name : ""}?</Typography>
										<Box className = "rating-view">
											<Typography className = "rating-info-view">{Rating_Strs[this.state.rating]}</Typography>
											<Rating
											    name = "rating"
												value = {Number(values.rating)}
												onChange = {handleChange}
												size="large"
											/>
											 {errors.rating && touched.rating && (
												<Typography className="input-feedback">{errors.rating}</Typography>
											)}
										</Box>
									</Box>
								</Paper>
							   <Paper className = "reviewContainer">
									<Box className = "review-main-details">
										<Typography className = "review-experience-title">What did you like about working with Super cleaner?</Typography>
										<Box className = "review-experience-details">
											<Button className = {this.state.qualities.includes("Work Quality") ? "item select" : "item"} onClick = {()=>this.setExp("Work Quality")}>Work Quality</Button>		 
											<Button className = {this.state.qualities.includes("Professionalism") ? "item select" : "item"} onClick = {()=>this.setExp("Professionalism")}>Professionalism</Button>		 
											<Button className = {this.state.qualities.includes("Responsiveness") ? "item select" : "item"} onClick = {()=>this.setExp("Responsiveness")}>Responsiveness</Button>		 
											<Button className = {this.state.qualities.includes("Value") ? "item select" : "item"} onClick = {()=>this.setExp("Value")}>Value</Button>		 
											<Button className = {this.state.qualities.includes("Punctuality") ? "item select" : "item"} onClick = {()=>this.setExp("Punctuality")}>Punctuality</Button>		 
										</Box>
										<Box className = "submit-text-area">
											<TextField
												id="experience-text-area"
												name = "review"
												label=""
												multiline
												fullWidth
												rows = "10"
												variant="outlined"
												placeholder = "write about your experience"
												onChange = {handleChange}
												onBlur = {handleBlur}
											/>
											 {errors.review && touched.review && (
												<Typography className="input-feedback">{errors.review}</Typography>
											)}
										</Box>
										<Box className = "image-preview-area">
											{
												this.state.images && this.state.images.map((img, index) => (
													<Card className="card" key = {`preview-image${index}`}>
														<CardMedia
														className = "card-media"
														image={
															URL.createObjectURL(img)
														}
														>
														<DeleteIcon className = "delete-icon"
															onClick = {()=>{
																this.setState({
																	images: this.state.images.filter(image => image !== img)
																})
															}}
														/>
														</CardMedia>
														<CardContent className = "content">
															<TextField
																id={`image-description-${index}`}
																label=""
																multiline
																fullWidth
																rows = "3"
																variant="outlined"
																placeholder = "description"
																// onChange = {(e) => {
																// 	this.setState({
																// 		review: e.target.value
																// 	})
																// }}
															/>
														</CardContent>
													</Card>	
												))
											}
										</Box>
										<Box className = "add-image-view"
											onClick = {() => {
												this.fileUploader.click();
											}}
										>
											<input type="file" id="image-selector" ref={ref => this.fileUploader = ref} style={{display: "none"}}
												onChange = {this.handleChangeImages}
											/>
											<CameraIcon/>
											{this.state.images.length > 0 ? " Add More photos" : " Add Photos(Optional)"}
										</Box>
										<Box className = "submit-view">
											<Typography className = "policy-statement">
												By clicking Submit you agree to 
												<span className = "linked-text"> Terms of Use </span>
												and 
												<span className = "linked-text"> Privacy Policy </span>
											</Typography>
											<Box className = "submit-button-view">
												<Button color = "primary" className = "submit-button" type = "submit">Submit</Button>
											</Box>
										</Box>
									</Box>
								</Paper>
								<LoginForSubmit
									show = {this.state.loginShow}
									hide = {this.hideLoginModal}
									rating = {values.rating}
									qualities = {this.state.qualities}
									review = {values.review}
									con_id = {this.props.match.params.id}
									images = {this.state.images}
								/>
                            </form>
                        );
                        }}
							
                    </Formik>
				</Box>
			
			</Box>
		);
	}
}

const mapStateToProps = state => ({
	selectedContractor: state.cont_data.selectedContractor,
	userProfile: state.global_data.userProfile,
});
const mapDispatchToProps = {
	selectContractor,
	submiteReview
};

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(withRouter(ReviewWritingView));


