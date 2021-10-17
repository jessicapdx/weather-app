let apiKey = "e9bb26ed626e12b32c5d3d0d23619b61";
let baseUrl = "https://api.openweathermap.org/data/2.5";
let iconUrl = null;
let imgBaseUrl = "http://openweathermap.org";
let form = document.querySelector("#search-bar");
let celsius = document.querySelector("#celsius");
let celsiusTemp = null;
let forecastDate = null;
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
  if (hours >= 12) {
    hours = hours - 12;
    ampm = "PM";
  } else if (hours === 0) {
    hours = "01";
    ampm = "AM";
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
}

function displayCurrentTemp(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#current-city");
  coordinates = response.data.coord;
  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector(".current-condition");
  let iconElement = document.querySelector("#current-icon");
  let iconCode = response.data.weather[0].icon;
  let windSpeed = Math.round(response.data.wind.speed);
  fahrenheitTemp = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = description;
  iconElement.setAttribute("src", `${imgBaseUrl}/img/wn/${iconCode}@2x.png`);
  iconElement.setAttribute("alt", description);
  windElement.innerHTML = `Wind Speed: ${windSpeed} mph`;
  displayTodaysForecast();
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

function displayTodaysForecast() {
  let forecastElement = document.querySelector(".today-weather");
  let forecastHTML = "";
  let dayTimes = ["Morning", "Afternoon", "Evening", "Overnight"];
  dayTimes.forEach(function (time) {
    forecastHTML =
      forecastElement.innerHTML +
      `
					<table class="table table-borderless">
						<thead>
							<tr class="today-time-grid">
								<th class="daytime" scope="col">Morning</th>
								<th class="daytime" scope="col">Afternoon</th>
								<th class="daytime" scope="col">Evening</th>
								<th class="daytime" scope="col">Overnight</th>
							</tr>
						</thead>
						<tbody>
							<tr class="today-icons">
								<td>🌦</th>
								<td>⛈</td>
								<td>☔️</td>
								<td>🌘</td>
							</tr>
							<tr class="today-temps">
								<td>60℉</th>
								<td>62℉</td>
								<td>59℉</td>
								<td>59℉</td>
							</tr>
						</tbody>
					</table>
				</div>	`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayWeekForecast(response) {
  let days = response.data.daily;
  let forecastElement = document.querySelector(".five-day-grid");
  let forecastHTML = `<div class="row five-day-grid">`;
  days.forEach(function (day, index) {
    if (index > 0 && index < 6) {
      getWeekDay(day.dt);
      getWeekDate(day.dt);
      console.log(day);
      forecastHTML += `
        <div class="col-2 grid-item">
          <div class="grid-item">
            ${weekDay}<br/>
            <div class="grid-item weekDate">
              ${monthAbb}/${forecastDate}
            </div>
          </div>
          <div class="grid-item forecast-icon">
            <img src="${imgBaseUrl}/img/wn/${day.weather[0].icon}@2x.png"/>
          </div>
          <div class="grid-item forecast-temps">${Math.round(day.temp.max)}
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
