"use strict";

window.addEventListener('load', () => {

    let element = elem => document.querySelector(elem);

    const searchbarOutterContainer = element('#searchbarOutterContainer');
    const weatherDisplayContainer = element('.weatherDisplayContainer');
    const input = element('#input');
    const addSymbol = element('.cityToAdd i');
    const miniAddSymbol = element('.fa-plus');
    const placeholder = element('.labelContainer');
    const currentWeatherInfo = element('#currentWeatherInfo');
    const currentLogo = element('#currentLogo');
    const timezone = element('#currentTimezone');
    const minMax = element('#minMax');
    const humidity = element('#humidity');
    const alert = element('#alert');
    const celsius = element('#celsius');
    const fahrenheit = element('#fahrenheit');
    const apiKey = '2f16685a3fb03f47a60534438b10f855';
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    let api;
    let lon;
    let lat;


/* *************************************************** */
/* ****************** SEARCH ENGINE ****************** */
/* *************************************************** */ 

    miniAddSymbol.addEventListener('click', () => {
        api = `${proxy}api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=metric`;
        console.log(api)
        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.message === undefined) {
                    const newWeatherContainer = document.createElement('div');
                    newWeatherContainer.classList.add('weatherInnerContainer');
                    newWeatherContainer.innerHTML = `<div class="weatherInfo">
                                                        <h2 class="timeZone">${data.name}, ${data.sys.country}</h2>
                                                        <p>
                                                            <span><i class="fa fa-thermometer-half"></i> ${Math.round(data.main.temp)}&#8451;</span>
                                                            <span class="fahrenheit"><i class="fa fa-thermometer-three-quarters"></i> ${Math.round( (data.main.temp * 9/5) + 32 )}&#8457;</span>
                                                        </p>
                                                        <p>
                                                            <span><i class="fa fa-sort-alt"></i> ${Math.round(data.main.temp_min)}&#8451; / ${Math.round(data.main.temp_max)}&#8451;</span>
                                                            <span class="humidity"><i class="fa fa-tint"></i> ${data.main.humidity}%</span>
                                                        </p>
                                                    </div>
    
                                                    <div class="weatherLogo">
                                                        <figure>
                                                            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Logo">
                                                            <figcaption>${data.weather[0].description}</figcaption>
                                                        </figure>
                                                    </div>`;
                        
                    weatherDisplayContainer.insertBefore(newWeatherContainer, weatherDisplayContainer.childNodes[weatherDisplayContainer.childNodes.length - 2]);    
                }
                else if (data.message === 'Nothing to ') {
                    //
                }
            })
            .catch(err => {
                //console.log(`Error : ${err}`);
            });
    });


/* **************************************************** */
/* **************** INPUT INTERACTIONS **************** */
/* **************************************************** */ 

    // focus on the input when the visitor clicks on the add symbol
    addSymbol.addEventListener('click', () => {
        window.location.hash = 'searchbarOutterContainer';
        input.focus();
    });

    // keep the placeholder disappear when the input is not empty


/* *************************************************** */
/* AUTOMATIC GEOLOCATOR FOR VISITORS' CURRENT LOCATION */
/* *************************************************** */ 

    // check if the location exists
    if (navigator.geolocation) {
        currentWeatherInfo.style.display = currentLogo.style.display = 'auto';
        alert.style.display = 'none';

        // get the current location
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        
            // fetch / convert / display data of the current location
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    timezone.innerHTML = `${data.name}, ${data.sys.country}`;
                    celsius.innerHTML = `<i class="fa fa-thermometer-half"></i> ${Math.round(data.main.temp)}&#8451;`;
                    fahrenheit.innerHTML = `<i class="fa fa-thermometer-three-quarters"></i> ${Math.round( (data.main.temp * 9/5) + 32 )}&#8457;`;
                    minMax.innerHTML = `<i class="fa fa-sort-alt"></i> ${Math.round(data.main.temp_min)}&#8451; / ${Math.round(data.main.temp_max)}&#8451;`;
                    humidity.innerHTML = `<i class="fa fa-tint"></i> ${data.main.humidity}%`;
                    currentLogo.innerHTML = `<figure>
                                                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather logo">
                                                <figcaption id="description" style="text-transform: capitalize;">${data.weather[0].description}</figcaption>
                                            </figure>`;
                })
                .catch(err => {
                    console.log(`Error : ${err}`);
                }); 
            
        });
    }
    else {
        currentWeatherInfo.style.display = currentLogo.style.display = 'none';
        alert.style.display = 'block';   
    }
});

