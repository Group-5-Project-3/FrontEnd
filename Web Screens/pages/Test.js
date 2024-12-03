// Trails.js
import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Spinner } from 'native-base';
import MapComponent from '../../MapComponent';
import { getNearbyParks } from '../../APICalls';

export default function Trails() {
  const [places, setPlaces] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLocationAndPlaces = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          try {
            const data = await getNearbyParks(latitude, longitude);
            setPlaces(data.results || []);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Failed to get user location');
          setLoading(false);
        }
      );
    };

    fetchUserLocationAndPlaces();
  }, []);

  return (
    <Box flex={1} safeArea p="2" py="8" w="100%">
      {loading ? (
        <Spinner accessibilityLabel="Loading places" />
      ) : error ? (
        <Text color="red.500">Error: {error}</Text>
      ) : currentLocation ? (
        <MapComponent places={places} currentLocation={currentLocation} />
      ) : (
        <Text>No places found.</Text>
      )}
    </Box>
  );
}
