import React from "react";
import { useState } from "react";
import SunRise from "./components/Sunrise";
import WeatherCard from "./components/WeatherCard";
import FiveDaysWeather from './components/FiveDaysWeather';
//App component
function App() {

  //Key to acces API. It should be hidden
  const weatherApiKey = '98b8ae4676e751b25a28160f8c3a8be7';

  //Weather api URL
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?`
  
  //Hook which contains weather for selected city. After it's value is diffrent then false, it means that data has been fetched and app is ready to render
  const [currentCityWeather, setCurrentCityWeather] = useState(false);

  //Name of selected city
  const [selectedCityName, setSelectedCityName] = useState('');

  //Timezone offset of selected city. Used to calc local time
  const [selectedCityOS, setSelectedCityOS] = useState('');

 //Array of objects that contains all data crucial for our APP
  const cities=[
    {
    name: 'Poznań',//Name of the cty
    timeZone: 'CET',//Timezone (this value isn't used, however I've decided to keep it in case of further development)
    offset: +1, //Timezone offset
    lat: '52.409538',//City's latitude - used to fetch data for this city
    lng: '16.931992',//City's longtitude - used to fetch data for this city
    },
    {
    name: 'Londyn',
    timeZone:'GMT',
    offset: 0,
    lat: '51.509865',
    lng: '-0.118092',
    },
    {
    name: 'Havana',
    timeZone:'CST',
    offset: -5,
    lat: '23.113592',
    lng: '-82.366592',
    }
  ];

  //Function that fetches data for given area. This function takes as arguments latitude and longtitude of selected city. It returns weather data for now and 16 days ahead.
  const getWeather = (lat,lng) =>{
    fetch(`${weatherApiUrl}lat=${lat}&lon=${lng}&exclude=minutely,alerts,hourly&appid=${weatherApiKey}&units=metric`)
    .then(res=>res.json())
    .then(response => setCurrentCityWeather(response))//Updating our weather hook. After hook is updated, app render is trigered
    .catch(error => {
      window.alert('Failed to download data. Please check your internet connection and try again.')//Alert that informs user of error with data fetching
    })
  }

  return (
    <div 
    className="shadow-lg d-flex justify-content-center flex-column align-items-center container-lg bg-dark bg-gradient bg-opacity-10 mt-3 rounded p-2">
      <div 
      className="d-flex align-items-center flex-column">
        <h2 
        className=" p-2">
          Choose city
        </h2>
        <select 
        className="col-9" 
        value={selectedCityName} 
        onChange={ e => { 
        setSelectedCityName(e.target.value);
        const index = cities.findIndex(element => element.name === e.target.value)
        setSelectedCityOS(cities[index].offset)
        getWeather(cities[index].lat,cities[index].lng)
       }}>
          <option 
          disabled 
          selected 
          hidden>
            Show list
          </option>
          {cities.map( (city,i)=> <option key={i} value={city.name}>{city.name}</option>)}
        </select>
      </div>
     <div 
        className="col-10 text-center">
          <h3>
            {selectedCityName}  
          </h3>
          <div 
          className="d-flex p-2 flex-row justify-content-start align-items-center">
            {currentCityWeather ? <CurrentTime offset={selectedCityOS}/>: null}
          </div>   
        </div>
        <div 
        className="d-flex row col-10 justify-content-center align-items-center col-lg-8 flex-lg-row">
        {currentCityWeather ? <SunRise sunrise={currentCityWeather.current.sunrise} sunset={currentCityWeather.current.sunset} offset={currentCityWeather.timezone_offset}></SunRise>: null}
        {currentCityWeather ? <WeatherCard weather={currentCityWeather}></WeatherCard>:null}
        </div>
        {currentCityWeather ? <h2 className="mt-3">5-days weather</h2> : <h2 className="mt-3">Weather App</h2> } 
        <div 
        className=" col-12 mb-3 d-flex flex-row  overflow-auto gap-3 mt-3 justify-content-lg-center">
        {currentCityWeather ? <FiveDaysWeather weather={currentCityWeather.daily}></FiveDaysWeather>:null}
      </div>
    </div>
  );
}
//Function that converts time users local to local for given offset. As a argument it takes time zone offset
const convertTime = (timeZoneOffset) =>{
  const date = new Date(); //intialize new Date object
  const localTime = date.getTime(); //get current time
  const TZoffset = date.getTimezoneOffset() * 60000; //get TZ offset and muliply it by 60000(miliseconds in one minute)
  const utc = localTime + TZoffset; //calc utc time
  const newDate = new Date(utc + (3600000*timeZoneOffset));//new Date object which takes as argument timezone offset * miliseconds in one hour
  return newDate.toLocaleString();
}
  //Component to display current time
  const CurrentTime =  (props) =>{
  const [seconds,updateSeconds] = useState(0);
  setInterval(()=> updateSeconds(new Date().getSeconds()),1000)
    const time = convertTime(props.offset)

  return(
  <>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
    </svg>
    <div>
      <p className="m-0 ms-2 fs-3"> {time.substring(time.indexOf(',')+1,time.length-3)}{seconds <10 ? ":0"+seconds : ":"+seconds}</p> 
    </div>
  </>
  )
}

export default App;
