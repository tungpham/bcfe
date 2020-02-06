import * as React from 'react';
import {useState} from 'react';
import ReactMarkdown from "react-markdown";
import breaks from 'remark-breaks';
import {  makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { ProjectLevelCategory, RoomOption, ProjectInfo } from 'types/project';
import {  NodeInfo } from 'types/global';

const DES_LIMIT_COUNT = 120;
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: 'relative'
    },
    title: {
        fontWeight: 600,
        fontSize: '1.2em',
        color: '#111'
    },
    bold: {
        fontWeight: 600
    },
    subtitle: {
        // fontWeight: 500,
        fontSize: '1rem',
        paddingRight: theme.spacing(1.5),
        color: '#222',
        // paddingTop: theme.spacing(0.5)
        "& p":{
            margin:"0px"
        }
    },
    subtitle1: {
        // fontWeight: 500,
        fontSize: '1rem',
        marginLeft: "50px",
        color: '#222',
        // paddingTop: theme.spacing(0.5)
        "& p":{
            margin:"0px"
        }
    },
    fab: {
        fontWeight:500,
        color:"#5782e4",
        marginTop:"20px",
        display:"flex",
        alignItems:"center"
       
    },
    actionBtn:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        marginTop:"10px"
    },
    link: {
        fontSize: '0.875rem',
        fontWeight: "bold",
        color: 'blue',
        cursor: 'pointer',
        marginLeft: '15px'
    },
    editIcon:{
            width:"0.7em"
    },
    catBox: {
        margin:"5px 0px"
    },
    value: {
        fontWeight: 500,
        fontSize: '1.0em',
        padding: theme.spacing(0, 1),
        color: '#222',
        flexGrow: 1,
        textAlign: 'right',
    },
    doneBtn: {
        border: '1px solid #4a148c',
        borderRadius: 0,
        color: theme.palette.primary.light,
        backgroundColor: '#FFF',
        padding: theme.spacing(1),
        marginRight: theme.spacing(2),
        width: '120px',
        // fontSize: '14px',
        bottom: 0,
        '&:hover': {
            backgroundColor: theme.palette.primary.light,
            color: '#FFF'
        },
        '&:disabled': {
            backgroundColor: '#CCC',
        },
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 20px)',
        top: 'calc(50% - 20px)',
    },
    showMoreLess:{
        color:"blue",
        "&:hover":{
            cursor: "pointer"
        }
    },
    description1:{
        display:"inline",
        "& p":{
            display:"inline"
        }
    }
}));

interface ISectionProps {
    component: NodeInfo;
    room: ProjectLevelCategory;
    project: ProjectInfo;
    getLevels: (id: string) => Promise<void>;
}

