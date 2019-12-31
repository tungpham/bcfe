/*eslint-enable*/
import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import Rating from '@material-ui/lab/Rating';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import '../../assets/css/img.css';
import '../../assets/css/contractorList.css';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import {xapi} from '../../services/utils';
function ContractorList(props) {
    var apiPath = 'contractors/search';
    const [contractorData, setContractorData] = useState([]);
    const [date] = useState(new Date().getFullYear());

    useEffect(() => {
        postContractorDetails();
        //eslint-disable-next-line
    }, []);

    async function postContractorDetails() {
        const payload = {
            "city": props.location.state.cityName,
            "specialty": props.location.state.specialty
        };
        if (payload) {
            await xapi().post( apiPath, payload).then(response => {
                    setContractorData(response.data);
                })
        }
    }

    return (<div style={{ marginTop: '-30px' }}>
        <Container className="contractor-list">
            {contractorData.length === 0 ? <List className="loader"><CircularProgress /></List> :
                <List className="list">
                    {contractorData.map((cntDetail, index) => {
                        return (
                            <div key={index}>
                                <Link className="underlineNone" to={`/contractordetails/${cntDetail.contractor.id}`}>
                                    <ListItem className="list-item">
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} lg={2}>
                                                {cntDetail.contractor['contractorFiles'].map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            {item.type === 'AVATAR' ?
                                                                <img className="myAvatar" alt={item.name} src={`${process.env.REACT_APP_PROJECT_API}/contractors/${cntDetail.contractor.id}/files/${item.name}`} /> : ' '}
                                                        </div>
                                                    )
                                                })}
                                                {cntDetail.contractor['contractorFiles'].length === 0 ? <img alt="companyImage" className="displayNone" src={`https://ui-avatars.com/api/api/?name=${cntDetail.contractor.address.company}`} /> : ''}
                                            </Grid>
                                            <Grid item xs={12} lg={10}>
                                                <Grid className="row">
                                                    <Grid item xs={12} lg={9}>
                                                        <ListItemText
                                                            primary={cntDetail.contractor.address.company} />
                                                        <div className="d-flex">
                                                            <span className="rate">{cntDetail.reviewSummary.rating}</span>
                                                            <div className="stars">
                                                                <Rating name="size-medium" className="rating r-star"
                                                                    value={cntDetail.reviewSummary.rating}
                                                                    max={5} readOnly
                                                                />
                                                            </div>
                                                            <span className="views">{cntDetail.reviewSummary.totalReviews}&nbsp;reviews</span>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={12} lg={3}>
                                                        <div className="no-margin"><i className="fa fa-comment-o" aria-hidden="true"></i></div>
                                                        <span style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.54)' }}>contact for price</span>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} lg={12} className="mtmb">
                                                    <span className="watch-icon"> <AccessTimeIcon style={{ color: '#817c7c' }} /> </span>
                                                    <span className="years">
                                                        {date - cntDetail.contractor.address.founded}
                                                        &nbsp;years in business</span>
                                                </Grid>
                                                <Grid container className="row fullwidth">
                                                    <Grid item xs={12} lg={9}>
                                                        <div className="details">
                                                            "{cntDetail.reviewSummary.areview}"
                                                    </div>
                                                    </Grid>
                                                    <Grid item xs={12} lg={3} >
                                                        <Button variant="contained" color="primary" >
                                                            View Profile
                                                    </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                </Link>
                                <Divider />
                            </div>)
                    })}
                </List>
            }
        </Container>
    </div>
    )
}

export default ContractorList;