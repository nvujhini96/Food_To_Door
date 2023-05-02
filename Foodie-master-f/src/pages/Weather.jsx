import React, { useEffect, useState } from "react";
import $ from "jquery";
import axios, { isCancel, AxiosError } from "axios";
import { useLocation } from "react-router-dom";
import { getDistance, getPreciseDistance } from "geolib";
import "../styles/WeatherStyle.css";

import CreditCard from "../components/CreditCard";

const google = window.google;

class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      degree: "",
      forecast: [],
      main: "",
      feels_like: "",
    };
  }

  temperatureConverter = (degree) => {
    return Math.round((degree * 9) / 5 + 32);
  };

  componentDidMount() {
    this.getWeather();
  }
  // Make sure we have access to users location
  getWeather = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.successWeather,
        this.errorWeather
      );
    }
  };
  // Get location coordinates
  successWeather = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const url = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c00cca645196f43959e6a78d0ae0bdaa&units=metric`;

    axios.get(url).then((res) => {
      const data = res.data;
      const temp = this.temperatureConverter(data.main.temp);
      let imgSource = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

      this.setState({
        location: `${data.name}, ${data.sys.country}`,
        degree: temp,
        feels_like: data.main.feels_like,
        main: data.weather[0].main,
        img: imgSource,
      });

      this.props.getWeatherValues(data.weather[0].main);
      console.log(this.state.feels_like);
    });

    const urlDuplicate = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?appid=c00cca645196f43959e6a78d0ae0bdaa&lat=${latitude}&lon=${longitude}&units=metric&cnt=8`;
    let weatherList = [];

    axios.get(urlDuplicate).then((res) => {
      res.data.list.forEach((obj) => {
        let utc = obj.dt;
        let d = new Date(0);
        d.setUTCSeconds(utc);
        let hour = d.getHours();
        if (hour < 13 && hour >= 0) {
          hour = `${hour} AM`;
        } else {
          hour = `${hour - 12} PM`;
        }
        const temp = this.temperatureConverter(obj.main.temp);
        const description = obj.weather[0].main;
        const prefix = "https://res.cloudinary.com/marvel451/image/upload/";
        let weatherIcons = [
          "v1525070596/sunny.svg",
          "v1525070599/cloud-one_iiddgh.svg",
          "v1525070596/cloud-three_isrrou.svg",
          "v1525070596/thunder_hw7uyx.svg",
          "v1525140183/snowy.svg",
          "v1525070596/slightly-cloudy-day_ljjffu.svg",
          "v1525070596/slightly-cloudy-night_xchkwe.svg",
        ];

        let img = null;

        if (description == "clear sky") {
          img = `${prefix + weatherIcons[0]}`;
        }
        if (description == "rain") {
          img = `${prefix + weatherIcons[1]}`;
        }
        if (description == "shower rain") {
          img = `${prefix + weatherIcons[2]}`;
        }
        if (description == "thunderstorm") {
          img = `${prefix + weatherIcons[3]}`;
        }
        if (description == "snow") {
          img = `${prefix + weatherIcons[4]}`;
        }
        if (description == "clouds" || "scattered clouds" || "few clouds") {
          img = `${prefix + weatherIcons[5]}`;
        }
        if (
          hour == "8 PM" ||
          hour == "11 PM" ||
          hour == "2 AM" ||
          hour == "5 AM"
        ) {
          img = `${prefix + weatherIcons[6]}`;
        }

        weatherList.push({ hour, temp, description, img });
      });
      this.setState({ forecast: weatherList });
    });
  };

  registerUser = () => {
    let x = document.forms["updates"]["sms"].value;
    // make sure input is not blank
    if (x == "") {
      alert("Please give us your phone number");
      return;
    }
    //validate only 10 digits
    if (x.match(/\d/g).length === 10) {
      alert("You have been registered!");
    } else {
      alert("Please double check your numbers");
      return;
    }
  };
  reloadApp = () => {
    this.setState({ state: this.state });
  };

  errorWeather = (er) => {
    alert("We could not determine your location");
    console.log(er);
  };
  render() {
    console.log(this.props);
    return (
      <div className="app" style={{ float: "right", padding: "5px" }}>
        <header className="app-header">
          <img
            style={{ height: "50px" }}
            src="https://res.cloudinary.com/marvel451/image/upload/v1525133241/sun-cloud_s558lu.png"
            className="app-logo"
            alt="logo"
          />
        </header>
        <section className="app-weather"></section>
        <section>
          <div class="card">
            <div class="card__info">
              <p class="card__info__place">
                {" "}
                We found you in: {this.state.location}
              </p>
              <p class="card__info__time"></p>
              {this.state.main ? (
                <p class="card__info__date">{this.state.main}</p>
              ) : (
                <h5>LOADING...</h5>
              )}
            </div>
            <div class="card__weather">
              <svg
                width="34"
                class="card__weather__icon"
                height="24"
                viewBox="0 0 34 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M31.7764 13.3718C30.8073 12.1841 29.5779 11.4201 28.0897 11.0793C28.5632 10.3633 28.7992 9.57921 28.7992 8.72709C28.7992 7.52249 28.3664 6.49418 27.5014 5.64182C26.6361 4.78976 25.592 4.36354 24.3688 4.36354C23.2612 4.36354 22.3034 4.71584 21.496 5.42044C20.8155 3.80682 19.7334 2.50001 18.251 1.50001C16.7682 0.500241 15.1152 0 13.2921 0C10.8461 0 8.75757 0.852482 7.02679 2.55703C5.29589 4.26116 4.43071 6.31818 4.43071 8.72727C4.43071 8.89777 4.44229 9.1419 4.46532 9.46011C3.12694 10.0738 2.04801 11.0027 1.22884 12.2473C0.409735 13.4913 0 14.8637 0 16.3637C0 18.4659 0.758789 20.2642 2.27594 21.7583C3.79316 23.2528 5.61918 24 7.75375 24H26.5847C28.4191 24 29.9853 23.3603 31.2836 22.0823C32.5816 20.804 33.2308 19.2615 33.2308 17.4545C33.2306 15.9206 32.7457 14.5591 31.7764 13.3718Z"
                  fill="#567DF4"
                />
              </svg>

              <p class="card__weather__temp">{this.state.degree}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Weather;
