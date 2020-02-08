import React from 'react';
//import material ui components;
import {  withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import SendIcon from '@material-ui/icons/Send';
import SearchIcon from '@material-ui/icons/Search';
//
import styles from './MesssageBox.style';
//import fakce data;
import {messagesData} from './fakeMessagesData';
import { Typography } from '@material-ui/core';

interface MessageBoxProps{
    classes: ClassNameMap<string>;
    contactorType: string;
}
class MessageBox extends React.Component<MessageBoxProps, any>{
    public loadAvatarImageCount:number = 0;
    public loadingAvatarImages = {
        contractor:{},
        owner: {}
    }
    constructor(props)
    {
        super(props);
        this.state = {
            messageData: null,
            message: "",
            contractorId: "",
            avatarImages: {},
            selfAvatarImage: null,
            imageLoaded: false
        }
        this.loadAvatarImageCount = 0;
        this.loadingAvatarImages  ={
            contractor:{},
            owner: {}
        }
    }
    avatarImageOnLoad = () => {
        this.loadAvatarImageCount++;
        if(this.loadAvatarImageCount === messagesData.contacts.length)
        {
            this.setState({
                messageData: messagesData,
                contractorId: messagesData && messagesData.contacts && messagesData.contacts.length > 0 ? messagesData.contacts[0].id : "",
                avatarImages: this.loadingAvatarImages,
                imageLoaded: true
            })
        }
    }
    loadAvatarImages = () => {
        this.loadingAvatarImages = {
            contractor:{},
            owner: {}
        }
        for(var i = 0 ;i < messagesData.contacts.length; i++)
        {
            
            if(messagesData.contacts[i].type === "contractor")
            {
                let image = new Image();
                image.crossOrigin = 'Anonymous';
                image.src = messagesData.contacts[i].avatar;
                let self = this;
                let contactIndex = i;
                image.onload = async () => {
                    var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');

                    canvas.height = image.naturalHeight;
                    canvas.width = image.naturalWidth;
                    ctx.drawImage(image, 0, 0);
                    var uri = canvas.toDataURL('image/png'),
                        b64 = uri/*.replace(/^data:image.+;base64,/, '')*/;
                    self.loadingAvatarImages.contractor[messagesData.contacts[contactIndex].id] = b64
                    self.loadAvatarImageCount++;
                    if(self.loadAvatarImageCount === messagesData.contacts.length)
                    {
                        self.setState({
                            messageData: messagesData,
                            contractorId: self.props.contactorType === "contractor" && messagesData && messagesData.contacts && messagesData.contacts.length > 0 ? messagesData.contacts[0].id : "",
                            avatarImages: self.loadingAvatarImages,
                            imageLoaded: true
                        })
                    }
                };
            } else {
                let image = new Image();
                image.crossOrigin = 'Anonymous';
                image.src = messagesData.contacts[i].avatar;
                let self = this;
                let contactIndex = i;
                image.onload = async () => {
                    var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');

                    canvas.height = image.naturalHeight;
                    canvas.width = image.naturalWidth;
                    ctx.drawImage(image, 0, 0);
                    var uri = canvas.toDataURL('image/png'),
                        b64 = uri/*.replace(/^data:image.+;base64,/, '')*/;
                    self.loadingAvatarImages.owner[messagesData.contacts[contactIndex].id] = b64
                    self.loadAvatarImageCount++;
                    if(self.loadAvatarImageCount === messagesData.contacts.length)
                    {
                        self.setState({
                            messageData: messagesData,
                            contractorId: self.props.contactorType === "contractor" && messagesData && messagesData.contacts && messagesData.contacts.length > 0 ? messagesData.contacts[0].id : "",
                            avatarImages: self.loadingAvatarImages,
                            imageLoaded: true
                        })
                    }
                };
            }
        }
    }
    componentDidMount(){
        this.loadAvatarImageCount = 0;
        this.loadAvatarImages();
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
                var _date = new Date();
                if(!_messagesData.messages[this.state.contractorId]) _messagesData.messages[this.state.contractorId] = [];
                _messagesData.messages[this.state.contractorId].push({
                    type:"self",
                    content: e.target.value,
                    sentTime: _date.getMinutes() + ":"+_date.getHours() + ":" + _date.getSeconds()
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
    getLastMessage = (contact, MessageData) => {
        if(!MessageData || !MessageData.messages || !MessageData.messages[contact.id] || !MessageData.messages[contact.id].length) return "";
        else {
            var _lastMsg = MessageData.messages[contact.id][MessageData.messages[contact.id].length - 1];
            if(_lastMsg.type === "self"){
                return `You: ${_lastMsg.content}`;
            } else {
                return `${contact.name}: ${_lastMsg.content}`
            }
        }
    }
    checkLastMessage = (type, index, messages) => {
        if(!messages || !messages.length || messages.length < index) return null;
        if(type === "other"){
            if(index < messages.length - 1 && messages[index + 1] === type) return false;
            else return true;
        }
        for(var i = index + 1; i < messages.length; i++ )
        {
            if(messages[i].type === type ) return false;
        }
        return true;
    }
    render(){
        const { classes } = this.props;
        return(
            <Box className = {classes.messageBoxWrapper} 
                  style = {{
                     marginTop:this.props.contactorType === "contractor" ? "0px" : "60px",
                     height:this.props.contactorType === "contractor" ? "calc(100vh - 277px)" : "calc(100vh - 127px)"
                  }}
            > 
                <Box className = {classes.contactsListViewWrapper}>
                    <Box className = {classes.contactSearchBox}>
                        <Typography variant = "h4" style = {{color:"#9cb7f3"}}>Recent &nbsp;</Typography>
                        <FormControl style = {{flex:1, marginBottom:"5px"}}>
                            <Input
                                placeholder = "Search"
                                id="contact-search"
                                endAdornment={
                                <InputAdornment position="end">
                                    <SearchIcon/>
                                </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Box>
                    <Box className = {classes.contactsListView}>
                        {
                            this.state.imageLoaded && this.state.messageData && this.state.messageData.contacts && this.state.messageData.contacts.map((contact, index)=>(
                                <React.Fragment key = {`contact-key-${index}`}>
                                    {
                                        this.props.contactorType === contact.type && (
                                            <Box key = {`contract-item-${index}`} className = {classes.contactListItem}
                                                style = {{border:this.state.contractorId === contact.id ? "1px solid #1752a8" : "1px solid #d6d3d3"}}
                                                onClick = {()=>{
                                                    this.setState({
                                                        contractorId: contact.id
                                                    })
                                                }}
                                            >
                                                <Avatar className = {classes.avatar} alt = {contact.name} src = {this.state.avatarImages[this.props.contactorType][contact.id]}/>
                                                <Box className = {classes.contactDetails}>
                                                    <Box style = {{
                                                        fontWeight:500,
                                                        color:this.state.contractorId === contact.id ? "#68e191" : "black"
                                                        }}
                                                    >{contact.name.length > 25 ? contact.name.substr(0,25) + "..." : contact.name}</Box>
                                                    <Box style = {{color:"gray"}}>{this.getLastMessage(contact, this.state.messageData)}</Box>
                                                </Box>
                                            </Box>
                                        )
                                    }
                                </React.Fragment>
                               
                            ))
                        }
                    </Box>
                </Box>
                <Box className = {classes.messageContentViewWrapper}>
                    <Box className = {classes.contactorInfoView}>
                        
                    </Box>
                    <Box className = {classes.messageContentView} id = "message-content-view">
                        {
                           this.state.imageLoaded && this.state.messageData && this.state.contractorId && this.state.messageData.messages[this.state.contractorId] &&  this.state.messageData.messages[this.state.contractorId].map((message, index)=>(
                                <Box className = {message.type === "self" ? classes.chatItemSelf : classes.chatItem} key = {`chat-item-${index}`}>
                                    {
                                        message.type === "other" ? (
                                            <React.Fragment>
                                                {
                                                    this.checkLastMessage("other", index, this.state.messageData.messages[this.state.contractorId]) === true ? (
                                                        <Avatar className = {classes.avatar} alt = "john" src = {this.state.avatarImages[this.props.contactorType][this.state.contractorId]}/>
                                                    ) : (null)
                                                }
                                                <Box className = {classes.msg}>
                                                    <Box>{message.content}</Box>
                                                    <Box style = {{textAlign:"left", color:"gray"}}>{message.sentTime}</Box>
                                                </Box>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <Box className = {classes.selfMsg}>
                                                    <Box>{message.content}</Box>
                                                    <Box style = {{textAlign:"right", color:"gray"}}>{message.sentTime}</Box>
                                                </Box>
                                                {
                                                    this.checkLastMessage("self", index, this.state.messageData.messages[this.state.contractorId]) === true ? (
                                                        <Avatar className = {classes.avatar} alt = "john" src = "https://demos.creative-tim.com/paper-dashboard-pro/assets/img/default-avatar.png"/>
                                                    ):(null)
                                                }
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