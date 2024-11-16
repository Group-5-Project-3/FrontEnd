import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginForm() {
  const [userInfo, setUserInfo] = useState(null);

  // Call the useAutoDiscovery hook inside the component
  const DISCOVERY = AuthSession.useAutoDiscovery('https://accounts.google.com');

  // Create the auth request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      // clientId: '132989833762-n70usa2m3iee4vcvc7kopfq9tmumffk4.apps.googleusercontent.com', // Replace with your Client ID
      redirectUri: AuthSession.makeRedirectUri({ useProxy: false }), // Ensure it matches your Google Console settings
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256, // Use PKCE
    },
    DISCOVERY
  );

  // Handle the authentication response
  React.useEffect(() => {
    const handleAuthResponse = async () => {
      if (response?.type === 'success' && response.params.code) {
        console.log('Authorization Code:', response.params.code);

        try {
          // Exchange the authorization code for tokens
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              // client_id: '132989833762-n70usa2m3iee4vcvc7kopfq9tmumffk4.apps.googleusercontent.com', // Replace with your Client ID
              // client_secret: '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', // Add your Client Secret
              code: response.params.code,
              redirect_uri: AuthSession.makeRedirectUri({ useProxy: false }),
              grant_type: 'authorization_code',
              code_verifier: request?.codeVerifier, // Add the code verifier
            }).toString(),
          });

          const tokens = await tokenResponse.json();
          console.log('Tokens:', tokens);

          // Fetch user info
          const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          }).then((res) => res.json());

          console.log('User Info:', userInfo);
          setUserInfo(userInfo);
        } catch (error) {
          console.error('Error exchanging token:', error);
        }
      }
    };

    handleAuthResponse();
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userInfo ? (
        <Text>Welcome, {userInfo.name}!</Text>
      ) : (
        <Button
          title="Login with Google"
          onPress={() => {
            promptAsync({ useProxy: false });
          }}
          disabled={!request}
        />
      )}
    </View>
  );
}
