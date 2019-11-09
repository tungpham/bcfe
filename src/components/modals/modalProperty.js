import React from 'react';
import { Grid, Typography, FormControlLabel } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import RadioGroup from '@material-ui/core/RadioGroup';

function ModalProperty(props) {
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
            <Grid className="service-modal-col" item xs={10}>
                <Typography className="city-head-text font-weight text-left" variant="h5">
                    What type of property is this?
                </Typography>
                <List className="service-modal-list" onChange={handleChange}>
                    <RadioGroup aria-label="gender" name="gender1" >
                        <ListItem className="list-border" role={undefined} dense button  >
                            <FormControlLabel checked={selectedValue === 'House'}
                                value="House"
                                control={<GreenRadio />}
                                label="House"
                                name="radio-button-demo"
                                
                            />
                        </ListItem>
                        <ListItem className="list-border" role={undefined} dense button  >
                            <FormControlLabel checked={selectedValue === 'Apartment'}
                                value="Apartment"
                                control={<GreenRadio />}
                                label="Apartment"
                                name="radio-button-demo"
                                
                            />
                        </ListItem>
                        <ListItem className="list-border" role={undefined} dense button  >
                            <FormControlLabel checked={selectedValue === 'Condominium'}
                                value="Condominium"
                                control={<GreenRadio />}
                                label="Condominium"
                                name="radio-button-demo"
                                 
                            />
                        </ListItem>
                        <ListItem className="list-border" role={undefined} dense button  >
                            <FormControlLabel checked={selectedValue === 'Townhouse'}
                                value="Townhouse"
                                control={<GreenRadio />}
                                label="Townhouse"
                                name="radio-button-demo"
                                 
                            />
                        </ListItem>
                        <ListItem className="list-border" role={undefined} dense button  >
                            <FormControlLabel checked={selectedValue === 'Other'}
                                value="Other"
                                control={<GreenRadio />}
                                label="Other"
                                name="radio-button-demo"
                                
                            />
                        </ListItem>
                    </RadioGroup>
                </List>
                <p className='red'>{props.errorMessage}</p>
            </Grid>
        </Grid>
    );
}
export default ModalProperty;
