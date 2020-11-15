"use strict";

window.addEventListener('load', () => {

    const addSymbol = document.querySelector('.cityToAdd i');
    const input = document.querySelector('#input');
    const miniAddSymbol = document.querySelector('.fa-plus');
    const currentWeatherInfo = document.querySelector('#currentWeatherInfo');
    const description = document.querySelector('#description');
    const currentLogo = document.querySelector('#currentLogo');
    const timezone = document.querySelector('#currentTimezone');
    const minMax = document.querySelector('#minMax');
    const humidity = document.querySelector('#humidity');
    const alert = document.querySelector('#alert');
    const celsius = document.querySelector('#celsius');
    const fahrenheit = document.querySelector('#fahrenheit');
    let lon;
    let lat;

    // search engine
    // add a feature which won't ring 'Add More cities' back if the input value is not empty

    addSymbol.addEventListener('click', () => {
        window.location.hash = 'input';
        miniAddSymbol.style.top = '0.73rem';
        input.style.border = '2px solid red';
        input.focus();
    });

    input.addEventListener('blur', () => {
        input.style.border = 'none';
        miniAddSymbol.style.top = '0.55rem';
    });

    // check if the location exists
    if (navigator.geolocation) {
        currentWeatherInfo.style.display = currentLogo.style.display = 'auto';
        alert.style.display = 'none';

        // get the current location
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            const apiKey = '2f16685a3fb03f47a60534438b10f855';
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            // fetch / convert / display data of the current location
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    timezone.innerHTML = `${data.name}, ${data.sys.country}`;
                    celsius.innerHTML = `<i class="fa fa-thermometer-half"></i> ${Math.round(data.main.temp)}&#8451;`;
                    fahrenheit.innerHTML = `<i class="fa fa-thermometer-three-quarters"></i> ${Math.round(data.main.temp * 33.8)}&#8457;`;
                    minMax.innerHTML = `<i class="fa fa-sort-alt"></i> ${Math.round(data.main.temp_min)}&#8451; / ${Math.round(data.main.temp_max)}&#8451;`;
                    humidity.innerHTML = `<i class="fa fa-tint"></i> ${data.main.humidity}%`;
                    description.style.textTransform = 'capitalize';
                    description.innerHTML = data.weather[0].description;
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