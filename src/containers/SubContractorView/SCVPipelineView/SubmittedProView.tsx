import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';

import removeMd from 'remove-markdown';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import CustomTableCell from 'components/shared/CustomTableCell';
import Ellipsis from 'components/Typography/Ellipsis';
import { UserProfile } from 'types/global';
import { deleteProposal, getProposals } from 'store/actions/sub-actions';
import { Proposals } from 'types/proposal';

const styles = createStyles((theme: Theme) => ({
	root: {
		position: 'relative',
		marginTop: theme.spacing(1),
		minHeight: 'calc(100vh - 64px - 56px - 16px - 48px)'
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	btnSubmitProposal: {
		marginBottom: 5,
		backgroundColor: theme.palette.primary.light,
		color: '#FFF',
		borderRadius: 0,
	},
	titleBtn: {
		color: '#4a148c',
		padding: '6px',
	},
	button: {
		padding: '6px',
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	},
}));

interface ISubmittedProViewProps extends RouteComponentProps {
	userProfile: UserProfile;
	classes: ClassNameMap<string>;
	proposals: Proposals;
	getProposals: (id: string, page: number, size: number, status: string) => Promise<void>;
	deleteProposal: (id: string) => Promise<void>;
}

interface ISubmittedProViewState extends ISnackbarProps {
	rowsPerPage: number;
	currentPage: number;
	isBusy: boolean;
}

class SubmittedProView extends React.Component<ISubmittedProViewProps, ISubmittedProViewState> {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			currentPage: 0,
			isBusy: false,
			showMessage: false,
			message: '',
			variant: 'success',
			handleClose: () => this.setState({ showMessage: false })
		};
	}

	componentDidMount() {
		const { userProfile } = this.props;
		this.props.getProposals(userProfile.user_metadata.contractor_id,
			0, 0, 'SUBMITTED');
	}

	handleChangePage = (event, page) => {
		const { userProfile } = this.props;
		this.setState({ currentPage: page });
		this.props.getProposals(userProfile.user_metadata.contractor_id, page, this.state.rowsPerPage, 'SUBMITTED');
	};

	handleChangeRowsPerPage = event => {
		const { proposals, userProfile } = this.props;

		const rowsPerPage = event.target.value;
		const currentPage =
			rowsPerPage >= proposals.totalElements ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage,
		});

		this.props.getProposals(
			userProfile.user_metadata.contractor_id,
			currentPage,
			rowsPerPage,
			'SUBMITTED'
		);
	};

	handleDeleteProposal = async id => {
		this.setState({ isBusy: true });

		const { userProfile, proposals } = this.props;
		try {
			await this.props.deleteProposal(id);

			if (
				this.state.rowsPerPage * this.state.currentPage <
				proposals.totalElements - 1
			) {
				await this.props.getProposals(
					userProfile.user_metadata.contractor_id,
					this.state.currentPage,
					this.state.rowsPerPage,
					'SUBMITTED'
				);
				this.setState({
					isBusy: false,
					showMessage: true,
					message: 'delete proposal success',
					variant: 'success',
				});
			} else {
				const currentPage = this.state.currentPage - 1;
				await this.props.getProposals(
					userProfile.user_metadata.contractor_id,
					currentPage,
					this.state.rowsPerPage,
					'SUBMITTED'
				);

				this.setState({
					isBusy: false,
					showMessage: true,
					message: 'delete proposal success',
					variant: 'success',
					currentPage,
				});
			}
		} catch (error) {
			console.log(error);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'delete proposal failed',
				variant: 'error',
			});
		}
	};

	handleSelectProposal = id => {
		this.props.history.push(`/s_cont/proposal_detail/${id}`);
	};

	render() {
		const { classes, proposals } = this.props;

		if (!proposals) {
			return (
				<Box className={classes.root}>
					<CircularProgress className={classes.busy} />
				</Box>
			);
		}

		return (
			<Box className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell> Project Title </CustomTableCell>
							<CustomTableCell align="center">Bids</CustomTableCell>
							<CustomTableCell align="center">Location</CustomTableCell>
							<CustomTableCell align="center">Price</CustomTableCell>
							<CustomTableCell align="center">Upload Date <ArrowDownwardIcon style={{ fontSize: '15px' }} className="Arrowdown" /></CustomTableCell>
							<CustomTableCell align="center">Bids Due<ArrowDownwardIcon style={{ fontSize: '15px' }} className="Arrowdown" /></CustomTableCell>
							<CustomTableCell align="center">Project Details</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{proposals.content.map(row => (
							<TableRow className={classes.row} key={row.id} hover>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									component="th"
									scope="row"
									align="center"
								>
									<Ellipsis maxLines={2}>{row.project.title}</Ellipsis>
								</CustomTableCell>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									component="th"
									scope="row"
									align="center"
								>
									{row.budget}
								</CustomTableCell>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									component="th"
									scope="row"
									align="center"
								>
									{row.duration}
								</CustomTableCell>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									component="th"
									scope="row"
									align="center"
								>
									{row.status}
								</CustomTableCell>
								<CustomTableCell
									onClick={() => this.handleSelectProposal(row.id)}
									align="center"
								>
									
								</CustomTableCell>
								<CustomTableCell align="center">
								<Ellipsis maxLines={2}>{removeMd(row.description)}</Ellipsis>
								</CustomTableCell>
								<CustomTableCell align="center">
								hello
								</CustomTableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<TablePagination
					style={{ overflow: 'auto' }}
					rowsPerPageOptions={[5, 10, 20]}
					count={proposals.totalElements}
					rowsPerPage={this.state.rowsPerPage}
					component="div"
					page={this.state.currentPage}
					backIconButtonProps={{ 'aria-label': 'Previous Page' }}
					nextIconButtonProps={{ 'aria-label': 'Next Page' }}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
				<CustomSnackbar
					open={this.state.showMessage}
					variant={this.state.variant}
					message={this.state.message}
					handleClose={this.state.handleClose}
				/>
				{this.state.isBusy && <CircularProgress className={classes.busy} />}
			</Box>
		);
	}
}

const mapDispatchToProps = {
	getProposals,
	deleteProposal,
};

const mapStateToProps = state => ({
	proposals: state.sub_data.proposals,
	userProfile: state.global_data.userProfile,
});

export default compose(
	withStyles(styles),
	connect(mapStateToProps, mapDispatchToProps)
)(SubmittedProView);
