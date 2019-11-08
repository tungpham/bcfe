import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import '../../assets/css/modal.css';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

function ModalCity(props) {
    const [value, setvalue] = useState('');
    const handelchange = (e) => {
        const newvalue = e.target.value;
        setvalue(newvalue);
        props.parentCallback(newvalue);
    }
    return (

        <Grid className="service-modal-col text-center" item xs={10} >
            <Typography className="city-head-text" variant="h5">
                Answer a few question to get matched professionals near you
                 </Typography>
            <Typography className="city-sub-text" variant="body1">
                Please confirm your project zipcode
                </Typography>
            <FormControl>
                <TextField
                    id="outlined-bare"
                    value={value}
                    onChange={handelchange}
                    margin="normal"
                    variant="outlined"
                    autoComplete="off"
                    inputProps={{ 'aria-label': 'bare' }}
                    required
                />
                <p className='red'>{props.errorMessage}</p>
                <div></div>
            </FormControl>
        </Grid>
    );
}
export default ModalCity;