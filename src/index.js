let apiKey = "e9bb26ed626e12b32c5d3d0d23619b61";
let city = "Moscow";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

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

axios.get(apiUrl).then(getLastUpdatedTime);

function displayCurrentTemp(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#current-temp");
  let cityElement = document.querySelector("#current-city");
  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector(".current-condition");
  let iconElement = document.querySelector("#current-icon");
  let iconCode = response.data.weather[0].icon;
  let temp = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = description;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`
  );
  iconElement.setAttribute("alt", description);
}

axios.get(apiUrl).then(displayCurrentTemp);
