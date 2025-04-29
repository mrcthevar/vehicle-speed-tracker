import { Loader } from '@googlemaps/js-api-loader';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { getAIInsights } from './AIAnalytics';


function App() {
  const [speed, setSpeed] = useState(0);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [vehicleType, setVehicleType] = useState('Car');
  const [userId] = useState('user123'); // Fake user for now
  const [aiInsight, setAiInsight] = useState('');

  // Get real GPS data
  const getRealGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newSpeed = position.coords.speed
            ? position.coords.speed * 3.6 // Convert m/s to km/h
            : Math.random() * 100; // Fake speed if not available
          setSpeed(newSpeed);
          setLocation({ lat: latitude, lng: longitude });
          setAiInsight(getAIInsights(newSpeed)); // Add AI insight

          // Save to back-end
          await axios.post('https://vehicle-speed-tracker-server.onrender.com/api/gps', {
            userId,
            vehicleType,
            speed: newSpeed,
            latitude,
            longitude,
          });
        },
        (error) => alert('Cannot get location. Try again!')
      );
    } else {
      alert('Your browser does not support GPS.');
    }
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyAAqm3VRGeKNPr_V1Bfzgh-zweFLSXO57Q', // Replace with your API key
      version: 'weekly',
    });
    loader.load().then(() => {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: location.lat || 37.7749, lng: location.lng || -122.4194 },
        zoom: 15,
      });
      new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: 'Vehicle',
      });
    });
  }, [location]);

// Fetch leaderboard data
useEffect(() => {
  axios.get('https://vehicle-speed-tracker-server.onrender.com/api/leaderboard')
    .then((res) => {
      setLeaderboard(res.data);
    })
    .catch((err) => console.log('Error fetching leaderboard:', err));
}, []);
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4148673871073933"
     crossorigin="anonymous"></script>

     
  return (
    <div className="App">
      <h1>Vehicle Speed Tracker</h1>
      <div>
        <label>Choose Vehicle: </label>
        <select onChange={(e) => setVehicleType(e.target.value)}>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Truck">Truck</option>
        </select>
      </div>
      <button onClick={getRealGPS}>Get GPS & Speed</button>
      <h2>Speed: {speed.toFixed(2)} km/h</h2>
      <h3>Location: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}</h3>
      <h3>AI Tip: {aiInsight}</h3>
      <div id="map" style={{ height: '300px', width: '100%' }}></div>
    </div>
  );
}

export default App;