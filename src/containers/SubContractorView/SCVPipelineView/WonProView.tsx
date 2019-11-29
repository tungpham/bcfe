import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import CustomTableCell from "components/shared/CustomTableCell";
import Ellipsis from 'components/Typography/Ellipsis';
import { deleteProposal, getProposals } from 'store/actions/sub-actions';
import { UserProfile } from 'types/global';
import { Proposals } from 'types/proposal';
import Axios from 'axios';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const styles = createStyles(theme => ({
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
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	},
}));

interface IWonProjectViewProps extends RouteComponentProps {
	classes: ClassNameMap<string>;
	userProfile: UserProfile;
	proposals: Proposals;
	getProposals: (id: string, page: number, size: number, filter: string) => Promise<void>;
	deleteProposal: (id: string) => Promise<void>;
}

interface IWonProjectViewState extends ISnackbarProps {
	rowsPerPage: number;
	currentPage: number;
	isBusy: boolean;
	awardData: [];
	startDateOrder: "desc" | "asc";
	endDateOrder: "desc" | "asc";
}

class WonProjectView extends React.Component<IWonProjectViewProps, IWonProjectViewState> {
	constructor(props) {
		super(props);
		this.state = {
			awardData: [],
			rowsPerPage: 20,
			currentPage: 0,
			isBusy: false,
			showMessage: false,
			startDateOrder: "desc",
			endDateOrder: "desc",
			message: '',
			variant: 'success',
			handleClose: () => this.setState({ showMessage: false })
		};
	}

	componentDidMount() {
		const { userProfile } = this.props;
		Axios.get(`https://bcbe-service.herokuapp.com/contractors/${userProfile.user_metadata.contractor_id}/proposals?page=${this.state.currentPage}&size=${this.state.rowsPerPage}&status=INACTIVE`).then(res => {
			this.setState({ awardData: res.data.content })
		});
		this.props.getProposals(
			userProfile.user_metadata.contractor_id,
			0, 0, 'AWARDED'
		);
	}

	handleChangePage = (event, page) => {
		const { userProfile } = this.props;
		this.setState({ currentPage: page });
		this.props.getProposals(
			userProfile.user_metadata.contractor_id,
			page,
			this.state.rowsPerPage,
			'AWARDED'
		);
	};

	handleChangeRowsPerPage = event => {
		const { userProfile } = this.props;

		const rowsPerPage = event.target.value;
		const currentPage =
			rowsPerPage >= this.state.awardData.length ? 0 : this.state.currentPage;

		this.setState({
			rowsPerPage: rowsPerPage,
			currentPage: currentPage,
		});

		Axios.get(`https://bcbe-service.herokuapp.com/contractors/${userProfile.user_metadata.contractor_id}/proposals?page=${currentPage}&size=${rowsPerPage}&status=INACTIVE`).then(res => {
			this.setState({ awardData: res.data.content })
		});
	};

