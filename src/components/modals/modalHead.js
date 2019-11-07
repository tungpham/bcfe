import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';





function ModalHead(props) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();

    const useStyles = makeStyles({
        root: {
            maxWidth: 1200,
            flexGrow: 1,
        },
    });
    const classes = useStyles();
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };
    return (
        <div>sgh</div>
    );
}
export default ModalHead;