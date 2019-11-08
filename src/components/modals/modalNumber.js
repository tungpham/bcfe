import React from 'react';
import {Grid, Typography, InputAdornment } from '@material-ui/core';
 
import TextField from '@material-ui/core/TextField';
 
import FormControl from '@material-ui/core/FormControl';
 

function ModalNumber() {
  
    return (
        
                                <Grid className="service-modal-col" item xs={10}  >
                                    <Typography variant="h5">
                                        What's the best phone number for you? 
                                 </Typography>
                                    <Typography variant="body1">
                                    Up to 5 matched pros may contact you to discuss your project using the information you provided
                                 </Typography>
                                 <FormControl style={{width:'100%'}}>
                                 <TextField
                                        fullWidth
                                        label="345345345"
                                        id="filled-full-width"
                                        margin="normal"
                                        variant="outlined" 
                                        inputProps={{ 'aria-label': 'Name'}}
                                    />
                                    <Typography variant="body1">
                                    by clicking or tapping "request quotes". i agree to recieve text messages and call about my
                                    project under the Houzz Terms of use.The Houzz Privacy policy applies.

                                 </Typography>  
                                 </FormControl>
                                 
                                </Grid>
                            
    );
}
export default ModalNumber;