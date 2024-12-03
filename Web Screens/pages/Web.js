import React, { useState, useEffect } from 'react';
import { Box, Spinner, Text } from 'native-base';
import MapComponent from '../components/Map Components/MapComponent';
import { getNearbyParks } from '../../APICalls';


export default function WebScreen() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLocationAndPlaces = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            console.log("one");
            const data = await getNearbyParks(latitude, longitude);
            console.log("two");
            setPlaces(data?.results || []);
            console.log("three");
          } catch (err) {
            setError('Failed to fetch nearby trails');
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
    <Box flex={1} safeAreaTop height="100%" width="100%" bg="gray.100">
      {loading ? (
        <Spinner accessibilityLabel="Loading places" />
      ) : error ? (
        <Text color="red.500">Error: {error}</Text>
      ) : (
        <MapComponent places={places} />
      )}
    </Box>
  );
}
