/*eslint-enable*/
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { compose } from "redux";
import Box from '@material-ui/core/Box';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import CustomTableCell from 'components/shared/CustomTableCell';
import Ellipsis from 'components/Typography/Ellipsis';
import { ProjectBriefInfo } from './Overview';
import CustomSnackbar, { ISnackbarProps } from 'components/shared/CustomSnackbar';
import TablePagination from '@material-ui/core/TablePagination';
import removeMd from 'remove-markdown';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { setCurrentProject } from 'store/actions/global-actions';
import {
    addFilesToProject,
    addProject,
    createLevel,
    createRoom,
    updateLevel,
    updateRoom,
    deleteLevel,
    deleteRoom,
    getLevels,
    clearLevels
} from 'store/actions/gen-actions';
import { loadRoots } from 'store/actions/tem-actions';

import { UserProfile } from 'types/global';
import { ProjectLevel, ProjectPostInfo, ProjectLevelCategory } from 'types/project';
import ContApis from 'services/contractor';
const styles = theme => createStyles({
    root: {
        position: 'relative',
        minHeight: '100%',
    },
    contents: {
        width: '100%',
        flex: 1,
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    },
    fileUpload: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: theme.spacing(1)
    },
    fileItem: {
        margin: '6px',
        padding: theme.spacing(1),
        border: '1px solid #CCC',
    },
    textFieldHalf: {
        width: 'calc(50% - 8px)',
        paddingRight: theme.spacing(1)
    },
});

interface IAddProjectViewProps extends RouteComponentProps {
    classes: ClassNameMap<string>;
    userProfile: UserProfile;
    searchTerm: String;
    addFilesToProject: (projId: string, files: Array<File>) => void;
    addProject: (contId: string, data: ProjectPostInfo) => Promise<string>;
    createLevel: (id: string, level: { number: number, name: string, description: string }) => Promise<any>;
    updateLevel: (id: string, level: { number: number, name: string, description: string }) => Promise<any>;
    deleteLevel: (id: string) => Promise<void>;
    createRoom: (id: string, room: {
        number: number,
        name: string,
        type: string,
        description: string,
        w: number,
        h: number,
        l: number
    }) => Promise<any>;
    updateRoom: (id: string, cat: ProjectLevelCategory) => Promise<any>;
    deleteRoom: (id: string) => Promise<void>;
    getLevels: (id: string) => Promise<void>;
    clearLevels: () => void;
    loadRoots: () => Promise<void>;
    setCurrentProject: (id: string) => Promise<void>;
    levels: ProjectLevel[];
}

interface IAddProjectViewState extends ISnackbarProps, ProjectBriefInfo {
    isBusy: boolean;
    project: any;
    startDateOrder: "desc" | "asc";
    endDateOrder: "desc" | "asc";
    compltedArray: [];
    rowsPerPage: any;
    currentPage: any;
    days: number;
    totalLength: number;
}

class AddProjectView extends React.Component<IAddProjectViewProps, IAddProjectViewState> {
    contractorBulk = [];
    constructor(props: IAddProjectViewProps) {
        super(props);
        this.state = {
            compltedArray: [],
            totalLength: 0,
            rowsPerPage: 20,
            currentPage: 0,
            title: '',
            price: 0,
            days: 0,
            description: '',
            startDateOrder: "desc",
            endDateOrder: "desc",
            dueDate: new Date(),
            isBusy: false,
            files: [],
            showMessage: false,
            message: '',
            variant: 'error',
            handleClose: this.closeMessage,
            project: undefined
        }
    }

    async componentDidMount() {
        await this.props.clearLevels();
        // await this.props.loadRoots();
        this.setState({ isBusy: true });
        await ContApis.getContractorsWithSearchTerm("gen", this.props.userProfile.user_metadata.contractor_id, this.state.currentPage, this.state.rowsPerPage, this.props.searchTerm, "ONGOING")
            .then(data => {
                this.setState({ compltedArray: data.data.content })
                this.setState({ totalLength: data.data.totalElements })
                data.data.content.map(d => {
                    var diff = Math.floor((Date.parse(d.project.endDate) - Date.parse(d.project.startDate)) / 86400000);
                    return this.setState({ days: diff })
                });
            })
        this.setState({ isBusy: false });
    }
   async componentDidUpdate(prevProps: IAddProjectViewProps){
        if(prevProps.searchTerm !== this.props.searchTerm)
        {
            this.setState({ isBusy: true });
            await ContApis.getContractorsWithSearchTerm("gen", this.props.userProfile.user_metadata.contractor_id, this.state.currentPage, this.state.rowsPerPage, this.props.searchTerm, "ONGOING")
            .then(data => {
                this.setState({ compltedArray: data.data.content })
                this.setState({ totalLength: data.data.totalElements })
                data.data.content.map(d => {
                    var diff = Math.floor((Date.parse(d.project.endDate) - Date.parse(d.project.startDate)) / 86400000);
                    return this.setState({ days: diff })
                });
            })
        this.setState({ isBusy: false });
        }
    }
    closeMessage = () => {
        this.setState({ showMessage: false });
    }

