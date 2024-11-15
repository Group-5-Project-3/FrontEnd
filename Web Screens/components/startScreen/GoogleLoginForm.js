import React from 'react';
import { VStack, Text, Button } from 'native-base';

export default function GoogleLoginForm({ setSelectedForm }) {
  return (
    <VStack space={4} width="80%">
      <Text color="white" textAlign="center" mb={2}>
        Google Login is in progress...
      </Text>
      <Button bg="#008001" _pressed={{ bg: '#006400' }} onPress={() => alert('Google Login')}>
        Continue with Google
      </Button>
      <Button variant="link" onPress={() => setSelectedForm(null)}>
        Back
      </Button>
    </VStack>
  );
}
