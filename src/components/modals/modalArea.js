import React,{useState} from 'react';
import { Grid, Typography } from '@material-ui/core';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import ListItemText from '@material-ui/core/ListItemText';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';

function ModalService(props) {
    // const [open, setOpen] = React.useState(false);
    const [validationMessage, setValidationMessage] = useState('')
    const [selectedValue, setSelectedValue] = React.useState('');

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
        props.areaCallback(event.target.value);

    };
    return (
        <Grid className="service-modal-col" item xs={8}>
            <Typography className="city-head-text font-weight text-left" variant="h5">
                what is the estimated square footege of the area that needs flooring?
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
                    <ListItemText primary={`Less then 500`} />
                </ListItem>
                <ListItem className="list-border" role={undefined} dense button  >
                    <GreenRadio
                        checked={selectedValue === 'b'}
                        onChange={handleChange}
                        value="b"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'b' }}
                    />
                    <ListItemText primary={`500-1000`} />
                </ListItem>
                <ListItem className="list-border" role={undefined} dense button  >
                    <GreenRadio
                        checked={selectedValue === 'c'}
                        onChange={handleChange}
                        value="c"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'C' }}
                    />
                    <ListItemText primary={`1000-2000`} />
                </ListItem>

                <ListItem className="list-border" role={undefined} dense button  >
                    <GreenRadio
                        checked={selectedValue === 'd'}
                        onChange={handleChange}
                        value="d"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': '' }}
                    />
                    <ListItemText primary={`2000-3000`} />
                </ListItem>
                <ListItem className="list-border" role={undefined} dense button  >
                    <GreenRadio
                        checked={selectedValue === 'e'}
                        onChange={handleChange}
                        value="e"
                        name="radio-button-demo"
                        inputProps={{ 'aria-label': 'e' }}
                    />
                    <ListItemText primary={`More then 3000`} />
                </ListItem> 
            </List>
            <p className='red'>{props.errorMessage}</p>
        </Grid>



    );
}
export default ModalService;