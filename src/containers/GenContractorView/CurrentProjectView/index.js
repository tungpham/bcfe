import React                      from 'react';
import { connect }                from 'react-redux';
import { compose }                from 'redux';
import {createStyles, withStyles} from '@material-ui/core/styles';
import Paper                      from '@material-ui/core/Paper';
import CircularProgress           from '@material-ui/core/CircularProgress';
import ReactTable                 from "react-table";
import Button from 'components/CustomButtons/Button.jsx';
import SweetAlert from "react-bootstrap-sweetalert";
import DeleteIcon       from '@material-ui/icons/Delete';
import InfoIcon       from '@material-ui/icons/Info';
import removeMd         from 'remove-markdown';
import CustomTableCell  from '../../../components/shared/CustomTableCell';
import CustomSnackbar   from '../../../components/shared/CustomSnackbar';
import ConfirmDialog    from '../../../components/shared/ConfirmDialog';

import { getProjectsByGenId }                     from '../../../actions/gen-actions';
import { deleteProject, setCurrentProject } from '../../../actions/global-actions';

import sweetAlertStyle from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx";

const style = (theme) => createStyles({
  root: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1)
  },
  actionButton: {
    margin: "0 0 0 5px",
    padding: "5px",
    "& svg,& .fab,& .fas,& .far,& .fal,& .material-icons": {
      marginRight: "0px"
    }
  },
  ...sweetAlertStyle,
});

class CurrentProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rowsPerPage: 20,
      currentPage: 0,
      isBusy: false,
      showMessage: false,
      message: '',
      variant: 'success',
      showConfirm: false,
      proId: 0,
    };
  }

  componentDidMount() {
    const { userProfile } = this.props;
    this.props.getProjectsByGenId(
      userProfile.user_metadata.contractor_id,
      0,
      0
    );
  }

  handleChangePage = async (event, page) => {
    const { userProfile } = this.props;
    this.setState({ currentPage: page, isBusy: true });
    try {
      this.props.getProjectsByGenId(
        userProfile.user_metadata.contractor_id,
        page,
        this.state.rowsPerPage
      );
    } catch (error) {
      console.log('CurrentProjectView.handleChangePage', error);
    }
    this.setState({ isBusy: false });
  };

  handleChangeRowsPerPage = async event => {
    const { projects, userProfile } = this.props;

    const rowsPerPage = event.target.value;
    const currentPage =
      rowsPerPage >= projects.totalElements ? 0 : this.state.currentPage;

    this.setState({ rowsPerPage, currentPage });
    try {
      this.props.getProjectsByGenId(
        userProfile.user_metadata.contractor_id,
        currentPage,
        rowsPerPage
      );
    } catch (error) {
      console.log('CurrentProjectView.handleChangeRowsPerPage', error);
    }
    this.setState({ isBusy: false });
  };

  handleDeleteProject = async id => {
    this.setState({ showConfirm: false });
    try {
      await this.props.deleteProject(this.state.prodId);
      this.setState({
        showMessage: true,
        message: 'Delete project success',
      });
    } catch (error) {
      this.setState({
        showMessage: true,
        message: 'Delete project failed',
      });
    }
  };

  hideAlert = () =>
      this.setState({
        showConfirm: false,
      });

  confirmDeleteProject = (id) =>
      this.setState({
        showConfirm: true,
        prodId: id
      })

  handleSelectProject = id => {
    this.props.setCurrentProject(id);
    this.props.history.push('/gen-contractor/project_detail/' + id);
  };

  render() {
    const { classes, projects } = this.props;

    if (projects === null) {
      return <CircularProgress className={classes.waitingSpin} />;
    }

    const dataTable = projects.content.map(item => ({
      ...item,
      actions: (
        <div className="actions-right">
          <Button
            size="sm"
            justIcon
            round
            onClick={() => this.handleSelectProject(item.id)}
            color="info"
            className="edit"
          >
            <InfoIcon />
          </Button>
          <Button
            size="sm"
            justIcon
            round
            onClick={() => this.confirmDeleteProject(item.id)}
            color="danger"
            className="remove"
          >
            <DeleteIcon />
          </Button>
        </div>
      )
    }));

    return (
      <Paper className={classes.root}>
        <ReactTable
          data={dataTable}
          columns={[
            {
              Header: "Project Name",
              accessor: "title"
            },
            {
              Header: "Budget",
              accessor: "budget"
            },
            {
              Header: "Description",
              accessor: "description"
            },
            {
              Header: "Actions",
              accessor: "actions"
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        {this.state.showConfirm && (
          <SweetAlert
            warning
            style={{ display: "block" }}
            title="Are you sure?"
            onConfirm={this.handleDeleteProject}
            onCancel={this.hideAlert}
            confirmBtnCssClass={
              this.props.classes.button + " " + this.props.classes.success
            }
            cancelBtnCssClass={
              this.props.classes.button + " " + this.props.classes.danger
            }
            confirmBtnText="Yes, delete it!"
            cancelBtnText="Cancel"
            showCancel
          />
        )}
        {/*<div className={classes.tableWrap}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <CustomTableCell> Project Title </CustomTableCell>
                <CustomTableCell align="center">Budget</CustomTableCell>
                <CustomTableCell align="center">Discription</CustomTableCell>
                <CustomTableCell align="center">Action</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.content.map(row => (
                <TableRow className={classes.row} key={row.id} hover>
                  <CustomTableCell
                    component="th"
                    scope="row"
                    onClick={() => this.handleSelectProject(row.id)}
                  >
                    <Typography className="nowrap">{row.title}</Typography>
                  </CustomTableCell>
                  <CustomTableCell
                    align="center"
                    onClick={() => this.handleSelectProject(row.id)}
                  >
                    {row.budget}
                  </CustomTableCell>
                  <CustomTableCell
                    align="center"
                    onClick={() => this.handleSelectProject(row.id)}
                  >
                    <Typography className="nowrap">
                      {removeMd(row.description)}
                    </Typography>
                  </CustomTableCell>
                  <CustomTableCell align="center">
                    <IconButton
                      aria-label="Delete"
                      color="primary"
                      onClick={() =>
                        this.setState({ showConfirm: true, proId: row.id })
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CustomTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          style={{ overflow: 'auto' }}
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={projects.totalElements}
          rowsPerPage={this.state.rowsPerPage}
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
          handleClose={() => this.setState({ showMessage: false })}
        />

        */}
      </Paper>
    );
  }
}

const mapDispatchToProps = {
  getProjectsByGenId,
  deleteProject,
  setCurrentProject,
};

const mapStateToProps = state => ({
  projects: state.gen_data.projects,
  userProfile: state.global_data.userProfile,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(style)
)(CurrentProject);
