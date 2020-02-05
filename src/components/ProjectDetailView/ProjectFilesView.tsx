import React, {useState} from 'react';
import { connect } from 'react-redux';
import withConfirm, { withConfirmProps } from 'components/HOCs/withConfirm';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
//import Material ui components;
import { withStyles, createStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import RefreshIcon from '@material-ui/icons/Refresh';
// import UploadIcon from '@material-ui/icons/CloudUpload';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import {Table, TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import PdfIcon from '@material-ui/icons/PictureAsPdf';
import ImageIcon from '@material-ui/icons/Image';
import MovieIcon from '@material-ui/icons/Movie';
import AudioIcon from '@material-ui/icons/MusicVideo';
import NoteIcon from '@material-ui/icons/Note';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { Menu, MenuItem } from '@material-ui/core';
import { MenuProps } from '@material-ui/core/Menu';
//import Types;
import { ProjectInfo } from 'types/project';
//import actions & apis;
import ProjectApi from 'services/project';

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
	},
})((props: MenuProps) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		{...props}
	/>
));

const styles = createStyles(theme => ({
    projectFilesViewWrapper:{
        padding:"0px",
        position:"relative"
    },
    ProjectFilesTableWrapper:{
        marginTop:"20px"
    },
    actionBtnsWrapper:{

    },
    busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)'
    },
    fileNameCell:{
        display: "flex",
        justifyContent:"left",
        alignItems:"center",
        fontWeight: 500,
        color:"blue"
    },
    menuItem :{
        padding:"0px 10px !important",
        minHeight:"0px"
    },
    menuItemIcon:{
        color:"black",
        minWidth:"30px",
        "& svg":{
            width:"0.7em",
            height:"0.7em"
        }
    },
}));
function DropDownButton(props)
{
    const [anchorEl, setAnchorEl] = useState(null);
    const [fileName, setFileName] = useState("");
    const [showRenameModal, setShowModal] = useState(false);
    const [firstRender, setFirstRender] = useState(true);
    if(firstRender === true)
    {
        setFileName(props.File.name);
        setFirstRender(false);
    }
    function handleClose(){
        setAnchorEl(null);
    }
    const handleActionMenuOpen=(event: React.MouseEvent<HTMLButtonElement>)=>{
		setAnchorEl(event.currentTarget);
	};
    return(
        <React.Fragment>
            <IconButton onClick = {handleActionMenuOpen} color = "default" size = "small"><ArrowDownIcon/></IconButton>
            <StyledMenu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem 
                    onClick = {()=>{handleClose(); props.deleteFile()}}
                    className = {props.classes.menuItem}
                >
                    <ListItemIcon className = {props.classes.menuItemIcon}>
                        <DeleteIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
                <MenuItem 
                    onClick = {()=>{
                        setShowModal(true);
                        setFileName(props.File.name);
                        handleClose();
                    }}
                    className = {props.classes.menuItem}
                >
                    <ListItemIcon  className = {props.classes.menuItemIcon}>
                        <EditIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
            </StyledMenu>
            <Dialog
                    open={showRenameModal}
                    onClose={() => setShowModal(false)}
                    aria-labelledby="form-dialog-title"
                    
                >
                    <DialogTitle id="form-dialog-title">
                        Change File Name
                    </DialogTitle>
                    <DialogContent>
                        <Grid container
                            style = {{width:"400px"}}
                        >
                            <Grid item xs={12} md={12} style={{ padding: '8px 0px' }}>
                                <TextField
                                    autoFocus
                                    fullWidth
                                    required
                                    margin='dense'
                                    label=''
                                    type='text'
                                    value={fileName}
                                    onChange={event => 
                                        setFileName(event.target.value)
                                    }
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setShowModal(false);
                        }}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            defaultChecked
                            onClick = {()=>{
                                setShowModal(false);
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
        </React.Fragment>
       
    )
}
interface ProjectFilesViewProps{
    project: ProjectInfo;
    classes: ClassNameMap<string>;
}
interface ProjectFilesViewState{
    Files: any[];
    isBusy: boolean;
    anchorEl: null | HTMLElement;
}
class ProjectFilesView extends React.Component<ProjectFilesViewProps & withConfirmProps & withSnackbarProps, ProjectFilesViewState>{
    public fileUploader:any;
    constructor(props)
    {
        super(props);
        this.state = {
            Files: [],
            isBusy: false,
            anchorEl: null
        }
        // this.handleChangeFiles = this.handleChangeFiles.bind(this);
        this.uploadFun = this.uploadFun.bind(this);
        this.fileUploader = null;
    }
    getFiles = async () => {
        this.setState({
            isBusy: true
        })
        var files = await ProjectApi.getFiles(this.props.project.id);
        this.setState({
            Files: files,
            isBusy: false
        })
    }
    async componentDidMount(){
        this.getFiles();
    }
    uploadFun = async (files) => {
        if(!files || files.length === 0 ) return;
        this.setState({
            isBusy: true
        })
        try{
            await ProjectApi.addFiles(this.props.project.id, [files[0]]);
            this.getFiles();
           
        } catch (error){
            this.setState({
                isBusy: false
            })
        }
    }
    deleteFile = (File) => {
        this.props.showConfirm('Confirm', 'Do you really want to delete this file?', async () => {
            this.props.hideConfirm();
            this.setState({isBusy: true})
            try {
                this.setState({isBusy: false});
                await ProjectApi.deleteFile(this.props.project.id, File.name);
                this.getFiles();
                this.props.showMessage(true, 'Delete file success');
            } catch (error) {
                console.log('ProjectFilesView.RemoveFile: ', error);
                this.setState({isBusy: false});
                this.props.showMessage(false, 'Delete File failed');
            }
        }, true);
    }
    // handleChangeFiles = (event) => {
    //     this.uploadFun(event.target.files);
    // }
    renderFileIcon = (name) => {
        var types = name.split(".");
        if(types[types.length -1] === "pdf"){
            return <PdfIcon style = {{color:"#e65a5a"}}/>
        } else if(types[types.length -1] === "bmp" || types[types.length -1] === "jpg" || types[types.length -1] === "jpeg" || types[types.length -1] === "png")
        {
            return <ImageIcon style = {{color:"#6e00ff"}}/>
        } else if(types[types.length -1] === "mp3" || types[types.length -1] === "ogg" || types[types.length -1] === "wav")
        {
            return <AudioIcon style = {{color:"#444242"}}/>
        } else if(types[types.length -1] === "avi" || types[types.length -1] === "mp4")
        {
            return <MovieIcon style = {{color:"#655f5f"}}/>
        } else {
            return <NoteIcon style = {{color:"#655f5f"}}/>
        }
    }
    render(){
        const {classes} = this.props;
        return(
            <Box className = {classes.projectFilesViewWrapper}>
                {
                    this.state.isBusy ? (
                        <CircularProgress className = {classes.busy}/>
                    ) :(null)
                }
                {/* <input style = {{display:"none"}}  type = "file" ref={ref => this.fileUploader = ref}
                    onChange = {this.handleChangeFiles}
                /> */}
                <Box className = {classes.actionBtnsWrapper}>
                    <Button color="default" variant="contained"  size = "small"
                        onClick = {()=>this.getFiles()}
                    ><RefreshIcon fontSize = "small"/></Button>
                    <Button color="default" variant="contained" style = {{marginLeft:"10px"}} size = "small"><DownloadIcon />&nbsp;Download All</Button>
                    {/* <Button color="default" variant="contained" style = {{float:"right"}}  size = "small" 
                        onClick = {()=>{
                            this.fileUploader.click();
                        }}
                    ><UploadIcon/>&nbsp;Upload files</Button> */}
                </Box>
                <Box className = {classes.ProjectFilesTableWrapper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Last Modified</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.Files && this.state.Files.length > 0 ? this.state.Files.map((file, index) => (
                                <TableRow key = {`table-row-key-${index}`}>
                                    <TableCell  >                                   
                                        <a href = {`${process.env.REACT_APP_PROJECT_API}/projects/${this.props.project.id}/files/${file.name}`} download>
                                            <Box className = {classes.fileNameCell}>
                                                {this.renderFileIcon(file.name)}
                                                &nbsp;&nbsp;&nbsp;
                                                {file.name}
                                            </Box>
                                        </a>
                                    </TableCell>
                                    <TableCell>{file.size ? file.size : ""}</TableCell>
                                    <TableCell>{file.lastModified ? file.lastModified : ""}</TableCell>
                                    <TableCell align = "right">
                                        <DropDownButton deleteFile = {()=>this.deleteFile(file)} File = {file} classes = {classes}/>
                                    </TableCell>
                                </TableRow>
                            )):(null)}
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        )
    }
}
const mapStateToProps = state => ({
    project: state.global_data.project,
});

export default connect(mapStateToProps, null)(withStyles(styles)(withConfirm<ProjectFilesViewProps>(withSnackbar<ProjectFilesViewProps>(ProjectFilesView))));
