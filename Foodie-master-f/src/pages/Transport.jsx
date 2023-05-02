import React, { useEffect, useState } from "react";
import $ from "jquery";
import { useLocation } from "react-router-dom";
import { getDistance, getPreciseDistance } from "geolib";
import Map from "../components/GoogleMap";
import Menu from "../components/Menu";
import data from "../data/data.json";
import MyCart from "../components/MyCart";
import "../styles/Transport.css";
import Weather from "./Weather";
var dis;
var lats;
var longs;
var distance;
var time;
var address;
var name;
let climate;
let miles;

const Transport = () => {
  const location = useLocation();
  const id = location.state.List;
  const hotel = "test";
  const Lats = id.filter(function(rec) {
    name = rec.name;
    address = rec.address;
    lats = rec.lat;
    longs = rec.long;
  });

  const calculatePreciseDistance = () => {
    var pdis = getPreciseDistance(
      { latitude: coordinate.lat, longitude: coordinate.long },
      { latitude: lats, longitude: longs }
    );
    alert(`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
  };
  const useCoordinates = () => {
    const [coordinate, setCoordinate] = useState({
      lat: 0,
      long: 0,
    });
    let geoId;

    useEffect(() => {
      //ComponenntDidMount

      geoId = window.navigator.geolocation.watchPosition((position) => {
        setCoordinate({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });

      return () => {
        navigator.geolocation.clearWatch(geoId);
      };
    });

    return coordinate;
  };

  const coordinate = useCoordinates();

  const calculateDistance = () => {
    dis = getDistance(
      { latitude: coordinate.lat, longitude: coordinate.long },
      { latitude: lats, longitude: longs }
    );
    alert(`Distance\n\n${dis} Meter\nOR\n${(dis / 1000) * 0.621371} Miles`);
    miles =(dis / 1000) * 0.621371
    distance = Math.round((((dis / 1000) * 0.621371) / 30) * 60);
    console.log(climate);
    if (climate == "Clouds") {
      time = distance + 5;
    } else if (climate == "Mist") time = distance + 10;
    else if (climate == "Rain") time = distance + 15;
    else if (climate == "Thunderstorm") time = distance + 4;
    else if (climate == "Clear") time = distance;

    var $locationText = $(".location");

    // Check for geolocation browser support and execute success method
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        geoLocationSuccess,
        geoLocationError,
        { timeout: 1000 }
      );
    } else {
      alert("your browser doesn't support geolocation");
    }
    function geoLocationSuccess(pos) {
      // get user lat,long
      var myLat = pos.coords.latitude,
        myLng = pos.coords.longitude,
        loadingTimeout;

      var loading = function() {
        $locationText.text("fetching...");
      };

      loadingTimeout = setTimeout(loading, 600);

      var request = $.get(
        "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
          myLat +
          "&lon=" +
          myLng
      )
        .done(function(data) {
          if (loadingTimeout) {
            clearTimeout(loadingTimeout);
            loadingTimeout = null;
            $locationText.text(data.display_name);
          }
        })
        .fail(function() {});
    }

    function geoLocationError(error) {
      var errors = {
        1: "Permission denied",
        2: "Position unavailable",
        3: "Request timeout",
      };
      alert("Error: " + errors[error.code]);
    }
  };

  const getWeatherValues = (props) => {
    climate = props;
    console.log("test");
    console.log(props);
  };

  return (
    <div>
      <div className="nav">
        <div id="logo">
          <h2>Food To Door</h2>
        </div>

        <div id="user">
          <div className="name">Hello, User</div>
          <div className="profile">
            <img src={""} alt="profile" id="img" height="45" width="45" />
          </div>
        </div>
      </div>

      <div style={{}}>
        <div style={{ padding: "5px" }}>
          <Weather getWeatherValues={getWeatherValues} />
        </div>
        <h2>
          Your current location is: <span className="location"></span>
        </h2>
        <div style={{ marginRight: "10px" }}>
          <Map latR={lats} longR={longs} />
        </div>
      </div>
      <div style={{ margin: "10px" }}>
        {time ? (<div>
           <h2>Distance From restaurant to Door is: {miles} Miles</h2>
          <h2>Travel Time From restaurant to Door is: {time} Min</h2></div>
        ) : (
          "j"
        )}

        <button
          class="button-87"
          role="button"
          style={{ alignContent: "center" }}
          onClick={calculateDistance}
        >
          Get Waiting time
        </button>
      </div>
    </div>
  );
};

export default Transport;
