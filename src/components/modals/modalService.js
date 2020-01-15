import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import '../../assets/css/conflictRemove.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function ModalService(props) {
    
    const handleToggle = id => (event) => {
        const currentIndex = id;
        if (currentIndex === '0') {
            props.serviceCallbackvalue1(event.target.value); // For Passing the value to modal series(child to parent)
            if (event.target.checked === false) {
                props.serviceCallbackvalue1('');
            }
        } else {
            props.serviceCallbackvalue2(event.target.value); // For Passing the value to modal series(child to parent)
            if (event.target.checked === false) {
                props.serviceCallbackvalue2('');
            }
        }
    };
    return (
        <React.Fragment>
            <Grid className="service-modal-col city-head-text font-weight" item xs={10}>
                <Typography className="heading-service" variant="h5">
                    Which Service(s) are you Looking for?
            </Typography>
                <Typography className="service-sub-text" variant="body1">
                    Select all that Apply
            </Typography>
                <List className="service-modal-list">
                    <FormGroup aria-label="position" row>
                        <ListItem className="list-border" dense button  >
                            <FormControlLabel
                                checked={props.data[5] === "Design" ? true : false}
                                value="Design"
                                control={<Checkbox style={{
                                    color: "green",
                                }} />}
                                label="Design Service"
                                onChange={handleToggle('0')}
                            />
                        </ListItem>
                        <ListItem className="list-border" dense button  >
                            <FormControlLabel
                                checked={props.data[6] === "Construction" ? true :false}
                                value="Construction"
                                control={<Checkbox style={{
                                    color: "green",
                                }} />}
                                label="Construction Service"
                                onChange={handleToggle('1')}
                            />
                        </ListItem>

                    </FormGroup>
                </List>
                <p className='red font'>{props.errorMessage}</p>
            </Grid>
        </React.Fragment>
    );
}
export default ModalService;