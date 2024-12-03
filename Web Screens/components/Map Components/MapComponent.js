import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Modal, Text, Button, Box } from 'native-base';
import { Asset } from 'expo-asset';
import TreeLogo from '../../../assets/TreeLogo.png';
import PlaceModal from './PlaceModal';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const mapOptions = {
    disableDefaultUI: true,
    styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    ],
};

function MapComponent({ places }) {
    const [currentLocation, setCurrentLocation] = useState({
        lat: 40.7128,
        lng: -74.0060,
    });

    const [isApiLoaded, setIsApiLoaded] = useState(false); // Add API loaded state
    const [selectedPlace, setSelectedPlace] = useState(null); // Track the selected place for the modal


    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => {
                    alert('Geolocation permission denied or unavailable');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }, []);

    const resolvedIcon = Asset.fromModule(TreeLogo).uri;

    // Handle marker click to open modal with place info
    const handleMarkerClick = (place) => {
        setSelectedPlace(place);
    };

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyDqZs2GcqLEwKD1rganE4GHJ5HHY85hRd0"
            onLoad={() => setIsApiLoaded(true)} // Set API loaded state to true
        >
            {isApiLoaded ? (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={currentLocation}
                    zoom={12}
                    options={mapOptions}
                >
                    {/* Marker for current location */}
                    <Marker position={currentLocation} />

                    {/* Markers for trails */}
                    {places.map((place, index) => (
                        place.geometry && place.geometry.location ? (
                            <Marker
                                key={index}
                                position={{
                                    lat: place.geometry.location.lat,
                                    lng: place.geometry.location.lng,
                                }}
                                title={place.name || 'Unnamed Trail'}
                                label={{
                                    text: place.name || 'Trail',
                                    color: 'blue',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                }}
                                icon={{
                                    url: resolvedIcon, // Resolved icon URL
                                    scaledSize: new window.google.maps.Size(32, 32), // Adjust icon size
                                }}
                                onClick={() => handleMarkerClick(place)}
                            />
                        ) : null
                    ))}

                    {/* Render the PlaceModal */}
                    <PlaceModal
                        isOpen={!!selectedPlace}
                        onClose={() => setSelectedPlace(null)}
                        place={selectedPlace}
                    />
                </GoogleMap>
            ) : (
                <p>Loading...</p> // Show a loading message while API loads
            )}
        </LoadScript>
    );
}

export default React.memo(MapComponent);
