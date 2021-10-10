let form = document.querySelector("#search-bar");
let celsius = document.querySelector("#celsius");
let celsiusTemp = null;
let fahrenheitElement = document.querySelector("#fahrenheit");
let fahrenheitTemp = null;
let temperatureElement = document.querySelector("#current-temp");

function getLastUpdatedTime(response) {
  let currentTime = document.querySelector("#current-time");
  let respDt = response.data.dt;
  var ampm = "AM";
  let now = new Date(respDt * 1000);
  let weekday = now.toLocaleString("en-US", { weekday: "long" });
  let hours = now.getHours();
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
  let minutes = now.getMinutes();
  let formattedMins = minutes.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  currentTime.innerHTML = `As of ${weekday}, ${hours}:${formattedMins} ${ampm}`;
}

function displayCurrentTemp(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#current-city");
  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector(".current-condition");
  let iconElement = document.querySelector("#current-icon");
  let iconCode = response.data.weather[0].icon;
  fahrenheitTemp = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = description;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  );
  iconElement.setAttribute("alt", description);
}

function search(userCity) {
  let apiKey = "e9bb26ed626e12b32c5d3d0d23619b61";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCity}&appid=${apiKey}&units=imperial`;
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

form.addEventListener("submit", submitSearch);
fahrenheit.addEventListener("click", displayFahrenheitTemp);
celsius.addEventListener("click", displayCelsiusTemp);
