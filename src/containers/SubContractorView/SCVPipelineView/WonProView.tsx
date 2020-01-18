/*eslint-enable*/
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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import ContApis from 'services/contractor';

const styles = createStyles(theme => ({
	root: {
		position: 'relative',
		marginTop: '24px',
		minHeight: '47px'
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
	searchTerm: String;
	getProposals: (id: string, page: number, size: number, filter: string) => Promise<void>;
	deleteProposal: (id: string) => Promise<void>;
}

interface IWonProjectViewState extends ISnackbarProps {
	rowsPerPage: number;
	currentPage: number;
	isBusy: boolean;
	awardData: [];
	totalLength: number;
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
			totalLength: 0,
			isBusy: false,
			showMessage: false,
			startDateOrder: "desc",
			endDateOrder: "desc",
			message: '',
			variant: 'success',
			handleClose: () => this.setState({ showMessage: false })
		};
	}

	async componentDidMount() {
		this.setState({
			isBusy:true
		})
		await ContApis.getContractorsWithSearchTerm("sub", this.props.userProfile.user_metadata.contractor_id, 0, this.state.rowsPerPage, this.props.searchTerm, "INACTIVE")
		.then(res => {
			this.setState({ 
				awardData: res.data.content ,
				isBusy: false
			})
		}).catch(()=>{
			this.setState({
				awardData: [],
				isBusy: false
			})
		});
	}
	async componentDidUpdate(prevProps: IWonProjectViewProps){
		if(prevProps.searchTerm !== this.props.searchTerm)
		{
			this.setState({
				isBusy:true,
				currentPage: 0
			})
			await ContApis.getContractorsWithSearchTerm("sub", this.props.userProfile.user_metadata.contractor_id, 0, this.state.rowsPerPage, this.props.searchTerm, "INACTIVE")
			.then(res => {
				this.setState({ 
					awardData: res.data.content ,
					isBusy: false,
					currentPage: 0
				})
			}).catch(()=>{
				this.setState({
					awardData: [],
					isBusy: false,
					currentPage: 0
				})
			});
		}
	}
	handleChangePage = async (event, page) => {
		try {
			if (page >= this.state.totalLength) page = this.state.totalLength - 1;
			await ContApis.getContractorsWithSearchTerm("sub", this.props.userProfile.user_metadata.contractor_id, page, this.state.rowsPerPage, this.props.searchTerm, "INACTIVE")
				.then(data => {
					this.setState({
						awardData: data.data.content,
						isBusy: false,
						currentPage: page,
					});
				})
			this.setState({ isBusy: false });
		} catch (error) {
			console.log('CurrentProjectView.handleChangePage', error);
		}
		this.setState({ isBusy: false });
	};



	handleChangeRowsPerPage = async event => {
		const { currentPage, rowsPerPage } = this.state;
		const curIndex = currentPage * rowsPerPage;
		const newPageSize = event.target.value;
		const newPage = Math.floor(curIndex / newPageSize);
		try {
			await ContApis.getContractorsWithSearchTerm("sub", this.props.userProfile.user_metadata.contractor_id, newPage, newPageSize, this.props.searchTerm, "INACTIVE")
			.then(res => {
				this.setState({
					awardData: res.data.content,
					isBusy: false,
					currentPage: newPage,
					rowsPerPage: newPageSize,
				});
			});
		} catch (error) {
			console.log(error);
		}
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
				'INACTIVE'
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
        if (this.state.isBusy ) {
            return <CircularProgress className={classes.busy} />
        }
	    if (this.state.awardData.length === 0) {
            return <div className="nodata">No Data Available!</div>;
        }
		console.log("awa", this.state.awardData);
		return (
			<Box className={classes.root}>
				<Table className="sub-table-margin" style={{marginTop:'55px'}}>
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
									{row.subContractor.address.name}
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
					count={this.state.totalLength}
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
