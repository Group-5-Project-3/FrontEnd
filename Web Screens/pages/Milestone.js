import React, { useEffect, useState } from 'react';
import { Box, Text, VStack, Spinner } from 'native-base';
import { getNearbyParks } from '../../APICalls';

export default function Milestone() {

  return (
    <Box flex={1} safeArea p="2" py="8" w="100%">
      <Text>Hello</Text>
    </Box>
  );
}
