import React, { useState } from 'react';
import { GoogleMap, MarkerF, LoadScriptNext } from '@react-google-maps/api';

const Test = () => {
  const [showMarkers, setShowMarkers] = useState(true); // State to toggle markers
  const [mapLoaded, setMapLoaded] = useState(false); // State to track if the map has loaded

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = { lat: 40.7128, lng: -74.0060 }; // Default to NYC

  const handleToggleMarkers = () => {
    setShowMarkers((prev) => !prev); // Toggle marker visibility
  };

  return (
    <div className="container mt-4">
      <button onClick={handleToggleMarkers} className="btn btn-primary mb-3">
        {showMarkers ? 'Hide Markers' : 'Show Markers'}
      </button>
      <LoadScriptNext googleMapsApiKey="AIzaSyDqZs2GcqLEwKD1rganE4GHJ5HHY85hRd0">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={() => setMapLoaded(true)} // Set map as loaded
        >
          {/* Render markers only when the map is loaded */}
          {mapLoaded && showMarkers && (
            <MarkerF position={center} title="Test Marker" />
          )}
        </GoogleMap>
      </LoadScriptNext>
    </div>
  );
};

export default Test;
