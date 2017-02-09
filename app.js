//Putting EVERYTHING in an Immediately Invoked Function Expression (IIFE). This allows us to create scope and make variables below inaccessible to the global scope. I.e. user can't just access DARKSKY_API_KEY from console. 
/*
How is this done?
1. Wrap ALL your code in anonymous function.
2. Enclose anonymous function into brackets.
3. Add () beside whole thing-inside-brackets to INVOKE/CALL/EXECUTE the code
*/
(function(){
var DARKSKY_API_URL = `https://api.darksky.net/forecast/`;
var DARKSKY_API_KEY = `0cc176eabc4ede993d379115f3779cf8`;
var CORS_PROXY = `https://cors-anywhere.herokuapp.com/`;

var GOOGLE_MAPS_API_KEY = `AIzaSyDwIcW_r663w7Sqjx8aedjT4XvQPvYi3-Y`;
var GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/geocode/json`;

//essentially doing REQUEST-PROMISE for city lat and lng coordinates
function getCoordinatesForCity(cityName){
	var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

	// cityWeather.innerText = "Weather in " + cityName + ": ";

	cityWeather.innerText = "loading...";

	return (
		fetch(url) //returns promise for a Response
		.then(response => response.json()) //Returns promise for the parsed JSON
		.then(data => data.results[0].geometry.location)	//Transform the response to only send back an object with lat and lng coordinates
		);
}

//knowing city lat and lng, now REQUEST-PROMISE city weather
function getCurrentWeather(coords){
	//Using template strings!
	var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

	return ( //why are the fetch promise chains enclosed in brackets??????
		fetch(url)
		.then(response => response.json())
		.then(data => data.currently)
		);

}

//=================================WIRING TO THE DOM===============================================
var app = document.querySelector('#app');
var cityForm = app.querySelector('.city-form');
var cityInput = cityForm.querySelector('.city-input');
var getWeatherButton = cityForm.querySelector('.get-weather-button');
var cityWeather = app.querySelector('.city-weather');

//eventhandlers
// //1. Wrong way to go about it. When user types in box and presses ENTER, get no result. Have to press button for event to happen. Have to change in HTML button type from "button" to "submit"
// getWeatherButton.addEventListener('click', function(){
// 	var city = cityInput.value; //grab string of whatever user types into input box

// 	getCoordinatesForCity(city)
// 	.then(getCurrentWeather)
// 	.then(function(weather){
// 		cityWeather.innerText = 'Current temperature: ' + weather.temperature + '\xB0C';
// 	});
// });

//2. Better way to approach input box (listening to the whole form - input tag and button tag)
//So whether user presses ENTER or clicks button, webpage will output temperature
cityForm.addEventListener('submit', function(event){
	event.preventDefault(); //???? how do you know to use this? If this is commented out, when user hits ENTER or clicks button after typing in box, value disappears and nothing happens

	var city = cityInput.value;

	getCoordinatesForCity(city)
	.then(getCurrentWeather)
	.then(function(weather){
		cityWeather.innerText = 'Current temperature: ' + weather.temperature + '\xB0C';
	});
})

})();
//==========================================TESTING===============================================
// //this did not work in the console -- why??
// getCoordinatesForCity("montreal").then(console.log);

// //but this works
// getCoordinatesForCity("montreal").then(response => console.log(response));

// getCurrentWeather({lat: 45.5, lng: -73.5}).then(response => console.log(response));

// getCoordinatesForCity('montreal')
// .then(getCurrentWeather)
// .then(data => console.log(`The current temperature is ${data.temperature}\xB0C`));
