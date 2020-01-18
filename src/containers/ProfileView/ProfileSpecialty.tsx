import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles, Theme, createStyles, StyledComponentProps } from '@material-ui/core/styles';
import   { SelectObject } from 'components/Select/MultiSelect';
import { Specialties } from 'types/global';
import Button from 'components/CustomButtons/Button';
import PredictiveSearchBox from './predictiveSearchBox';

const styles = (theme: Theme) => createStyles({
    containerSpe: {
        width: '100%',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderRadius: '0',
        minHeight:'340px'
    },
    subContents: {
        width: '100%',
        overflow: 'auto',
        margin: theme.spacing(1, 0)
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600
    },
    select: {
        width: '100%'
    },
    chip: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)
    },
    center: {
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
        position: 'absolute'
    },
});

interface ProfileSpecViewProps extends StyledComponentProps {
    contractor: any;
    specialties: Specialties;
    handleDelete: (specId: string) => Promise<any>;
    handleSave: (specs: string[]) => Promise<void>;
}

interface ProfileSpecViewState {
    showConfirmDlg: boolean;
    confirmMessage: string;
    onYes: () => Promise<void>;
    idToDel: string;
    specs: string[];
    suggestions: SelectObject[];
}
class ProfileSpecView extends React.Component<ProfileSpecViewProps, ProfileSpecViewState> {
    constructor(props: Readonly<ProfileSpecViewProps>) {
        super(props);

        this.state = {
            showConfirmDlg: false,
            confirmMessage: '',
            onYes: this.deleteSpecialty,
            idToDel: '',
            specs: props.contractor.contractorSpecialties.map(item => (item.specialty.name)),
            suggestions: props.specialties.content.map(spec => ({ id: spec.id, name: spec.name })).filter(sugg => !props.contractor.contractorSpecialties.map(item => (item.specialty.name)).includes(sugg.name))
        };
    }
    componentDidUpdate(prevProps:ProfileSpecViewProps, prevState:ProfileSpecViewState){
        if(prevState.specs && this.state.specs && prevState.specs !== this.state.specs)
        {
            var _suggestions = this.props.specialties.content.map(spec => ({ id: spec.id, name: spec.name })).filter(sugg => !this.state.specs.includes(sugg.name));
            this.setState({
                suggestions: _suggestions
            })
        }
    }
    closeConfirmDialog = () => {
        this.setState({ showConfirmDlg: false });
    };

    handleDelete = id => {
        this.setState({
            showConfirmDlg: true,
            idToDel: id,
            onYes: this.deleteSpecialty,
            confirmMessage: 'Do you really want to delete specialty?'
        });
    };

    deleteSpecialty = async () => {
        const data = await this.props.handleDelete(this.state.idToDel);
        this.setState({ showConfirmDlg: false, specs: data.contractorSpecialties.map(item => item.specialty.name) });
    }

    selectChange = (val: Array<string>) => {
        this.setState({ specs: val });
    }

    deleteSelect = (name: string) => {
        const { specs } = this.state;

        let idx: number = specs.indexOf(name);
        if (idx >= 0) {
            specs.splice(idx, 1);
            this.setState({ 
                specs: [...specs]
            },()=>{
                this.saveSpecialty();
            });
        }
    }

    saveSpecialty = async () => {
        this.props.handleSave(this.state.specs);
        this.setState({ showConfirmDlg: false });
    }

    trySave = () => {
        this.setState({
            showConfirmDlg: true,
            onYes: this.saveSpecialty,
            confirmMessage: 'Do you really want to change your specialty?'
        });
    }

    render() {
        const { classes } = this.props;
        const { suggestions, specs, confirmMessage, showConfirmDlg } = this.state;
        return (
            <>
                <Card className={classes.containerSpe}>
                    <List>
                        <ListItem>
                            <Typography className = {classes.title}>
                                Specialties
                            </Typography>
                        </ListItem>
                        <ListItem style = {{display:'block'}}>
                            <PredictiveSearchBox
                                parentIns = {this}
                                options = {suggestions}
                            />
                            <List>
                            <ListItem>
                                <Box style={{ display: 'inlineBlock' }}>
                                    {specs.map((spec, index) => (
                                        <Chip
                                            key={index}
                                            label={spec}
                                            className={classes.chip}
                                            onDelete={() => this.deleteSelect(spec)}
                                            style = {{display:"inlineBlock", margin:"3px 5px"}}
                                        />
                                    ))}
                                </Box>
                            </ListItem>
                        </List>
                        </ListItem>
                    </List>
                </Card>
                <Dialog
                    open={showConfirmDlg}
                    onClose={this.closeConfirmDialog}
                    aria-labelledby="alert-dialog-title"
                >
                    <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
                    <DialogContent className={classes.relative}>
                        <DialogContentText id="alert-dialog-description">
                            {confirmMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeConfirmDialog} autoFocus>
                            Cancel
            			</Button>
                        <Button onClick={this.state.onYes} color="primary">
                            Yes
            			</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(ProfileSpecView);
