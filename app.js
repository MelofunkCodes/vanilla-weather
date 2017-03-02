//Putting EVERYTHING in an Immediately Invoked Function Expression (IIFE). This allows us to create scope and make variables below inaccessible to the global scope. I.e. user can't just access DARKSKY_API_KEY from console. 
/*
How is this done?
1. Wrap ALL your code in anonymous function.
2. Enclose anonymous function into brackets.
3. Add () beside whole thing-inside-brackets to INVOKE/CALL/EXECUTE the code
*/
(function() {
    var DARKSKY_API_URL = `https://api.darksky.net/forecast/`;
    var DARKSKY_API_KEY = `0cc176eabc4ede993d379115f3779cf8`;
    var CORS_PROXY = `https://cors-anywhere.herokuapp.com/`;

    var GOOGLE_MAPS_API_KEY = `AIzaSyDwIcW_r663w7Sqjx8aedjT4XvQPvYi3-Y`;
    var GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/geocode/json`;

    //essentially doing REQUEST-PROMISE for city lat and lng coordinates
    function getCoordinatesForCity(cityName) {
        var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

        // cityWeather.innerText = "Weather in " + cityName + ": ";

        return (
            fetch(url) //returns promise for a Response
            .then(response => response.json()) //Returns promise for the parsed JSON
            .then(function(data) {
                var coordinates = data.results[0].geometry.location;

                location = data.results[0].formatted_address;

                return coordinates;
            }) //Transform the response to only send back an object with lat and lng coordinates
        );
    }

    //knowing city lat and lng, now REQUEST-PROMISE city weather
    function getCurrentWeather(coords) {
        //Using template strings!
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

        return ( //fetch promise enclosed in brackets so you can make chain look nice on next line break. Wo brackets, Node REPL will run, but there will be error on browser
            fetch(url)
            .then(response => response.json())
            .then(data => data.currently)
        );

    }

    function getSkycon(icon) {
        // convert clear-day to "CLEAR_DAY"
        /*
        Logic
        1. Take string argument, and separate/splice it based on hyphens into an array
        2. map to new array variable .toUpperCase()
        3. Join to new variable with underscore
        4. Return that value
        */

        var words = icon.split(/-/g); //splits words into an array and removes hyphen
        var wordsArr = words.map(eachWord => eachWord.toUpperCase());

        var reformatted = wordsArr.join("_");

        return reformatted;

    }





    // }
    //=================================WIRING TO THE DOM===============================================
    var app = document.querySelector('#app');
    var cityForm = app.querySelector('.city-form');
    var cityInput = cityForm.querySelector('.city-input');
    var getWeatherButton = cityForm.querySelector('.get-weather-button');
    var cityWeather = app.querySelector('#city-weather');

    var location = '';

    //eventhandlers
    // //1. Wrong way to go about it. When user types in box and presses ENTER, get no result. Have to press button for event to happen. Have to change in HTML button type from "button" to "submit"
    // getWeatherButton.addEventListener('click', function(){
    //  var city = cityInput.value; //grab string of whatever user types into input box

    //  getCoordinatesForCity(city)
    //  .then(getCurrentWeather)
    //  .then(function(weather){
    //      cityWeather.innerText = 'Current temperature: ' + weather.temperature + '\xB0C';
    //  });
    // });

    //2. Better way to approach input box (listening to the whole form - input tag and button tag)
    //So whether user presses ENTER or clicks button, webpage will output temperature
    cityForm.addEventListener('submit', function(event) {
        event.preventDefault(); //???? how do you know to use this? If this is commented out, when user hits ENTER or clicks button after typing in box, value disappears and nothing happens

        var city = cityInput.value;

        while (cityWeather.hasChildNodes()) {
            cityWeather.removeChild(cityWeather.lastChild);
        }

        cityWeather.innerText = "loading...";

        getCoordinatesForCity(city)
            .then(getCurrentWeather)
            .then(function(weather) {
                console.log(weather);

                //SKYCON SECTION
                var skycons = new Skycons({ "color": "orange" });

                console.log(`weather.icon: ${weather.icon}`); //string
                // var icon = document.createElement('canvas');
                // icon.setAttribute('id', 'icon1');
                var message = getSkycon(weather.icon);

                skycons.add(document.querySelector("#icon1"), Skycons[message]);
                skycons.play();


                cityWeather.innerText = "";

                var address = document.createElement('h2');
                address.innerText = location;

                var temperature = document.createElement('p');
                temperature.innerText = `Current temperature: ${weather.temperature}\xB0C`;


                var windSpeed = document.createElement('p');
                windSpeed.innerText = `Wind Speed: ${weather.windSpeed} m/s`;

                var humidity = document.createElement('p');
                humidity.innerText = `Humidity: ${weather.humidity}`;

                var weatherData = [address, temperature, windSpeed, humidity];

                weatherData.forEach(function(data) {
                    cityWeather.appendChild(data);
                });


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
