import React from 'react';
//import material ui components;
import {  withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/styles/withStyles';
import { Typography } from '@material-ui/core';
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
import PageNextIcon from '@material-ui/icons/KeyboardArrowRight';
import PagePrevIcon from '@material-ui/icons/KeyboardArrowLeft';
//import Api
import ProjApi from 'services/project';
import ContApi from 'services/contractor';
//import types;
import { ProjectInfo } from 'types/project';
//import style
import styles from './MesssageBox.style';

interface MessageBoxProps{
    classes: ClassNameMap<string>;
    contactorType: string;  //contractor || owner
    project: ProjectInfo;
}
class MessageBox extends React.Component<MessageBoxProps, any>{
    public loadAvatarImageCount:number = 0;
    public cachedAvatarImages = {};
    public conversationId = "";
    constructor(props)
    {
        super(props);
        this.state = {
            message: "",
            selfAvatarImage: null,
            //left menu;
            selectedConversationId: "",
            conversationSummary: [],
            avatarImages: {},
            contactsLoading: false,
            currentPageForLeft: 0,
            perPageForLeft: 20,
            totalPagesForLeft: 0,
            //right detail view;
            messagesLoading: false,
            scrollLoading: false,
            messagesData: [],
            currentPageForRight: 0,
            perPageForRight: 20,
            totalPagesForRight: 0,
        }
        this.loadAvatarImageCount = 0;
        this.cachedAvatarImages  = {};
        this.conversationId = "";
    }
    loadAvatarImages = (conversationSummaryData) => {
        this.cachedAvatarImages = {};
        for( var i = 0 ;i < conversationSummaryData.content.length; i++ )
        {
            if(conversationSummaryData.content[i].latestMessage &&
                conversationSummaryData.content[i].latestMessage.senderId)
            {
                let image = new Image();
                image.crossOrigin = 'Anonymous';
                if(this.props.contactorType === "owner")
                {
                    image.src = ContApi.getAvatar(conversationSummaryData.content[i].projectOwnerId);
                } else {
                    image.src = ContApi.getAvatar(conversationSummaryData.content[i].contractorId);
                }
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
                    if(self.props.contactorType === "owner")
                    {
                        self.cachedAvatarImages[`${_conversationSummaryData.content[contactIndex].projectOwnerId}`] = b64
                    } else {
                        self.cachedAvatarImages[`${_conversationSummaryData.content[contactIndex].contractorId}`] = b64
                    }
                    self.loadAvatarImageCount++;
                    if(self.loadAvatarImageCount === _conversationSummaryData.content.length)
                    {
                        console.clear();
                        self.setState({
                            avatarImages: self.cachedAvatarImages,
                            contactsLoading: false
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
                        if(self.props.contactorType === "owner")
                        {
                            self.cachedAvatarImages[`${_conversationSummaryData.content[contactIndex].projectOwnerId}`] = b64
                        } else {
                            self.cachedAvatarImages[`${_conversationSummaryData.content[contactIndex].contractorId}`] = b64
                        }
                        self.loadAvatarImageCount++;
                        if(self.loadAvatarImageCount === _conversationSummaryData.content.length)
                        {
                            console.clear();
                            self.setState({
                                avatarImages: self.cachedAvatarImages,
                                contactsLoading: false
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
                    if(self.props.contactorType === "owner")
                    {
                        self.cachedAvatarImages[`${_conversationSummaryData.content[contactIndex].projectOwnerId}`] = b64
                    } else {
                        self.cachedAvatarImages[`${_conversationSummaryData.content[contactIndex].latestMessage.senderId}`] = b64
                    }
                    self.loadAvatarImageCount++;
                    if(self.loadAvatarImageCount === _conversationSummaryData.content.length)
                    {
                        console.clear();
                        self.setState({
                            avatarImages: self.cachedAvatarImages,
                            contactsLoading: false
                        })
                    }
                }
            }
        }
        let image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = ContApi.getAvatar(localStorage.getItem("contractor_ID"));
        let self = this;
        image.onload = async () => {
            var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
            canvas.height = image.naturalHeight;
            canvas.width = image.naturalWidth;
            ctx.drawImage(image, 0, 0);
            var uri = canvas.toDataURL('image/png'),
                b64 = uri/*.replace(/^data:image.+;base64,/, '')*/;
            self.setState({
                selfAvatarImage: b64
            })
        };
    }
    async componentDidMount(){
        this.loadAvatarImageCount = 0;
        if(this.props.contactorType === "contractor" )
        {
          if(!this.props.project || !this.props.project.id) return;
          var conversationSummary  = await ProjApi.getConversationSummary(this.props.project.id, this.state.currentPageForLeft, this.state.perPageForLeft);
          this.setState({
            conversationSummary: conversationSummary.content,
            totalPagesForLeft: conversationSummary.totalPages
          })
          if(conversationSummary && conversationSummary.content &&  conversationSummary.content.length > 0)
          {
              this.setState({
                contactsLoading: true
              })
              this.loadAvatarImages(conversationSummary);
          }
        } else {
            var selfId = localStorage.getItem("contractor_ID");
            var conversationSummaryWithOwner  = await ProjApi.getConversationSummary1(selfId, this.state.currentPageForLeft, this.state.perPageForLeft);
            this.setState({
                conversationSummary: conversationSummaryWithOwner.content,
                totalPagesForLeft: conversationSummaryWithOwner.totalPages
            })
            if(conversationSummaryWithOwner && conversationSummaryWithOwner.content &&  conversationSummaryWithOwner.content.length > 0)
            {
                this.setState({
                    contactsLoading: true
                })
                this.loadAvatarImages(conversationSummaryWithOwner);
            }
        }
    }
    onChange = (e) => {
        this.setState({
            message: e.target.value
        })
    }
    onKeyDown = async (e) => {
        if (e.keyCode === 13) {
            if(e.target.value !== "" && this.state.selectedConversationId )
            {
                 var selfId = localStorage.getItem("contractor_ID");
                 var _messagesData = this.state.messagesData;
                 var _conversationSummaryData = this.state.conversationSummary;
                 for(var i = 0 ;i < _conversationSummaryData.length; i++)
                 {
                     if(this.state.selectedConversationId === _conversationSummaryData[i].id){
                         _conversationSummaryData[i].latestMessage.message = this.state.message;
                         _conversationSummaryData[i].latestMessage.senderId = selfId;
                         _conversationSummaryData[i].latestMessage.timestamp = new Date()
                     }
                 }
                 _messagesData.content.push({
                    senderId: selfId,
                    senderName: "",
                    message: this.state.message,
                    timestamp: new Date(),
                    status: "UNREAD"
                 })
                 this.setState({
                    message:"",
                    messagesData: _messagesData,
                    conversationSummaryData: _conversationSummaryData
                 },()=>{
                    var optionListView = document.getElementById("message-content-view");
                    optionListView.scrollTop = optionListView.scrollHeight;
                 });
                 await ProjApi.postMessageToConversation(this.state.selectedConversationId, selfId, this.state.message);
                //  this.handleChangeConversation(this.state.selectedConversationId);
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
    renderContractorName = (name) => {
        if(name === null || name === undefined || name === "") return "";
        if(this.props.contactorType === "owner")
        {
            if(name.length > 25 ) return name.substr(0,25) + "...";
            else return name;
        } else {

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
    noScroll = () => {
        var optionListView = document.getElementById("message-content-view");
        optionListView.scrollTop = 0;
    }
    scrollChange = (e) =>{
        if(this.state.currentPageForRight >= this.state.totalPagesForRight - 1) return;
        if(e.target.scrollTop < 100)
        {
            this.setState({scrollLoading: true})
            this.handleChangeConversationDetailPage(this.conversationId, this.state.currentPageForRight + 1, this.state.perPageForRight);
        }
    }
    handleChangeConversation = async (conversation_id) => {
        this.conversationId = conversation_id;
        this.setState({
            selectedConversationId: conversation_id,
            messagesLoading: true,
            currentPageForRight: 0,
            perPageForRight : 20
        });
        var messagesData = await ProjApi.getMessages(conversation_id, 0, 20);
        this.setState({
            messagesLoading: false,
            scrollLoading: false,
            messagesData: messagesData,
            totalPagesForRight: messagesData.totalPages
        }, ()=>{
               var optionListView = document.getElementById("message-content-view");
               optionListView.scrollTop = optionListView.scrollHeight;
               optionListView.addEventListener('scroll', this.scrollChange)
        })
    }
    handleChangeContactListPage = async (page, perPage) => {
        this.loadAvatarImageCount = 0;
        if(this.props.project.id)
        {
            this.setState({
                contactsLoading: false
            })
            var conversationSummary  = await ProjApi.getConversationSummary(this.props.project.id, page, perPage);
            this.setState({
                conversationSummary: conversationSummary.content,
                totalPagesForLeft: conversationSummary.totalPages,
                currentPageForLeft: page,
            })
            this.loadAvatarImages(conversationSummary);
        }
    }
    handleChangeConversationDetailPage = async (conversation_id, page, perPage) => {
        this.setState({
            messagesLoading: true
        })
        var optionListView = document.getElementById("message-content-view");
        optionListView.removeEventListener('scroll', this.scrollChange);
        optionListView.addEventListener('scroll', this.noScroll);
        var beforeScrollHeight = optionListView.scrollHeight;
        var _messagesData = await ProjApi.getMessages(conversation_id, page, perPage);
        _messagesData.content = _messagesData.content.concat(this.state.messagesData.content);
        this.setState({
            messagesLoading: false,
            messagesData: _messagesData,
            currentPageForRight: page
        },()=>{
            optionListView.scrollTop = optionListView.scrollHeight - beforeScrollHeight;
        })
        optionListView.removeEventListener('scroll', this.noScroll);
        optionListView.addEventListener('scroll', this.scrollChange);
    }
    renderTimestamp = (time) => {
        var postDate = new Date(time);
        return `${postDate.getHours()}:${postDate.getMinutes()}:${postDate.getSeconds()}`
    }
    render(){
        const { classes } = this.props;
        var selfId = localStorage.getItem("contractor_ID");
        return(
            <Box className = {classes.messageBoxWrapper} 
                  style = {{
                     margin:this.props.contactorType === "contractor" ? "0px" : "69px 24px 0px 24px",
                     height:this.props.contactorType === "contractor" ? "calc(100vh - 277px)" : "calc(100vh - 140px)",
                     
                  }}
            > 
                <Box className = {classes.contactsListViewWrapper}>
                    {
                        this.state.contactsLoading && (
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
                    <Box className = {classes.contactsListView} id = "contacts-list-view">
                        {
                            !this.state.contactsLoading && this.state.conversationSummary.map((contact, index)=>(
                                <Box key = {`contract-item-${index}`} className = {classes.contactListItem}
                                    style = {{border:this.state.selectedConversationId === contact.id ? "1px solid #1752a8" : "1px solid #d6d3d3"}}
                                    onClick = {()=>{
                                        this.handleChangeConversation(contact.id)
                                    }}
                                >
                                    <Avatar className = {classes.avatar} alt = {`avatar-image-${index}`} src = {this.state.avatarImages ? this.state.avatarImages[`${this.props.contactorType === "contractor" ? contact.contractorId : contact.projectOwnerId}`] : ""}/>
                                    
                                    <Box className = {classes.contactDetails}>
                                        <Box style = {{
                                            fontWeight:500,
                                            color:this.state.selectedConversationId === contact.id ? "#68e191" : "black"
                                            }}
                                        >
                                            {
                                                this.renderContractorName(contact.projectTitle)
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
                        {
                            !this.state.contactsLoading && this.state.totalPagesForLeft > 1 && (
                                <Box className = {classes.contactsListPagenation}>
                                    <Box className = { this.state.currentPageForLeft === 0 ? classes.contactsListPagenationDisableBtn : classes.contactsListPagenationActionBtn} 
                                        onClick = {()=>{
                                            if(this.state.currentPageForLeft > 0) this.handleChangeContactListPage(this.state.currentPageForLeft - 1, this.state.perPageForLeft)
                                        }}
                                    ><PagePrevIcon/></Box>
                                    <Box className = {classes.contactsListPagenationInfo}>{`${this.state.currentPageForLeft + 1} of ${this.state.totalPagesForLeft}`}</Box>
                                    <Box className = { this.state.currentPageForLeft >= this.state.totalPagesForLeft - 1 ? classes.contactsListPagenationDisableBtn : classes.contactsListPagenationActionBtn}
                                        onClick = {()=>{
                                            if(this.state.currentPageForLeft < this.state.totalPagesForLeft - 1) this.handleChangeContactListPage(this.state.currentPageForLeft + 1, this.state.perPageForLeft)
                                        }}
                                    ><PageNextIcon/></Box>
                                </Box>
                            )
                        }
                    </Box>
                </Box>
                <Box className = {classes.messageContentViewWrapper}>
                    <Box className = {classes.contactorInfoView}>
                        
                    </Box>
                    <Box className = {classes.messageContentView} id = "message-content-view" >
                        {
                            this.state.messagesLoading && this.state.scrollLoading &&  (
                                    <Box className = {classes.messagesLoadingLabel}>Loading messages...</Box>
                            )
                        }
                        {
                            this.state.messagesLoading && (
                                <CircularProgress className = {classes.busy}/>
                            )
                        }
                        {
                           !this.state.contactsLoading  &&  this.state.messagesData && this.state.messagesData.content &&  this.state.messagesData.content.map((message, index)=>(
                                <Box className = {message.senderId && message.senderId === selfId ? classes.chatItemSelf : classes.chatItem} key = {`chat-item-${index}`}>
                                    {
                                        message.senderId && message.senderId === selfId ? (
                                            <React.Fragment>
                                                <Box className = {classes.selfMsg}>
                                                    <Box>{message.message ? message.message : ""}</Box>
                                                    <Box style = {{textAlign:"right", color:"gray"}}>{message.timestamp ? this.renderTimestamp(message.timestamp) : ""}</Box>
                                                </Box>
                                                 <Avatar className = {classes.selfAvatar} alt = "john" src = {this.state.selfAvatarImage}/>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <Avatar className = {classes.avatar} alt = {`avatar-contractor-${index}`} src = {this.state.avatarImages ? this.state.avatarImages[`${message.senderId}`] : ""}/>
                                                <Box className = {classes.msg}>
                                                <Box>{message.message ? message.message : ""}</Box>
                                                    <Box style = {{textAlign:"right", color:"gray"}}>{message.timestamp ? this.renderTimestamp(message.timestamp) : ""}</Box>
                                                </Box>
                                            </React.Fragment>
                                        )
                                    }
                                </Box>
                            ))
                        }
                    </Box>
                    <Box className = {classes.messageSentView}>
                        <Avatar alt = "john" src = {this.state.selfAvatarImage}/>
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