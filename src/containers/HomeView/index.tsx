import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import AutoCompleteText from '../../components/common/AutoCompleteText.js';
import '../../assets/css/conflictRemove.css';
import HomePageMid from 'components/HomeMid/homePageMid.js';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(2, 3, 2, 10),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));
function HomeView() {
  const [error, setError] = useState('');
  const [city, setCitiesData] = useState([]);
  const [cityName, setCityName] = useState('');
  async function fetchCities() {
    const result = await axios(
      process.env.REACT_APP_PROJECT_API + 'specialties/' + 'cities',
    );
    setCitiesData(result.data);
  }

  function onCityChange(event) {
    setCityName(event.target.value)
  }

  useEffect(() => {
    localStorage.clear();
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
          <h1 className="home-title" style={{ textAlign: 'center', fontFamily: 'sans-serif', fontWeight: 'normal' }}>Find local proffesionals for pretty much anything</h1>
          <p className="red">{error}</p>
          <div   id="search">
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
                {cityName != '' || cityName != null ? <Link onClick={onHitSearch} className="underlineNone" to={{
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