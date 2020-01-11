import React from 'react';
import clsx from 'clsx';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import auth0Client from 'services/auth0/auth';
import { History } from 'history';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SendIcon from '@material-ui/icons/Send';
import { MaterialThemeHOC, UserProfile } from 'types/global';
import styles from './Header.style';
import MenuList from '../MenuList';
import { Menu, MenuItem } from '@material-ui/core';
import { MenuProps } from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import  ContApis from 'services/contractor';
const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5',
	},
})((props: MenuProps) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		{...props}
	/>
));

interface HeaderProps extends MaterialThemeHOC {
	profile: UserProfile;
	history: History;
}

interface HeaderState {
	anchorEl: null | HTMLElement;
	mobileMoreAnchorEl: React.ReactNode;
	open: boolean;
	avartaImg: string;
}

class Header extends React.Component<HeaderProps, HeaderState> {
	constructor(props: any) {
		super(props);
		this.state = {
			anchorEl: null,
			mobileMoreAnchorEl: null,
			open: true,
			avartaImg: ""
		};
	}

	resizedWindow = () => {
		const open: boolean = window.innerWidth > 960;
		if (open !== this.state.open) {
			this.setState({ open });
		}
	}

	componentDidMount() {
		const open: boolean = window.innerWidth > 960;
		this.setState({ open });
		window.addEventListener('resize', this.resizedWindow);
	}
    componentDidUpdate(prevProps:HeaderProps){
			if(prevProps.profile.user_metadata.contractor_id !== this.props.profile.user_metadata.contractor_id)
			{
				console.log("updated")
			}
	}
	UNSAFE_UNSAFE_componentWillMount() {
		window.removeEventListener('resize', this.resizedWindow);
	}

	handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuClose = () => {
		this.setState({ anchorEl: null });
		this.handleMobileMenuClose();
	};

	handleMobileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		this.setState({ mobileMoreAnchorEl: event.currentTarget });
	};

	handleMobileMenuClose = () => {
		this.setState({ mobileMoreAnchorEl: null });
	};

	handleUserLogIn = () => {
		auth0Client.signIn();
	};

	handleUserLogOut = () => {
		localStorage.clear();
		auth0Client.signOut();
		this.handleMenuClose();
	};

	handleDrawerOpen = () =>
		this.setState({
			open: true,
		});

	handleDrawerClose = () =>
		this.setState({
			open: false,
		});

	handleClose = () =>
		this.setState({
			anchorEl: null,
		});
	imageExists1 = (url) => {
		if(this.state.avartaImg === "" && this.props.profile.user_metadata.contractor_id){
			var img = new Image();
			img.src = url;
			var _that = this;
			img.onload = function() { 
				if(_that.state.avartaImg !== url)
				{
					_that.setState({
						avartaImg: url
					})
				}
			};
			img.onerror = function() { 
				var imgUrl = "https://ui-avatars.com/api/?name=" + _that.props.profile.email.split("@")[0];
				if(_that.state.avartaImg !== imgUrl)
				{
					_that.setState({
						avartaImg: imgUrl
					})
				}
			};
		}
		
	}
	render() {
		const { anchorEl, open } = this.state;
		const { classes } = this.props;
		const isMenuOpen = Boolean(anchorEl);
		const avatarImg = ContApis.getAvatar(this.props.profile.user_metadata.contractor_id);
		this.imageExists1(avatarImg)
		const rightApp = auth0Client.isAuthenticated() ? (
			<div className="rightmenu">
				<div className={classes.sectionDesktop}>
					<IconButton color="inherit" style = {{marginRight:"20px"}}>
						<Badge badgeContent={17} color="secondary">
							<NotificationsIcon className="notification" />
						</Badge>
					</IconButton>
					<StyledMenu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
					
						open={Boolean(anchorEl)}
						onClose={this.handleClose}
					>
						<MenuItem component={Link} to={"/profile"}
							onClick = {this.handleClose}
							className = {classes.menuItem}
						>
							<ListItemIcon className = {classes.menuItemIcon}>
								<SendIcon fontSize="small"/>
							</ListItemIcon>
							<ListItemText primary="Profile" />
						</MenuItem>
						<MenuItem component={Link} to={"/settings"}
							 onClick = {this.handleClose}
							 className = {classes.menuItem}
						>
							<ListItemIcon  className = {classes.menuItemIcon}>
								<SettingsIcon fontSize="small"/>
							</ListItemIcon>
							<ListItemText primary="Settings" />
						</MenuItem>
						<MenuItem onClick={()=>{this.handleUserLogOut(); this.handleClose();}}
							className = {classes.menuItem}
						>
							<ListItemIcon  className = {classes.menuItemIcon}>
								<ExitToAppIcon fontSize="small"/>
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</MenuItem>
					</StyledMenu>

					<Typography className="righttitle" variant="h6" noWrap>
						{this.props.profile.email}
					</Typography>
					<IconButton
						aria-owns={isMenuOpen ? 'material-appbar' : undefined}
						aria-haspopup="true"
						aria-controls="simple-menu"
						onClick={this.handleProfileMenuOpen}
						color="inherit"
						style = {{boxShadow:'0px 0px 10px rgba(0,0,0,0.2)', marginLeft:'10px', width:"32px", height:"32px", padding:"0"}}
					>
						{
							this.state.avartaImg !== "" ? (
								<Avatar alt="user-avatar" src={this.state.avartaImg} className = {classes.avatar}/>
							) : ( null)
						}
					
					</IconButton>
				</div>
				<div className={classes.sectionMobile}>
					<IconButton
						aria-haspopup="true"
						onClick={this.handleMobileMenuOpen}
						color="inherit"
					>
						<MoreIcon />
					</IconButton>
				</div>
			</div>
		) : (
				<Button color="inherit" onClick={this.handleUserLogIn}>
					Login
      			</Button>
			);

		return (
			<>
				<AppBar
					position="absolute"
					className={clsx(classes.appBar, open && classes.appBarShift)}
					style={{ boxShadow: 'none', backgroundColor: 'white' }}>
					<Toolbar className="myheader" style={{minHeight:47}}>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							className={classes.title}
						>
							LOGO NAME
            			</Typography>
						{rightApp}
					</Toolbar>
				</AppBar>
				<div className="drawer" onMouseOver={this.handleDrawerOpen}
					onMouseLeave={this.handleDrawerClose}>
					<Drawer
						variant="permanent"
						classes={{
							root: classes.drawerPaperRoot,
							paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
						}}
						open={open}
					>
						{/* paper: clsx("MuiPaper-root.MuiPaper-elevation0.MuiDrawer-paper.MuiDrawer-paperAnchorLeft.MuiDrawer-paperAnchorDockedLeft" ,!open && "MuiPaper-root MuiPaper-elevation0 MuiDrawer-paper withRouter(Connect(Header))-drawerPaper-32 withRouter(Connect(Header))-drawerPaperClose-33 MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft"), */}
						<MenuList />
					</Drawer>
				</div>
			</>
		);
	}
}

const mapStateToProps = (state: any) => ({
	profile: state.global_data.userProfile,
});

export default compose(
	withStyles(styles),
	withRouter,
	connect(mapStateToProps),
)(Header);
