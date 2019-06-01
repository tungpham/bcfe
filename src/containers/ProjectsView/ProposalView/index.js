import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { Paper, CircularProgress, Tabs, Tab, NoSsr, Link } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { submitProposal, getProposalDetails, selectProject, addOption } from '../../../actions/gen-actions';

import ProposalDetailOverview from './ProposalDetailOverview';
import ProposalDetailFiles from './ProposalDetailFiles';
import ProposalEditView from "./ProposalEditView";
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog';

const styles = theme => ({
  root: {
    padding: "10px 10px 10px 10px",
    height: "calc(100vh - 136px)",
    overflowY: "auto",
    position: 'relative'
  },
  waitingSpin: {
    position: "relative",
    left: "calc(50% - 20px)",
    top: "calc(50% - 20px)",
  },
  toolbarstyle: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.dark
  },
  busy: {
    position: "absolute",
    left: "calc(50% - 10px)",
    top: "calc(50%-10px)"
  },
  link: {
    padding: theme.spacing(1),
    '&:hover': {
      cursor: 'pointer',
    }
  },
  submitBtn: {
    width: '160px',
    marginTop: '10px',
    border: "1px solid #4a148c",
    borderRadius: 0,
    backgroundColor: theme.palette.primary.light,
    color: "#FFFFFF",
    marginLeft: 5,
    marginRight: 5,
    float: "right",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark
    },
  }
});

