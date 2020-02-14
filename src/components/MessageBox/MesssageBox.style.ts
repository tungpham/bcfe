import { createStyles } from '@material-ui/core/styles';

const styles = () => createStyles({
    messageBoxWrapper:{
        display:"flex",
        justifyContent:"center",
    },
    //contactsListView------
    contactsListViewWrapper:{
        width:"400px",
        height:"100%",
        padding:"10px",
        display:"flex",
        flexDirection:"column",
        borderRight:"1px solid #e0e0e0",
        position:"relative",
        backgroundColor:"white"
    },
    contactSearchBox:{
        padding:"10px 0px",
        display:"flex",
        alignItems:"flex-end"
    },
    contactsListView:{
        flex:1,
        overflow:"auto",
    },
    contactListItem:{
        padding:"15px",
        margin:"5px 0px",
        display:"flex",
        justifyContent:"flex-start",
        alignItems:"center",
        "&:hover":{
            cursor:"pointer",
        }
    },
    contactDetails:{
        marginLeft:"10px"
    },
    contactsListPagenation:{
        padding:"20px 15px",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    },
    contactsListPagenationActionBtn:{
        "&:hover":{
            cursor:"pointer",
            color:"#68e191"
        }
    },
    contactsListPagenationDisableBtn:{
        color:"#bdbaba",
        "&:hover":{
            cursor:"not-allowed",
        }
    },
    contactsListPagenationInfo:{
        flex:1,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        fontSize:"1.3rem",
        fontWeight:500
    },

    //messageContentView---
    messageContentViewWrapper:{
        flex:1,
        display:"flex",
        flexDirection:"column",
        position:"relative",
        backgroundColor:"white",
        marginLeft:"5px"
    },
    contactorInfoView:{

    },
    messageContentView:{
        padding:"10px",
        flex: 1,
        overflow:"auto",
        borderBottom:"1px solid #e0e0e0"
    },
    messageSentView:{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        padding:"10px 10px 20px 10px",
        marginTop:"10px",
    },
    messageInput:{
        marginLeft:"10px",
        flex: 1,
        "& input":{
            height:"2.1875em"
        },
        backgroundColor:"white"
    },
    sendIcon:{
        marginLeft:"10px",
        backgroundColor:"#1752a8",
        "& svg":{
            width:"0.75em"
        }
    },
    //chat-items;
    chatItem:{
        padding:"0.3rem",
        overflow:"hidden",
        display:"flex"
    },
    chatItemSelf:{
        padding:"0.3rem",
        overflow:"hidden",
        display:"flex",
        justifyContent:"flex-end",
        alignItems:"flex-end"
    },
    avatar:{
        // width:"40px",
        // height:"40px",
        position:"relative",
        display:"block",
        zIndex: 2
    },
    msg:{
        order: 1,
        border: "2px solid #b8d8d8",
        borderRadius:"16px",
        position:"relative",
        marginLeft:"22px",
        maxWidth:"75%",
        backgroundColor:"#b8d8d8",
        padding:"5px 10px"
    },
    selfAvatar:{
        position:"relative",
        display:"block",
        zIndex: 2,
        "&::after":{
            content: "",
            position: "absolute",
            display: "inline-block",
            bottom: "19px",
            right: "48px",
            width: "0px",
            height: "0px",
            border: "8px solid #d6c1ab",
            borderRightColor: "transparent",
            borderTopColor: "transparent"
        }
    },
    selfMsg:{
        border: "2px solid #d6c1ab",
        borderRadius:"16px",
        position:"relative",
        marginRight:"22px",
        maxWidth:"75%",
        backgroundColor:"#d6c1ab",
        padding:"5px 10px"
    },
    busy: {
		position: 'absolute',
		left: 'calc(50% - 20px)',
		top: 'calc(50% - 20px)'
    },
    messagesLoadingLabel:{
        position: 'absolute',
		left: 0,
        top: 0,
        width:"100%",
        padding:"10px",
        backgroundColor:"#e8e8e8",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        zIndex: 9999
    }
});
export default styles;