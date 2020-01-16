import React from 'react';
import { Grid, Typography, FormControlLabel } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import RadioGroup from '@material-ui/core/RadioGroup';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';

function ModalArea(props) {

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
        props.areaCallback(event.target.value);// pass value to modal searies
    };
    return (
        <Grid className="service-modal-col" item xs={10}>
            <Typography className="city-head-text font-weight text-left" variant="h5">
                What is the estimated square footage of the area that needs flooring?
             </Typography>
            <List className="service-modal-list" onChange={handleChange}>
                <RadioGroup aria-label="gender" name="gender1" >
                    <ListItem className="list-border" role={undefined} dense button  >
                        <FormControlLabel checked={props.data[2] === '0-500'}
                            value="0-500"
                            control={<GreenRadio />}
                            label="Less then 500"
                            name="radio-button-demo"
                             />
                    </ListItem>
                    <ListItem className="list-border" role={undefined} dense button  >
                        <FormControlLabel checked={props.data[2] === '500-1000'}
                            value="500-1000"
                            control={<GreenRadio />}
                            label="500-1000"
                            name="radio-button-demo"
                             
                        />
                    </ListItem>
                    <ListItem className="list-border" role={undefined} dense button  >
                        <FormControlLabel checked={props.data[2] === '1000-2000'}
                            value="1000-2000"
                            control={<GreenRadio />}
                            label="1000-2000"
                            name="radio-button-demo"
                             
                        />
                    </ListItem>
                    <ListItem className="list-border" role={undefined} dense button  >
                        <FormControlLabel checked={props.data[2] === '2000-3000'}
                            value="2000-3000"
                            control={<GreenRadio />}
                            label="2000-3000"
                            name="radio-button-demo"
                             
                        />
                    </ListItem>
                    <ListItem className="list-border" role={undefined} dense button  >
                        <FormControlLabel checked={props.data[2] === '3000-inf'}
                            value="3000-inf"
                            control={<GreenRadio />}
                            label="More then 3000"
                            name="radio-button-demo"
                             
                        />
                    </ListItem>
                </RadioGroup>
            </List>
            <p className='red'>{props.errorMessage}</p>
        </Grid>
    );
}
export default ModalArea;