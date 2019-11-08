import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import '../../assets/css/conflictRemove.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

function ModalService(props) {
    const [checked, setChecked] = React.useState([false]);
    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        props.serviceCallback(newChecked);
    };
    return (
        <Grid className="service-modal-col city-head-text font-weight" item xs={10}>
            <Typography className="heading-service" variant="h5">
                Which Service(s) are you Looking for?
            </Typography>
            <Typography className="service-sub-text" variant="body1">
                Select all that Apply
            </Typography> <List className="service-modal-list">
                <ListItem className="list-border" role={undefined} dense button onClick={handleToggle()}>
                    <ListItemIcon className="service-modal-icon-color">
                        <Checkbox
                            className="service-checkbox-color"
                            edge="start"
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': 1 }} />
                    </ListItemIcon>
                    <ListItemText id="1" primary="Design Service" />
                </ListItem>
                <ListItem className="list-border" role={undefined} dense button onClick={handleToggle()}>
                    <ListItemIcon className="service-modal-icon-color">
                        <Checkbox
                            className="service-checkbox-color"
                            edge="start"
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': 1 }}
                        />
                    </ListItemIcon>
                    <ListItemText id="2" primary="Construction Service" />
                </ListItem>
            </List>
            <p className='red font'>{props.errorMessage}</p>
        </Grid>
    );
}
export default ModalService;