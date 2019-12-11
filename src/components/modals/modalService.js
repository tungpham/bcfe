import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import '../../assets/css/conflictRemove.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

function ModalService(props) {
    const [checked, setChecked] = React.useState([]);

    const newData = props.data[5];
    const a = newData[0];
    const b = newData[1];
    const [state, setState] = React.useState({
        DesignService: false,
        ConstructionService: false,
    });

    // const handleToggle = value => (event) => {
        // const currentIndex = checked.indexOf(event.target.value);
        // const newChecked = [...checked];


        // if (currentIndex === -1) {
        //     newChecked.push(event.target.value);

        // } else {
        //     newChecked.splice(currentIndex, 1);

        // } 
        // setChecked(newChecked);
        // props.serviceCallback(newChecked);
    // };


    const handleChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
        const { DesignService, ConstructionService } = state;
        const currentIndex = checked.indexOf(event.target.value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(event.target.value);

        } else {
            newChecked.splice(currentIndex, 1);

        } 
        setChecked(newChecked);
        props.serviceCallback(newChecked);
        // console.log("va",newChecked);
    };

    const { DesignService, ConstructionService } = state;
    // console.log('d', DesignService);
    // console.log('c', ConstructionService);
    
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
                                checked={DesignService}
                                value="Design Service"
                                control={<Checkbox style={{
                                    color: "green",
                                }} />}
                                label="Design Service"
                                onChange={handleChange('DesignService')}
                            />
                        </ListItem>
                        <ListItem className="list-border" dense button  >
                            <FormControlLabel
                                checked={ConstructionService}
                                value="Construction Service"

                                control={<Checkbox style={{
                                    color: "green",
                                }} />}
                                label="Construction Service"
                                onChange={handleChange('ConstructionService')}
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