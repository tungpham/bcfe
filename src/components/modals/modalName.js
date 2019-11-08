import React from 'react';
import { Grid, Typography, InputAdornment } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';

import FormControl from '@material-ui/core/FormControl';


function ModalName() {

    return (

        <Grid className="service-modal-col" item xs={10}  >
            <Typography variant="h5">
                We found matching pros!
                                 </Typography>
            <Typography variant="body1">
                Seee result for 54434. Tell us your name
                                 </Typography>
            <FormControl style={{ width: '100%' }}>
                <TextField
                    fullWidth
                    label="Name"
                    id="filled-full-width"
                    margin="normal"
                    variant="outlined"
                    inputProps={{ 'aria-label': 'Name' }}
                />

            </FormControl>

        </Grid>

    );
}
export default ModalName;