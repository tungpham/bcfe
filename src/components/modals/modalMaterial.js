import React,{useState} from 'react';
import { Grid, Typography } from '@material-ui/core';
 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
 
import ListItemText from '@material-ui/core/ListItemText';
 
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';

import { makeStyles} from '@material-ui/core/styles';



function ModalMaterial(props) {
    const [validationMessage, setValidationMessage] = useState('');
    const [selectedValue, setSelectedValue] = React.useState(' '); 
    const useStyles = makeStyles({
        root: {
            maxWidth: 1200,
            flexGrow: 1,
        },
    });
    const classes = useStyles();


    const GreenRadio = withStyles({
        root: {
            color: green[400],
            '&$checked': {
                color: green[600],
            },
        },
        checked: {},
    })(props => <Radio color="default" {...props} />);

    const handleChange = event => {
        setSelectedValue(event.target.value);
        props.MaterialCallback(event.target.value);
    };
    const [activeStep, setActiveStep] = React.useState(0);
    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };
    return (
        <Grid container spacing={2}>
            <Grid className="service-modal-col" item xs={8}>
                <Typography className="city-head-text font-weight text-left" variant="h5">
                   Will you Provide the flooring for this project?
                                 </Typography>
                <List className="service-modal-list">
                    <ListItem className="list-border" role={undefined} dense button  >

                        <GreenRadio
                            checked={selectedValue === 'a'}
                            onChange={handleChange}
                            value="a"
                            name="radio-button-demo"
                            inputProps={{ 'aria-label': 'a' }}
                        />
                        <ListItemText primary={`Yes`} />
                    </ListItem>
                    <ListItem className="list-border" role={undefined} dense button  >
                        <GreenRadio
                            checked={selectedValue === 'b'}
                            onChange={handleChange}
                            value="b"
                            name="radio-button-demo"
                            inputProps={{ 'aria-label': 'b' }}
                        />
                        <ListItemText primary={`No`} />
                    </ListItem> 
                </List>
                <p className='red'>{props.errorMessage}</p>
            </Grid>
        </Grid>


    );
}
export default ModalMaterial;