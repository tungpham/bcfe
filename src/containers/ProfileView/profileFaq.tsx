import React from 'react';
import Card from '@material-ui/core/Card';
import {  Grid,   CircularProgress } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import ConApi from 'services/contractor';
const styles = (theme: Theme) => createStyles({
    contents: {
        width: '100%',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        borderRadius: 0
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600,
        flex: 1,
        color:"black"
    },
    link: {
        fontSize: '0.875rem',
        fontWeight: "bold",
        color: 'blue',
        cursor: 'pointer',
        marginLeft: '15px'
    },
});

interface ProfileFAQProps {
    classes: any;
}
interface ProfileFAQState {
    isEditFaq: boolean;
    saveFAQLoading: boolean;
    editingFaqList: any[];
    FaqList: any[];
    isBusy: boolean;
}
const FAQs = [
    'What should the customer know about your pricing (e.g., discounts, fees)?',
    'What is your typical process for working with a new customer?',
    'What education and/or training do you have that relates to your work?'
]
class ProfileFAQView extends React.Component<ProfileFAQProps, ProfileFAQState> {
    constructor(props:ProfileFAQProps)
    {
        super(props);
        this.state = {
            isEditFaq: false,
            saveFAQLoading: false,
            editingFaqList: [],
            FaqList: [],
            isBusy: false,
        }
    }
    FetchFAQ = async () => {
        this.setState({isBusy: true})
        await ConApi.getFaqs(localStorage.getItem("contractor_ID")).then((data) => {
            var _temp = [
                {
                    question: FAQs[0],
                    answer: ""
                },
                {
                    question: FAQs[1],
                    answer: ""
                },
                {
                    question: FAQs[2],
                    answer: ""
                }
            ]
            for(var i = 0; i < 3; i ++)
            {
                for(var j = 0 ; j < data.data.length; j++)
                {
                    if(_temp[i].question === data.data[j].question)
                    {
                        _temp[i].answer = data.data[j].answer;
                    }
                }
            }
            this.setState({
                FaqList: data.data,
                editingFaqList: _temp,
                isBusy: false
            })
        })
    }
    componentDidMount(){
        this.FetchFAQ();
    }
    saveFQA = async () => {
        this.setState({
            saveFAQLoading: true
        })
        var submitdata = [];
        this.state.editingFaqList.forEach((item) => {
            submitdata.push({
                question: item.question,
                answer: item.answer
            })
        })
        await ConApi.updateFaqs( localStorage.getItem("contractor_ID"), submitdata).then((data) => {
            this.FetchFAQ();
            this.setState({
                saveFAQLoading: false,
                isEditFaq: false
            })
        }).catch(error => {
            this.setState({
                saveFAQLoading: false,
                isEditFaq: false
            })
        })
    }
    render(){
        const  { classes } = this.props;
        return (
                <Card className={classes.contents}>
                    <List>
                        <ListItem>
                            <div className="FAQs" >
                                    <Grid container className="que-ans" >
                                        <Grid item lg={12} xs={12} style = {{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                            <h3 className={classes.title}>
                                                {
                                                    this.state.isEditFaq === true ? "Frequently asked questions" : "FAQs"
                                                }
                                            </h3>
                                            {
                                                this.state.isEditFaq === true ? (
                                                    <React.Fragment>
                                                        <div className = {classes.link}
                                                            onClick = {()=>this.state.saveFAQLoading === false ? this.saveFQA() : null}
                                                        >
                                                        {
                                                            this.state.saveFAQLoading === true ? (<CircularProgress/>) : "Save"
                                                        }
                                                        </div>
                                                        <div className = {classes.link}
                                                            style = {{color:"red"}}
                                                            onClick = {()=>this.setState({isEditFaq: false})}
                                                        >Cancel</div>
                                                    </React.Fragment>
                                                ) : (
                                                    <div className = {classes.link} onClick = {()=>this.setState({isEditFaq: true})}>Edit</div>
                                                )
                                            }
                                        </Grid>
                                        { FAQs.map((Faq, index) => {
                                            return <Grid key={`faq-question${index}`} item lg={12} xs={12}>
                                                {
                                                    (this.state.editingFaqList.length > index && this.state.editingFaqList[index].answer !== "" && this.state.isEditFaq === false) || this.state.isEditFaq === true ? (
                                                        <h3 className="question">
                                                            { Faq }
                                                        </h3>
                                                    ) : (null)
                                                }
                                            
                                                {
                                                    this.state.isEditFaq === false && this.state.editingFaqList.length > index ? (
                                                    <p className="ans">{this.state.editingFaqList[index].answer === "" || this.state.editingFaqList[index].answer === undefined ||this.state.editingFaqList[index].answer === null ? "Not Answered" : this.state.editingFaqList[index].answer}</p>
                                                    ) : (null)
                                                }
                                                {
                                                    this.state.isEditFaq === true ? (
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            rows = "5"
                                                            variant="outlined"
                                                            value = {this.state.editingFaqList[index].answer !== null && this.state.editingFaqList[index].answer !== "" ? this.state.editingFaqList[index].answer : ""}
                                                            onChange = {(e)=>{
                                                                var _temp = this.state.editingFaqList;
                                                                _temp[index].answer = e.target.value
                                                                this.setState({
                                                                    editingFaqList: _temp
                                                                })
                                                            }}
                                                        />
                                                    ) : (null)
                                                }
                                            </Grid>
                                        })}
                                    </Grid>
                                </div>
                            </ListItem>
                        </List>
                </Card>
        );
    }
}
export default withStyles(styles)(ProfileFAQView);