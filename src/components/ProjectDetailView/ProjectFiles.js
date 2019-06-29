import {IconButton, Snackbar} from '@material-ui/core';
import {withStyles}           from '@material-ui/core/styles';
import Table                  from '@material-ui/core/Table';
import TableBody              from '@material-ui/core/TableBody';
import TableHead              from '@material-ui/core/TableHead';
import TableRow               from '@material-ui/core/TableRow';
import DeleteIcon             from '@material-ui/icons/Delete';
import NoteAddIcon            from '@material-ui/icons/NoteAdd';
import {DropzoneDialog}       from 'material-ui-dropzone';
import React                  from 'react';
import {connect}              from 'react-redux';
import {compose}              from 'redux';

import {addFilesToProject, deleteFileFromProject, getProjectData,} from '../../actions/global-actions';
import CustomTableCell                                             from '../shared/CustomTableCell';

const styles = theme => ({
  root: {
    padding: theme.spacing(1),
  },
  waitingSpin: {
    position: 'relative',
    left: 'calc(50% - 10px)',
    top: 'calc(40vh)',
  },
});

class ProjectFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openUploadForm: false,
      snackBar: false,
      isProcessing: false,
      snackBarContent: '',
    };
  }

  componentDidMount() {}

  handleUploadFiles = async files => {
    const { project } = this.props;

    await this.props.addFiles(project.id, files, res =>
      this.setState({
        snackBar: true,
        snackBarContent: res ? 'File Upload Success' : 'File Upload Failed',
        openUploadForm: false,
      })
    );

    await this.props.getProjectData(project.id);
  };

  handleDeleteFile = async name => {
    const { project } = this.props;

    await this.props.deleteFile(project.id, name, res => {
      this.setState({
        snackBar: true,
        snackBarContent: res ? 'delete file success' : 'delete file failed',
      });
    });

    await this.props.getProjectData(project.id);
  };

  render() {
    const { classes, project } = this.props;
    const projectFiles = project.projectFiles;

    return (
      <div className={classes.root}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <CustomTableCell align="center">Name</CustomTableCell>
              <CustomTableCell align="center">
                <IconButton
                  style={{ color: '#fff' }}
                  onClick={() => this.setState({ openUploadForm: true })}
                >
                  <NoteAddIcon />
                </IconButton>
              </CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectFiles.map(row => (
              <TableRow className={classes.row} key={row.id} hover>
                <CustomTableCell component="th" scope="row" align="center">
                  <a
                    download={row.name}
                    href={
                      process.env.REACT_APP_PROJECT_API +
                      '/projects/' +
                      project.id +
                      '/files/' +
                      row.name
                    }
                  >
                    {row.name}
                  </a>
                </CustomTableCell>
                <CustomTableCell align="center">
                  <IconButton
                    className={classes.button}
                    aria-label="Delete"
                    color="primary"
                    onClick={() => this.handleDeleteFile(row.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DropzoneDialog
          open={this.state.openUploadForm}
          onSave={this.handleUploadFiles}
          maxFileSize={52428800}
          showFileNamesInPreview={true}
          acceptedFiles={[
            'text/*,image/*,video/*,audio/*,application/*,font/*,message/*,model/*,multipart/*',
          ]}
          filesLimit={100}
          dropzoneText="select files to upload(< 50mb)"
          onClose={() => this.setState({ openUploadForm: false })}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={this.state.snackBar}
          onClose={() =>
            this.setState({
              snackBar: false,
            })
          }
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id"> {this.state.snackBarContent}</span>}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.global_data.project,
});

const mapDispatchToProps = {
  addFiles: addFilesToProject,
  getProjectData,
  deleteFile: deleteFileFromProject,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectFiles);
