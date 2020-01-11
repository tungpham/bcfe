import { createStyles, Theme } from '@material-ui/core/styles';

const drawerWidth = 240;

export default (theme: Theme) =>
	createStyles({
		grow: {
			flexGrow: 1,
			fontWeight: 600,
			fontSize: '2.1rem',
		},
		avatar: {
			width: theme.spacing(4),
			height: theme.spacing(4),
		},
		title: {
			display: 'none',
			padding: theme.spacing(0, 2),
			flexGrow: 1,
			[theme.breakpoints.up('sm')]: {
				display: 'block',
			},
		},
		menuButton: {
			marginRight: 36,
		},
		menuButtonHidden: {
			display: 'none',
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
		toolbar: {
			paddingRight: 24, // keep right padding when drawer closed
		},
		toolbarIcon: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			padding: '0 8px',
			...theme.mixins.toolbar,
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
		},
		appBarShift: {
			marginLeft: drawerWidth,
			// width: `calc(100% - ${drawerWidth}px)`,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		sectionDesktop: {
			display: 'none',
			[theme.breakpoints.up('md')]: {
				display: 'flex',
			},
		},
		sectionMobile: {
			display: 'flex',
			[theme.breakpoints.up('md')]: {
				display: 'none',
			},
		},
		profilemenu: {
			top: '50px',
		},
		drawerPaperRoot: {
			display: 'flex',
			flexDirection: 'column',
			backgroundColor:' #E9EDF5'
		},
		drawerPaper: {
			position: 'relative',
			whiteSpace: 'nowrap',
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		drawerPaperClose: {
			overflowX: 'hidden',
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(0),
			[theme.breakpoints.up('sm')]: {
				width: '50px',
			},
		},
	});
