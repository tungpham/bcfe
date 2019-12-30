import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {xapi} from 'services/utils';
import { Link } from 'react-router-dom';
import AutoCompleteText from '../../components/common/AutoCompleteText.js';
import '../../assets/css/conflictRemove.css';
import HomePageMid from 'components/HomeMid/homePageMid.js';

function HomeView(props) {
  const [error, setError] = useState('');
  const [city, setCitiesData] = useState([]);
  const [cityName, setCityName] = useState('');

  async function fetchCities() {
    const result = await xapi().get("specialties/cities");
      setCitiesData(result.data);
  }

  function onCityChange(event) {
    setCityName(event.target.value)
  }

  useEffect(() => {
    fetchCities();
  }, []);
  
  function onHitSearch() {
    if (cityName === '' || cityName === null) {
      setError("Please Submit the valid Form!")
    } else {
      setError("");
    }
  }
  return (
    <div>
      <Container>
        <Grid className="text-center" item xs={6}>
          <h1 className="home-title" style={{ textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 'normal' }}>Find local professionals for pretty much anything</h1>
          <p className="red">{error}</p>
          <div id="search">
            <AutoCompleteText />
            <div className="city-btn">
              <div className="city">
                <select className="city" onChange={(event) => onCityChange(event)}>
                  <option value=" ">City</option>
                  {city.map(city => {
                    return <option key={city} value={city}>{city}</option>
                  })}
                </select>
              </div>
              <div className="btn">
                {cityName !== '' || cityName !== null ? <Link onClick={onHitSearch} className="underlineNone" to={{
                  pathname: "/contractorList",
                  state: {
                    cityName: cityName,
                    specialty: [localStorage.getItem('specialitie')]
                  }
                }}>
                  <Button onClick={onHitSearch} className="getstarted">Search</Button>
                </Link> : 2}
              </div>
            </div>
          </div>
        </Grid>
        <Grid className="text-center bg-image" item xs={12}>
          <div className=""></div>
        </Grid>
        <HomePageMid />
      </Container>

    </div>
  );
}

export default HomeView;