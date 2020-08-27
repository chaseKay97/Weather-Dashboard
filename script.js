var APIKey = "&appid=ade2bb7e46d866c6271ae23428c893bc";
var cityHistory = JSON.parse(localStorage.getItem("city")) || []


$(document).ready(function () {
  $("#citySearch").on("click", function () {
    event.preventDefault();
    var cityInput = $("#cityInput").val().trim();

    if (cityHistory.indexOf(cityInput) === -1) {
      cityHistory.push(cityInput)
      window.localStorage.setItem("city", JSON.stringify(cityHistory));
    }
    $("#cityInput").val("");

    cityWeather(cityInput)
    cityForecast(cityInput)
  });


  function cityWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us" + APIKey;
    $.ajax({
      type: "GET",
      url: queryURL,
      dataType: "json",
      success: function (data) {

        $("#cityInput").empty();

        // variables cityName, cityTemp, cityHumid, cityWind, cityUV
        cityName = $(".cityName").html("#cityDiv").text(city);
        cityTemp = $(".cityTemp").html("#cityDiv").text("Temperature: " + ((data.main.temp - 273.15) * 1.80 + 32).toFixed(2) + " F");
        cityWind = $(".cityWind").html("#cityDiv").text("Wind speed: " + data.wind.speed + "mph");
        cityHumid = $(".cityHum").html("#cityDiv").text("Humidity: " + data.main.humidity + "%");
        weatherIcon = $(".weatherIcon").html("#cityDiv").attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
        cityUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }


  function cachedCities() {
    cityHistory = JSON.parse(localStorage.getItem("city")) || []
    for (var i = 0; i < cityHistory.length; i++) {
      var cityList = $("<button>")
      cityList.text(cityHistory[i])
      cityList.addClass("list-group-item p-3 cityBtns")
      $("#searchDiv").prepend(cityList)

    }
    $(".cityBtns").on("click", function () {
      var city = $(this).text();
      cityWeather(city)
      cityForecast(city);
    });
  }
  cachedCities();
});


function cityForecast(city) {
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + APIKey;
  $.ajax({
    type: "GET",
    url: queryURL,
    dataType: "json",
    success: function (data) {
      console.log(data);
    }
  });
  console.log(city);
}
function cityUVIndex(lat, lon) {
  $.ajax({
    type: "GET",
    url: `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}${APIKey}`,
    dataType: "json",
    success: function (data) {
      var uv = data[0].value;
      var cityUV = $(".cityUV").text("UV Index: " + uv);
      // uv = 2;
      $(".cityUV").removeClass("btn-success");
      $(".cityUV").removeClass("btn-warning");
      $(".cityUV").removeClass("btn-danger");
      $(".cityUV").removeClass("btn-info");
      if (uv <= 3) {
        cityUV.addClass("btn-success");
        $("#cityDiv").append(cityUV.append(cityUV));
      }
      else if (uv <= 6) {
        cityUV.addClass("btn-info");
        $("#cityDiv").append(cityUV.append(cityUV));
      }
      else if (uv <= 11) {
        cityUV.addClass("btn-warning");
        $("#cityDiv").append(cityUV.append(cityUV));
      }
      else {
        cityUV.addClass("btn-danger");
        $("#cityDiv").append(cityUV.append(cityUV));
      }
    }
  });
};