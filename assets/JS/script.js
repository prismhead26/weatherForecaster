const titleEl = document.querySelector('#title');
const searchInputEl = document.getElementById('city');
const searchBtnEl = document.getElementById('searchBtn');
const cityHistoryEl = document.getElementById('city-history');

// styling
titleEl.setAttribute('style', 'display: flex; justify-content: center;');
document.body.setAttribute('style', 'background-image: linear-gradient(to right, #8360c3, #2ebf91); font-family: Merriweather, sans-serrif;');
searchBtnEl.setAttribute('style', 'background: lightblue');
cityHistoryEl.setAttribute('style', 'border: 4px solid purple;');
// using apiKey for authentication in order to use openweathermap API
const apiKey = 'fde83cd9791936e6b1cf4cd277616bb1';

function start(city) {
  // if statement one liner
  // const city = saveCity || document.getElementById('city').value;

  // get the input value containing the city
  // using the city api, input city and key to get the lat and lon and current weather
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // fetch the data
  // return json object to ensure its an object
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      // (K − 273.15) × 9/5 + 32 = 33.53°F
      // converting temp from K to F
      const currentTemp = Math.floor(((data.main.temp - 273.15) * (9 / 5) + 32));
      // create current date and display only yyyy/mm/dd
      const d = new Date();
      const currentDate = d.toISOString().split('T')[0];
      const imagesrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;

      // get the today el and list new data in the html
      document.getElementById('today').innerHTML = `
            <h2>${city}</h2>
            <h3>${currentDate}</h3>
            <img src="${imagesrc}" alt="weather image"></img>
            <p>Temperature: ${currentTemp} °F</p>
            <p>Humidity: ${data.main.humidity} %</p>
            <p>Wind Speed: ${data.wind.speed} MPH</p>
        `;
      // create lat / lon variables to make code more readable
      const { lat } = data.coord;
      const { lon } = data.coord;
      // using the 5-day/3 hrs api and get all weather info + 5 day forcast
      return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    })
    // fetch the data
    // return json object to ensure its an object
    .then(fetch)
    .then((res) => res.json())
    .then((data2) => {
      // create a for loop to create the 5 day forcast
      let textContent = '';
      for (let i = 8; i < data2.list.length; i += 8) {
        // create image variable and retrieve the forcast image for each date
        const imagesrc = `https://openweathermap.org/img/w/${data2.list[i].weather[0].icon}.png`;

        const futureTemp = Math.floor(((data2.list[i].main.temp - 273.15) * (9 / 5) + 32));
        // loops through each daty and inputs the data within the DOM
        // add date/ only want the first ten letters containing the mm/dd/yyyy
        // add temp, humidity, and wind speed
        textContent += `
            <div class="futureContainer" style="display: flex; flex-direction: column;align-items: center;border: 4px solid purple;border-radius: 20px;">
                <h3>${data2.list[i].dt_txt.substring(0, 10)}</h3>
                <img src="${imagesrc}" alt="weather image"></img>

                <p>Temperature: ${futureTemp} °F</p>

                <p>Humidity: ${data2.list[i].main.humidity} %</p>

                <p>Wind Speed: ${data2.list[i].wind.speed} MPH</p>
            </div>
            `;
      }
      document.getElementById('future').innerHTML = textContent;
    })
    //  catches error for if any .then fails, it will return an error
    .catch((err) => console.log('Failed to load', err));
  // saveStorage();
}

// Retrieve city history from local storage, or initialize empty array if not present
const cityHistory = JSON.parse(localStorage.getItem('city_history')) || [];

// display cities onto DOM
// with each city as a button that can be clicked to retrieve the weather data
function displayCityHistory() {
  cityHistoryEl.innerHTML = '';
  for (let i = 0; i < cityHistory.length; i++) {
    const list = document.createElement('li');
    list.setAttribute('id', cityHistory[i]);
    cityHistoryEl.appendChild(list);
    const container = document.getElementById(cityHistory[i]);
    const button = document.createElement('button');
    button.setAttribute('value', cityHistory[i]);
    button.textContent = cityHistory[i];
    container.appendChild(button);
    button.addEventListener('click', (event) => {
      const city = event.target.value;
      start(city);
    });
  }
}
// This function updates the city history in local
// storage with the user's search input and calls the
//  "printCityHistory" function to update the city history on the page
function updateCityHistory(searchInput) {
  localStorage.setItem('city_history', JSON.stringify(searchInput));
  displayCityHistory();
}

// atach event listener to searchBtn, so that a function fetches and retrieves the data of city
searchBtnEl.addEventListener('click', () => {
  // caps function to capitalize the first letter of the city
  const searchInput = (searchInputEl.value && searchInputEl.value[0].toUpperCase() + searchInputEl.value.slice(1)) || '';

  start(searchInput);
  // Add the user's search input to local storage using the updateCityHistory func
  // if statement to replace newer city search to history list
  // And display updated cities to page
  if (cityHistory.length < 3) {
    cityHistory.unshift(searchInput);
  } else {
    cityHistory.length -= 1;
    cityHistory.unshift(searchInput);
  }
  displayCityHistory();
  updateCityHistory(cityHistory);
});

// Load city history on page load
displayCityHistory();
