/*eslint-enable*/
import React from 'react';
import { RouteComponentProps } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import removeMd from 'remove-markdown';
import CustomTableCell from 'components/shared/CustomTableCell';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import ConfirmDialog from 'components/shared/ConfirmDialog';
import Ellipsis from 'components/Typography/Ellipsis';
import { getArchivedProjectsByGenId } from 'store/actions/gen-actions';
import { setCurrentProject } from 'store/actions/global-actions';
import { deleteProject } from 'store/actions/gen-actions';
import { UserProfile } from 'types/global';
import { Projects } from 'types/project';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ContApis from 'services/contractor';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const style = (theme: Theme) => createStyles({
    root: {
        position: 'relative',
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
    waitingSpin: {
        position: 'relative',
        left: 'calc(50% - 10px)',
        top: 'calc(40vh)',
    },
    desc: {
        color: '#444',
        marginTop: '0',
        '& > p': {
            margin: theme.spacing(0, 0),
        },
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    },
});

interface ArchivedProjectProps extends RouteComponentProps {
    userProfile: UserProfile | null;
    searchTerm : String;
    getArchivedProjectsByGenId: Function;
    projects: Projects | null;
    deleteProject: (id: string) => Promise<void>;
    setCurrentProject: (id: string) => Promise<void>;
    classes: ClassNameMap<string>;
}

interface ArchivedProjectState extends ISnackbarProps {
    startDateOrder: "desc" | "asc";
    endDateOrder: "desc" | "asc";
    rowsPerPage: number;
    currentPage: number;
    compltedArray: [];
    isBusy: boolean;
    showConfirm: boolean;
    totalLength: number;
    proId: string;
    startDate: Date;
    endDate: Date;
    days: number;
}

class ArchivedProject extends React.Component<ArchivedProjectProps, ArchivedProjectState> {
    constructor(props: Readonly<ArchivedProjectProps>) {
        super(props);
        this.state = {
            compltedArray: [],
            rowsPerPage: 20,
            currentPage: 0,
            totalLength: 0,
            isBusy: true,
            startDateOrder: "desc",
            endDateOrder: "desc",
            startDate: new Date(),
            endDate: new Date(),
            days: 0,
            showMessage: false,
            message: '',
            variant: 'success',
            handleClose: this.closeMessage,
            showConfirm: false,
            proId: '',
        };
    }

    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    async componentDidMount() {
        this.setState({ isBusy: true });
        await ContApis.getContractorsWithSearchTerm("gen", this.props.userProfile.user_metadata.contractor_id, 0, this.state.rowsPerPage, this.props.searchTerm, "ARCHIVED").then(data => {
            this.setState({ 
                compltedArray: data.data.content,
                totalLength: data.data.totalElements
             });
        })
        this.setState({ isBusy: false });
    }
    async componentDidUpdate(prevProps:ArchivedProjectProps ){
        if(prevProps.searchTerm !== this.props.searchTerm )
        {
            this.setState({ isBusy: true });
            await ContApis.getContractorsWithSearchTerm("gen", this.props.userProfile.user_metadata.contractor_id, 0, this.state.rowsPerPage, this.props.searchTerm, "ARCHIVED").then(data => {
                this.setState({ 
                    compltedArray: data.data.content,
                    totalLength: data.data.totalElements
                 });
            })
            this.setState({ isBusy: false });
        }
    }
    handleChangePage = async (event, page) => {
        try {
            if (page >= this.state.totalLength) page = this.state.totalLength - 1;
            this.setState({ isBusy: true });
            await ContApis.getContractorsWithSearchTerm("gen", this.props.userProfile.user_metadata.contractor_id, page, this.state.rowsPerPage, this.props.searchTerm, "ARCHIVED")
                .then(data => {
                    this.setState({
                        compltedArray: data.data.content,
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
        this.setState({isBusy: true})
        try {
            await ContApis.getContractorsWithSearchTerm("gen", this.props.userProfile.user_metadata.contractor_id, newPage, newPageSize, this.props.searchTerm, "ARCHIVED")
                .then(data => {
                    this.setState({
                        compltedArray: data.data.content,
                        isBusy: false,
                        currentPage: newPage,
                        rowsPerPage: newPageSize,
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
            await this.props.getArchivedProjectsByGenId(
                userProfile.user_metadata.contractor_id,
                curPage,
                this.state.rowsPerPage
            );
            this.setState({
                isBusy: false,
                showMessage: true,
                variant: 'success',
                message: 'delete project success',
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

    handleSelectProject = id => {
        this.props.setCurrentProject(id);
        this.props.history.push('/gen-contractor/project_detail/' + id);
    };

    // Implemented Sort function on Start Date column.
    StartDateToggleSort = () => {
        let startDateOrder: ('desc' | 'asc') = 'desc';

        if (this.state.startDateOrder === 'desc') {
            startDateOrder = 'asc';
        }
        this.state.compltedArray.sort((a: any, b: any) =>
            a.project.startDate > b.project.startDate ? 1 : -1
        );
        this.setState({ startDateOrder });
    }

    // Implemented Sort function on End Date column.
    EndDateToggleSort = () => {
        let endDateOrder: ('desc' | 'asc') = 'desc';

        if (this.state.endDateOrder === 'desc') {
            endDateOrder = 'asc';
        }
        this.state.compltedArray.sort((a: any, b: any) =>
            a.project.endDate > b.project.endDate ? 1 : -1
        );
        this.setState({ endDateOrder });
    }

    render() {
        const { classes } = this.props;

        if(this.state.isBusy ){
            return <CircularProgress className={classes.busy} />
        }

        return (
            <Box className={classes.root}>
                <Table className="sub-table-margin" style={{marginTop:'40px'}}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell className="sub-table-col-1"> Project Title </CustomTableCell>
                            <CustomTableCell align="center">Contractor</CustomTableCell>
                            <CustomTableCell align="center">Location</CustomTableCell>
                            <CustomTableCell align="center">Budget</CustomTableCell>
                            <CustomTableCell align="center">
                                <TableSortLabel style={{ fontSize: '15px', cursor: "pointer" }} className="Arrowdown "
                                    active={true}
                                    direction={this.state.startDateOrder}
                                    onClick={this.StartDateToggleSort} > Start Date </TableSortLabel>
                            </CustomTableCell>
                            <CustomTableCell align="center">
                                <TableSortLabel style={{ fontSize: '15px', cursor: "pointer" }} className="Arrowdown"
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
                        {this.state.compltedArray.map((data: any) => (
                            <TableRow className="" key={data.project.id} hover onClick={() => this.handleSelectProject(data.project.id)}>
                                <CustomTableCell
                                    component="th"
                                    scope="row"
                                    className="margintopbottom"
                                >

                                    <Ellipsis maxLines={2}>{data.project.title}</Ellipsis>
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                >
                                    {data.contractor && data.contractor.address ? data.contractor.address.name : ""}
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                >
                                    {data.contractor && data.contractor.address ? data.contractor.address.city : ""}
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"

                                >
                                    ${data.project.budget}
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                >
                                    {data.project.startDate && data.project.startDate.slice(0, 10)}
                                    <div className="time">{data.project.startDate && data.project.startDate.slice(10, 19)}&nbsp;{data.project.startDate.slice(10, 13) <= 11 ? "AM" : "PM"}</div>
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom">
                                    {data.project.endDate && data.project.endDate.slice(0, 10)}
                                    <div className="time">{data.project.endDate && data.project.endDate.slice(10, 19)}&nbsp;{data.project.endDate.slice(10, 13) <= 11 ? "AM" : "PM"}</div>

                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                ><Ellipsis maxLines={2}>
                                        <IconButton
                                            aria-label="Delete"
                                            color="primary">
                                            <CheckCircleIcon className="bluedoneicon" />
                                        </IconButton>
                                        {removeMd(data.project.description)}
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
                    open={this.state.showMessage}
                    variant={this.state.variant}
                    message={this.state.message}
                    handleClose={() => this.setState({ showMessage: false })}
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
    getArchivedProjectsByGenId,
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
)(ArchivedProject);
