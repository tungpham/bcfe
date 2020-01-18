/*eslint-enable*/
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Button from "components/CustomButtons/Button.jsx";
import CustomTableCell from "components/shared/CustomTableCell";
import { deleteProject } from 'store/actions/gen-actions';
import { getInvitedProjects } from 'store/actions/sub-actions';
import { Projects } from 'types/project';
import { UserProfile } from 'types/global';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import Ellipsis from 'components/Typography/Ellipsis';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import ContApis from 'services/contractor';
const styles = createStyles((theme: Theme) => ({
	root: {
		position: 'relative',
		marginTop: '24px',
		minHeight: 'calc(100vh - 64px - 56px - 16px - 48px)'
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)',
	},
}));

interface InvitedProViewProps extends RouteComponentProps {
	classes: ClassNameMap<string>;
	searchTerm: String;
	getInvitedProjects: (id: string, page: number, size: number) => Promise<void>;
	deleteProject: (id: string) => Promise<void>;
	projects: Projects;
	userProfile: UserProfile;
}

interface InvitedProViewState extends ISnackbarProps {
	rowsPerPage: number;
	currentPage: number;
	isBusy: boolean;
	alertConfirm: boolean;
	startDateOrder: "desc" | "asc";
	endDateOrder: "desc" | "asc";
	totalLength: number;
	proId: string;
	inviteData: [];
}

