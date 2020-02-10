import React from 'react';
//import material ui components;
import {  withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { Typography } from '@material-ui/core';
//import Api
import ProjApi from 'services/project';
import ContApi from 'services/contractor';
//import types;
import { ProjectInfo } from 'types/project';
interface MessageBoxProps{
    classes: ClassNameMap<string>;
    contactorType: string;  //contractor || owner
    project: ProjectInfo;
}
class MessageBox extends React.Component<MessageBoxProps, any>{
    public loadAvatarImageCount:number = 0;
    public cachedAvatarImages = {};
    constructor(props)
    {
        super(props);
        this.state = {
            messageData: null,
            message: "",
            selectedConversationId: "",
            avatarImages: {},
            selfAvatarImage: null,
            imageLoaded: false,
            messagesLoading: false,
            conversationSummary: []
        }
        this.loadAvatarImageCount = 0;
        this.cachedAvatarImages  = {};
    }
    loadAvatarImages = (conversationSummaryData) => {
        this.cachedAvatarImages = {};
        for( var i = 0 ;i < conversationSummaryData.content.length; i++ )
        {
            if(conversationSummaryData.content[i].latestMessage &&
                conversationSummaryData.content[i].latestMessage.sender &&
                conversationSummaryData.content[i].latestMessage.sender.id)
            {
                let image = new Image();
                image.crossOrigin = 'Anonymous';
                image.src = ContApi.getAvatar(conversationSummaryData.content[i].latestMessage.sender.id);
                let self = this;
                let contactIndex = i;
                let _conversationSummaryData = conversationSummaryData;
                image.onload = async () => {
                    var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');
                    canvas.height = image.naturalHeight;
                    canvas.width = image.naturalWidth;
                    ctx.drawImage(image, 0, 0);
                    var uri = canvas.toDataURL('image/png'),
                        b64 = uri/*.replace(/^data:image.+;base64,/, '')*/;
                    self.cachedAvatarImages[`${_conversationSummaryData.content[contactIndex].id}`] = b64
                    self.loadAvatarImageCount++;
                    if(self.loadAvatarImageCount === _conversationSummaryData.content.length)
                    {
                        self.setState({
                            avatarImages: self.cachedAvatarImages,
                            imageLoaded: true
                        })
                    }
                };
                image.onerror = () => {
                    var senderName = "Contractor " + contactIndex;
                    if(_conversationSummaryData.content[contactIndex].sender &&
                        _conversationSummaryData.content[contactIndex].sender.address &&
                        _conversationSummaryData.content[contactIndex].sender.address.name)
                    {
                        senderName = _conversationSummaryData[contactIndex].sender.address.name;
                    }
                    var _url = "https://ui-avatars.com/api/?name=" + senderName;
                    let defaultAvatar = new Image();
                    defaultAvatar.crossOrigin = "Anonymous";
                    defaultAvatar.src = _url;
                    defaultAvatar.onload = async () => {
                        var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');
                        canvas.height = defaultAvatar.naturalHeight;
                        canvas.width = defaultAvatar.naturalWidth;
                        ctx.drawImage(defaultAvatar, 0, 0);
                        var uri = canvas.toDataURL('image/png'),
                            b64 = uri/*.replace(/^data:image.+;base64,/, '')*/;
                        self.cachedAvatarImages[`${_conversationSummaryData.content[contactIndex].id}`] = b64
                        self.loadAvatarImageCount++;
                        if(self.loadAvatarImageCount === _conversationSummaryData.content.length)
                        {
                            self.setState({
                                avatarImages: self.cachedAvatarImages,
                                imageLoaded: true
                            })
                        }
                    }
                }
            }
            else {
                let self = this;
                let contactIndex = i;
                let _conversationSummaryData = conversationSummaryData;
                var senderName = "Contractor " + contactIndex;
                if(_conversationSummaryData.content[contactIndex].sender &&
                    _conversationSummaryData.content[contactIndex].sender.address &&
                    _conversationSummaryData.content[contactIndex].sender.address.name)
                {
                    senderName = _conversationSummaryData[contactIndex].sender.address.name;
                }
                var _url = "https://ui-avatars.com/api/?name=" + senderName;
                let defaultAvatar = new Image();
                defaultAvatar.crossOrigin = "Anonymous";
                defaultAvatar.src = _url;
                defaultAvatar.onload = async () => {
                    var canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');
                    canvas.height = defaultAvatar.naturalHeight;
                    canvas.width = defaultAvatar.naturalWidth;
                    ctx.drawImage(defaultAvatar, 0, 0);
                    var uri = canvas.toDataURL('image/png'),
                        b64 = uri/*.replace(/^data:image.+;base64,/, '')*/;
                    self.cachedAvatarImages[`${_conversationSummaryData.content[contactIndex].id}`] = b64
                    self.loadAvatarImageCount++;
                    if(self.loadAvatarImageCount === _conversationSummaryData.content.length)
                    {
                        self.setState({
                            avatarImages: self.cachedAvatarImages,
                            imageLoaded: true
                        })
                    }
                }
            }
                
        }
    }
    async componentDidMount(){
        this.loadAvatarImageCount = 0;
        if(this.props.project.id)
        {
          var conversationSummary  = await ProjApi.getConversationSummary(this.props.project.id);
          this.setState({
            conversationSummary: conversationSummary.content
          })
          this.loadAvatarImages(conversationSummary);
        }
    }
    onChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }
    onKeyDown = (e) => {
        if (e.keyCode === 13) {
            if(e.target.value !== "" && this.state.selectedConversationId)
            {
                // var _messagesData = this.state.messageData;
                // var _date = new Date();
                // if(!_messagesData.messages[this.state.selectedConversationId]) _messagesData.messages[this.state.selectedConversationId] = [];
                // _messagesData.messages[this.state.selectedConversationId].push({
                //     type:"self",
                //     content: e.target.value,
                //     sentTime: _date.getMinutes() + ":"+_date.getHours() + ":" + _date.getSeconds()
                // })
                // this.setState({
                //     messageData: _messagesData,
                //     message : ""
                // },()=>{
                //     var optionListView = document.getElementById("message-content-view");
                //     optionListView.scrollTop = optionListView.scrollHeight;
                // })
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
    renderContractorName = (latestMessage) => {
        if(!latestMessage ||
           !latestMessage.sender ||
           !latestMessage.sender.address ||
           !latestMessage.sender.address.name) return "";
        else {
            if( latestMessage.sender.address.name.length > 25 ) return latestMessage.sender.address.name.substr(0, 25) + "...";
            else return latestMessage.sender.address.name;
        }
    }
    renderLatestMessageContent = (latestMessage) => {
        if(!latestMessage ||
           !latestMessage.message) return "";
        else {
            if(latestMessage.message.length > 28) return latestMessage.message.substr(0,28) + "...";
            else return latestMessage.message;
        }
    }
    handleChangeConversation = async (conversation_id) => {
        this.setState({
            selectedConversationId: conversation_id,
            messagesLoading: true
        });
        var messagesData = await ProjApi.getMessages(conversation_id);
        this.setState({
            messagesLoading: false
        })
        console.log(messagesData);
    }
    render(){
        const { classes } = this.props;
        return(
            <Box className = {classes.messageBoxWrapper} 
                  style = {{
                     margin:this.props.contactorType === "contractor" ? "0px" : "69px 24px 0px 24px",
                     height:this.props.contactorType === "contractor" ? "calc(100vh - 277px)" : "calc(100vh - 140px)",
                     
                  }}
            > 
                <Box className = {classes.contactsListViewWrapper}>
                    {
                        !this.state.imageLoaded && (
                            <CircularProgress  className = {classes.busy}/>
                        )
                    }
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
                            this.state.imageLoaded && this.state.conversationSummary.map((contact, index)=>(
                                <Box key = {`contract-item-${index}`} className = {classes.contactListItem}
                                    style = {{border:this.state.selectedConversationId === contact.id ? "1px solid #1752a8" : "1px solid #d6d3d3"}}
                                    onClick = {()=>{
                                        this.handleChangeConversation(contact.id)
                                    }}
                                >
                                    <Avatar className = {classes.avatar} alt = {`avatar-image-${index}`} src = {this.state.avatarImages ? this.state.avatarImages[`${contact.id}`] : ""}/>
                                    <Box className = {classes.contactDetails}>
                                        <Box style = {{
                                            fontWeight:500,
                                            color:this.state.selectedConversationId === contact.id ? "#68e191" : "black"
                                            }}
                                        >
                                            {
                                                this.renderContractorName(contact.latestMessage)
                                            }
                                        </Box>
                                        <Box style = {{color:"gray"}}>
                                            {
                                                this.renderLatestMessageContent(contact.latestMessage)
                                            }
                                        </Box>
                                    </Box>
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
                            this.state.messagesLoading && (
                                <CircularProgress className = {classes.busy}/>
                            )
                        }
                        {
                        //    this.state.imageLoaded && this.state.messageData && this.state.selectedConversationId && this.state.messageData.messages[this.state.selectedConversationId] &&  this.state.messageData.messages[this.state.selectedConversationId].map((message, index)=>(
                        //         <Box className = {message.type === "self" ? classes.chatItemSelf : classes.chatItem} key = {`chat-item-${index}`}>
                        //             {
                        //                 message.type === "other" ? (
                        //                     <React.Fragment>
                        //                         {
                        //                             this.checkLastMessage("other", index, this.state.messageData.messages[this.state.selectedConversationId]) === true ? (
                        //                                 <Avatar className = {classes.avatar} alt = "john" src = {this.state.avatarImages[this.props.contactorType][this.state.selectedConversationId]}/>
                        //                             ) : (null)
                        //                         }
                        //                         <Box className = {classes.msg}>
                        //                             <Box>{message.content}</Box>
                        //                             <Box style = {{textAlign:"left", color:"gray"}}>{message.sentTime}</Box>
                        //                         </Box>
                        //                     </React.Fragment>
                        //                 ) : (
                        //                     <React.Fragment>
                        //                         <Box className = {classes.selfMsg}>
                        //                             <Box>{message.content}</Box>
                        //                             <Box style = {{textAlign:"right", color:"gray"}}>{message.sentTime}</Box>
                        //                         </Box>
                        //                         {
                        //                             this.checkLastMessage("self", index, this.state.messageData.messages[this.state.selectedConversationId]) === true ? (
                        //                                 <Avatar className = {classes.avatar} alt = "john" src = "https://demos.creative-tim.com/paper-dashboard-pro/assets/img/default-avatar.png"/>
                        //                             ):(null)
                        //                         }
                        //                     </React.Fragment>
                        //                 )
                        //             }
                        //         </Box>
                        //     ))
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