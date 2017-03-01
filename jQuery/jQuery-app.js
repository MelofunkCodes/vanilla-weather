//jQuery version

(function() {
    var DARKSKY_API_URL = `https://api.darksky.net/forecast/`;
    var DARKSKY_API_KEY = `0cc176eabc4ede993d379115f3779cf8`;
    var CORS_PROXY = `https://cors-anywhere.herokuapp.com/`;

    var GOOGLE_MAPS_API_KEY = `AIzaSyDwIcW_r663w7Sqjx8aedjT4XvQPvYi3-Y`;
    var GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/geocode/json`;

    //essentially doing REQUEST-PROMISE for city lat and lng coordinates
    function getCoordinatesForCity(cityName) {
        var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

        return ( //fetch is new thing of ES6, but not all browsers support it (esp Safari in your iPhones, so while new and nice, use ajax call)
            $.getJSON(url)
            .then(function(data) {

                console.log("city data: ", data);

                var coordinates = data.results[0].geometry.location;

                location = data.results[0].formatted_address;

                return coordinates;
            })
        );
    }

    //knowing city lat and lng, now REQUEST-PROMISE city weather
    function getCurrentWeather(coords) {
        //Using template strings!
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

        return ( //fetch promise enclosed in brackets so you can make chain look nice on next line break. Wo brackets, Node REPL will run, but there will be error on browser
            $.getJSON(url)
            .then(data => data.currently)
        );

    }

    //TO DO LATER
    // function getSkycon(icon){
    // 	// convert clear-day to "CLEAR_DAY"

    // 	Logic
    // 	1. Take string argument, and separate/splice it based on hyphens into an array
    // 	2. map to new array variable .toUpperCase()
    // 	3. Join to new variable with underscore
    // 	4. Return that value



    // }
    //=================================WIRING TO THE DOM===============================================
    //it's nice to still do below, because if I just generally point to $('.city-input'), browser will look at WHOLE document until it finds class name of "city-input". If you do it like cityInput = cityForm.find('.city-input'), it tells browser to look in the form section of document, and find class name of "city-input". It will make browser run faster, ESP if you have a LOT of content on your page
    var app = $('#app');
    var cityForm = app.find('.city-form');
    var cityInput = cityForm.find('.city-input');
    var getWeatherButton = cityForm.find('.get-weather-button');
    var cityWeather = app.find('#city-weather');

    var location = '';
    $(document).ready(function() { //don't have to put this in every script file, but it's nice to have. If you have MANY script files, don't have to have $(document).ready in each file as it's task HEAVY. Just have it in 1 (have 2 or 3 at most) because it will slow down your browser. 

        cityForm.on('submit', function(event) {
            event.preventDefault();

            // var city = cityInput.val();
            var city = $('.city-input', cityForm).val(); //another alternative to line above to prevent browser from searching WHOLE document until it finds class name of "city-input"
            // console.log("city:", city); 

            if (city.length === 0) { //if user submits with nothing in input box
                cityWeather.text('You need to enter a City to get weather. Try again!');
            } 
            else {
            	// console.log(cityWeather);
                cityWeather.empty();

                cityWeather.text('loading...');

                getCoordinatesForCity(city)
                .then(getCurrentWeather)
                .then(function(weather) {
                    // console.log(weather); //getting output here

                    cityWeather.text('');

                    console.log("location: ", location);
                    var address = $('<h2>').text(location);

                    // console.log('address: ', address); //should find result in innerHTML property of the object

                    var temperature = $('<p>').text(`Current temperature: ${weather.temperature}\xB0C`);
                    var icon = $('<p>').text(`(display Climacons here) ${weather.icon}`);
                    var windSpeed = $('<p>').text(`Wind Speed: ${weather.windSpeed} m/s`);
                    var humidity = $('<p>').text(`Humidity: ${weather.humidity}`);
                    var weatherData = [address, temperature, icon, windSpeed, humidity];

                    weatherData.forEach(function(data) {
                        app.append(data);
                    });

                });
            }


        });
    });


})();
