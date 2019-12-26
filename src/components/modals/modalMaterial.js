import React from 'react';
import { Grid, Typography, FormControlLabel } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import RadioGroup from '@material-ui/core/RadioGroup';

function ModalMaterial(props) {
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
        props.MaterialCallback(event.target.value); // For Passing the value to modal series(child to parent)
    };
    return (
        <Grid container spacing={2}>
            <Grid className="service-modal-col" item xs={10}>
                <Typography className="city-head-text font-weight text-left" variant="h5">
                    Do you provide the material?</Typography>
                <List className="service-modal-list">
                    <RadioGroup aria-label="gender" name="gender1" onChange={handleChange}>
                        <ListItem className="list-border" role={undefined} dense button  >
                            <FormControlLabel checked={props.data[4] === 'Yes'}
                                value="Yes"
                                control={<GreenRadio />}
                                label="Yes"
                                name="radio-button-demo"
                                 
                            />
                        </ListItem>
                        <ListItem className="list-border" role={undefined} dense button  >
                            <FormControlLabel checked={props.data[4] === 'No'}
                                value="No"
                                control={<GreenRadio />}
                                label="No"
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
export default ModalMaterial;