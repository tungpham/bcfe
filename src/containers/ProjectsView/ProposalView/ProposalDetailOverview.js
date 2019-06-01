import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { TextField, Paper, Table, TableHead, TableRow, TableBody, InputAdornment, InputLabel, Input, Button, Typography, FormControl, Card, CircularProgress } from '@material-ui/core';
import CustomTableCell from '../../../components/shared/CustomTableCell';
import ProjectView from "./ProjectView";
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog';

const styles = (theme) => ({
	root: {
		position: 'relative',
		width: '100%',
		flexGrow: 1,
		padding: "10px"
	},
	tableWrap: {
		overflow: "auto",
		marginTop: '20px'
	},
	editField: {
		lineHeight: '1.5rem',
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 20px)",
		top: "calc(50% - 20px)",
	},
	width_300: {
		width: 300,
		marginRight: 10,
	},
	submitBtn: {
		border: "1px solid #4a148c",
		borderRadius: 0,
		backgroundColor: theme.palette.primary.light,
		color: "#FFFFFF",
		margin: 5,
		width: '120px',
		'&:hover': {
			backgroundColor: theme.palette.primary.dark
		},
		'&:disabled': {
			backgroundColor: "#FFFFFF"
		}
	},
	link: {
		'&:hover': {
			cursor: 'pointer',
		}
	},
	margin: {
		margin: theme.spacing(1),
	},
	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	textField: {
		flexBasis: 200,
	}
});


class ProposalDetailOverview extends Component {
	constructor(props) {
		super(props);

		console.log('brief', props.brief);
		this.state = {
			budget: props.brief.budget,
			duration: props.brief.duration,
			description: props.brief.description,
			showConfirm: false,
			message: 'Would you like to submit your proposal?'
		}
	}

	componentWillUnmount() {
		this.props.handleOverviewChange({ budget: this.state.budget, duration: this.state.duration, description: this.state.description });
	}

	handleChange = name => event => {
		this.setState({ [name]: event.target.value });
	};

	submit = async () => {
		this.setState({ showConfirm: true });
	}

	handleSubmit = async () => {
		this.setState({ showConfirm: false });
		this.props.handleSubmit({ budget: this.state.budget, duration: this.state.duration, description: this.state.description });
	}

	closeConfirm = () => {
		this.setState({ showConfirm: false });
	}

	render() {
		const { classes, project, edit } = this.props;

		return (
			<Paper className={classes.root}>
				<ProjectView project={project} />
				<div className={classes.tableWrap} >
					<Card id='brief-desc' style={{ display: 'flex', flexWrap: 'wrap' }}>
						<TextField disabled={!edit}
							label="Budget *" id="budget" type='number'
							className={clsx(classes.margin, classes.textField)}
							value={this.state.budget}
							onChange={this.handleChange('budget')}
							InputProps={{
								endAdornment: <InputAdornment position="start">USD</InputAdornment>,
							}}
						/>
						<TextField disabled={!edit}
							label="Duration *" type='number'
							className={clsx(classes.margin, classes.textField)}
							value={this.state.duration}
							onChange={this.handleChange('duration')}
							InputProps={{
								endAdornment: <InputAdornment position="start">days</InputAdornment>,
							}}
						/>
						<FormControl fullWidth className={classes.margin}>
							<InputLabel htmlFor="description">Description *</InputLabel>
							<Input disabled={!edit}
								id="description"
								value={this.state.description}
								onChange={this.handleChange('description')}
								multiline={true}
							/>
						</FormControl>
					</Card>

					<Typography variant="subtitle1" noWrap style={{ fontWeight: 'bold', fontSize: '24px', marginTop: '16px' }}>Project Templates</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<CustomTableCell>Name</CustomTableCell>
								<CustomTableCell align="center">Discription</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody >
							{
								project && project.projectTemplates.map((templ, index) => (
									<TableRow className={classes.row} key={index} hover
										onClick={() => this.props.templateSelected(index)}>
										<CustomTableCell component="th" scope="row">
											{templ.template.name}
										</CustomTableCell>
										<CustomTableCell align="center">{templ.template.description}</CustomTableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</div>

				<div style={{ textAlign: 'right', paddingTop: '16px' }}>
					{edit && <Button type='submit' className={classes.submitBtn} onClick={this.submit}>SUBMIT</Button>}
				</div>
				<ConfirmDialog open={this.state.showConfirm} message={this.state.message} onYes={this.handleSubmit} onCancel={this.closeConfirm} />
			</Paper >
		);
	}
}

ProposalDetailOverview.propTypes = {
	project: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	edit: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	templateSelected: PropTypes.func.isRequired,
	handleOverviewChange: PropTypes.func.isRequired
};

export default withRouter(withStyles(styles)(ProposalDetailOverview));