class InvitedProView extends React.Component<InvitedProViewProps, InvitedProViewState> {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 20,
			inviteData: [],
			currentPage: 0,
			isBusy: false,
			showMessage: false,
			startDateOrder: "desc",
			endDateOrder: "desc",
			totalLength: 0,
			message: '',
			variant: 'success',
			alertConfirm: false,
			proId: '',
			handleClose: () => this.setState({ showMessage: false })
		};
	}

	async componentDidMount() {
		this.setState({ isBusy: true });
		await ContApis.getContractorsWithSearchTerm("sub", this.props.userProfile.user_metadata.contractor_id, 0, this.state.rowsPerPage, this.props.searchTerm, "AWARDED").then(res => {
			this.setState({ inviteData: res.data.content })
			this.setState({ totalLength: res.data.totalElements })
		});
		// this.props.getInvitedProjects(
		// 	userProfile.user_metadata.contractor_id,
		// 	0, 0
		// );
		this.setState({ isBusy: false });
	}
	async componentDidUpdate(prevProps: InvitedProViewProps)
	{
		if(prevProps.searchTerm !== this.props.searchTerm)
		{
			this.setState({ isBusy: true, currentPage: 0 });
			await ContApis.getContractorsWithSearchTerm("sub", this.props.userProfile.user_metadata.contractor_id, 0, this.state.rowsPerPage, this.props.searchTerm, "AWARDED").then(res => {
				this.setState({ inviteData: res.data.content })
				this.setState({ totalLength: res.data.totalElements })
			});
			// this.props.getInvitedProjects(
			// 	userProfile.user_metadata.contractor_id,
			// 	0, 0
			// );
			this.setState({ isBusy: false });
		}
	}
	handleChangePage = async (event, page) => {
		try {
			if (page >= this.state.totalLength) page = this.state.totalLength - 1;
			this.setState({ isBusy: false });
			await ContApis.getContractorsWithSearchTerm("sub", this.props.userProfile.user_metadata.contractor_id, page, this.state.rowsPerPage, this.props.searchTerm, "AWARDED")
				.then(data => {
					this.setState({
						inviteData: data.data.content,
						isBusy: false,
						currentPage: page,
					});
				})
			
		} catch (error) {
			console.log('CurrentProjectView.handleChangePage', error);
		}
		this.setState({ isBusy: false });
	};

	handleChangeRowsPerPage = async  event => {
		const { currentPage, rowsPerPage } = this.state;
		const curIndex = currentPage * rowsPerPage;
		const newPageSize = event.target.value;
		const newPage = Math.floor(curIndex / newPageSize);
		this.setState({
			isBusy: true,
			currentPage: 0
		})
		try {
			await ContApis.getContractorsWithSearchTerm("sub", this.props.userProfile.user_metadata.contractor_id, newPage, newPageSize, this.props.searchTerm, "AWARDED")
			.then(res => {
				this.setState({
					inviteData: res.data.content,
					isBusy: false,
					currentPage: newPage,
					rowsPerPage: newPageSize,
				});
			});
		} catch (error) {
			console.log(error);
			this.setState({isBusy: false})
		}
	};

	handleDeleteProject = async id => {
		const { projects, userProfile } = this.props;
		this.setState({
			isBusy: true,
			alertConfirm: false,
		});

		try {
			await this.props.deleteProject(this.state.proId);

			let curPage = this.state.currentPage;
			if (this.state.rowsPerPage * curPage >= projects.totalElements - 1) {
				curPage--;
			};

			await this.props.getInvitedProjects(
				userProfile.user_metadata.contractor_id,
				curPage, this.state.rowsPerPage
			);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Delete project success',
				variant: 'success',
				currentPage: curPage
			});
		} catch (error) {
			console.log('InvitedProView.handleDeleteProject: ', error);
			this.setState({
				isBusy: false,
				showMessage: true,
				message: 'Delete project failed',
				variant: 'error'
			});
		}
	};

	deleteProject = (id: string) => {
		this.setState({
			alertConfirm: true,
			proId: id,
		});
	}

	handleSelectProject = async id => {
		this.props.history.push('/s_cont/proposal_detail/' + id);
	};

	// Implemented Sort function on Start Date  column.
	StartDateToggleSort = () => {
		let startDateOrder: ('desc' | 'asc') = 'desc';

		if (this.state.startDateOrder === 'desc') {
			startDateOrder = 'asc';
		}
		this.state.inviteData.sort((a: any, b: any) =>
			a.project.startDate > b.project.startDate ? 1 : -1
		);
		this.setState({ startDateOrder });
	}

	// Implemented Sort function on End Date  column.
	EndDateToggleSort = () => {
		let endDateOrder: ('desc' | 'asc') = 'desc';

		if (this.state.endDateOrder === 'desc') {
			endDateOrder = 'asc';
		}
		this.state.inviteData.sort((a: any, b: any) =>
			a.project.endDate > b.project.endDate ? 1 : -1
		);
		this.setState({ endDateOrder });
	}

	render() {
		const { classes } = this.props;
		const { showMessage, variant, message } = this.state;
        if (this.state.isBusy) {
            return <CircularProgress className={classes.waitingSpin} />;
        }
		return (
			<Box className={classes.root}>
				<Table className="sub-table-margin"  style={{marginTop:'55px'}}> 
					<TableHead>
						<TableRow>
							<CustomTableCell className="sub-table-col-1"> Project Title </CustomTableCell>
							<CustomTableCell align="center">Owner</CustomTableCell>
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
						{this.state.inviteData.length > 0 ? this.state.inviteData.map((row: any) => (
							<TableRow className={classes.row} key={row.id} hover>
								<CustomTableCell
									component="th"
									scope="row"
									onClick={() => this.handleSelectProject(row.id)}
								>
									<Ellipsis maxLines={2}>{row.project.title}</Ellipsis>
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.handleSelectProject(row.id)}
								>
									{row.subContractor.address && row.subContractor.address.name ? row.subContractor.address.name: ""}
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.handleSelectProject(row.id)}
								>
									{row.project.city}
								</CustomTableCell>
								<CustomTableCell
									align="center"
									onClick={() => this.handleSelectProject(row.id)}
								>
									<Ellipsis maxLines={2}>{row.budget}
									</Ellipsis>
								</CustomTableCell>
								<CustomTableCell align="center" onClick={() => this.handleSelectProject(row.id)}>

									{row.project.startDate && row.project.startDate.slice(0, 10)}
									<div className="time">
										{row.project.startDate && row.project.startDate.slice(10, 19)}&nbsp;{row.project.startDate.slice(10, 13) <= 11 ? "AM" : "PM"}
									</div>
								</CustomTableCell>
								<CustomTableCell
									component="th"
									scope="row"
									onClick={() => this.handleSelectProject(row.id)}
								>
									<Ellipsis maxLines={2}>
										{row.project.endDate && row.project.endDate.slice(0, 10)}
										<div className="time">
											{row.project.endDate && row.project.endDate.slice(10, 19)}&nbsp;{row.project.endDate.slice(10, 13) <= 11 ? "AM" : "PM"}
										</div>
									</Ellipsis>
								</CustomTableCell>
								<CustomTableCell
									onClick={() => this.handleSelectProject(row.id)}
									component="th"
									scope="row"
								>
									<Ellipsis maxLines={2}>
										{row.project.description}
									</Ellipsis>
								</CustomTableCell>
							</TableRow>
						)):(null)}
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
				<Dialog
					open={this.state.alertConfirm}
					onClose={() => this.setState({ alertConfirm: false })}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{'Delete Project?'}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Do you want to delete this project?
            			</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => this.setState({ alertConfirm: false })}>
							No
            			</Button>
						<Button
							onClick={() => this.handleDeleteProject(this.state.proId)}
							color="primary"
							autoFocus
						>
							Yes
            			</Button>
					</DialogActions>
				</Dialog>
			</Box>
		);
	}
}

const mapDispatchToProps = {
	getInvitedProjects,
	deleteProject
};

const mapStateToProps = state => ({
	projects: state.sub_data.projects,
	userProfile: state.global_data.userProfile,
})

export default compose(
	withStyles(styles),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(InvitedProView)
