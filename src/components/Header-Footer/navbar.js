import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PersonIcon from '@material-ui/icons/Person';
import { Icon } from '@material-ui/core';
import '../../assets/css/conflictRemove.css';
import auth0Client from 'services/auth0/auth';

function NavBar() {
    function handleUserLogIn() {
        auth0Client.signIn();
    };

    return (
        <div style={{marginBottom:'-4%'}}>
            <AppBar position="static"  className="beforeloginheader">
                <Toolbar style={{position:'unset'}}>
                    <Button className="btn default" color="inherit">
                        Logo Placeholder
                    </Button>
                    <Button color="inherit" onClick={handleUserLogIn} >
                        <Icon><PersonIcon className="person" style={{ color: 'black' }} /></Icon>
                        <Typography className="signin" style={{ textTransform: 'capitalize' }}>
                            Sign In
                        </Typography>
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}
export default NavBar;