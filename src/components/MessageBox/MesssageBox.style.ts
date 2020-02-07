import { createStyles } from '@material-ui/core/styles';

const styles = () => createStyles({
    messageBoxWrapper:{
        margin:"0px 60px",
        display:"flex",
        justifyContent:"center",
        height:"calc(100vh - 260px)",
        boxShadow:"0px 10px 10px rgba(0,0,0,.1)",
        backgroundColor:"white",
        border:"1px solid #e0e0e0"
    },
    //contactsListView------
    contactsListViewWrapper:{
        width:"350px",
        height:"100%",
        padding:"10px",
        display:"flex",
        flexDirection:"column",
        borderRight:"1px solid #e0e0e0"
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
        border:"1px solid #d6d3d3",
        display:"flex",
        justifyContent:"flex-start",
        alignItems:"center",
        transition:"all ease 0.5s",
        "&:hover":{
            cursor:"pointer",
            boxShadow:"0px 0px 10px rgba(0,0,0,.4)"
        }
    },
    //messageContentView---
    messageContentViewWrapper:{
        flex:1,
        display:"flex",
        flexDirection:"column",
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
        flex: 1,
        "& input":{
            height:"2.1875em"
        },
        backgroundColor:"white"
    },
    sendIcon:{
        marginLeft:"20px",
        backgroundColor:"#1752a8",
        "& svg":{
            width:"0.75em"
        }
    },
    //chat-items;
    chatItem:{
        padding:"0.5rem",
        overflow:"hidden",
        display:"flex"
    },
    chatItemSelf:{
        padding:"0.5rem",
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
        padding:"10px"
    },
    selfMsg:{
        border: "2px solid #d6c1ab",
        borderRadius:"16px",
        position:"relative",
        marginRight:"22px",
        maxWidth:"75%",
        backgroundColor:"#d6c1ab",
        padding:"10px"
    }
});
export default styles;