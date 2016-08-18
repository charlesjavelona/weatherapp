//Intitalize global data objects, which will be used to store api objects
var userLocation = {};	//Returns only the that is needed to diplay to the html template
var weatherInfo = {};
var template = {};
//Load jQuery Mobile the page shows
$(document).on('pagebeforeshow', function() {
	template.weatherTemplate = $('#weatherTemplate').html();
	template.forecastTemplate = $('#forecastTemplate').html();
	template.ctr = $('#chartTemplate');
});	

$(document).on('pagecreate', function() {
	if($("#citySearch").val() == "") {
		//GetPosition and Get Weather Chained
		getPosition().done(function () {
			getCurrentWeather().done(function () {
				getWeatherTemplate();
			});//getWeather
		})//getPosition
	}

	$( "#button" ).on("collapsibleexpand", function( event, ui ) {
		getWeatherForecast().done(function() {
			getForecastTemplate();	
			getChartTemplate();
		})
		.fail(function () {
			alert('API called failed');
		});
	});

	$("#citySearch").keypress(function(e) {
		
		//Collapse accordion
		$("#button").collapsible("collapse");
		if(e.which == 13) {
			getCityWeather().done(function () {
			
			}).then(function() {
				var objects = [];
				objects.push(JSON.parse(localStorage.getItem('searches')));
				if (objects == null) {
					localStorage.setItem("searches", JSON.stringify($('#citySearch').val()));
				} else {
					objects.push($('#citySearch').val());
					localStorage.setItem("searches", JSON.stringify(objects));
				}
				
				getWeatherTemplate();
			})
			.fail(function () {
				alert("API call failed");
			});
		}
	})
});

	function getPosition() {
		var deferred = $.Deferred();
		navigator.geolocation.getCurrentPosition(function(position) {
			userLocation.latitude = position.coords.latitude.toFixed(2);
			userLocation.longitude = position.coords.longitude.toFixed(2);
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
			weatherInfo = weatherJson;
			deferred.resolve();
		});//getJSON
		return deferred.promise();
	}//getWeather
	
	function getWeatherForecast() {
		var deferred = $.Deferred();
		url = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + userLocation.latitude + '&lon=' + userLocation.longitude + '&units=metric&appid=a8e29972d260d0df1639bf0d7199f680&cnt=5'; 

		$.getJSON(url, function(weatherJson) {
      			//Show data
         		prettyPrint = JSON.stringify(weatherJson, null, '\t');
			weatherInfo.forecast = weatherJson;
			deferred.resolve();
		});//getJSON
		return deferred.promise();
	}//getWeather

	function getCityWeather() {
		var deferred = $.Deferred();
		url = 'http://api.openweathermap.org/data/2.5/weather?q=' + $('#citySearch').val() + '&units=metric' + '&appid=a8e29972d260d0df1639bf0d7199f680';

		$.getJSON(url, function(weatherJson) {
      			//Show data
         		prettyPrint = JSON.stringify(weatherJson, null, '\t');
			weatherInfo = weatherJson;
			//Change userLocation
			userLocation.latitude = weatherJson.coord.lat;
			userLocation.longitude = weatherJson.coord.lon;
			deferred.resolve();
		});//getJSON
		return deferred.promise();
	}//getWeather

	function getWeatherTemplate() {
		var templateScript = Handlebars.compile(template.weatherTemplate);
		/*weatherInfo is global right now*/
		var t = templateScript(weatherInfo);
		if($("#weatherTemplate").html() != undefined) {
			$("#weatherTemplate").replaceWith(t);
		} else {
			$("#page").replaceWith(t);	
		}
	}

	function getForecastTemplate() {
		var templateScript = Handlebars.compile(template.forecastTemplate);
		/*weatherInfo is global right now*/
		var t = templateScript(weatherInfo.forecast);
		if($("#forecastTemplate").html() != undefined) {
			$("#forecastTemplate").replaceWith(t);
		} else {
			$("#forecastPage").replaceWith(t);	
		}
	}

	function getChartTemplate() {
		//Get 5 Day Weather Forecast Data From 
		var labels = getLabels();
		var max = getMax();
		var min = getMin();
		

		var lineData = {
			    labels: labels,
			        datasets: [
				{
					label: 'Max Temperature',
					fillColor: '#382765',
					data: max 
				},
				{
					label: 'Min Temperature',
					fillColor: '#7BC225',
					data: min 
				}
			        ]
		};
		//Pass charts
		var clientsChart = new Chart(template.ctr, {
			type: 'line', 
			data: lineData
		});
	}//function

	function getLabels() {
		var labels = [];
		weatherInfo.forecast.list.forEach(function(a) {
			labels.push(unixTimeConverter(a.dt));
		});
		return labels;
	} 
	function unixTimeConverter(u) {
		return getWeekDay(new Date(u * 1000).getDay());
	}
	function getWeekDay(day) {
		var weekday = new Array(7);
		weekday[0]=  "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
		return weekday[day];
	}
	function getMax() {
		var max = [];
		weatherInfo.forecast.list.forEach(function(a) {
			max.push(a.temp.max);
		});
		return max;
	} 
	function getMin() {
		var min = [];
		weatherInfo.forecast.list.forEach(function(a) {
			min.push(a.temp.min);
		});
		return min;
	} 

		
//******Handlebar Helper Functions*****************//
	Handlebars.registerHelper('computeIcon', function(icon) {
	  	return 'https://openweathermap.org/img/w/' + icon + '.png';
	});

	Handlebars.registerHelper('unixTimeConvert', function(u) {
		return new Date(u * 1000).toGMTString();
	})
