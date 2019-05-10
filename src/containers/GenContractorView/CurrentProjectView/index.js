import React from 'react';
import { withRouter } from 'react-router-dom';
// Redux
import { connect } from 'react-redux';
import { addProject, getProjectDetailById, getAllProjects } from '../../../actions/gen-actions';

import PropTypes from 'prop-types';

// material ui
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
	root: {
		flexGrow: 1,
		height: "calc(100vh - 64px - 72px - 20px)",
		margin: "10px 10px 10px 10px",
		overflow: "auto",
	},
	card: {
		minWidth: "200px"
	},
	cardProjectTitle: {
		color: theme.palette.primary.dark
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	title: {
		fontSize: 14,
	},
	pos: {
		marginBottom: 12,
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default,
		},
	},
	waitingSpin: {
		position: "relative",
		left: "calc(50% - 10px)",
		top: "calc(40vh)",
	}
});

const CustomTableCell = withStyles(theme => ({
	head: {
		backgroundColor: theme.palette.primary.light,
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
		color: theme.palette.primary.light
	},
}))(TableCell);

class connectedCurProView extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		};
	}

	componentDidMount() {
		this.props.getAllProjects();
	}

	handleAddProject = () => {
	}

	render() {
		const { classes, projects } = this.props;

		return (
			<Paper className={classes.root}>
				{
					projects.length != 0 ?
						<Table className={classes.table}>
							<TableHead>
								<TableRow>
									<CustomTableCell> Project Title </CustomTableCell>
									<CustomTableCell align="center">Status</CustomTableCell>
									<CustomTableCell align="center">Discription</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									projects.map(
										row => (
											<TableRow className={classes.row} key={row.id} hover
												onClick={() => {
													this.props.getProjectDetailById(row.id);
													this.props.history.push("/g_cont/project_detail");
												}}>
												<CustomTableCell component="th" scope="row">
													Project {row.id}
												</CustomTableCell>
												<CustomTableCell align="center">{row.status}</CustomTableCell>
												<CustomTableCell align="center">{row.description}</CustomTableCell>
											</TableRow>
										)
									)
								}
							</TableBody>
						</Table>
						: <CircularProgress className={classes.waitingSpin} />
				}
			</Paper >
		);
	}
}


const mapDispatchToProps = dispatch => {
	return {
		getProjectDetailById: proEl => dispatch(getProjectDetailById(proEl)),
		addProject: proEl => dispatch(addProject(proEl)),
		getAllProjects: () => dispatch(getAllProjects())
	};
};

const mapStateToProps = state => {
	return {
		projects: state.gen_data.projects,
	};
};

const CurrentProjectView = connect(mapStateToProps, mapDispatchToProps)(connectedCurProView);

CurrentProjectView.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(CurrentProjectView));