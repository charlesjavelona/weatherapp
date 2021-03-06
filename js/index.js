if (navigator.geolocation) {
  var latitude;
  var longitude;

  navigator.geolocation.getCurrentPosition(function(position) {

    //Grab longitude and latitude
    //Pass it to url
    latitude = position.coords.latitude.toFixed(3); //Round to 3 decimal places
    longitude = position.coords.longitude.toFixed(3); //Round to 3 decimal places
    url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=metric' + '&appid=a8e29972d260d0df1639bf0d7199f680';

    //Get weather info using http://openweathermap.org/current
    $.getJSON(url, function(weatherJson) {
      /***Show data
         prettyPrint = JSON.stringify(json, null, '\t');
         alert(prettyPrint)
         ***/
      $('#cityCountry').text(weatherJson['name'] + ', ' + weatherJson.sys['country']);
      $('#dayTime').text(returnDay() + ', ' + returnTime());
      $('#icon').attr('src', returnIcon(weatherJson.weather[0].icon)); //Refactor to reflect weather icon
      $('#degrees').text(Math.round(weatherJson.main['temp']) + '°');

      //Change celsius to farenheit
      $('#farenheit').on('click', function() {
        $('#degrees').text(toFarenheit(weatherJson.main['temp']) + '°')
      }); //farenheit

      //Change farenheit to celcius
      $('#celsius').on('click', function() {
        $('#degrees').text(Math.round(weatherJson.main['temp']) + '°')
      }); //farenheit
    }); //
  }); //getJSON*

} else {
  console.log("Not supported")
} //End of app

//See reference: 
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
function replacer(key, value) {
  if (typeof value === "string") {
    return undefined;
  }
  return value;
}

function cleaner(json) {
  data = JSON.stringify(json, replacer, '\t');
  dataParse = JSON.parse(data);
  return dataParse;
}

//Return name of day
//Referrence: http://www.w3schools.com/jsref/jsref_getday.asp
function returnDay() {
  var day = new Date();
  var weekday = ['Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  return weekday[day.getDay()];
} //returnDay()

//Return Current Time
//Referrence http://www.w3schools.com/jsref/jsref_gethours.asp
function returnTime() {
  var day = new Date();
  var hour = addZero(day.getHours());
  var minutes = addZero(day.getMinutes());

  if (hour > 12) {
    return hour + ':' + minutes + ' PM';
  } else {
    return hour + ':' + minutes + ' AM';
  }

}

//Add extra zero for time function
function addZero(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

function returnIcon(id) {
  var urlIcon = 'https://openweathermap.org/img/w/' + id + '.png';
  return urlIcon;
}

//Formula: 
//Celsius to Fahrenheit:   (°C × 9/5) + 32 = °F
function toFarenheit(num) {
  return Math.round((num * 9 / 5) + 32);
}

//No need for this one
function toCelsius(num) {
  return Math.round(num - 32 * 5 / 9);
}