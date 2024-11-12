// MapComponent.js
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { decodeJWT } from '../../APICalls';


const containerStyle = {
    width: '100%',
    height: '100%', // Replace 50px with the actual height of your nav bar
};

function MapComponent() {
    const [currentLocation, setCurrentLocation] = useState({
        lat: 40.7128, // Default: New York City
        lng: -74.0060,
    });

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

    return (
        <LoadScript googleMapsApiKey="AIzaSyDqZs2GcqLEwKD1rganE4GHJ5HHY85hRd0">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentLocation}
                zoom={12}
            >
                {/* Marker at the current location */}
                <Marker position={currentLocation} />
            </GoogleMap>
        </LoadScript>
    );
}

export default React.memo(MapComponent);