const Section: React.FunctionComponent<ISectionProps> = (props) => {

    const { component, room} = props;
    const classes = useStyles({});
    const [isExpandedDes, setIsExpandedDes] = useState(false);
    const [category, setCategory] = React.useState(component.id);
    const [curRoom, setCurRoom] = React.useState(room.id);
    const [busy, setBusy] = React.useState(false);
    const pathFromOption = () => {
        const crumb = [component];

        if (!room.selectionList) return crumb;
        const current = room.selectionList.filter(selection => component.id === selection.category.id);
        if (current.length === 0) return crumb;
        const ids = current[0].breadcrumb;
        if (!ids || ids.length === 0) return crumb;

        let curNode = component;
        for (let i = 0; i < ids.length; i++) {
            const matches = curNode.children.filter(item => item.id === ids[i]);
            if (matches.length === 1) {
                crumb.push(matches[0]);
                curNode = matches[0];
            } else {
                break;
            }
        }

        return crumb;
    }

    const curPath = pathFromOption();
    const [node, setNode] = React.useState<NodeInfo>(curPath[curPath.length - 1]);
    const reload = () => {
        setCategory(component.id);
        setCurRoom(room.id);
        setBusy(false);
        setNode(curPath[curPath.length - 1]);
    }

    if (category !== component.id) {
        reload();
    } else if (room.id !== curRoom) {
        reload();
    }

    const buildPath = (opt: RoomOption) => {
        if (!opt.breadcrumb) {
            return [];
        } else {
            return [...opt.breadcrumb];
        }
    }

    const buildCrumb = (ids: string[]) => {
        let crumb = [];
        let curNode = component;
        for (let i = 0; i < ids.length; i++) {
            const matches = curNode.children.filter(item => item.id === ids[i]);
            if (matches.length === 1) {
                crumb.push(matches[0].name);
                curNode = matches[0];
            } else {
                crumb = [];
                break;
            }
        }

        crumb.unshift(component.name);
        return crumb;
    }

    const render_des = (_des, classes) => {
        if(_des === null || _des === undefined || _des === "") return ""
        if(_des.length > DES_LIMIT_COUNT) {
            if(isExpandedDes !== true){
                return (
                    <React.Fragment>
                            <Box  className = {classes.description1}>
                                <ReactMarkdown
                                    source={_des.substr(0,DES_LIMIT_COUNT)}
                                    skipHtml={false}
                                    escapeHtml={false}
                                />
                            </Box>
                            <span className = {classes.showMoreLess}
                                onClick = {() => {
                                    setIsExpandedDes(true)
                                }}
                            >&nbsp;...more</span>
                    </React.Fragment>
                )
            } else {
                return (
                    <React.Fragment>
                            <Box  className = {classes.description1}>
                                <ReactMarkdown
                                    source={_des}
                                    skipHtml={false}
                                    escapeHtml={false} 
                                />
                            </Box>
                            <span className = {classes.showMoreLess}
                                onClick = {() => {
                                    setIsExpandedDes(false)
                                }}
                            >&nbsp; less</span>
                    </React.Fragment>
                )
            }
        } else {
            return _des
        }
    }
    return (
        <Box className={classes.root}>
            <List>
                <ListItem>
                    <Box className={classes.title}>
                        {`${component.name} ( `}
                        {
                            render_des(component.description, classes)
                        }
                        {` )`}
                    </Box>
                </ListItem>
                <Divider />
                {/* <ListItem>
                    <Breadcrumbs>
                        {path.map(item => (
                            <Link key={item.id} onClick={() => clickCrumb(item)} style={{ cursor: 'pointer' }}>
                                {item.name}
                            </Link>
                        ))}
                    </Breadcrumbs>
                </ListItem> */}
                <ListItem style = {{alignItems:"none"}}>
                    <Box style = {{display:"flex"}}>
                        <Box>
                            {/* <FormControl variant="outlined" style = {{width:"400px"}}>
                                <NativeSelect
                                    style={{ minWidth: 180 }}
                                    placeholder={node && node.name}
                                    value={node.id}
                                    onChange={nodeChange}
                                    name="sub-nodes"
                                    className={classes.catBox}
                                    input = {<BootstrapInput/>}
                                >
                                    <option value={node.id} key={node.id}>
                                        {(!node.children || node.children.length === 0) ? node.name : `Select option for ${node.name}`}
                                    </option>
                                    {node && node.children && node.children.map(item => (
                                        <option value={item.id} key={item.id}>
                                            {`  > ${item.name}`}
                                        </option>
                                    ))}
                                </NativeSelect>
                            </FormControl> */}
                            {room.selectionList && room.selectionList.filter(selection => component.id === selection.category.id).map(opt => (
                                <React.Fragment key={opt.id}>
                                    <Box>
                                        <Box style={{ width: '100%' }}>
                                            <Typography className={classes.subtitle} style = {{width:"350px"}}>
                                                {`Current Selection: < ${buildCrumb(buildPath(opt)).join(' / ')} >`}
                                            </Typography>
                                            <Box style={{ display: 'flex' }}>
                                                {opt.option  &&  Object.keys(opt.option).length > 0 &&  (
                                                    <Box  className={classes.fab}>
                                                        <Box>Additional Details</Box>
                                                    </Box>
                                                )}
                                            </Box>
                                            {opt.option  &&  Object.keys(opt.option).length > 0 && (
                                                <ul>
                                                    {Object.keys(opt.option).map(key => (
                                                        <li key={key} style={{ padding: 4, listStyleType: 'disc' }}>{`${key} : ${opt.option[key]}`}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </Box>
                                    </Box>
                                </React.Fragment>
                            ))}
                        </Box>
                        <Box className={classes.subtitle1}>
                            <Box>
                                <ReactMarkdown
                                    source={node.description}
                                    skipHtml={false}
                                    escapeHtml={false}
                                    plugins = {[breaks]}
                                />
                            </Box>
                        </Box>
                    </Box>
                </ListItem>
               

            </List>
            {busy && <CircularProgress className={classes.busy} />}
        </Box>
    );
};

export default Section;