    handleAddProject = async () => {
        const { userProfile, history } = this.props;
        const { files, title, description, price, dueDate } = this.state;
        if (this.state.project) {
            history.push('/gen-contractor/add_project/add-levels');
            return;
        }

        if (title.length === 0 || description.length === 0 || price === 0) {
            this.setState({
                showMessage: true,
                message: 'You must fill in all the items',
            });
            return;
        }

        const projectData = {
            title,
            description,
            budget: price,
            updatedBy: userProfile.email,
            due: dueDate
        };

        this.setState({ isBusy: true });

        let project = undefined;
        try {
            project = await this.props.addProject(userProfile.user_metadata.contractor_id, projectData);
            await this.props.addFilesToProject(project.id, files);
            this.setState({
                isBusy: false,
                project,
                showMessage: true,
                variant: 'success',
                message: 'Add project success'
            });
        } catch (error) {
            this.setState({
                isBusy: false,
                showMessage: true,
                variant: 'error',
                message: 'Add project failed.',
                project: undefined
            });
        }
    };

    handleFileChange = e => {
        this.setState({ files: [...this.state.files, ...e.target.files] });
    };

    handleRemove = file => {
        const { files } = this.state;

        for (let i = 0; i < files.length; i++) {
            if (files[i].name === file.name && files[i].size === file.size) {
                files.splice(i, 1);
                break;
            }
        }

        this.setState({ files: [...files] });
    };
    handleChangePage = async (event, page) => {
        if (page >= this.state.totalLength) page = this.state.totalLength - 1;
        this.setState({isBusy: true});
        try {
            await ContApis.getContractorsWithSearchTerm("gen", this.props.userProfile.user_metadata.contractor_id, page, this.state.rowsPerPage, this.props.searchTerm, "ONGOING")
                .then(data => {
                    this.setState({
                        compltedArray: data.data.content,
                        isBusy: false,
                        currentPage: page,
                    });
                })
        } catch (error) {
            console.log('CurrentProjectView.handleChangePage', error);
            this.setState({ isBusy: false });
        }
    };

    handleChangeRowsPerPage = async event => {

        const { currentPage, rowsPerPage } = this.state;
        const curIndex = currentPage * rowsPerPage;
        const newPageSize = event.target.value;
        const newPage = Math.floor(curIndex / newPageSize);
        this.setState({ rowsPerPage, currentPage, isBusy: true });
        try {
            await ContApis.getContractorsWithSearchTerm("gen", this.props.userProfile.user_metadata.contractor_id, newPage, newPageSize, this.props.searchTerm, "ONGOING").then(data=>{
                this.setState({
                    compltedArray: data.data.content,
                    isBusy: false,
                    currentPage: newPage,
                    rowsPerPage: newPageSize,
                })
            })
        } catch (error) {
            console.log('CurrentProjectView.handleChangeRowsPerPage', error);
        }

        this.setState({ isBusy: false });
    };

    handleDateChange = (date) => {
        this.setState({ dueDate: date });
    };

    handleDescChange = value => {
        this.setState({ description: value });
    };

    handleTitleChange = value => {
        this.setState({ title: value });
    }

    handlePriceChange = value => {
        this.setState({ price: value });
    }

