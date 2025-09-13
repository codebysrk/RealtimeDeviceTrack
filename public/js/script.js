const socket = io();

let map;
let userMarker;

// Define tile layers
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
});

let currentLayer = osmLayer;

// Function to initialize the map
function initializeMap(latitude, longitude) {
  if (map) return; // Initialize map only once

  map = L.map('map').setView([latitude, longitude], 16);
  currentLayer.addTo(map);

  userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup('You are here!').openPopup();
}

if ('geolocation' in navigator) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      if (!map) {
        initializeMap(latitude, longitude);
      }

      // Update user's marker position
      if (userMarker) {
        userMarker.setLatLng([latitude, longitude]);
        map.setView([latitude, longitude]);
      }
      
      socket.emit('sendLocation', { latitude, longitude });
    },
    (err) => {
      console.error('Error:', err.message);
      if (!map) {
        // Fallback to a default location if geolocation fails
        initializeMap(51.505, -0.09);
        alert('Geolocation is not available or denied. Showing a default location.');
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.log('Geolocation not supported');
  // Fallback to a default location if geolocation is not supported
  initializeMap(51.505, -0.09);
  alert('Geolocation is not supported by your browser. Showing a default location.');
}

const markers = {};

socket.on('getLocation', (data) => {
  const { id, latitude, longitude } = data;

  // Don't create a marker for the current user
  if (id === socket.id) return;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`User: ${id.substring(0, 6)}`);
  }
});

socket.on('user-disconnected', (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

// Toggle view button
const toggleBtn = document.getElementById('toggle-view-btn');
toggleBtn.addEventListener('click', () => {
  map.removeLayer(currentLayer);
  if (currentLayer === osmLayer) {
    currentLayer = satelliteLayer;
    toggleBtn.textContent = 'Street View';
  } else {
    currentLayer = osmLayer;
    toggleBtn.textContent = 'Satellite View';
  }
  currentLayer.addTo(map);
});