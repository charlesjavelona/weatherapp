//Intitalize global data objects, which will be used to store api objects
userLocation = {};	//Returns only the that is needed to diplay to the html template
weatherInfo = {};
var template;
//Load jQuery Mobile the page shows
$(document).on('pagebeforeshow', function() {
	template = $('#handlebars').html();
//	$('div').remove();
});	

$(document).on('pagecreate', function() {

	//GetPosition and Get Weather ChainedV
	getPosition().done(function () {
		console.log('Execute getPositon.done() ');		
		getCurrentWeather().done(function () {
			console.log('Execute getWeather.done()');
			getTemplate();
		});//getWeather
	})//getPosition

//Reference:http://stackoverflow.com/questions/14468659/jquery-mobile-document-ready-vs-page-events/14469041#14469041	
	$(document).on('click', '#button', function(e) {
		debugger;
		console.log(userLocation);
			getWeatherForecast().done(function() {
				console.log('Execute getCurrentWeather.done()');	
			});
	});
});


	function getPosition() {
		var deferred = $.Deferred();
		navigator.geolocation.getCurrentPosition(function(position) {
		
//Pass data to see if it GETS the positions
			console.log(position.coords.latitude + ' ' + position.coords.longitude);
			userLocation.latitude = position.coords.latitude;
			userLocation.longitude = position.coords.longitude;
			deferred.resolve();
		});
		return deferred.promise();
	}


	function getCurrentWeather() {
		var deferred = $.Deferred();
		url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + userLocation.latitude + '&lon=' + userLocation.longitude + '&units=metric' + '&appid=a8e29972d260d0df1639bf0d7199f680';

		$.getJSON(url, function(weatherJson) {
      			//Show data
         		prettyPrint = JSON.stringify(weatherJson, null, '\t');
			console.log(prettyPrint);
			weatherInfo = weatherJson;
			deferred.resolve();
		});//getJSON
		return deferred.promise();
	}//getWeather
	
	function getWeatherForecast() {
		var deferred = $.Deferred();
		url = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + userLocation.latitude + '&lon=' + userLocation.longitude + '&units=metric&appid=a8e29972d260d0df1639bf0d7199f680&cnt=7' 

		$.getJSON(url, function(weatherJson) {
      			//Show data
         		prettyPrint = JSON.stringify(weatherJson, null, '\t');
			console.log(prettyPrint);
			//weatherInfo = weatherJson;
			deferred.resolve();
		});//getJSON
		return deferred.promise();
	}//getWeather

	function getTemplate() {
		//console.log(template);	
		var templateScript = Handlebars.compile(template);
		//console.log(templateScript);
		/*weatherInfo is global right now*/
		var html = templateScript(weatherInfo);
		//console.log(html);
		$(document.body).append(html);
	}

//******Handlebar Helper Functions*****************//
	Handlebars.registerHelper('computeIcon', function() {
	  	return'https://openweathermap.org/img/w/' + weatherInfo.weather[0].icon + '.png';
	});
/*if (navigator.geolocation) {
  var latitude;
  var longitude;

  navigator.geolocation.getCurrentPosition(function(position) {

    //Grab longitude and latitude
    //Pass it to url
    latitude = position.coords.latitude.toFixed(3); //Round to 3 decimal places
    longitude = position.coords.longitude.toFixed(3); //Round to 3 decimal places
    url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=metric' + '&appid=a8e29972d260d0df1639bf0d7199f680';

    //Get weather info using http://openweathermap.org/current
    $.getJSON(url, function(weatherJson) {
      //Show data
         prettyPrint = JSON.stringify(weatherJson, null, '\t');
         alert(prettyPrint)
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
*/
