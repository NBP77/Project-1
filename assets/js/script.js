// known working api urls for testing functions
var testSearchUrl = 'https://www.mapquestapi.com/search/v4/place?location=-74.95590458465354%2C40.26624146333869&sort=relevance&feedback=false&key=9UthBdDGZK1MsiEFy48XWw3fWtC01AAJ&pageSize=5&q=parks'
var testLocationUrl = 'https://www.mapquestapi.com/geocoding/v1/address?key=mtbhj6FHUDK65jhm5YNhCClvB7GI52JS&location=philadelphia,pa';
// can be set as user input once we get everything connected
var testInput = document.querySelector('#input-field');
// some dude on stackoverflow says this is how to remove spaces, seems to work
var searchButton = document.querySelector('#search-button');
// set results to appear in test div
var parksDisplay = document.querySelector('.parkresults');
var weatherDisplay = document.querySelector('.weather-card');

// uses mapquest api to get coordinates based on city, state or zip
function getLocation(){
  // resets parks so it doesn't keep printing when new search entered
  parksDisplay.innerHTML = " ";
  // removes white space in search input
  var testLocation = testInput.value.replace(/\s+/g, '');
  fetch('https://www.mapquestapi.com/geocoding/v1/address?key=mtbhj6FHUDK65jhm5YNhCClvB7GI52JS&maxResults=1&location=' + testLocation)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    if(data.results[0].locations.length !== 1){
      alert('enter a city name');
      location.reload();
    }
    //grabs the coordinates from the api call
    var userLon = data.results[0].locations[0].latLng.lng;
    var userLat = data.results[0].locations[0].latLng.lat;
    //plugs the coords into mapquest search places api
    getParks(userLon, userLat)
    getWeather(userLon, userLat)
  })
  }

  // grabs weather data and displays them on the page
  function getWeather(lon,lat) {
    weatherDisplay.innerHTML=" "
    fetch("https://api.weatherbit.io/v2.0/current?&lat=" + lat + '&lon=' + lon + "&units=I&key=b5c97ec4269348f59f7363c259205e69")
    .then(function (response) {
      return response.json()
      .then(function(data) {
      //writes weather data to html
      var weatherTemp = document.createElement('p');
      //ADD BULMA AND STYLING CLASSES HERE
      // weatherTemp.classList.add('');
      var text = document.createTextNode('Temperature: ' + parseInt(data.data[0].temp) + '°F');
      weatherTemp.appendChild(text);
      weatherDisplay.appendChild(weatherTemp);
      
      var weatherWind = document.createElement('p');
      //ADD BULMA AND STYLING CLASSES HERE
      // weatherWind.classList.add('');
      var text = document.createTextNode('Wind: ' + parseInt(data.data[0].wind_spd) + 'MPH');
      weatherWind.appendChild(text);
      weatherDisplay.appendChild(weatherWind);

      var weatherHum = document.createElement('p');
      //ADD BULMA AND STYLING CLASSES HERE
      
      // weatherHum.classList.add('');
      var text = document.createTextNode('Humidity: ' + parseInt(data.data[0].rh) + '%');
      weatherHum.appendChild(text);
      weatherDisplay.appendChild(weatherHum);

      var weatherUv = document.createElement('p');
      //ADD BULMA AND STYLING CLASSES HERE
      // weatherUv.classList.add('');
      var text = document.createTextNode('UV: ' + parseInt(data.data[0].uv));
      weatherUv.appendChild(text);
      weatherDisplay.appendChild(weatherUv);

      var weatherPrecip = document.createElement('p');
      //ADD BULMA AND STYLING CLASSES HERE
      // weatherPrecip.classList.add('');
      var text = document.createTextNode('Precipitation: ' + parseInt(data.data[0].precip));
      weatherPrecip.appendChild(text);
      weatherDisplay.appendChild(weatherPrecip);

      var curImg = document.createElement('img');
      //ADD BULMA AND STYLING CLASSES HERE
      // curImg.classList.add('');
      curImg.src = ('https://www.weatherbit.io/static/img/icons/' + data.data[0].weather.icon + '.png');
      weatherDisplay.appendChild(curImg);
      })}
    )}


  //searches for 5 parks near coords, sorts by relevance for now because the filter is a query and not super specific
function getParks(lon, lat) {
  fetch('https://www.mapquestapi.com/search/v4/place?location=' + lon + '%2C' + lat +'&sort=relevance&feedback=false&key=9UthBdDGZK1MsiEFy48XWw3fWtC01AAJ&pageSize=5&q=parks')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    //can sort through the return data if you want, doesn't look like much comes back
    console.log(data);
    //console logging info to make it easier to figure out what we'll want printed to the page
    for(i=0;i<data.results.length;i++){
      console.log('park name: ' + data.results[i].name);
      //can use this link in an iframe if we want or a redirect link if that doesn't work out
      console.log('iframe src: https://www.mapquest.com/' + data.results[i].slug);
      // prints the park names to a test div
      var pSlug = data.results[i].slug;
      var pSlugFrame = document.createElement('iframe');
      //ADD STYLES TO IFRAME HERE
      pSlugFrame.setAttribute("src", ('https://www.mapquest.com/' + pSlug), "scrolling", "no")
      //ADD BULMA AND STYLING CLASSES HERE
      // pSlugFrame.classList.add('');
      parksDisplay.appendChild(pSlugFrame);
    }
  })
  }

searchButton.addEventListener('click', getLocation) 