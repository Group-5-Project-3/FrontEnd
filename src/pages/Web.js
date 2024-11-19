import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import MapComponent from '../components/Map Components/MapComponent';
import { getNearbyParks } from '../components/APICalls';

export default function WebScreen() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const fetchUserLocationAndPlaces = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
  
          try {
            const data = await getNearbyParks(latitude, longitude);
            console.log('Fetched places:', data); // Log API response
            setPlaces(data?.results || []);
          } catch (err) {
            console.error('Failed to fetch nearby places:', err); // Log API errors
            setError('Failed to fetch nearby places.');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error); // Log geolocation errors
          setError('Failed to retrieve location. Defaulting to NYC.');
          setCurrentLocation({ lat: 40.7128, lng: -74.0060 });
          setLoading(false);
        }
      );
    };
  
    fetchUserLocationAndPlaces();
  }, []);

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
        <Alert variant="danger" className="text-center">
          <strong>Error:</strong> {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="d-flex flex-column" style={{ height: '100%', padding: 0 }}>
      {places.length === 0 ? (
        <Alert variant="info" className="text-center">
          No nearby parks found.
        </Alert>
      ) : (
        <MapComponent places={places} />
      )}
    </Container>
  );
}
