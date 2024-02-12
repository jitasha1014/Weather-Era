const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessConatiner = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const apiError = document.querySelector(".api-error-container");
const userInfoContainer = document.querySelector(".user-info-container");


// initial variables
const API_KEY = "2c64b7d2d299ccbf6e3babe11e783261";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
  apiError.classList.remove("active");
  if(clickedTab != currentTab){
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");
  }
  if(!searchForm.classList.contains("active")){
    userInfoContainer.classList.remove("active");
    grantAccessConatiner.classList.remove("active");
    searchForm.classList.add("active");
  }
  else{
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    // your weather tab and now go to the local storage for the coordinates
    getfromSessionStorage();
  }
}

userTab.addEventListener("click", () =>{
  // pass user tab as input parameters
  switchTab(userTab);
});

searchTab.addEventListener("click", () =>{
  // pass user tab as input parameters
  switchTab(searchTab);
});

function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    grantAccessConatiner.classList.add("active");
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates){
  const {lat , lon} = coordinates;
  grantAccessConatiner.classList.remove("active");
  loadingScreen.classList.add("active");

  // API CALL
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.remove("active");
    apiError.classList.add("active");
  }
}

function renderWeatherInfo(weatherInfo){
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const description = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-cloudiness]");

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  description.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
  windSpeed.innerText =`${weatherInfo?.wind?.speed}m/s` ;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    console.log("No geoLocation support");
  }
}

function showPosition(position){
  const userCoordinates ={
    lat:position.coords.latitude,
    lon:position.coords.longitude,
  }
  sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if(searchInput.value === "") return;

  fetchSearchWeatherInfo(searchInput.value);
  searchInput.value ="";
})
async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  apiError.classList.remove("active");
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    if (!data.sys) {
      throw data;
    }
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    apiError.classList.add("active");
  }
}



// async function fetchWeatherDetails() {
//   try {
//     let city = "Kota";
//     const response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
//     );

//     const data = await response.json();
//     console.log("Weather data :-> ", data);

    
//     renderWeatherInfo(data);
//   } 
//   catch (err) {
//     // See this later
//   }
// }

// async function getCustomWeatherDetails() {
//   try {
//     let lattitude = 17.333;
//     let longitude = 74.0833;

//     let result = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=${API_KEY}`
//     );
//     const data = await result.json();
//     console.log(data);
//   } 
//   catch (err) {
//     console.log("Error found" , err);
//   }
// }

// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

//     document.body.appendChild(newPara);

// }

// function getLocation(){
//     if (navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No geoLocation support");
//     }
// }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;
//     console.log(lat);
//     console.log(longi);
// }
