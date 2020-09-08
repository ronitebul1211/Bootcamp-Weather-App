
const weatherApiKey = '5a8131970b4d70b55616fac0b37bd755';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'


async function fetchByCityName(cityName){
  const response = await fetch(`${baseUrl}?q=${cityName}&units=metric&appid=${weatherApiKey}`);
  const data = await response.json();
  console.log(createWeatherObj(data));
}

async function fetchByLocation(latitude, longitude){
  const response = await fetch(`${baseUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`);
  const data = await response.json();
  console.log(createWeatherObj(data));
}

/**Return Weather object: cityName, current celsius, sunrise time stamp, sunset time stamp*/
function createWeatherObj(data){
  return {
    cityName: data.name,
    currentCelsius: data.main.temp,
    sunriseTimeStamp: data.sys.sunrise,
    sunsetTimeStamp: data.sys.sunset
  }
}

function getCurrentLocation(){
  const success = (geoPosition) => fetchByLocation(geoPosition.coords.latitude, geoPosition.coords.longitude);
  const error = (error) => console.warn(`ERROR(${error.code}): ${error.message}`);
  navigator.geolocation.getCurrentPosition(success, error);
}

/*********************************************************************  UI  *******************************************************************/

/** Get string with formatted time, pattern: 00:00:00 */
function formatTime (unixTimestamp){
  //Multiplied by 1000 so that the argument is in milliseconds, not seconds.
  const date = new Date(unixTimestamp * 1000);
  const hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  const seconds = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
  return `${hours}:${minutes}:${seconds}`
}

getCurrentLocation();
fetchByCityName('eilat');

const getWeatherForm = document.querySelector('.get-weather-form');
getWeatherForm.addEventListener('submit', (event) => {
  event.preventDefault()//don't refresh page 
  
});





