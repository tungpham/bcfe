/*eslint-enable*/
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
import style from './CurrentProject.style';
import ContApis from 'services/contractor';
import TableSortLabel from '@material-ui/core/TableSortLabel';

interface CurrentProjectProps extends RouteComponentProps {
    classes: ClassNameMap<string>;
    userProfile: UserProfile | null;
    projects: Projects | null;
    searchTerm: String;
    getProjectsByGenId: (id: string, page: number, size: number) => void;
    deleteProject: (id: string) => void;
    setCurrentProject: (id: string) => void;
}

interface CurrentProjectState extends ISnackbarProps {
    rowsPerPage: number;
    currentPage: number;
    isBusy: boolean;
    uploadOrder: "desc" | "asc";
    bidsOrder: "desc" | "asc";
    compltedArray: [];
    totalLength: number,
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
            totalLength: 0,
            uploadOrder: 'desc',
            bidsOrder: "desc",
            showMessage: false,
            message: '',
            variant: 'success',
            showConfirm: false,
            proId: '',
            handleClose: () => this.setState({ showMessage: false })
        };
    }

    async componentDidMount() {
        const { userProfile } = this.props;
        this.setState({ isBusy: true });
        try {
                await ContApis.getContractorsWithSearchTerm("gen", userProfile.user_metadata.contractor_id, 0, this.state.rowsPerPage, null, null).then(data => {
                    this.setState({ 
                        compltedArray: data.data.content,
                        totalLength: data.data.totalElements,
                        isBusy: false
                    })
                }) 
        } catch (error) {
            console.log(error);
            this.setState({ isBusy: false });
        }
    }
    async componentDidUpdate(prevProps:CurrentProjectProps){
        if(prevProps.searchTerm !== this.props.searchTerm)
        {
            const { userProfile } = this.props;
            this.setState({ isBusy: true });
            try {
                    await ContApis.getContractorsWithSearchTerm("gen", userProfile.user_metadata.contractor_id, 0, this.state.rowsPerPage, this.props.searchTerm, null).then(data => {
                        this.setState({ 
                            compltedArray: data.data.content,
                            totalLength: data.data.totalElements,
                            isBusy: false
                        })
                    }) 
            } catch (error) {
                console.log(error);
                this.setState({ isBusy: false });
            }
        }
    }
    handleChangePage = async (event, page) => {
        const { userProfile } = this.props;
        if (page >= this.state.totalLength) page = this.state.totalLength - 1;
        this.setState({isBusy: true});
        try {
            await ContApis.getContractorsWithSearchTerm("gen", userProfile.user_metadata.contractor_id, page, this.state.rowsPerPage, this.props.searchTerm, null)
                .then(data => {
                    this.setState({
                        compltedArray: data.data.content,
                        isBusy: false,
                        currentPage: page,
                        totalLength: data.data.totalElements
                    });
                })
        } catch (error) {
            this.setState({ isBusy: false });
            console.log('CurrentProjectView.handleChangePage', error);
        }
    };

    handleChangeRowsPerPage = async event => {
        const { currentPage, rowsPerPage } = this.state;
        const curIndex = currentPage * rowsPerPage;
        const newPageSize = event.target.value;
        const newPage = Math.floor(curIndex / newPageSize);
        const { userProfile } = this.props;
        this.setState({isBusy: true});
        try {
            await ContApis.getContractorsWithSearchTerm("gen", userProfile.user_metadata.contractor_id, newPage, newPageSize, this.props.searchTerm, null)
                .then(data => {
                    this.setState({
                        compltedArray: data.data.content,
                        isBusy: false,
                        currentPage: newPage,
                        rowsPerPage: newPageSize,
                        totalLength: data.data.totalElements
                    });
                })
        } catch (error) {
            console.log('CurrentProjectView.handleChangeRowsPerPage', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Some errors occured',
                variant: 'error'
            });
        }
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

    // Implemented Sort function on upload column.
    UploadToggleSort = () => {
        let uploadOrder: ('desc' | 'asc') = 'desc';
        if (this.state.uploadOrder !== 'desc') {
            this.state.compltedArray.sort((a: any, b: any) =>
                a.project.submittedDate < b.project.submittedDate ? 1 : -1
            );
        }
        else {
            this.state.compltedArray.sort((a: any, b: any) =>
                a.project.submittedDate > b.project.submittedDate ? 1 : -1
            );
            uploadOrder = 'asc';
        }
        this.setState({ uploadOrder });
    }

    // Implemented Sort function on Bids Due column.
    BidsToggleSort = () => {
        let bidsOrder: ('desc' | 'asc') = 'desc';

        if (this.state.bidsOrder === 'desc') {
            bidsOrder = 'asc';
        }
        this.state.compltedArray.sort((a: any, b: any) =>
            new Date(a.project.due) > new Date(b.project.due) ? 1 : -1
        );
        this.setState({ bidsOrder });
    }

    handleSelectProject = async (id: string) => {
        await this.props.setCurrentProject(id);
        this.props.history.push('/gen-contractor/project_detail/' + id);
    };

    render() {
        const { classes } = this.props;

        if (this.state.isBusy ) {
            return <CircularProgress className={classes.busy} />
        }

        return (
            <Box>
                <Table className="sub-table-margin" style={{ marginTop: '40px' }}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell className="sub-table-col-1"> Project Title </CustomTableCell>
                            <CustomTableCell align="center">Bids</CustomTableCell>
                            <CustomTableCell align="center">Location</CustomTableCell>
                            <CustomTableCell align="center">Budget</CustomTableCell>
                            <CustomTableCell align="center">
                                <TableSortLabel style={{ fontSize: '15px', cursor: "pointer" }} className="Arrowdown"
                                    active={true}
                                    direction={this.state.uploadOrder}
                                    onClick={this.UploadToggleSort}>
                                    Upload Date
                            </TableSortLabel>
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                <TableSortLabel style={{ fontSize: '15px', cursor: "pointer" }} className="Arrowdown"
                                    active={true}
                                    direction={this.state.bidsOrder}
                                    onClick={this.BidsToggleSort}>
                                    Bids Due
                            </TableSortLabel>
                            </CustomTableCell>
                            <CustomTableCell align="center" className="sub-table-col-width">Project Details</CustomTableCell>
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
                                    {data.project.due ? data.project.due && data.project.due.slice(0, 10) : ''}
                                    <div className="time"> {data.project.due ? data.project.due && data.project.due.slice(11, 19) : ''}&nbsp;{data.project.due ? data.project.due.slice(10, 13) <= 11 ? "AM" : "PM" : ''}</div>
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
                    count={this.state.totalLength}
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
            </Box >
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
