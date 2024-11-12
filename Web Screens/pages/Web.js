import React from 'react';
import { Box } from 'native-base';
import MapComponent from '../components/MapComponent';





export default function WebScreen() {

  return (
    <Box flex={1} bg="gray.100" borderRadius="md" overflow="hidden">
      <MapComponent />
    </Box>
  );
}
