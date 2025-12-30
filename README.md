# 📍 Realtime Device Tracker

A real-time location tracking application built with Node.js, Express, Socket.io, and Leaflet API.

## 🚀 Features

- **Real-time Tracking**: Setup a socket connection to track devices instantly.
- **Smart Map Integration**: Uses Leaflet API with OpenStreetMap and Satellite views.
- **Auto-Centering**: Map automatically centers on the first valid location found.
- **Live Updates**: User movement is updated on the map in real-time.
- **Robust Error Handling**: Alerts users if the connection to the server fails.
- **Privacy**: Markers for other users are visible, but your own view remains stable for better navigation.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Socket.io
- **Frontend**: HTML5, CSS3, JavaScript (Leaflet.js)
- **Templating**: EJS

## ⚙️ Installation & Run

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd RealtimeDeviceTrack
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start the Server**
    ```bash
    npm run start
    ```

4.  **Access the App**
    Open your browser and visit: `http://localhost:3000`

## 🛡️ Security

- Backend validation ensures that only valid numeric coordinates are broadcasted.

## 🤝 Contributing

Feel free to fork this repository and submit pull requests.
