import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, LoadScriptNext } from '@react-google-maps/api';
import PlaceModal from './PlaceModal';
import { Button, Spinner } from 'react-bootstrap';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  disableDefaultUI: true,
  gestureHandling: 'greedy',
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  ],
};

const MapComponent = ({ places, searchLocation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // Fetch user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error.message);
          alert('Failed to retrieve your location. Using default location.');
          setCurrentLocation({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
          setLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setCurrentLocation({ lat: 40.7128, lng: -74.0060 });
      setLoadingLocation(false);
    }
  }, []);

  const handleToggleMarkers = () => {
    setShowMarkers(!showMarkers);
  };

  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
  };

  if (loadingLocation) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      onLoad={() => setGoogleLoaded(true)} // Set flag when API is loaded
    >
      {googleLoaded ? (
        <div style={{ height: '100%', position: 'relative' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={searchLocation || currentLocation}
            zoom={12}
            options={mapOptions}
          >
            {/* Current location marker */}
            <MarkerF
              position={currentLocation}
              title="You are here"
              icon={{
                url: '/images/Person.png', // Icon for current location
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />

            {/* Search location marker */}
            {searchLocation && (
              <MarkerF
                position={searchLocation}
                title="Search Location"
                icon={{
                  url: '/images/SearchMarker.png', // Icon for search location
                  scaledSize: new window.google.maps.Size(32, 32),
                }}
              />
            )}

            {/* Place markers */}
            {showMarkers &&
              places
                .filter((place) => place.geometry?.location)
                .map((place, index) => (
                  <MarkerF
                    key={`${place.geometry.location.lat}-${place.geometry.location.lng}-${index}`}
                    position={{
                      lat: place.geometry.location.lat,
                      lng: place.geometry.location.lng,
                    }}
                    title={place.name || 'Unnamed Place'}
                    icon={{
                      url: '/images/TreeLogo.png', // Icon for places
                      scaledSize: new window.google.maps.Size(32, 32),
                    }}
                    onClick={() => handleMarkerClick(place)}
                  />
                ))}

            {/* Place Modal */}
            <PlaceModal
              isOpen={!!selectedPlace}
              onClose={() => setSelectedPlace(null)}
              place={selectedPlace}
              currentLocation={currentLocation}
            />
          </GoogleMap>

          {/* Hide/Show Markers Button */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
            <Button onClick={handleToggleMarkers} variant="primary">
              {showMarkers ? 'Hide Markers' : 'Show Markers'}
            </Button>
          </div>
        </div>
      ) : (
        <p>Loading Google Maps...</p>
      )}
    </LoadScriptNext>
  );
};

export default React.memo(MapComponent);
