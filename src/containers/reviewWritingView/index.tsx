import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
//import Material ui components;
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
//import assets;
import Img1 from 'assets/images/slider1.jpeg';
import './style.scss';

interface ReviewWriteViewState {
	rating: number;
}
class ReviewWritingView extends React.Component<any, ReviewWriteViewState> {
	constructor(props: any) {
		super(props);
		this.state = {
			rating : 0
		}
	}
	render() {
		var Rating_Strs = ['', 'very bad', 'bad', 'good', 'very good', 'excellent']
		return (
			<Box className = "review-view-root">
				<Box className = "contents">
					<Paper className = "reviewContainer">
						<Box className = "review-score">
					     	<img src = {Img1} alt = "" className = "review-image"/>
					     	<Typography className = "review-title">How would you rate your overall experience with Super cleaner?</Typography>
							 <Box className = "rating-view">
		                         <Typography className = "rating-info-view">{Rating_Strs[this.state.rating]}</Typography>
								 <Rating
									 value = {this.state.rating}
									 onChange = {(e, newVal) => {
										this.setState({
											rating: newVal
										})
									 }}
									 size="large"
								 />
							 </Box>
						</Box>
					</Paper>
					<Paper className = "reviewContainer">
						<Typography >How would you rate your overall experience with Super cleaner?</Typography>
					</Paper>
				</Box>
			</Box>
		);
	}
}

const mapStateToProps = state => ({
	
});
const mapDispatchToProps = {
	
};

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(ReviewWritingView);
