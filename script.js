
const weatherApiKey = '5a8131970b4d70b55616fac0b37bd755';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

let weatherHistory = [];

function getCurrentLocation(){
  const success = (geoPosition) => fetchByLocation(geoPosition.coords.latitude, geoPosition.coords.longitude);
  const error = (error) => console.warn(`ERROR(${error.code}): ${error.message}`);
  navigator.geolocation.getCurrentPosition(success, error);
}

/** Fetch By City Name -> Update current weather UI*/
async function fetchByCityName(cityName){
  try{
    const response = await fetch(`${baseUrl}?q=${cityName}&units=metric&appid=${weatherApiKey}`);
    handleErrors(response);
    const data = await response.json();
    if(isExistInHistory(data.id)){
      console.log('already displayed');
    } else {
      const weather = createWeatherObj(data);
      displayWeather(weather);
      // Save in history 
      weatherHistory.push(weather);
      addWeatherToHistoryUi(weather);
    }   
  } catch (error){
    console.log(error);
  }
}

// catch fetch error -> https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
function handleErrors(response) {
  if (!response.ok) {
      throw Error(response.statusText);
  }
  // return response;
}


/** Fetch By Location -> Update current weather UI*/
async function fetchByLocation(latitude, longitude){
  const response = await fetch(`${baseUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`);
  const data = await response.json();
  // Create obj
  const weather = createWeatherObj(data);
  // display
  displayWeather(weather);
}

/**Return Weather object: cityName, current celsius, sunrise time stamp, sunset time stamp*/
function createWeatherObj(data){
  return {
    id: data.id,
    cityName: data.name,
    currentCelsius: data.main.temp,
    sunriseTimeStamp: data.sys.sunrise,
    sunsetTimeStamp: data.sys.sunset
  }
}

function isExistInHistory(id){
  return weatherHistory.some(weather => weather.id === id);
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

function displayWeather(weather){
    const cityEl = document.querySelector('.city .value');
    const weatherEl = document.querySelector('.weather .value');
    const sunriseEl = document.querySelector('.sunrise .value');
    const sunsetEl = document.querySelector('.sunset .value');
  
    cityEl.textContent = weather.cityName;
    weatherEl.textContent = weather.currentCelsius + '\u2103'; 
    sunriseEl.textContent = formatTime(weather.sunriseTimeStamp);
    sunsetEl.textContent = formatTime(weather.sunsetTimeStamp);
}

function addWeatherToHistoryUi(weather){
  const placeholder = document.querySelector('.search-history .placeholder');
  if(placeholder){
    placeholder.remove()
  }

  const historyEl = document.createElement('span');
  historyEl.textContent = `${weather.cityName}: ${weather.currentCelsius + '\u2103'}`;

  const historyContainerEl = document.querySelector('.search-history');
  historyContainerEl.appendChild(historyEl);
}



const getWeatherForm = document.querySelector('.get-weather-form');

getWeatherForm.addEventListener('submit', (event) => {
  event.preventDefault()//don't refresh page 
  const locationInputEl = event.currentTarget.locationInput;
  fetchByCityName(locationInputEl.value);
  locationInputEl.value = ''; //Reset UI
});

getCurrentLocation();






