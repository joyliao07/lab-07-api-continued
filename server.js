'use strict';

 const express = require('express');
 const superagent = require('superagent');
 const cors = require('cors');
 const app = express();
 app.use(cors());
 require('dotenv').config();
 const PORT = process.env.PORT || 3000;

//API routes
app.get('/location', (request, response) => {
  searchToLatLong(request.query.data)
    .then(location => response.send(location))
})

// Dark Skies / weather
app.get('/weather', getWeather);

function searchToLatLong(query){
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_API_KEY}`;
  return superagent.get(url)
    .then(result => {
      return{
        search_query: query,
        formatted_query: result.body.results[0].formatted_address,
        latitude: result.body.results[0].geometry.location.lat,
        longitude: result.body.results[0].geometry.location.lng
      }

    })
};

function getWeather(request, response){
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  return superagent.get(url)
    .then(result =>{
      console.log('data', result.body.daily.data);
      let weatherSummaries = result.body.daily.data.map(day => {return new Weather(day);});
      console.log('weather summaries', weatherSummaries); 
      response.send(weatherSummaries)
    })
}

function Weather(day){
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
  this.forecast = day.summary;
}

 app.listen(PORT, () => console.log(`Listening on ${PORT}`));





















