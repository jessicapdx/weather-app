// Feature 1: In your project, display the current date and time using JavaScript: Tuesday 16:00
let currentTime = document.querySelector("#current-time");

function userCurrentTime() {
  let now = new Date();
  let weekday = now.toLocaleString("en-US", { weekday: "long" });
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let formattedMins = minutes.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  currentTime.innerHTML = `As of ${weekday} ${hours}:${formattedMins}`;
}

userCurrentTime(currentTime);

// Feature #2: Add a search engine, when searching for a city (i.e. Paris), display the city name on the page after the user submits the form.
let searchEngine = document.querySelector("#search-bar");

function currentUserData(response) {
  console.log(response);
  let cityString = document.querySelector("#current-city");
  let currentCity = response.data.name;
  cityString.innerHTML = `${currentCity} Weather`;
  let currentTempData = Math.round(response.data.main.temp);
  let currentTempElement = document.querySelector("#current-temp");
  currentTempElement.innerHTML = `${currentTempData}`;
}

function userSearch(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search").value;
  if (searchCity) {
    let apiKey = "e9bb26ed626e12b32c5d3d0d23619b61";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=imperial`;
    axios.get(url).then(currentUserData);
  } else {
    alert("Please provide a city to see the weather");
  }
}

searchEngine.addEventListener("submit", userSearch);
