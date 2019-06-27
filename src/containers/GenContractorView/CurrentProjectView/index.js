import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReactTable from 'react-table';
import Button from 'components/CustomButtons/Button.jsx';
import SweetAlert from 'react-bootstrap-sweetalert';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';

import { getProjectsByGenId } from '../../../actions/gen-actions';
import {
  deleteProject,
  setCurrentProject,
} from '../../../actions/global-actions';

import sweetAlertStyle from 'assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.jsx';

const style = theme =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(0, 2),
    },
    actionButton: {
      margin: '0 0 0 5px',
      padding: '5px',
      '& svg,& .fab,& .fas,& .far,& .fal,& .material-icons': {
        marginRight: '0px',
      },
    },
    ...sweetAlertStyle,
  });

class CurrentProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rowsPerPage: 4,
      currentPage: 0,
      showConfirm: false,
      proId: 0,
      alert: null,
    };
  }

  componentDidMount() {
    const { userProfile } = this.props;
    this.props.getProjectsByGenId(
      userProfile.user_metadata.contractor_id,
      this.state.currentPage,
      this.state.rowsPerPage
    );
  }

  refreshDataSource = () => {
    const { userProfile } = this.props;
    try {
      this.props.getProjectsByGenId(
        userProfile.user_metadata.contractor_id,
        this.state.currentPage,
        this.state.rowsPerPage
      );
    } catch (error) {
      // TODO
    }
  };

  setPage = (pageSize, pageIndex) =>
    this.setState({ currentPage: pageIndex, rowsPerPage: pageSize });

  handleDeleteProject = async () => {
    try {
      await this.props.deleteProject(this.state.prodId);
      this.successDelete();
    } catch (error) {
      this.failedDelete();
    }
  };

  setConfirmMessage(id) {
    this.setState({
      prodId: id,
      alert: (
        <SweetAlert
          warning
          style={{ display: 'block' }}
          title="Are you sure?"
          onConfirm={() => this.handleDeleteProject()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + ' ' + this.props.classes.success
          }
          cancelBtnCssClass={
            this.props.classes.button + ' ' + this.props.classes.danger
          }
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        />
      ),
    });
  }

  successDelete = () =>
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: 'block' }}
          title="Deleted!"
          onConfirm={() => { this.hideAlert(); this.refreshDataSource(); }}
          confirmBtnCssClass={
            this.props.classes.button + ' ' + this.props.classes.success
          }
        />
      ),
    });

  failedDelete = () =>
    this.setState({
      alert: (
        <SweetAlert
          error
          style={{ display: 'block' }}
          title="Failed to delete this project!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + ' ' + this.props.classes.success
          }
        />
      ),
    });

  hideAlert = () =>
    this.setState({
      alert: null,
    });

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
            onClick={() => this.setConfirmMessage(item.id)}
            color="danger"
            className="remove"
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    }));

    return (
      <Paper className={classes.root}>
        <ReactTable
          data={dataTable}
          columns={[
            {
              Header: 'Project Name',
              accessor: 'title',
            },
            {
              Header: 'Budget',
              accessor: 'budget',
            },
            {
              Header: 'Description',
              accessor: 'description',
            },
            {
              Header: 'Actions',
              accessor: 'actions',
            },
          ]}
          defaultPageSize={this.state.rowsPerPage}
          onPageSizeChange={(pageSize, pageIndex) => {
            this.setPage(pageSize, pageIndex);
            this.refreshDataSource();
          }}
          className="-striped -highlight"
        />
        {this.state.alert}
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
