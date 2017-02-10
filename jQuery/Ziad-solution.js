(function() {
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  var DARKSKY_API_KEY = 'd28ab0f9b42fc84d1f68799a4c8119fa';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var GOOGLE_MAPS_API_KEY = 'AIzaSyCW4dTPRXL8O-w2jKdu0BVjOSXcW7OVdD4';
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

  function getCurrentWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}`;

    return (
      $.getJSON(url)
      .then(data => data.currently)
    );
  }

  function getCoordinatesForCity(cityName) {
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      $.getJSON(url)
      .then(data => data.results[0].geometry.location)
    );
  }

  var app = $('#app')
  var cityForm = app.find('.city-form');
  var cityInput = cityForm.find('.city-input');
  var getWeatherButton = cityForm.find('.get-weather-button');
  var cityWeather = app.find('.city-weather');

  cityForm.on('submit', function(event) {
    event.preventDefault(); // prevent the form from submitting

    var city = cityInput.val();

    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
      cityWeather.text('Current temperature: ' + weather.temperature);
    })
  });
})();