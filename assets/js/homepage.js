// Code adapted from Module 6 Activity 23-Ins_Review-Part-Two

const API_KEY = '6bfe5caff6470d1b595f0fe19025cbd1';
//const APIKey = '2d6928c33cad737f7fa833b834904f7d';
const KEY_HISTORY = 'search-history';

var userFormEl = document.querySelector('#user-form');
var historyButtonsEl = document.querySelector('#history-buttons');
var cityInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
var forecastContainerEl = document.querySelector('#forecast-container');

const city = {
  name: null,
  forecast: false,
};

const cityWeather = {
  date: "",
  hour: "",
  temp: 0,
  wind: 0,
  humidity: 0,
  icon: "",
  iconalt: "",
};

var formSubmitHandler = function (event) {
  event.preventDefault();

  city.name = cityInputEl.value.trim();  

  if (city.name) {
    getCityWeather(city);

    weatherContainerEl.textContent = '';
    forecastContainerEl.textContent = '';
    cityInputEl.value = '';   

  } else {
    alert('Please enter a City name');
  }
};

var buttonClickHandler = function (event) {
  city.name = event.target.getAttribute('data-language');

  if (city.name) {
    getCityWeather(city); 

    weatherContainerEl.textContent = '';
    forecastContainerEl.textContent = '';
  }
};

var getCityWeather = function (cityObj) {

    var baseURL = 'https://api.openweathermap.org/data/2.5/';
    var options = 
      '?q=' + cityObj.name      
      + '&units=' + 'imperial'
      + '&appid=' + API_KEY;
    var weatherURL = baseURL + 'weather' + options;
    var forecastURL = baseURL + 'forecast' + options;

    fetch(weatherURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //console.log(data);          
          cityObj.forecast = false;
          displayCityWeather(data, cityObj);          
        });
      } else {
        //alert('Error: ' + response.statusText);
        weatherContainerEl.innerHTML = '<h2>No city with that name found.</h2>';
      }
    })
    .catch(function (error) { alert('Unable to connect to OpenWeather'); });

    fetch(forecastURL)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //console.log(data);          
          cityObj.forecast = true;
          displayCityForecast(data, cityObj);          
        });
      }
    })
    .catch(function (error) { alert('Unable to connect to OpenWeather'); });

};

var displayCityWeather = function (weatherObj, cityObj) {

    
}

var displayCityForecast = function (weatherObj, cityObj) {


};

userFormEl.addEventListener('submit', formSubmitHandler);
historyButtonsEl.addEventListener('click', buttonClickHandler);