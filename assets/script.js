$(document).ready(function (){
    var cityName = "";
    var lat = "";
    var lon = "";

    function getWeatherData(a,b) {
        var queryUrlOne = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=aec299195260a001b09706b5bfe740f7&units=imperial";
    
        fetch(queryUrlOne)
            .then(function(response) {
                return response.json();
            })
            .then(function(data){
                console.log(data);

                $(".card-deck").empty();

                var icon = data.current.weather[0].icon;
                var iconImg = $("<img>");
                iconImg.addClass("img-fluid");
                iconImg.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
                $("#city").append(iconImg);

                // update background of UV index color
                var uvi = parseInt(data.current.uvi);
                if(uvi <= 2) {
                    $(".color").css({"background-color":"green", "color":"white"});
                } else if(uvi >=3 && uvi <=5){
                    $(".color").css({"background-color":"yellow", "color":"black"});
                } else if (uvi >=8 && uvi <=10) {
                    $(".color").css({"background-color":"red", "color":"white"});
                } else {
                    $(".color").css({"background-color":"violet", "color":"white"});
                }

                // output current data for the city:
                $("#temp").text("Temperature: " + data.current.temp + " F");
                $("#humidity").text("Humidity: " + data.current.humidity + " %");
                $("#wind").text("Wind Speed: " + data.current.wind_speed + " MPH");
                $(".color").text(data.current.uvi);

                $("#current").css({"display":"block"});

                var daily = data.daily;

                for(var i=1; i < daily.length - 2 ; i++) {
                    var dailyDate = moment.unix(daily[i].dt).format("dddd, MM/DD/YYYY");
                    var dailyTemp = daily[i].temp.day;
                    var dailyHum = daily[i].humidity;
                    var dailyWind = daily[i].wind_speed;
                    var dailyIcon = daily[i].weather[0].icon;

                    var dailyDiv = $("<div class='card tex-white bg-primary p-2'>");
                    var hDate = $("<h5>");
                    var pTemp = $("<p>");
                    var pHum = $("<p>");
                    var pWind = $("<p>");
                    var imgIcon = $("<img>");

                    hDate.text(dailyDate);
                    imgIcon.attr("src", "https://openweathermap.org/img/wn/" + dailyIcon + "@2x.png");
                    imgIcon.addClass("img-fluid");
                    imgIcon.css({"width":"100%"});
                    pTemp.text("TEMP: " + dailyTemp + " F");
                    pHum.text("HUMIDITY: " + dailyHum + " %");
                    pWind.text("WIND SPEED: " + dailyWind + " MPH");

                    dailyDiv.append(hDate);
                    dailyDiv.append(imgIcon);
                    dailyDiv.append(pTemp);
                    dailyDiv.append(pHum);
                    dailyDiv.append(pWind);
                    $(".card-deck").append(dailyDiv);

                    $("#five-day").css({"display":"block"});
                }
            })
    
    }

// get weather 
function getWeather() {
   var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&lang=en&appid=aec299195260a001b09706b5bfe740f7";

    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            lat = data.coord.lat;
            lon = data.coord.lon;
        
            $("#city").text(data.name);
            $("#date").text(moment.unix(data.dt).format("dddd, MM/DD/YYYY"));

            localStorage.setItem("cityname", data.name);

            getWeatherData(lat,lon);
        })
};

function startData() {
    cityName = localStorage.getItem("cityname");
    if (cityName !== null) {
        var cityList = $("<button>");
        cityList.addClass("list-group-item list-group-item-action");
        cityList.text(cityName);
        $("ul").prepend(cityList);
        getWeather();
    }
}

function searchBtn() {
    cityName = $("input").val().trim();

    var cityList = $("<button>");
    cityList.addClass("list-group-item list-group-item-action");
    cityList.text(cityName);

    $("ul").prepend(cityList);
    $("input").val("");

    getWeather();
}

startData();

$("#city-search").submit(function(event){
    event.preventDefault();
    searchBtn();
})

$("#search-btn").click(function(event){
    event.preventDefault();
    searchBtn();
})

$("ul").on("click", "button", function(){
    cityName = $(this).text();
    console.log(cityName);
    getWeather();
})

});
