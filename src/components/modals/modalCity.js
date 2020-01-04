import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import '../../assets/css/modal.css';
import FormControl from '@material-ui/core/FormControl';
import {xapi} from 'services/utils';
function ModalCity(props) {
    const [city, setCitiesData] = useState([]);
    const [cityName, setCityName] = useState('');
    const [firstRender, setFirstRender] = useState(false);
      async function fetchCities() {
        const result = await xapi().get("specialties/cities");
          setCitiesData(result.data);
      }
      function getContractorData(){
        if(firstRender === true) return;
          var _id = localStorage.getItem("contractor_ID");
          if(_id)
          {
              xapi().get(`contractors/${_id}`).then((res) => {
                  if(res.data && res.data.address && res.data.address.city)
                  {
                      setCityName(res.data.address.city);
                      props.parentCallback(res.data.address.city)
                  }
              })
              setFirstRender(true);
          }
      }
      function onCityChange(event) {
        setCityName(event.target.value)
        props.parentCallback(event.target.value)
      }
      getContractorData();
      useEffect(() => {
        fetchCities();
      },[]);
   
    return (
        <Grid className="service-modal-col" item xs={10} >
            <Typography className="city-head-text" variant="h5">
                Answer a few question to get matched professionals near you
                 </Typography>
            <Typography className="city-sub-text" variant="body1">
                 Please confirm your city
                </Typography>
            <FormControl className="width100">
               <select className="city" onChange={(event) => onCityChange(event)} style = {{width:'100%'}} value = {cityName ? cityName : " "}>
                  <option value=" ">City</option>
                  {city.map(city => {
                    return <option key={city} value={city}>{city}</option>
                  })}
                </select>
                {cityName.length === 0 ? <p className='red'>{props.errorMessage}</p> : ''}
                <div></div>
            </FormControl>
        </Grid>
    );
}
const mapStateToProps = state => ({
    contractor: state.cont_data.selectedContractor,
});

export default connect(mapStateToProps, null)(ModalCity);