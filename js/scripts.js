/* The app is tested for Firefox, Safari and Chrome  */
/* The app run smoothly in codepen.io environment in Chrome */
/* There are location retrieval issues when run from codepen.io in Safari */

$(document).ready(function() {
    var lat = 0;
    var lng = 0;
    var temperature = 0;
    getLocationWeb();
    getTime();

    /* Retrieve user's location in Safari */
    function getAlternativeLocation() {
        /*
                $.getJSON("http://ip-api.com/json/?callback=?", function(data) {
                    updateCoordinates(data.lat, data.lon);
                    getWeather(data.lat, data.lon);
                });
        */
        var urlIpApi = "http://ip-api.com/json/?callback=?";
        $.ajax({
            dataType: "jsonp",
            url: urlIpApi,
            jsonCallback: 'jsonp',
            cache: false,
            success: function(data) {
                updateCoordinates(data.lat, data.lon);
                getWeather(data.lat, data.lon);
            }
        });
    }

    function updateCoordinates(latNew, lngNew) {
        lat = latNew;
        lng = lngNew;
    }

    /* This method of retrieving location is NOT working in Safari. However, works in Firefox and Chrome
    To retrievhe user's location in Safari we use an alternative method getAlternativeLocation()*/
    function getLocationWeb() {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
            return;
        }

        var geoOptions = {
            enableHighAccuracy: true
        };

        function geoError(error) {
            console.log("Can't retrieve the location using navigator.geolocation");
            getAlternativeLocation();
        }

        function geoSuccess(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            updateCoordinates(lat, lng);
            getWeather(lat, lng);
        }
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    }

    function getWeather(lat, lng) {
        var iconPath = "http://openweathermap.org/img/w/";
        var url = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=metric&appid=393480cc10010dd643349a84fd338b7c";
        $.ajax({
            dataType: "jsonp",
            url: url,
            jsonCallback: 'jsonp',
            //data: { q: city },
            cache: false,
            success: function(data) {
                $("#image-weather").attr("src", iconPath + data.weather[0].icon + ".png");
                temperature = Math.round(data.main.temp);
                $("#temperature").text(Math.round(data.main.temp));
                $("#weather-conditions").text(data.weather[0].description);
                $("#time").text(getTime());
                setBodyImage(data.weather[0].main);
            }
        });

        getCityCountry(lat, lng);
    }

    /* We retrieve user's city and country based on the geographical coordinates because the service http://ip-api.com returns the location
    of the internet provider a user is on a mobile device with a roaming on provided by a different country */
    function getCityCountry(lat, lng) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true";
        $.getJSON(url, function(response) {
            var addressComponentsArray = response.results[0].address_components;
            var clientLocation = {};
            for (var i = 0; i < addressComponentsArray.length; i++) {
                if (addressComponentsArray[i].types[0] === 'locality') {
                    clientLocation.city = addressComponentsArray[i].short_name;
                }
                if (addressComponentsArray[i].types[0] === 'country') {
                    clientLocation.country = addressComponentsArray[i].long_name;
                }
            }
            $("#city-country").html(clientLocation.city + ', ' + clientLocation.country);
        });
    }

    function setBodyImage(wCondition) {

        if (wCondition !== null) {

            var usplashBodyImageUrl = 'https://source.unsplash.com/1600x900/?' + wCondition.toLowerCase();
            $("body").css("background-image", "url(" + usplashBodyImageUrl + ")");
            $("body").addClass("tint t2");

        }

    }

    function getTime() {
        var currentdate = new Date();
        var datetime = currentdate.getHours() + ":" + currentdate.getMinutes();
        return currentdate.getHours() + ":" + currentdate.getMinutes();
    }


    /* Celsius/Fahrenheit buttons*/
    $('.btn').click(function() {
        $('.btn').removeClass('btn-primary').addClass('btn-default');
        $(this).removeClass('btn-default').addClass('btn-primary');
    });

    $('#button-cels').click(function() {
        $("#temperature").text(temperature);
    });

    $('#button-fahr').click(function() {
        $("#temperature").text(Math.round((temperature * (9 / 5)) + 32));
    });

});
