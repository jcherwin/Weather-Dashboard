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

  cityWeather.date = dayjs.unix(weatherObj.dt).format("MM/DD/YYYY");
  cityWeather.temp = weatherObj.main.temp;
  cityWeather.wind = weatherObj.wind.speed;
  cityWeather.humidity = weatherObj.main.humidity;
  cityWeather.icon = weatherObj.weather[0].icon;
  cityWeather.icon = "http://openweathermap.org/img/wn/" + cityWeather.icon + "@2x.png";
  cityWeather.iconalt = weatherObj.weather[0].description;

  createHTML(cityWeather, cityObj);
    
}

var displayCityForecast = function (weatherObj, cityObj) {

  var headerEl = document.createElement('h3');
  headerEl.textContent = "5-Day Forecast (all times Noon UTC):";
  var divRowEl = document.createElement('div');
  divRowEl.classList = 'row';    
  forecastContainerEl.appendChild(headerEl);
  forecastContainerEl.appendChild(divRowEl);

  for (var i = 0; i < weatherObj.list.length; i++) {
    
    cityWeather.hour = weatherObj.list[i].dt_txt;
    cityWeather.hour = cityWeather.hour.split(' ')[1];
    cityWeather.date = dayjs.unix(weatherObj.list[i].dt).format("MM/DD/YYYY");

    if(cityWeather.hour === "12:00:00"){      

      cityWeather.temp = weatherObj.list[i].main.temp;
      cityWeather.wind = weatherObj.list[i].wind.speed;
      cityWeather.humidity = weatherObj.list[i].main.humidity;
      cityWeather.icon = weatherObj.list[i].weather[0].icon
      cityWeather.icon = "http://openweathermap.org/img/wn/" + cityWeather.icon + ".png";
      cityWeather.iconalt = weatherObj.list[i].weather[0].description;

      //console.log(cityWeather);
      //console.log(weatherObj.list[i]);
      createHTML(cityWeather, cityObj); 
    }
  }
  //console.log(weatherObj);
};

var createHTML = function (weatherObj, cityObj) {
  var titleEl = document.createElement('h2');
  var titleElOptions = 
    "<img "
    + "src='" + weatherObj.icon + "' "
    + "alt='" + weatherObj.iconalt + "'"
    + ">";
  if(cityObj.forecast){
    titleEl.innerHTML = 
      " (" + weatherObj.date + ") "
      + titleElOptions;
  }else{
    titleEl.innerHTML = 
      cityObj.name
      + " (" + weatherObj.date + ") "
      + titleElOptions;
  }        

  var tempEl = document.createElement('p');
  tempEl.innerHTML =
    "Temp: " + weatherObj.temp + " &#176;F";    

  var windEl = document.createElement('p');
  windEl.innerHTML = 
    "Wind: " + weatherObj.wind + " MPH";    

  var humidityEl = document.createElement('p');
  humidityEl.innerHTML = 
    "Humidity: " + weatherObj.humidity + " %";  

  if(!cityObj.forecast){    
    weatherContainerEl.appendChild(titleEl);
    weatherContainerEl.appendChild(tempEl);
    weatherContainerEl.appendChild(windEl);
    weatherContainerEl.appendChild(humidityEl);
  }else{
    
    var cardEl = document.createElement('div');
    cardEl.classList = 'card col-md-6 col-lg-4';
    var cardBodyEl = document.createElement('div');
    cardBodyEl.classList = 'card-body';

    cardBodyEl.appendChild(titleEl);
    cardBodyEl.appendChild(tempEl);
    cardBodyEl.appendChild(windEl);
    cardBodyEl.appendChild(humidityEl);

    cardEl.appendChild(cardBodyEl);

    var forecastContainerRowEl = document.querySelector('#forecast-container').children[1];
    forecastContainerRowEl.appendChild(cardEl);
  }
}

userFormEl.addEventListener('submit', formSubmitHandler);
historyButtonsEl.addEventListener('click', buttonClickHandler);