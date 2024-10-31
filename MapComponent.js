// MapComponent.js
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 40.7128,
  lng: -74.0060, // Example: New York City
};

function MapComponent() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDqZs2GcqLEwKD1rganE4GHJ5HHY85hRd0">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        {/* Add markers, info windows, etc., here */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(MapComponent);
