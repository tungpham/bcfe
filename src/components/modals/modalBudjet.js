import React,{useState} from 'react';
import { Grid, Typography, InputAdornment } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import ListItemText from '@material-ui/core/ListItemText';

import Button from '@material-ui/core/Button';

import Divider from '@material-ui/core/Divider';

import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import FormControl from '@material-ui/core/FormControl';

function ModalBudjet(props) {
    const [validationMessage, setValidationMessage] = useState('')
    const [selectedValue, setSelectedValue] = React.useState('');
    const [value, setvalue] = useState('');
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
        props.budjetCallback(event.target.value);
    };
    const handleChangevalue=(e)=>{
        const newvalue = e.target.value;
        setvalue(newvalue);
        props.budjetCallbackvalue(newvalue);
    }
    return (
        <Grid className="service-modal-col" item xs={8}  >
            <Typography className="city-head-text font-weight text-left" variant="h5">
                what is your budget for this Project?
            </Typography>
            <Typography color="textSecondary" variant="body1">
                Enter Yout Budget will help us contect you with the right pro
          </Typography>
            <FormControl className="width100">
                <TextField
                    // fullwidth
                    id="filled-full-width"
                    id="outlined-bare"
                    margin="normal"
                    value={value}
                    onChange={handleChangevalue}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AttachMoneyIcon  className="dollar"/>
                            </InputAdornment>
                        ),
                    }}
                />
                 <p className='red'>{props.errorMessage}</p>
            </FormControl>
            <Typography color="textSecondary" variant="body1">
                Or Select from the following option.
            </Typography>
            <List className="service-modal-list list-overflow" >
                <ListItem className="list-border" role={undefined} dense button  >
                    <GreenRadio
                        checked={selectedValue === 'a'}
                        onChange={handleChange}
                        value="a"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'a' }}
                    />
                    <ListItemText primary={`I'm Not sure`} />
                </ListItem>
                <ListItem className="list-border" role={undefined} dense button  >
                    <GreenRadio
                        checked={selectedValue === 'b'}
                        onChange={handleChange}
                        value="b"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'b' }}
                    />
                    <ListItemText primary={`Less then $12,000`} />
                </ListItem>
                <ListItem className="list-border" role={undefined} dense button  >
                    <GreenRadio
                        checked={selectedValue === 'c'}
                        onChange={handleChange}
                        value="c"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'C' }}
                    />
                    <ListItemText primary={`$12000-$50000`} />
                </ListItem>

                <ListItem className="list-border" role={undefined} dense button  >
                    <GreenRadio
                        checked={selectedValue === 'd'}
                        onChange={handleChange}
                        value="d"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': '' }}
                    />
                    <ListItemText primary={`$50000-$100000`} />
                </ListItem>
                <ListItem className="list-border" role={undefined} dense button  >
                    <GreenRadio
                        checked={selectedValue === 'e'}
                        onChange={handleChange}
                        value="e"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'e' }}
                    />
                    <ListItemText primary={`More then $10000`} />
                </ListItem>
                <p className='red'>{props.errorMessage}</p>
            </List>
            
        </Grid>
    );
}
export default ModalBudjet;