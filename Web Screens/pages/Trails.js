import React from 'react';
import { NativeBaseProvider, Box, Center, Heading, VStack } from 'native-base';


export default function Trails() {
  return (
    <NativeBaseProvider>
      <Box flex={1} safeArea p="2" py="8" w="100%">
        <p>Hello</p>
      </Box>
    </NativeBaseProvider>
  );
}
