import React from "react";
import { useState } from "react";
import SunRise from "./components/Sunrise";
function App() {
  const weatherApiKey = '98b8ae4676e751b25a28160f8c3a8be7';
  const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
  fetch(`${weatherApiUrl}Poznań&appid=${weatherApiKey}`)
  .then(res=>res.json())
  .then(response => console.log(response))
  const [selectedCityName, setSelectedCityName] = useState('Poznań');
  const [selectedCityOS, setSelectedCityOS] = useState('+1');
  const [selectedCityLatLng,getCityLatLng] = useState('52.409538&16.931992')
  const [cities,setCities]=useState([
    {
      name: 'Poznań',
    timeZone: 'CET',
    offset: '+1',
    lat: '52.409538',
    lng: '16.931992'
    },
    {
    name: 'Londyn',
    timeZone:'GMT',
    offset: '0',
    lat: '51.509865',
    lng: '-0.118092',
    },
    {
    name: 'Havana',
    timeZone:'CST',
    offset: '-5',
    lat: '23.113592',
    lng: '-82.366592',
    }
  ]);
    

  return (
    <div className="container-lg" >
     <select value={selectedCityName} onChange={ e => { 
       setSelectedCityName(e.target.value);
       const index = cities.findIndex(element => element.name === e.target.value)
       getCityLatLng(cities[index].lat+"&"+cities[index].lng)
       setSelectedCityOS(cities[index].offset)
       }}>
       {cities.map( (city,i)=> <option key={i} value={city.name} selected={city.name === 'Londyn' ? true : false}>{city.name}</option>)}
     </select>
     <div className="col-10">
       <h3>{selectedCityName} <CurrentTime offset={selectedCityOS}/> </h3>
     </div>
     <SunRise latlng={selectedCityLatLng} offset={selectedCityOS} isSet={false}></SunRise>
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
console.log(convertTime(-5))
  const CurrentTime =  (props) =>{
  const [seconds,updateSeconds] = useState(0);
  setInterval(()=> updateSeconds(new Date().getSeconds()),1000)
    const time = convertTime(props.offset)

  return(
    <p> {time.substring(time.indexOf(',')+1,time.length-3)}{seconds <10 ? ":0"+seconds : ":"+seconds}</p>
  )

}
export default App;
