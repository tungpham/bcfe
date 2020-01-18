import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import ConApi from 'services/contractor';
import {getContractorDetailById} from 'store/actions/cont-actions';
const styles = (theme: Theme) => createStyles({
    contents: {
        width: '100%',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderRadius: 0
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600,
        flex: 1
    },
    link: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'blue',
        cursor: 'pointer',
        marginLeft: '15px'
    },
});

interface IntroductionProps {
    contractor: any;
    classes: any;
    getContractorDetailById: (id: String) => Promise<void>; 
}
interface IntroductionStates {
    isEdit: boolean;
    editingIntroduction: String;
    introduction: String;
}
class ProfileIntroductionView extends React.Component<IntroductionProps, IntroductionStates> {
    constructor(props:IntroductionProps)
    {
        super(props);
        this.state = {
            isEdit: false,
            editingIntroduction: '',
            introduction: '',
        }
    }
    startEdit = () => {
        var intro = this.state.introduction;
        this.setState({
            isEdit: true,
            editingIntroduction: intro
        })
    }
    endEdit = () => {
      
        this.setState({
            isEdit: false,
            editingIntroduction: '',
        })
    }
    componentDidMount(){
        this.setState({
            introduction: this.props.contractor && this.props.contractor.address && this.props.contractor.address.introduction ? this.props.contractor.address.introduction : ""
        })
    }
    save = async () => {
        var submitData = {
            address: {
                introduction:this.state.editingIntroduction
            }
        }
        await ConApi.approve(this.props.contractor.id, submitData).then((data:any) => {
               var intro = data.data.address.introduction;
               this.setState({
                  introduction: intro
               })
        })
        this.endEdit();
    }
    render(){
        const  { classes } = this.props;
        return (
                <Card className={classes.contents}>
                    <List>
                        <ListItem>
                            <Box style = {{display:'flex', width:'100%'}}>
                               
                                {
                                     this.state.isEdit === true ? (
                                         <Box>
                                            <Typography className = {classes.title}>
                                                Your introduction
                                            </Typography>
                                            <Typography style = {{padding:'10px 0px'}}>
                                                This is one of the first things customers see about your business
                                            </Typography>
                                        </Box>
                                     ):(
                                        <Typography className = {classes.title}>
                                            Your introduction
                                        </Typography>
                                     )
                                }
                                {
                                    this.state.isEdit === true ? (
                                        <React.Fragment>
                                            <Typography className = {classes.link}
                                                onClick = {()=>{
                                                    this.save();
                                                    this.endEdit();
                                                }}
                                            >
                                                Save
                                            </Typography>
                                            <Typography className = {classes.link} style = {{color:"red"}}
                                                onClick = {this.endEdit}
                                            >
                                                Cancel
                                            </Typography>
                                        </React.Fragment>
                                        
                                    ) : (
                                        <Typography className = {classes.link}
                                            onClick={this.startEdit}
                                        >
                                            Edit
                                        </Typography>
                                    )
                                }
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box style = {{padding:'10px 0px', width:'100%'}}>
                                {
                                    this.state.isEdit === true ? (
                                        <Box>
                                            <Typography style = {{fontWeight:600, padding:'10px 0px'}}>
                                                Why should customers hire you?
                                            </Typography>
                                            <TextField
                                                    id="experience-text-area"
                                                    name = "review"
                                                    label=""
                                                    multiline
                                                    fullWidth
                                                    rows = "5"
                                                    variant="outlined"
                                                    placeholder = ""
                                                    value = {this.state.editingIntroduction}
                                                    onChange = {(e) => {
                                                        this.setState({
                                                            editingIntroduction: e.target.value
                                                        })
                                                    }}
                                            />
                                       </Box>
                                    ) : this.state.introduction !== '' ? (
                                        <Typography>{this.state.introduction}</Typography>
                                    ) : (
                                        <Typography>This is one of the first things customers see about your business</Typography>
                                    )
                                }
                            </Box>
                        </ListItem>
                    </List>
                </Card>
        );
    }
}
const mapStateToProps = state => ({
    contractor: state.cont_data.selectedContractor,
});
const mapDispatchToProps = {
    getContractorDetailById
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProfileIntroductionView));