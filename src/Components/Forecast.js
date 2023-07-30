import React, { useEffect, useState } from "react";
import Clock from "react-live-clock";
import ReactAnimatedWeather from "react-animated-weather";

export default function Forecast() {
  var [forecast, setForecast] = useState({});
  var [city, setCity] = useState("");
  var [date, setDate] = useState("");
  var [iconName, setIconName] = useState("CLEAR_DAY");
  var [error, setError] = useState(false);

  const defaults = {
    icon: iconName,
    color: "white",
    size: 100,
    animate: true,
  };
  useEffect(() => {
    async function getData() {
      if (city !== "") {
        var response = await fetch(
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ca8c2c7970a09dc296d9b3cfc4d06940`
        );
        console.log(response);
        if (response.status === 200) {
          setError(false);
          var data = await response.json();
          console.log(data);
          setForecast(data);
          convertDate(data.dt);

          if (
            data.weather?.[0].main === "Rain" ||
            data.weather?.[0].main === "Drizzle" ||
            data.weather?.[0].main === "Thunderstorm"
          ) {
            setIconName("RAIN");
          } else if (data.weather?.[0].main === "Snow") {
            setIconName("SNOW");
          } else if (
            data.weather?.[0].main === "Fog" ||
            data.weather?.[0].main === "Smoke"
          ) {
            setIconName("FOG");
          } else if (data.weather?.[0].main === "Clear") {
            setIconName("CLEAR_DAY");
          } else if (data.weather?.[0].main === "Clouds") {
            setIconName("CLOUDY");
          }
        } else {
          setError(true);
        }
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              var response = await fetch(
                `http://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&id=524901&appid=ca8c2c7970a09dc296d9b3cfc4d06940`
              );
              console.log(response);
              if (response.status === 200) {
                setError(false);
                var data = await response.json();
                console.log(data);
                setForecast(data);
                convertDate(data.dt);

                if (
                  data.weather?.[0].main === "Rain" ||
                  data.weather?.[0].main === "Drizzle" ||
                  data.weather?.[0].main === "Thunderstorm"
                ) {
                  setIconName("RAIN");
                } else if (data.weather?.[0].main === "Snow") {
                  setIconName("SNOW");
                } else if (
                  data.weather?.[0].main === "Fog" ||
                  data.weather?.[0].main === "Smoke"
                ) {
                  setIconName("FOG");
                } else if (data.weather?.[0].main === "Clear") {
                  setIconName("CLEAR_DAY");
                } else if (data.weather?.[0].main === "Clouds") {
                  setIconName("CLOUDY");
                }
              } else {
                setError(true);
              }
            },
            (error) => {
              alert("location service denied");
            }
          );
        } else {
          alert("Location Services not found!");
        }
      }
    }
    getData();
  }, [city]);

  function getCityName() {
    var cityName = document.getElementById("cityName").value;
    setCity(cityName);
    // clears value after search below
    document.getElementById("cityName").value = "";
  }

  function convertDate(dt) {
    var date = new Date(dt);
    var fullDate =
      date.getDate() + " - " + date.getMonth() + 1 + " - " + date.getFullYear();
    setDate(fullDate);
  }
  return (
    <div>
      <div className="container">
        <div className="city">
          <div className="title">
            {error === false ? (
              <>
                <h2>{forecast.name}</h2>
                <h3>{forecast.sys?.country}</h3>
              </>
            ) : (
              <>
                <h2>Country not found!</h2>
              </>
            )}
          </div>

          <div className="mb-icon">
            {" "}
            <p>Punjab</p>
          </div>
          <div className="date-time">
            <div className="dmy">
              <div id="txt"></div>
              <div className="current-time">
                <Clock format="HH:mm:ss" interval={1000} ticking={true} />
              </div>

              {error === false ? (
                <>
                  <div className="current-date">{date}</div>
                </>
              ) : (
                <div className="current-date"></div>
              )}
            </div>
            <div className="temperature">
              <p>
                {error === false ? (
                  <>
                    {Math.round(forecast.main?.temp)}°<span>C</span>
                  </>
                ) : (
                  <>Celcius</>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="forecast">
          <div className="forecast-icon">
            {error === false ? (
              <>
                <ReactAnimatedWeather
                  icon={defaults.icon}
                  color={defaults.color}
                  size={defaults.size}
                  animate={defaults.animate}
                />
              </>
            ) : null}
          </div>
          <div className="today-weather">
            {error === false ? (
              <>
                <h3>{forecast.weather?.[0].main}</h3>
              </>
            ) : (
              <>
                <h3>Not Found</h3>
              </>
            )}
            <div className="search-box">
              <input
                type="text"
                className="search-bar"
                placeholder="Search any city"
                id="cityName"
              />
              <div className="img-box">
                {" "}
                <img
                  src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
                  alt="weather"
                  onClick={getCityName}
                />
              </div>
            </div>

            {error === false ? (
              <>
                <ul>
                  <div>
                    {" "}
                    <li className="cityHead">
                      <p>{forecast.weather?.[0].description}</p>
                      <img
                        className="temp"
                        src={`https://openweathermap.org/img/wn/${forecast.weather?.[0].icon}.png`}
                      />
                    </li>
                    <li>
                      Temperature{" "}
                      <span className="temp">
                        {Math.round(forecast.main?.temp)}°c
                      </span>
                    </li>
                    <li>
                      Humidity{" "}
                      <span className="temp">{forecast.main?.humidity} %</span>
                    </li>
                    <li>
                      Visibility{" "}
                      <span className="temp">
                        {Math.round(forecast.visibility * 0.00062137)} mi
                      </span>
                    </li>
                    <li>
                      Wind Speed{" "}
                      <span className="temp">
                        {Math.round(forecast.wind?.speed)} Km/h
                      </span>
                    </li>
                  </div>
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
