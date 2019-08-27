import React          from 'react';
import { withStyles } from '@material-ui/core/styles';
import kitchen from '../../assets/images/kitchen.jpg';

const style = (theme) =>  ({
  root: {
   padding: theme.spacing(1)
  }
});

function HomeView({ classes }) {
  return (
      <>
    <div className={classes.root}>Welcome Home</div>
      <img src={kitchen}/>
      </>
  )
}

export default withStyles(style)(HomeView);
