import React, { useState, useRef } from "react";
import { GoogleMap, MarkerF, LoadScriptNext } from "@react-google-maps/api";
import PlaceModal from "./PlaceModal";
import { Button } from "react-bootstrap";
import { getNearbyParks } from "../APICalls";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  disableDefaultUI: true,
  gestureHandling: "greedy",
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const MapComponent = ({
  places,
  setPlaces,
  searchLocation,
  currentLocation,
  setSearchLocation,
  isSearchLocation
}) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const mapRef = useRef(null); // Reference to the Google Map instance

  const handleToggleMarkers = () => {
    setShowMarkers(!showMarkers);
  };

  const handleMarkerClick = (place) => {
    console.log(place);
    setSelectedPlace(place);
  };

  const handleGoToCurrentLocation = async () => {
    if (mapRef.current && currentLocation) {
      const mapCenter = mapRef.current.getCenter();
      if (
        Math.abs(mapCenter.lat() - currentLocation.lat) < 0.0001 &&
        Math.abs(mapCenter.lng() - currentLocation.lng) < 0.0001
      ) {
        alert("You are already at your current location.");
        return;
      }

      // Hide the search location marker
      setSearchLocation(null);

      // Pan to the user's current location
      mapRef.current.panTo(currentLocation);

      // Fetch trails around the user's current location
      try {
        const data = await getNearbyParks(
          currentLocation.lat,
          currentLocation.lng
        );
        setPlaces(data?.results || []);
      } catch (err) {
        console.error("Error fetching trails:", err);
        alert("Failed to fetch trails around your location. Please try again.");
      }
    }
  };

  return (
    <LoadScriptNext
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      onLoad={() => setGoogleLoaded(true)} // Set flag when API is loaded
    >
      {googleLoaded ? (
        <div style={{ height: "100%", position: "relative" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={searchLocation || currentLocation}
            zoom={12}
            options={mapOptions}
            onLoad={(map) => (mapRef.current = map)} // Save the map instance to the ref
          >
            {/* Current location marker */}
            <MarkerF
              position={currentLocation}
              title="You are here"
              icon={{
                url: "/images/Person.png", // Icon for current location
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />

            {/* Search location marker */}
            {searchLocation && (
              <MarkerF position={searchLocation} title="Search Location" />
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
                    title={place.name || "Unnamed Place"}
                    icon={{
                      url: "/images/TreeLogo.png", // Icon for places
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
              isSearchLocation={isSearchLocation} // Pass the flag to the modal
            />
          </GoogleMap>

          {/* Hide/Show Markers Button */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 1000,
            }}
          >
            <Button onClick={handleToggleMarkers} variant="primary">
              {showMarkers ? "Hide Markers" : "Show Markers"}
            </Button>
          </div>

          {/* Go to Current Location Button */}
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "10px",
              zIndex: 1000,
            }}
          >
            <Button onClick={handleGoToCurrentLocation} variant="secondary">
              Go to Current Location
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
