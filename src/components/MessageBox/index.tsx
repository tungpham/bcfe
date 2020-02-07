import React from 'react';
//import material ui components;
import {  withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import Avatar from '@material-ui/core/Avatar';
//
import styles from './MesssageBox.style';
//import fakce data;
import {messagesData} from './fakeMessagesData';
import { Typography } from '@material-ui/core';
interface MessageBoxProps{
    classes: ClassNameMap<string>;
}
class MessageBox extends React.Component<MessageBoxProps, any>{
    constructor(props)
    {
        super(props);
        this.state = {
            messageData: null,
            message: "",
            contractorId: ""
        }
    }
    componentDidMount(){
        this.setState({
            messageData: messagesData,
            contractorId: messagesData && messagesData.contacts && messagesData.contacts.length > 0 ? messagesData.contacts[0].id : ""
        })
    }
    onChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }
    onKeyDown = (e) => {
        if (e.keyCode === 13) {
            if(e.target.value !== "" && this.state.contractorId)
            {
                var _messagesData = this.state.messageData;
                if(!_messagesData.messages[this.state.contractorId]) _messagesData.messages[this.state.contractorId] = [];
                _messagesData.messages[this.state.contractorId].push({
                    type:"self",
                    content: e.target.value,
                    sentTime:"11:20"
                })
                this.setState({
                    messageData: _messagesData,
                    message : ""
                },()=>{
                    var optionListView = document.getElementById("message-content-view");
                    optionListView.scrollTop = optionListView.scrollHeight;
                })
            }
        }
    }
    render(){
        const { classes } = this.props;
        return(
            <Box className = {classes.messageBoxWrapper}> 
                <Box className = {classes.contactsListViewWrapper}>
                    <Box className = {classes.contactSearchBox}></Box>
                    <Box className = {classes.contactsListView}>
                        {
                            this.state.messageData && this.state.messageData.contacts && this.state.messageData.contacts.map((contract, index)=>(
                                <Box key = {`contract-item-${index}`} className = {classes.contactListItem}
                                    style = {{backgroundColor:this.state.contractorId === contract.id ? "#9cb7f3" : "white"}}
                                    onClick = {()=>{
                                        this.setState({
                                            contractorId: contract.id
                                        })
                                    }}
                                >
                                    <Avatar className = {classes.avatar} alt = {contract.name} src = {contract.avatar}/>
                                    &nbsp;&nbsp;
                                    <Typography variant = "h5">
                                        {
                                            contract.name
                                        }
                                    </Typography>
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
                <Box className = {classes.messageContentViewWrapper}>
                    <Box className = {classes.contactorInfoView}>

                    </Box>
                    <Box className = {classes.messageContentView} id = "message-content-view">
                        {
                            this.state.messageData && this.state.contractorId && this.state.messageData.messages[this.state.contractorId] &&  this.state.messageData.messages[this.state.contractorId].map((message, index)=>(
                                <Box className = {message.type === "self" ? classes.chatItemSelf : classes.chatItem} key = {`chat-item-${index}`}>
                                    {
                                        message.type === "other" ? (
                                            <React.Fragment>
                                                <Avatar className = {classes.avatar} alt = "john" src = "https://demos.creative-tim.com/paper-dashboard-pro/assets/img/faces/face-2.jpg"/>
                                                <Box className = {classes.msg}>
                                                   {message.content}
                                                </Box>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <Box className = {classes.selfMsg}>
                                                    {message.content}
                                                </Box>
                                                <Avatar className = {classes.avatar} alt = "john" src = "https://demos.creative-tim.com/paper-dashboard-pro/assets/img/default-avatar.png"/>
                                            </React.Fragment>
                                        )
                                    }
                                </Box>
                            ))
                        }
                    </Box>
                    <Box className = {classes.messageSentView}>
                        <TextField
                            className = {classes.messageInput}
                            fullWidth
                            variant = "outlined"
                            label = ""
                            placeholder = "Type here!"
                            onKeyDown={this.onKeyDown}
                            onChange = {this.onChange}
                            value = {this.state.message}
                        />
                        <Fab size = "small" className = {classes.sendIcon} color = "primary">
                            <SendIcon fontSize = "small"/>
                        </Fab>
                    </Box>
                </Box>
            </Box>
        )
    }
}

export default withStyles(styles)(MessageBox);