    addLevel = async (number, name, desc) => {
        const { project } = this.state;
        if (!project) {
            this.setState({
                showMessage: true,
                message: 'You should post a project first',
                variant: 'warning'
            });
            return;
        }

        const { createLevel, getLevels } = this.props;
        this.setState({ isBusy: true });
        try {
            await createLevel(project.id, { number, name, description: desc });
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Add Level success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.AddLevel: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Add Level failed',
                variant: 'error'
            });
        }
    }

    updateLevel = async (id: string, no: number, name: string, desc: string) => {
        const { project } = this.state;

        this.setState({ isBusy: true });
        try {
            await this.props.updateLevel(id, { number: no, name, description: desc });
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Update Level success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.UpdateLevel: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Update Level failed',
                variant: 'error'
            });
        }
    }

    deleteLvl = async (id: string) => {
        const { project } = this.state;
        const { deleteLevel, getLevels } = this.props;
        if (!project) return;

        this.setState({ isBusy: true });
        try {
            await deleteLevel(id);
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete Level success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.RemoveLevel: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete Level failed',
                variant: 'error'
            });
        }
    }

    addCategory = async (id: string, cat: ProjectLevelCategory) => {
        const { createRoom, getLevels } = this.props;
        const { project } = this.state;

        this.setState({ isBusy: true });
        try {
            await createRoom(id, {
                number: cat.number,
                name: cat.name,
                type: cat.type,
                description: cat.description,
                w: cat.w,
                l: cat.l,
                h: cat.h
            });
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Create Room success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.AddRoom: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Create Room failed',
                variant: 'error'
            });
        }
    }

    updateCategory = async (id: string, cat: ProjectLevelCategory) => {
        const { updateRoom, getLevels } = this.props;
        const { project } = this.state;
        this.setState({ isBusy: true });
        try {
            await updateRoom(cat.id, cat);
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Update Room success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.UpdateRoom: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Update Room failed',
                variant: 'error'
            });
        }
    }

    deleteCategory = async (id: string, catId: string) => {
        const { deleteRoom, getLevels } = this.props;
        const { project } = this.state;

        this.setState({ isBusy: true });
        try {
            await deleteRoom(catId);
            await getLevels(project.id);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete Room success',
                variant: 'success'
            });
        } catch (error) {
            console.log('AddProjectView.DeleteRoom: ', error);
            this.setState({
                isBusy: false,
                showMessage: true,
                message: 'Delete Room failed',
                variant: 'error'
            });
        }
    }
    // Implemented Sort function on Start Date  column.
    StartDateToggleSort = () => {
        let startDateOrder: ('desc' | 'asc') = 'desc';

        if (this.state.startDateOrder === 'desc') {
            startDateOrder = 'asc';
        }
        this.state.compltedArray.sort((a: any, b: any) =>
            a.project.submittedDate > b.project.submittedDate ? 1 : -1
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

    handleSelectProject = id => {
        this.props.setCurrentProject(id);
        this.props.history.push('/gen-contractor/project_detail/' + id);
    };

    public render() {
        const { classes, match, location } = this.props;
        const tabs = [
            { href: `${match.url}/submitted`, label: 'Overview' },
            { href: `${match.url}/add-levels`, label: 'Levels' },
            { href: `${match.url}/select`, label: 'Select' }
        ];

        let tab = tabs.map(tab => tab.href).indexOf(location.pathname);
        if (tab < 0) tab = 0;

        if (this.state.isBusy ) {
            return <CircularProgress className={classes.busy} />
        }

        return (
            <div>
                <Box>
                    <Table className="sub-table-margin" style={{ marginTop: '40px' }}>
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
                                        onClick={this.StartDateToggleSort}
                                    >
                                        Start Date
                                </TableSortLabel>
                                </CustomTableCell>
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
                            {this.state.compltedArray.map((data: any) => (
                                <TableRow className="" key={data.project.id} hover onClick={() => this.handleSelectProject(data.project.id)}>
                                    <CustomTableCell
                                        component="th"
                                        scope="row">
                                        <Ellipsis maxLines={2}>{data.project.title}</Ellipsis>
                                    </CustomTableCell>

                                    <CustomTableCell
                                        align="center"
                                    >
                                        {data.contractor && data.contractor.address ? data.contractor.address.name : ""}
                                    </CustomTableCell>

                                    <CustomTableCell
                                        align="center"
                                    >
                                        {data.contractor && data.contractor.address ? data.contractor.address.city : ""}
                                    </CustomTableCell>

                                    <CustomTableCell
                                        align="center"
                                    >
                                        ${data.project.budget}
                                    </CustomTableCell>

                                    <CustomTableCell
                                        align="center"
                                    >
                                        {data.project.submittedDate && data.project.submittedDate.slice(0, 10)}
                                        <div className="time">{data.project.submittedDate && data.project.submittedDate.slice(10, 19)}&nbsp;{data.project.submittedDate.slice(10, 13) <= 11 ? "AM" : "PM"}</div>
                                    </CustomTableCell>

                                    <CustomTableCell
                                        align="center"

                                    >
                                        {data.project.submittedDate && data.project.submittedDate.slice(0, 10)}
                                        <div className="notDisplayFlex">
                                            <p className="font-size-12">{this.state.days}&nbsp; Days Left</p>
                                        </div>
                                        {/* {data.project.endDate && data.project.endDate.slice(0, 10)}
                                            <div className="notDisplayFlex">
                                                <p className="font-size-12">{this.state.days}&nbsp; Days Left</p>
                                            </div> */}
                                    </CustomTableCell>

                                    <CustomTableCell
                                        align="center"
                                    ><Ellipsis maxLines={2}>
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
                </Box>
            </div >
        );
    }
}

const mapStateToProps = state => ({
    userProfile: state.global_data.userProfile,
    levels: state.gen_data.levels,
    roots: state.tem_data.roots,
    // templates: state.tem_data.templates ? state.tem_data.templates.content || [] : [],
});

const mapDispatchToProps = {
    addProject,
    addFilesToProject,
    createLevel,
    createRoom,
    updateLevel,
    updateRoom,
    deleteLevel,
    deleteRoom,
    getLevels,
    clearLevels,
    loadRoots,
    setCurrentProject
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withStyles(styles),
)(AddProjectView);