	handleDeleteProposal = async id => {
		const { userProfile, proposals } = this.props;
		this.setState({ isBusy: true });
		try {
			await this.props.deleteProposal(id);
			let curPage = this.state.currentPage;
			if (this.state.rowsPerPage * this.state.currentPage >= proposals.totalElements - 1) {
				curPage--;
			}
			await this.props.getProposals(
				userProfile.user_metadata.contractor_id,
				curPage,
				this.state.rowsPerPage,
				'AWARDED'
			);

			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Delete proposal success',
				variant: 'success',
				currentPage: curPage
			});
		} catch (error) {
			console.log('WonProView.handleDeleteProposal: ', error);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Delete proposal failed',
				variant: 'error'
			});
		}
	};

	handleSelectProposal = id => {
		this.props.history.push(`/s_cont/proposal_detail/${id}`);
	};

	StartDateToggleSort = () => {
		let startDateOrder: ('desc' | 'asc') = 'desc';

		if (this.state.startDateOrder === 'desc') {
			startDateOrder = 'asc';
		}
		this.state.awardData.sort((a: any, b: any) =>
			a.project.startDate > b.project.startDate ? 1 : -1
		);
		this.setState({ startDateOrder });
	}

	EndDateToggleSort = () => {
		let endDateOrder: ('desc' | 'asc') = 'desc';

		if (this.state.endDateOrder === 'desc') {
			endDateOrder = 'asc';
		}
		this.state.awardData.sort((a: any, b: any) =>
			a.project.endDate > b.project.endDate ? 1 : -1
		);
		this.setState({ endDateOrder });
	}


	render() {
		const { classes } = this.props;
		const { showMessage, variant, message } = this.state;

		if (this.state.awardData.length === 0) {
			return <div className="nodata">No Data Available!</div>
		}

		return (
			<Box className={classes.root}>
				<Table>
					<TableHead>
						<TableRow>
							<CustomTableCell className="sub-table-col-1"> Project Title </CustomTableCell>
							<CustomTableCell align="center">owner</CustomTableCell>
							<CustomTableCell align="center">Location</CustomTableCell>
							<CustomTableCell align="center">Price</CustomTableCell>
							<CustomTableCell align="center">
								<TableSortLabel style={{ fontSize: '15px', cursor: "pointer" }} className="Arrowdown"
									active={true}
									direction={this.state.startDateOrder}
									onClick={this.StartDateToggleSort}
								>
									Start Date </TableSortLabel> </CustomTableCell>
							<CustomTableCell align="center"><TableSortLabel style={{ fontSize: '15px', cursor: "pointer" }} className="Arrowdown"
								active={true}
								direction={this.state.endDateOrder}
								onClick={this.EndDateToggleSort}
							>
								End Date
									</TableSortLabel>
							</CustomTableCell>
							<CustomTableCell align="center" className="sub-table-col-width">Project Details</CustomTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.state.awardData.map((row: any) => (

							<TableRow className={classes.row} key={row.id} hover>
								<CustomTableCell
									component="th"
									scope="row"

								>
									<Ellipsis maxLines={2}>{row.project.title}</Ellipsis>
								</CustomTableCell>
								<CustomTableCell
									align="center"

								>

								</CustomTableCell>
								<CustomTableCell
									align="center"

								>
									{row.project.city}
								</CustomTableCell>
								<CustomTableCell
									align="center"

								>
									<Ellipsis maxLines={2}>${row.budget}
									</Ellipsis>
								</CustomTableCell>
								<CustomTableCell align="center">
									{row.project.startDate && row.project.startDate.slice(0, 10)}
									<div className="time">
										{row.project.startDate && row.project.startDate.slice(10, 19)}&nbsp;{row.project.startDate.slice(10, 13) <= 11 ? "AM" : "PM"}
									</div>
								</CustomTableCell>
								<CustomTableCell
									component="th"
									scope="row"
								>
									<Ellipsis maxLines={2}>
										{row.project.endDate && row.project.endDate.slice(0, 10)}
										<div className="time">
											{row.project.endDate && row.project.endDate.slice(10, 19)}&nbsp;{row.project.endDate.slice(10, 13) <= 11 ? "AM" : "PM"}
										</div>
									</Ellipsis>
								</CustomTableCell>
								<CustomTableCell
									component="th"
									scope="row"
								>
									<Ellipsis maxLines={2}>
										{row.project.description}
									</Ellipsis>
								</CustomTableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<TablePagination
					style={{ overflow: 'auto' }}
					rowsPerPageOptions={[5, 10, 20]}
					component="div"
					count={this.state.awardData.length}
					rowsPerPage={this.state.rowsPerPage}
					page={this.state.currentPage}
					backIconButtonProps={{ 'aria-label': 'Previous Page' }}
					nextIconButtonProps={{ 'aria-label': 'Next Page' }}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
				<CustomSnackbar
					open={showMessage}
					variant={variant}
					message={message}
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
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(WonProjectView);
