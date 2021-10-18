let apiKey = "e9bb26ed626e12b32c5d3d0d23619b61";
let baseUrl = "https://api.openweathermap.org/data/2.5";
let iconUrl = null;
let imgBaseUrl = "http://openweathermap.org";
let form = document.querySelector("#search-bar");
let celsius = document.querySelector("#celsius");
let celsiusTemp = null;
let forecastDate = null;
let forecastHours = null;
let fahrenheitElement = document.querySelector("#fahrenheit");
let fahrenheitTemp = null;
let fullDate = null;
let monthAbb = null;
let temperatureElement = document.querySelector("#current-temp");
let weekDay = null;
let weekDayName = null;
let windElement = document.querySelector(".current-wind");

function getWeekDay(dtStamp) {
  fullDate = new Date(dtStamp * 1000);
  weekDay = fullDate.toLocaleString("en-US", { weekday: "long" });
}

function getWeekDate(dtStamp) {
  fullDate = new Date(dtStamp * 1000);
  forecastHours = fullDate.getHours();
  monthAbb = fullDate.getMonth();
  monthAbb += 1;
  forecastDate = fullDate.getDate();
}

function getLastUpdatedTime(response) {
  getWeekDay(response.data.dt);
  let currentTime = document.querySelector("#current-time");
  var ampm = "AM";
  let hours = fullDate.getHours();
  var ampm = "Checking time...";
  if (hours > 12) {
    hours = hours - 12;
    ampm = "PM";
  } else if (hours === 0) {
    hours = "01";
    ampm = "AM";
  } else if (hours === 12) {
    hours = "12";
    ampm = "PM";
  } else {
    ampm = "AM";
  }
  let minutes = fullDate.getMinutes();
  let formattedMins = minutes.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  currentTime.innerHTML = `As of ${weekDay}, ${hours}:${formattedMins} ${ampm}`;
}

function getForecast(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `${baseUrl}/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayWeekForecast);
  axios.get(apiUrl).then(displayTodaysForecast);
}

function displayCurrentTemp(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector(".current-city");
  coordinates = response.data.coord;
  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector(".current-condition");
  let iconElement = document.querySelector("#current-icon");
  let iconCode = response.data.weather[0].icon;
  fahrenheitTemp = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
  cityElement.innerHTML = `${response.data.name} - ${response.data.sys.country}`;
  descriptionElement.innerHTML = description;
  iconElement.setAttribute("src", `${imgBaseUrl}/img/wn/${iconCode}@2x.png`);
  iconElement.setAttribute("alt", description);

  getForecast(response.data.coord);
}

function search(userCity) {
  let apiUrl = `${baseUrl}/weather?q=${userCity}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayCurrentTemp);
  axios.get(apiUrl).then(getLastUpdatedTime);
}

function submitSearch(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-search");
  userCity = cityInputElement.value;
  search(userCity);
}

function displayCelsiusTemp(temp) {
  event.preventDefault();
  celsiusTemp = (5 / 9) * (fahrenheitTemp - 32);
  temperatureElement.innerHTML = Math.round(celsiusTemp);
  // remove the active class the fahrenheit link
  fahrenheit.classList.remove("active");
  celsius.classList.add("active");
}

function displayFahrenheitTemp(temp) {
  event.preventDefault();
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
  // remove the active class from the celsius temp
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
}

function displayTodaysForecast(response) {
  let dailyTemps = response.data.daily[0].temp;
  let windSpeed = Math.round(response.data.daily[0].wind_speed);
  let morningTemp = Math.round(dailyTemps.morn);
  let afternoonTemp = Math.round(dailyTemps.max);
  let eveningTemp = Math.round(dailyTemps.eve);
  let nightTemp = Math.round(dailyTemps.night);
  console.log(dailyTemps);
  let forecastElement = document.querySelector(".today-weather");
  let forecastHTML = `<div class="row">`;
  forecastHTML += `
    <div class="col-6 grid-item">
      <p class="weekDay">Morning</p>
      <p class="forecast-temps">${morningTemp}<span class="fahrenheit">℉</span></p>
    </div>
    <div class="col-6 grid-item">
      <p class="weekDay">Afternoon</p>
      <p class="forecast-temps">${afternoonTemp}<span class="fahrenheit">℉</span></p>
    </div>
    <div class="col-6 grid-item">
      <p class="weekDay">Evening</p>
      <p class="forecast-temps">${eveningTemp}<span class="fahrenheit">℉</span></p>
    </div>
    <div class="col-6 grid-item">
      <p class="weekDay">Night</p>
      <p class="forecast-temps">${nightTemp}<span class="fahrenheit">℉</span></p>
    </div>
        `;
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
  windElement.innerHTML = `Wind Speed: ${windSpeed} mph`;
}

function displayWeekForecast(response) {
  let days = response.data.daily;
  let forecastElement = document.querySelector(".five-day-grid");
  let forecastHTML = `<div class="row five-day-grid">`;
  days.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      getWeekDay(day.dt);
      getWeekDate(day.dt);
      forecastHTML += `
        <div class="col-2 grid-item">
          <div class="grid-item">
            <span class="weekDay">${weekDay}<br/>
              <span class="weekDate">
                ${monthAbb}/${forecastDate}
              </span>
            </span>
          </div>
          <div class="grid-item forecast-icons">
            <img src="${imgBaseUrl}/img/wn/${day.weather[0].icon}@2x.png"/>
          </div>
          <div class="grid-item">
            <div class="forecast-temps">
            ${Math.round(day.temp.max)}
              <span class="fahrenheit">℉</span>
            </div>
          </div>  
        </div>
        `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

form.addEventListener("submit", submitSearch);
fahrenheit.addEventListener("click", displayFahrenheitTemp);
celsius.addEventListener("click", displayCelsiusTemp);
search("Beaverton");
