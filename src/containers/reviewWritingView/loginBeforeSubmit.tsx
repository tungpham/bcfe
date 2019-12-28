import * as React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Formik } from "formik";
import * as Yup from "yup";
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from 'components/CustomButtons/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
//import actions;
import {submiteReview} from 'store/actions/global-actions';
interface LoginModalProps {
    show: boolean;
    hide: () => void;
    submiteReview: (id:String, params : any) => Promise<void>;    
    con_id: String;
    rating: string;
    qualities: String[];
    review: string;
    images: any;
}
interface LoginModalState {
    firstName: string;
    lastName:  String;
    email: String;
}
class LoginForSubmit extends React.Component<LoginModalProps, LoginModalState>{
    close = () => {
        this.props.hide();
    }
    render(){
        const {show} = this.props;
        return (
            <Dialog open={show} onClose={this.close} className = "login-modal">
                <DialogTitle className = "title">
                    <Typography >
                        {'Enter your information'}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                      <Formik
                        initialValues={{ firstName:"", lastName:"",email: ""}}
                        onSubmit={(values, { setSubmitting }) => {
                          let data = new FormData();
                                this.props.images.forEach((img) => {
                                    data.append('file', img)
                                })
								data.append('file', this.props.images)
								data.set('reviewerEmail',values.email);
								data.set('reviewerFirstName',values.firstName);
								data.set('reviewerLastName',values.lastName);
								data.set('rating', this.props.rating);
								data.set('qualities',this.props.qualities.toString());
								data.set('review', this.props.review);
                            this.props.submiteReview( this.props.con_id, data);
                            this.close();
                        }}
                        validationSchema={Yup.object().shape({
                        firstName: Yup.string().required("Please enter your first name"),
                        lastName:  Yup.string().required("Please enter your last name"),
                        email: Yup.string()
                            .email()
                            .required("Required"),
                        })}
                    >
                        {props => {
                        const {
                            values,
                            touched,
                            errors,
                            handleChange,
                            handleBlur,
                            handleSubmit
                        } = props;
                        return (
                            <form onSubmit={handleSubmit} className = "content">
                                <TextField
                                    variant = "outlined"
                                    fullWidth
                                    name="firstName"
                                    type="text"
                                    placeholder="Enter your first name"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style = {{margin:"10px 0px"}}
                                />
                                {errors.firstName && touched.firstName && (
                                    <Typography className="input-feedback">{errors.firstName}</Typography>
                                )}
                                <TextField
                                    variant = "outlined"
                                    fullWidth
                                    name="lastName"
                                    type="text"
                                    placeholder="Enter your last name"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style = {{margin:"10px 0px"}}
                                />
                                {errors.lastName && touched.lastName && (
                                    <Typography className="input-feedback">{errors.lastName}</Typography>
                                )}
                                <TextField
                                    variant = "outlined"
                                    fullWidth
                                    name="email"
                                    type="text"
                                    placeholder="Enter your email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style = {{margin:"10px 0px"}}
                                />
                                {errors.email && touched.email && (
                                    <Typography className="input-feedback">{errors.email}</Typography>
                                )}
                               <Box className = "submit-button-view-1">
                                        <Button color = "primary" type = "submit">
                                            Submit
                                        </Button>
                               </Box>
                            </form>
                        );
                        }}
                    </Formik>
                </DialogContent>
                
            </Dialog>
        );
    }
   
};

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
	submiteReview
};
export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(LoginForSubmit);


