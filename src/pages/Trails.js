import React, { useEffect, useState } from 'react';
import { getNearbyParks } from '../components/APICalls';

export default function Trails() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const latitude =	34.0069; // Center of California
  const longitude = 	-119.7785; // Center of California
  const radius = 5000; // 500 km radius to cover the state
  const type = 'park';
  const keyword = 'trail';

  useEffect(() => {
    const fetchUserLocationAndPlaces = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // const { latitude, longitude } = position.coords;

          try {
            const data = await getNearbyParks(latitude, longitude, radius, type, keyword);
            // console.log(data);
            setPlaces(data.results || []);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError('Failed to get user location');
          setLoading(false);
        }
      );
    };

    fetchUserLocationAndPlaces();
  }, []);

  return (
    <div className="container mt-4">
      {loading ? (
        <div className="spinner-border text-primary" role="status"></div>
      ) : error ? (
        <div className="text-danger">Error: {error}</div>
      ) : (
        <div>
          <h2>Nearby Trails</h2>
          {places.length > 0 ? (
            places.map((place, index) => <p key={index}>{place.name}</p>)
          ) : (
            <p>No places found.</p>
          )}
        </div>
      )}
    </div>
  );
}
