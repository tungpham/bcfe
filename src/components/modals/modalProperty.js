import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';

function ModalProperty(props) {
    const [validationMessage, setValidationMessage] = useState('');
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
        props.propertyCallback(event.target.value);
    };

    return (
        <Grid container spacing={2}>
            <Grid className="service-modal-col" item xs={8}>
                <Typography className="city-head-text font-weight text-left" variant="h5">
                    what type of property is this?
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
                        <ListItemText primary={`House`} />
                    </ListItem>
                    <ListItem className="list-border" role={undefined} dense button  >
                        <GreenRadio
                            checked={selectedValue === 'b'}
                            onChange={handleChange}
                            value="b"
                            name="radio-button-demo"
                            inputProps={{ 'aria-label': 'b' }}
                        />
                        <ListItemText primary={`Apartment`} />
                    </ListItem>
                    <ListItem className="list-border" role={undefined} dense button  >
                        <GreenRadio
                            checked={selectedValue === 'c'}
                            onChange={handleChange}
                            value="c"
                            name="radio-button-demo"
                            inputProps={{ 'aria-label': 'C' }}
                        />
                        <ListItemText primary={`Condominium`} />
                    </ListItem>
                    <ListItem className="list-border" role={undefined} dense button  >
                        <GreenRadio
                            checked={selectedValue === 'd'}
                            onChange={handleChange}
                            value="d"
                            name="radio-button-demo"
                            inputProps={{ 'aria-label': '' }}
                        />
                        <ListItemText primary={`Townhouse`} />
                    </ListItem>
                    <ListItem className="list-border" role={undefined} dense button  >
                        <GreenRadio
                            checked={selectedValue === 'e'}
                            onChange={handleChange}
                            value="e"
                            name="radio-button-demo"
                            inputProps={{ 'aria-label': 'e' }}
                        />
                        <ListItemText primary={`Other`} />
                    </ListItem>
                </List>
                <p className='red'>{props.errorMessage}</p>
            </Grid>
        </Grid>
    );
}
export default ModalProperty;