class ConnectedProposalView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currentTab: 0,
      edit: props.match.params.mode !== 'view',
      brief: {},
      proposal: [],
      templateNo: 0,
      showAlert: false,
      message: 'Invalid proposal information',
      busy: false
    }
  }

  async componentDidMount() {
    let proposal = [];
    let brief = {};
    brief.budget = 1200;
    brief.duration = 15;
    brief.description = '';
    if (!this.state.edit) {
      if (this.props.proposalId && this.props.proposalId.length > 0) {
        try {
          const data = await this.props.getProposalDetails(this.props.proposalId);
          proposal = this.createDetails(data);
          brief.budget = data.proposal.budget;
          brief.duration = data.proposal.duration;
          brief.description = data.proposal.description;
        } catch (error) {
          console.log(error);
          proposal = this.createEmptyDetails();
        }
      }
    } else {
      proposal = this.createEmptyDetails();
    }

    this.setState({ loading: false, proposal, brief });
  }

  createDetails = (data) => {
    const { project } = this.props;
    const details = [];
    project.projectTemplates.forEach((templ, index) => {
      const cats = templ.template.categoryList;
      details[index] = {};
      details[index].id = templ.template.id;
      cats.forEach(cat => {
        details[index][cat.id] = {};
        details[index][cat.id].id = cat.id;
        details[index][cat.id].type = cat.type;
        details[index][cat.id].name = cat.name;
        details[index][cat.id].value = cat.value;
        details[index][cat.id].description = cat.description;
        details[index][cat.id].options = [];
      })
    })

    data.temCatOptionDetail &&
      data.temCatOptionDetail.forEach(template => {
        for (let tid in template) {
          for (let det of details) {
            if (det.id !== tid) continue;

            const cats = template[tid];
            cats.forEach(cat => {
              for (let cid in cat) {
                det[cid].options = cat[cid] || [];
              }
            })

            break;
          }
        }
      });

    return details;
  }

  createEmptyDetails = () => {
    const details = [];
    const { project } = this.props;
    project && project.projectTemplates.forEach((templ, index) => {
      details[index] = {};
      details[index].id = templ.template.id;
      const cats = templ.template.categoryList;
      cats && cats.forEach(cat => {
        details[index][cat.id] = {
          id: cat.id,
          name: cat.name,
          type: cat.type,
          value: cat.value,
          description: cat.description,
          options: []
        };
      });
    });

    return details;
  }

  handleTabChange = (event, value) => {
    this.setState({
      currentTab: value
    });
  }

  handleOverviewChange = (brief) => {
    this.setState({ brief });
  }

  handleTemplateChange = (index) => {
    this.setState({ templateNo: index, currentTab: 1 });
  }

  AddOption = (catId, option) => {
    const categories = this.state.proposal[this.state.templateNo];
    categories[catId] && categories[catId].options.push(option);
  };

  UpdateOption = (catId, option) => {
    const categories = this.state.proposal[this.state.templateNo];
    const cat = categories[catId];
    if (!cat) return;

    let len = cat.options.length;
    for (let i = 0; i < len; i++) {
      if (cat.options[i].id === option.id) {
        cat.options[i] = option;
        break;
      }
    }
  };

  DeleteOption = (catId, optId) => {
    const categories = this.state.proposal[this.state.templateNo];
    const cat = categories[catId];
    if (!cat) return;

    let len = cat.options.length;
    for (let i = 0; i < len; i++) {
      if (cat.options[i].id === optId) {
        cat.options.splice(i, 1);
        cat.options = [...cat.options];
        break;
      }
    }
  };

  handleBack = async () => {
    const { project } = this.props;
    this.props.history.push("/a_pros/project_detail/proposals");
  };

  checkProposal = (brief) => {
    if (!brief.budget || !brief.duration || !brief.description) return false;
    if (brief.description.length == 0) return false;

    return true;
  }

  handleSubmit = async (brief) => {
    console.log(brief);
    if (!this.checkProposal(brief)) {
      this.setState({ showAlert: true, busy: false, message: 'Invalid proposal information' });
      return;
    }

    this.setState({ busy: true });
    const { proposal } = this.state;
    const { project } = this.props;
    try {
      // let data = await this.props.submitProposal(project.genContractor.id, project.id, brief);
      // const propid = data.id;
      const propid = '6b1f5540-6f74-4341-b4bd-907e4d38024a';
      console.log(propid, proposal);
      let tasks = [];

      for (let templ of proposal) {
        for (let key in templ) {
          if (key !== 'id') {
            const options = templ[key].options;
            for (let opt of options) {
              console.log('option: ', propid, templ[key].id, opt);
              tasks.push(this.props.addOption(propid, templ[key].id, {
                name: opt.name,
                value: opt.value,
                budget: opt.budget,
                duration: opt.duration,
                description: opt.description
              }));
            }
          }
        }
      }

      for (let task of tasks) {
        await task;
      }
      this.setState({ busy: false });
      this.handleBack();
    } catch (error) {
      this.setState({ showAlert: true, message: 'Some error occured' });
      console.log(error);
    }

    this.setState({ busy: false });
  }

  closeAlert = () => {
    this.setState({ showAlert: false });
  }

  render() {
    const { classes, project } = this.props;
    const { proposal, templateNo, currentTab, edit, brief } = this.state;

    if (this.state.loading) {
      return <CircularProgress className={classes.waitingSpin} />;
    }

    if (!this.props.project) {
      return <div>No project selected</div>
    }

    if (!edit && (!this.props.proposalId || this.props.proposalId.length == 0)) {
      return <div>No proposal selected</div>
    }

    return (
      <NoSsr>
        <div className={classes.root}>
          <Link onClick={this.handleBack} className={classes.link}> &lt;&lt; Back to all proposals</Link>
          <Paper square style={{ height: "100%", overflow: "auto" }}>
            <Tabs
              value={currentTab}
              onChange={this.handleTabChange}
              variant="scrollable"
              indicatorColor="primary"
              textColor="primary"
              scrollButtons="on"
              className={classes.toolbarstyle}
            >
              <Tab label="Detail" />
              <Tab label="Templates" />
              <Tab label="Files" />
            </Tabs>

            {currentTab === 0 && (
              <ProposalDetailOverview
                templateSelected={this.handleTemplateChange}
                edit={edit}
                project={project}
                brief={brief}
                handleSubmit={this.handleSubmit}
                handleOverviewChange={this.handleOverviewChange}
              />
            )}
            {currentTab === 1 && (
              <ProposalEditView
                proposal={proposal[templateNo]}
                edit={edit}
                handleAdd={this.AddOption}
                handleUpdate={this.UpdateOption}
                handleDelete={this.DeleteOption}
              />
            )}
            {currentTab === 2 && <ProposalDetailFiles edit={edit} />}
          </Paper>

          <ConfirmDialog open={this.state.showAlert} message={this.state.message} onYes={this.closeAlert} />
          {this.state.busy && <CircularProgress className={classes.waitingSpin} />}
        </div>
      </NoSsr>
    );
  }
}

ConnectedProposalView.propTypes = {
  classes: PropTypes.object.isRequired,
  submitProposal: PropTypes.func.isRequired,
  getProposalDetails: PropTypes.func.isRequired,
  userProfile: PropTypes.object.isRequired,
  proposalId: PropTypes.string.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    genContractor: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
  }).isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    submitProposal: (cont_id, pro_id, proposal) => dispatch(submitProposal(cont_id, pro_id, proposal)),
    getProposalDetails: id => dispatch(getProposalDetails(id)),
    addOption: (propid, catid, option) => dispatch(addOption(propid, catid, option))
  };
}

const mapStateToProps = state => {
  return {
    userProfile: state.global_data.userProfile,
    proposalId: state.gen_data.proposalId,
    // proposalId: '0d016c64-1129-410a-942d-bd0d6c72385b',
    project: state.gen_data.selectedProject
  };
};

const ProposalView = connect(mapStateToProps, mapDispatchToProps)(ConnectedProposalView);
export default withStyles(styles)(ProposalView);