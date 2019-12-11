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
    }

    const getInputValue = () => {
        var inputVal = document.getElementById("outlined-bare").value;
        props.parentCallback(inputVal);
    }

    return (
        <Grid className="service-modal-col" item xs={10} >
            <Typography className="city-head-text" variant="h5">
                Answer a few question to get matched professionals near you
                 </Typography>
            <Typography className="city-sub-text" variant="body1">
                Please confirm your project zipcode
                </Typography>
            <FormControl className="width100">
                <TextField
                    id="outlined-bare"
                    value={value}
                    onChange={handelchange}
                    onBlur={getInputValue}
                    margin="normal"
                    variant="outlined"
                    autoComplete="off"
                    inputProps={{ 'aria-label': 'bare' }}
                    required
                />
                {value.length === 0 ? <p className='red'>{props.errorMessage}</p> : ''}
                <div></div>
            </FormControl>
        </Grid>
    );
}
export default ModalCity;