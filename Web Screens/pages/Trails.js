import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Spinner } from 'native-base';
import { getNearbyParks } from '../../APICalls';

export default function Trails() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLocationAndPlaces = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const data = await getNearbyParks(latitude, longitude);
            if (data && data.results) {
              setPlaces(data.results);
            } else {
              setPlaces([]);
            }
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
      ) : places.length > 0 ? (
        <VStack space={4}>
          <Text fontSize="2xl" mb={4}>Nearby Trails</Text>
          {places.map((place, index) => (
            <Text key={index}>{place.name}</Text>
          ))}
        </VStack>
      ) : (
        <Text>No places found.</Text>
      )}
    </Box>
  );
}
