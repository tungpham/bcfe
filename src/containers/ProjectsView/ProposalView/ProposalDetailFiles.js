import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import List from '@material-ui/core/List';
import { CircularProgress, IconButton, Snackbar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import CustomTableCell from '../../../components/shared/CustomTableCell';
import CustomizedSnackbars from '../../../components/shared/CustomSnackbar';

import { DropzoneDialog } from 'material-ui-dropzone';
import { setSelectedProposal, addFilesToProposal, deleteProposalFile, getProposalDetails } from '../../../actions/gen-actions';
import { select } from 'glamor';

const styles = theme => ({
	root: {
		flexGrow: 1,
		padding: "10px 10px 10px 10px",
		height: "calc(100vh - 64px - 72px - 48px - 20px)",
		overflow: "auto",
		overflowX: "hidden"
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

class ConnectedProposalDetailFiles extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			openUploadForm: false,
			showMessage: false,
			message: '',
			variant: 'success'
		}
	}

	handleUploadFiles = async (files) => {
		const { selectedProposal } = this.props;
		let variant = 'success';
		let message = 'File Upload Success';

		try {
			await this.props.addFilesToProposal(selectedProposal.proposal.id, files);
			await this.props.getProposalDetails(selectedProposal.proposal.id);
		} catch (error) {
			message = 'File Upload failed';
			variant = 'error';
		}

		this.setState({ showMessage: true, openUploadForm: false, message, variant });
	}

	handleDeletefile = async (name) => {
		const { selectedProposal } = this.props;
		let variant = 'sucess';
		let message = 'File Delete Success';

		try {
			await this.props.deleteProposalFile(selectedProposal.proposal.id, name);
			await this.props.getProposalDetails(selectedProposal.proposal.id);
		} catch (error) {
			message = 'File Delete failed';
			variant = 'error';
		}

		this.setState({ showMessage: true, openUploadForm: false, message, variant });
	}

	openUpload = () => {
		const { selectedProposal } = this.props;
		if (!selectedProposal.proposal.id) {
			this.setState({ showMessage: true, openUploadForm: false, message: 'You must submit a proposal first', variant: 'info' });
			return;
		}

		this.setState({ openUploadForm: true, showMessage: false });
	}

	render() {
		const { classes, selectedProposal } = this.props;

		return (
			<div className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell align="center">Name</CustomTableCell>
							<CustomTableCell align="center">
								<IconButton style={{ color: "#FFFFFF" }} onClick={this.openUpload}>
									<NoteAddIcon />
								</IconButton>
							</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{
							selectedProposal.proposal.proposalFiles &&
							selectedProposal.proposal.proposalFiles.map((row) => (
								<TableRow key={row.id} hover>
									<CustomTableCell align="center">
										<a download={row.name} href={process.env.PROJECT_API + "/proposals/" + selectedProposal.proposal.id + "/files/" + row.name}>{row.name}</a>
									</CustomTableCell>
									<CustomTableCell align="center">
										<IconButton className={classes.button} aria-label="Delete" color="primary" onClick={
											() => this.handleDeletefile(row.name)
										}>
											<DeleteIcon />
										</IconButton>
									</CustomTableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>

				<DropzoneDialog
					open={this.state.openUploadForm}
					onSave={this.handleUploadFiles}
					maxFileSize={52428800}
					showFileNamesInPreview={true}
					acceptedFiles={['text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*']}
					filesLimit={100}
					dropzoneText='select files to upload(< 50mb)'
					onClose={() => this.setState({ openUploadForm: false })}
				/>

				<CustomizedSnackbars
					variant={this.state.variant}
					message={this.state.message}
					open={this.state.showMessage}
					handleClose={() => this.setState({ showMessage: false })} />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setSelectedProposal: (id) => dispatch(setSelectedProposal(id)),
		addFilesToProposal: (id, files) => dispatch(addFilesToProposal(id, files)),
		deleteProposalFile: (id, name) => dispatch(deleteProposalFile(id, name)),
		getProposalDetails: id => dispatch(getProposalDetails(id))
	}
}

const mapStateToProps = state => {
	return {
		selectedProposal: state.gen_data.selectedProposal
	};
};

const ProposalDetailFiles = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalDetailFiles);

ProposalDetailFiles.propTypes = {
	classes: PropTypes.object.isRequired,
	selectedProposal: PropTypes.shape({
		proposal: PropTypes.shape({
			proposalFiles: PropTypes.arrayOf(PropTypes.shape({
				id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired
			})),
		}),
	}),
};

export default withStyles(styles)(ProposalDetailFiles);