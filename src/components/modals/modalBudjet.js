import React,{useState} from 'react';
import { Grid, Typography, InputAdornment, FormControlLabel } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { green } from '@material-ui/core/colors';
import Radio from '@material-ui/core/Radio';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';

function ModalBudjet(props) {
    const [value, setvalue] = useState('');
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
        props.budjetCallback(event.target.value); // For Passing the value to modal series(child to parent)
    };

    const handleChangevalue=(e)=>{
        const newvalue = e.target.value; //get value for text field
        setvalue(newvalue); //set value
    }

    const getInputValue = () => {
        var inputVal = document.getElementById("filled-full-width").value; //get value
        props.budjetCallbackvalue(inputVal); // For Passing the value to modal series(child to parent)
    }
    return (
        <Grid className="service-modal-col" item xs={10}>
            <Typography className="city-head-text font-weight text-left" variant="h5">
                What is your budget for this Project?
            </Typography>
            <Typography color="textSecondary" variant="body1">
                Enter Yout Budget will help us contect you with the right pro
          </Typography>
            <FormControl className="width100">
                <TextField
                    id="filled-full-width"
                    margin="normal"
                    value={value}
                    onChange={handleChangevalue}
                    onBlur={getInputValue}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AttachMoneyIcon  className="dollar"/>
                            </InputAdornment>
                        ),
                    }}
                />
                 {/* <p className='red'>{props.errorMessage}</p> */}
            </FormControl>
            <Typography color="textSecondary" variant="body1">
                Or Select from the following option.
            </Typography>
            <List className="service-modal-list list-overflow" onChange={handleChange} >
           <RadioGroup aria-label="gender" name="gender1" >
                       <ListItem className="list-border" role={undefined} dense button  >
                           <FormControlLabel checked={props.data[3] === 'I m Not sure'}
                               value="I m Not sure"
                               control={<GreenRadio />}
                               label="I m Not sure"
                               name="radio-button-demo"
                           />
                       </ListItem>
                       <ListItem className="list-border" role={undefined} dense button  >
                       <FormControlLabel checked={props.data[3] === 'Less then $12,000'}
                               value="Less then 12,000"
                               control={<GreenRadio />}
                               label="Less then $12,000"
                               name="radio-button-demo"
                           />
                       </ListItem>
                       <ListItem className="list-border" role={undefined} dense button  >
                       <FormControlLabel checked={props.data[3] === '$12000-$50000'}
                               value="12000-50000"
                               control={<GreenRadio />}
                               label="$12000-$50000"
                               name="radio-button-demo"
                           />
                       </ListItem>
                       <ListItem className="list-border" role={undefined} dense button  >
                       <FormControlLabel checked={props.data[3] === '$50000-$100000'}
                               value='50000-100000'
                               control={<GreenRadio />}
                               label="$50000-$100000"
                               name="radio-button-demo"
                           />
                       </ListItem>
                       <ListItem className="list-border" role={undefined} dense button  >
                       <FormControlLabel checked={props.data[3] === 'More then $10000'}
                               value="More then 10000"
                               control={<GreenRadio />}
                               label="More then $10000"
                               name="radio-button-demo"
                           />
                       </ListItem>
                   </RadioGroup>
               <p className='red'>{props.errorMessage}</p>
           </List>
        </Grid>
    );
}
export default ModalBudjet;