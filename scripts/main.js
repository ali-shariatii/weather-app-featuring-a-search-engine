"use strict";

/*

Next Update: fixing line 168 DOMException error.

*/

window.addEventListener('load', () => {

    let elm = element => document.querySelector(element);

    const weatherOutterContainer = elm('.weatherOutterContainer'),
        input = elm('.input'),
        addCityBtn1 = elm('.addCityBtn1'),
        addCityBtn2 = elm('.addCityBtn2 i'),
        placeholder = elm('.placeholder span'),
        currentLogo = elm('#currentLogo'),
        timeZone = elm('#currentTimeZone'),
        minMaxTemp = elm('#minMaxTemp'),
        humidity = elm('#humidity'),
        celsius = elm('#celsius'),
        fahrenheit = elm('#fahrenheit'),
        apiKey = '2f16685a3fb03f47a60534438b10f855',
        proxy = 'https://cors-anywhere.herokuapp.com/';

    let warningAlarm = elm('.searchbarOutterContainer p'), 
        api, 
        lon, 
        lat;

/* *************************************************** */
/* ****************** SEARCH ENGINE ****************** */
/* *************************************************** */ 

    let warning = (duration) => {
        setTimeout(() => {
            warningAlarm.style.opacity = '0';
        }, duration);
    }

    warning(3500);

    input.addEventListener('input', () => {
        switch (true) {
            case (input.value.length > 0) :
                placeholder.style.color = 'transparent';
                placeholder.style.left = '0';
                addCityBtn1.style.right = '0.6rem';
                addCityBtn1.style.pointerEvents = 'auto';
                addCityBtn1.querySelector('i').style.color = 'rgb(48, 160, 197)';
                addCityBtn1.querySelector('i').style.transform = 'rotateZ(180deg)';
                break;
              
            case (input.value.length === 0) :
                placeholder.style.color = 'rgb(170, 170, 170)';
                placeholder.style.left = '0.6rem';
                addCityBtn1.style.right = '0';
                addCityBtn1.style.pointerEvents = 'none';
                addCityBtn1.querySelector('i').style.color = 'transparent';
                addCityBtn1.querySelector('i').style.transform = 'rotateZ(0deg)';
                break;
        }
    });

    addCityBtn1.querySelector('i').addEventListener('click', () => {

        let currentTimeZones = document.querySelectorAll('.timeZone');
        let alertFree = true;

        for (let i = 0; i < currentTimeZones.length; i++) {

            // prevent timeZone duplication
            if (currentTimeZones[i].innerText.slice(0, currentTimeZones[i].innerText.indexOf(',')).toLowerCase().includes(input.value.toLowerCase())) {
                alertFree = false;
                warningAlarm.style.opacity = '1';
                warningAlarm.innerHTML = `<i>${input.value}</i> has already been added. Please try a new time zone.`;
                warning(2000);
                break;
            } 
        }

        if (input.value.length < 3 || /^\s+$/.test(input.value)) {
            alertFree = false;
            warningAlarm.style.opacity = '1';
            warningAlarm.innerText = 'Please add a proper input.';
            warning(2000);
        }

        if (alertFree === true) {

            warningAlarm.style.opacity = '1';
            warningAlarm.innerText = 'Waiting for the server to respond ... \n More click attempts may result longer response.';
            
            api = `${proxy}api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=metric`;
            console.log(api)
            fetch(api)
                .then(response => {
                    console.log(`RESPONSE STATUS : ${response.status}`);
  
                    // server is down
                    if (response.status === 429) {
                        warningAlarm.style.opacity = '1';
                        warningAlarm.innerText = 'Sorry, the server is not responding. Try again in 5 minutes.';
                        warning(4500);
                    }

                    // time zone non-existent.
                    if (response.status === 404) {
                        warningAlarm.style.opacity = '1';
                        warningAlarm.innerText = "Sorry, the time zone doesn't exist or misspelled. You may also try using (-) or accents.";
                        warning(4500);
                    }

                    // fetch successful
                    if (response.status === 200) {
                        return response.json();
                    }
                })
                .then(data => {
                    warning(1000);
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
                                                    </div>
                                                    
                                                    <div class="cityToRemove">
                                                        <i class="fa fa-map-marker-minus"></i>
                                                    </div>`;
                        
                    weatherOutterContainer.insertBefore(newWeatherContainer, weatherOutterContainer.childNodes[weatherOutterContainer.childNodes.length - 2]); 
                })
                .then(() => {
                    // reset the searchbar
                    input.value = '';
                    placeholder.style.color = 'rgb(170, 170, 170)';
                    placeholder.style.left = '0.6rem';
                    addCityBtn1.style.right = '0';
                    addCityBtn1.style.pointerEvents = 'none';
                    addCityBtn1.querySelector('i').style.color = 'transparent';
                    addCityBtn1.querySelector('i').style.transform = 'rotateZ(0deg)';
                    input.blur();
    
                    // remove the time zone you want
                    let citiesToRemove = document.querySelectorAll('.cityToRemove');
                    if (document.body.contains(elm('.cityToRemove'))) {
    
                        for (let i = 0; i < citiesToRemove.length; i++) {
                            let cityToRemove = citiesToRemove[i].parentNode;
                
                            citiesToRemove[i].addEventListener('click',() => {
                                weatherOutterContainer.removeChild(cityToRemove);
                            });
                        }
                    }
                })
                .catch(err => {
                    console.log(`Error : ${err}`);
                });
        }
    });

    // focus on the input when the visitor clicks on the addCityBtn2
    addCityBtn2.addEventListener('click', () => {
        window.location.hash = 'searchbarOutterContainer';
        input.focus();
    });


/* *************************************************** */
/* AUTOMATIC GEOLOCATOR FOR VISITORS' CURRENT LOCATION */
/* *************************************************** */ 

    // check if the location exists
    if (navigator.geolocation) {

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
                    timeZone.innerHTML = `${data.name}, ${data.sys.country}`;
                    celsius.innerHTML = `<i class="fa fa-thermometer-half"></i> ${Math.round(data.main.temp)}&#8451;`;
                    fahrenheit.innerHTML = `<i class="fa fa-thermometer-three-quarters"></i> ${Math.round( (data.main.temp * 9/5) + 32 )}&#8457;`;
                    minMaxTemp.innerHTML = `<i class="fa fa-sort-alt"></i> ${Math.round(data.main.temp_min)}&#8451; / ${Math.round(data.main.temp_max)}&#8451;`;
                    humidity.innerHTML = `<i class="fa fa-tint"></i> ${data.main.humidity}%`;
                    currentLogo.innerHTML = `<figure>
                                                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                                                <figcaption id="description" style="text-transform: capitalize;">${data.weather[0].description}</figcaption>
                                            </figure>`;
                })
                .catch(err => {
                    console.log(`Error : ${err}`);
                }); 
        });
    }
    
    setTimeout(() => {
        if (elm('#currentTimeZone').innerText === "Your Time Zone") {
            warningAlarm.style.opacity = '1';
            warningAlarm.innerText = "It seems automatic geolocator neither supported by this browser nor your device Location is on. Try to Add your time zone manually.";
            warning(10000);          
        }
    }, 10000); 
});

