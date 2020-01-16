import React, { useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import DoneIcon from '@material-ui/icons/Done';

function ModalDisc(props) {
    const [value, setvalue] = useState('');
    const [char, setChar] = useState(0);

    const handelchange = (e) => {
        const newvalue = e.target.value; //get the value
        const charLength = e.target.value.length; //Get the charecter Length
        setChar(charLength);
        setvalue(newvalue); //set Value
    }

    const getInputValue = () => {
        var inputVal = document.getElementById("filled-full-width").value;
        props.discCallback(inputVal); // For Passing the value to modal series(child to parent).
    }

    return (
        <Grid className="service-modal-col" item xs={10}  >
            <Typography className="city-head-text font-weight text-left bootom" variant="h5">
                Anything else the pro should know to provide the best service/quote for you?
           </Typography>

            <FormControl className="width100" style={{height:'270px'}}>
                <TextareaAutosize
                    id="filled-full-width"
                    value={value}
                    onChange={handelchange}
                    onBlur={getInputValue}
                    style={{ minHeight: '170px', color: ' #bbb', fontSize:"14px" }}
                    rowsMax={14}
                    rows = {14}
                    aria-label="maximum height"
                    placeholder="Minimum 10 rows"

                />
                <p className='red'>{props.errorMessage}</p>
            </FormControl>
            <Grid item xs={12}>
                <Typography color="textSecondary" variant="inherit">
                    Charecters:{char}
                </Typography>
                <Typography className="city-sub-text" >
                    <DoneIcon className="right-icon" /> write at least 40 Charecters,
                                 </Typography>
                <Typography className="city-sub-text" >
                    <DoneIcon className="right-icon" /> Include spacific challenges or requirments.
                </Typography>

            </Grid>
        </Grid>
    );
}
export default ModalDisc;