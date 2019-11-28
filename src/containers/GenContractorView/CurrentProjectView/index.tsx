import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router-dom'

import { withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import removeMd from 'remove-markdown';
import CustomTableCell from 'components/shared/CustomTableCell';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import ConfirmDialog from 'components/shared/ConfirmDialog';
import Ellipsis from 'components/Typography/Ellipsis';

import { getProjectsByGenId } from 'store/actions/gen-actions';
import { setCurrentProject } from 'store/actions/global-actions';
import { archiveProject } from 'store/actions/gen-actions';
import { UserProfile } from 'types/global';
import { Projects } from 'types/project';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import style from './CurrentProject.style';
import Axios from 'axios';


interface CurrentProjectProps extends RouteComponentProps {
    classes: ClassNameMap<string>;
    userProfile: UserProfile | null;
    projects: Projects | null;
    getProjectsByGenId: (id: string, page: number, size: number) => void;
    deleteProject: (id: string) => void;
    setCurrentProject: (id: string) => void;
}

interface CurrentProjectState extends ISnackbarProps {
    rowsPerPage: number;
    currentPage: number;
    isBusy: boolean;
    compltedArray: [];
    showConfirm: boolean;
    proId: string;
}

class CurrentProject extends React.Component<CurrentProjectProps, CurrentProjectState> {
    constructor(props) {
        super(props);

        this.state = {
            compltedArray: [],
            rowsPerPage: 20,
            currentPage: 0,
            isBusy: false,
            showMessage: false,
            message: '',
            variant: 'success',
            showConfirm: false,
            proId: '',
            handleClose: () => this.setState({ showMessage: false })
        };
    }

    async componentDidMount() {
        var d = new Date();
        var n = d.toLocaleString([], { hour12: true });
        console.log(n);
        const { userProfile } = this.props;
        this.setState({ isBusy: true });

        try {
            Axios.get(`https://bcbe-service.herokuapp.com/contractors/${userProfile.user_metadata.contractor_id}/projects?page=${this.state.currentPage}&size=${this.state.rowsPerPage}`).then(data => {
                this.setState({ compltedArray: data.data.content })
            })
            await this.props.getProjectsByGenId(userProfile.user_metadata.contractor_id, 0, 20);
        } catch (error) {
            console.log(error);
        }
        this.setState({ isBusy: false });
    }

    handleChangePage = async (event, page) => {
        const { userProfile } = this.props;
        this.setState({ currentPage: page, isBusy: true });
        try {
            await this.props.getProjectsByGenId(
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
        const { userProfile } = this.props;

        const rowsPerPage = event.target.value;
        const currentPage =
            rowsPerPage >= this.state.compltedArray.length ? 0 : this.state.currentPage;

        this.setState({ rowsPerPage, currentPage });
        try {
            Axios.get(`https://bcbe-service.herokuapp.com/contractors/${userProfile.user_metadata.contractor_id}/projects?page=${currentPage}&size=${rowsPerPage}`).then(data => {
                this.setState({ compltedArray: data.data.content })
            })
        } catch (error) {
            console.log('CurrentProjectView.handleChangeRowsPerPage', error);
        }
        this.setState({ isBusy: false });
    };

    handleDeleteProject = async () => {
        const { userProfile, projects } = this.props;

        this.setState({ isBusy: true, showConfirm: false });
        try {
            await this.props.deleteProject(this.state.proId);

            let curPage = this.state.currentPage;
            if (this.state.rowsPerPage * this.state.currentPage > (projects.totalElements - 1))
                curPage--;
            await this.props.getProjectsByGenId(
                userProfile.user_metadata.contractor_id,
                curPage,
                this.state.rowsPerPage
            );
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'delete project success',
                variant: 'success',
                currentPage: curPage,
            });
        } catch (error) {
            console.log(error);
            this.setState({
                isBusy: false,
                showMessage: true,
                variant: 'error',
                message: 'delete project failed',
            });
        }
    };

    handleSelectProject = async (id: string) => {
        await this.props.setCurrentProject(id);
        this.props.history.push('/gen-contractor/project_detail/' + id);
    };

    render() {
        const { classes, projects } = this.props;

        if (!projects) {
            return <CircularProgress className={classes.waitingSpin} />;
        }

        return (
            <Box>
                <Table>
                    <TableHead>
                        <TableRow className="sub-table-row-width">
                            <CustomTableCell  className="sub-table-col-1" > Project Title </CustomTableCell>
                            <CustomTableCell  >Bids</CustomTableCell>
                            <CustomTableCell  >Location</CustomTableCell>
                            <CustomTableCell  >Budget</CustomTableCell>
                            <CustomTableCell className="sub-table-col-1" >Upload Date <ArrowDownwardIcon style={{ fontSize: '15px' }} className="Arrowdown" /></CustomTableCell>
                            <CustomTableCell  >Bids Due<ArrowDownwardIcon style={{ fontSize: '15px' }} className="Arrowdown" /></CustomTableCell>
                            <CustomTableCell  className="sub-table-col-width">Project Details</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.compltedArray.map((data: any) => (
                            <TableRow className="" key={data.project.id} hover>

                                <CustomTableCell
                                    component="th"
                                    scope="row"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                    className="title"
                                >
                                    <Ellipsis maxLines={2}>{data.project.title}</Ellipsis>

                                    {/* <Typography className="nowrap">{row.title}</Typography> */}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                >
                                    {data.numberOfBids}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                >
                                    {data.project.city}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                >
                                    ${data.project.budget}
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.handleSelectProject(data.project.id)}>
                                    {data.project.submittedDate && data.project.submittedDate.slice(0, 10)}
                                    <div className="time"> {data.project.submittedDate && data.project.submittedDate.slice(10, 19)}&nbsp;{data.project.submittedDate.slice(10, 13) <= 11 ? "AM" : "PM"}</div>
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                >
                                    {data.project.endDate && data.project.endDate.slice(0, 10)}
                                    <div className="time"> {data.project.endDate && data.project.endDate.slice(10, 19)}&nbsp;{data.project.endDate.slice(10, 13) <= 11 ? "AM" : "PM"}</div>
                                </CustomTableCell>
                                <CustomTableCell
                                    align="center"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                >
                                    <Ellipsis maxLines={2}>{removeMd(data.project.description)}</Ellipsis>
                                    {/* {removeMd(row.description)} */}
                                </CustomTableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    style={{ overflow: 'auto' }}
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={this.state.compltedArray.length}
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
                    handleClose={this.state.handleClose}
                />
                <ConfirmDialog
                    open={this.state.showConfirm}
                    onYes={this.handleDeleteProject}
                    onCancel={() => this.setState({ showConfirm: false })}
                    message="Do you want to delete this project?"
                />
                {this.state.isBusy && <CircularProgress className={classes.busy} />}
            </Box>
        );
    }
}

const mapDispatchToProps = {
    getProjectsByGenId,
    deleteProject: archiveProject,
    setCurrentProject,
};

const mapStateToProps = state => ({
    projects: state.gen_data.projects,
    userProfile: state.global_data.userProfile,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(style)
)(CurrentProject);
