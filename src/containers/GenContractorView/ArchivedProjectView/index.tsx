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
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Axios from 'axios';

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
    getArchivedProjectsByGenId: Function;
    projects: Projects | null;
    deleteProject: (id: string) => Promise<void>;
    setCurrentProject: (id: string) => Promise<void>;
    classes: ClassNameMap<string>;
}

interface ArchivedProjectState extends ISnackbarProps {
    rowsPerPage: number;
    currentPage: number;
    compltedArray: [];
    isBusy: boolean;
    showConfirm: boolean;
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
            isBusy: true,
            startDate: new Date,
            endDate: new Date,
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
        const { userProfile } = this.props;

        this.setState({ isBusy: true });
        Axios.get(`https://bcbe-service.herokuapp.com/contractors/${userProfile.user_metadata.contractor_id}/projects?page=${this.state.currentPage}&size=${this.state.rowsPerPage}&status=ARCHIVED`).then(data => {
            this.setState({ compltedArray: data.data.content });
        })
        this.setState({ isBusy: false });
    }

    handleChangePage = async (event, page) => {
        const { userProfile } = this.props;
        this.setState({ currentPage: page, isBusy: true });
        try {
            await this.props.getArchivedProjectsByGenId(
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
            rowsPerPage >= this.state.compltedArray.length ? 0 : this.state.currentPage;

        this.setState({ rowsPerPage, currentPage, isBusy: true });
        try {
            Axios.get(`https://bcbe-service.herokuapp.com/contractors/${userProfile.user_metadata.contractor_id}/projects?page=${currentPage}&size=${rowsPerPage}&status=ARCHIVED`).then(data => {
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

    render() {
        const { classes, projects } = this.props;
        
        if (this.state.compltedArray.length === 0) {
            return <CircularProgress className={classes.waitingSpin} />;
        }

        console.log("projects", projects);
        return (
            <Box className={classes.root}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell> Project Title </CustomTableCell>
                            <CustomTableCell align="center">Contractor</CustomTableCell>
                            <CustomTableCell align="center">Location</CustomTableCell>
                            <CustomTableCell align="center">Budget</CustomTableCell>
                            <CustomTableCell align="center">Start Date<ArrowDownwardIcon className="Arrowdown" /> </CustomTableCell>
                            <CustomTableCell align="center">End Date<ArrowDownwardIcon className="Arrowdown" /> </CustomTableCell>
                            <CustomTableCell align="center">Project Details</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.compltedArray.map((data: any) => (
                            <TableRow className="" key={data.project.id} hover>
                                <CustomTableCell
                                    component="th"
                                    scope="row"
                                    className="margintopbottom"
                                    onClick={() => this.handleSelectProject(data.project.id)}>
                                        
                                    <Ellipsis maxLines={2}>{data.project.title}</Ellipsis>
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                >
                                    {data.contractor.address.name}
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                >
                                    {data.contractor.address.city}
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                >
                                    ${data.project.budget}
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                    onClick={() => this.handleSelectProject(data.project.id)}
                                >
                                    {data.project.startDate}
                                    <div className="time">HH:MM:SS AM</div>
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                    onClick={() => this.handleSelectProject(data.project.id)}>
                                    {data.project.endDate}
                                    <div className="time">HH:MM:SS AM</div>
                                   
                                </CustomTableCell>

                                <CustomTableCell
                                    align="center"
                                    className="margintopbottom"
                                    onClick={() => this.handleSelectProject(data.project.id)}
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
