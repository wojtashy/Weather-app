import React from "react";
import { useState } from "react";
import SunRise from "./components/Sunrise";
import WeatherCard from "./components/WeatherCard";
import FiveDaysWeather from './components/FiveDaysWeather'
function App() {
  const weatherApiKey = '98b8ae4676e751b25a28160f8c3a8be7';
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/onecall?`
  
  const [currentCityWeather, setCurrentCityWeather] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState('Poznań');
  const [selectedCityOS, setSelectedCityOS] = useState('+1');
  const [selectedCityLatLng,getCityLatLng] = useState('52.409538&16.931992')
  const [sunHours, setSunHours] = useState([{
    sunrise: '00:00',
    sunset: '00:00',
  }],
  [{
    sunrise: '00:00',
    sunset: '00:00',
  }],
  [{
    sunrise: '00:00',
    sunset: '00:00',
  }])
  const [cities,setCities]=useState([
    {
      name: 'Poznań',
    timeZone: 'CET',
    offset: +1,
    lat: '52.409538',
    lng: '16.931992',
   
    
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
  ]);
  const getWeather = (lat,lng) =>{
    fetch(`${weatherApiUrl}lat=${lat}&lon=${lng}&exclude=minutely,alerts,hourly&appid=${weatherApiKey}&units=metric`)
    .then(res=>res.json())
    .then(response => setCurrentCityWeather(response))
  }

  return (
    <div className="shadow-lg d-flex justify-content-center flex-column align-items-center container-lg bg-dark bg-gradient bg-opacity-10 mt-3 rounded p-2" >
      <div className="d-flex align-items-center flex-column">
        <h2 className=" p-2">Choose city</h2>
        <select className="col-9" value={selectedCityName} onChange={ e => { 
       setSelectedCityName(e.target.value);
       const index = cities.findIndex(element => element.name === e.target.value)
       getCityLatLng(cities[index].lat+"&"+cities[index].lng)
       setSelectedCityOS(cities[index].offset)
       getWeather(cities[index].lat,cities[index].lng)
       }}>
       {cities.map( (city,i)=> <option key={i} value={city.name} selected={city.name === 'Londyn' ? true : false}>{city.name}</option>)}
     </select></div>
     
     <div className="col-10">
       <h3>{selectedCityName}  </h3>
       <div className="d-flex p-2 flex-row justify-content-start align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
</svg>
<CurrentTime offset={selectedCityOS}/></div>
       
     </div>
    {currentCityWeather ? <SunRise sunrise={currentCityWeather.current.sunrise} sunset={currentCityWeather.current.sunset} offset={currentCityWeather.timezone_offset}></SunRise>: null}
     {currentCityWeather ? <WeatherCard weather={currentCityWeather}></WeatherCard>:null}
     <h2 className="mt-3">5-days weather</h2>
     <div className="d-flex flex-row justify-content-center gap-3 mt-3">
       {currentCityWeather ? <FiveDaysWeather weather={currentCityWeather.daily}></FiveDaysWeather>:null}
       </div>
    </div>
  );
}

const convertTime = (timeZoneOffset) =>{
  
  const date = new Date();
  const localTime = date.getTime();
  const TZoffset = date.getTimezoneOffset() * 60000;
  const utc = localTime + TZoffset;
  const newDate = new Date(utc + (3600000*timeZoneOffset));
  return newDate.toLocaleString();
}
  const CurrentTime =  (props) =>{
  const [seconds,updateSeconds] = useState(0);
  setInterval(()=> updateSeconds(new Date().getSeconds()),1000)
    const time = convertTime(props.offset)

  return(
    <div>
      <p className="m-0 ms-2 fs-3"> {time.substring(time.indexOf(',')+1,time.length-3)}{seconds <10 ? ":0"+seconds : ":"+seconds}</p>
      
    </div>
    
  )

}


  
  

const convertSunsetTime = (offset,sunrise,sunset) =>{
  const converted = {
      sunrise: (1*sunrise.substring(0,sunrise.indexOf(':')))+ (offset*1)+ sunrise.substring(sunrise.indexOf(':'),sunrise.indexOf(':')+3),
      sunset:  (1*sunset.substring(0,sunset.indexOf(':')))+ (offset*1+12) +sunset.substring(sunset.indexOf(':'),sunset.indexOf(':')+3)
  }
   return(converted)
}



export default App;
