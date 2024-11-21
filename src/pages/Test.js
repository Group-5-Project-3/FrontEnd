import React, { useState, useEffect } from 'react';
import { GoogleMap, MarkerF, LoadScriptNext } from '@react-google-maps/api';

const Test = () => {
  const [parks, setParks] = useState([]);
  const apiKey = "AIzaSyDqZs2GcqLEwKD1rganE4GHJ5HHY85hRd0";

  // Fetch National Parks
  const fetchNationalParks = async () => {
    const location = "36.7783,-119.4179"; // Center of California
    const radius = 500000; // 500 km radius
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=park&keyword=national+park&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results) {
        setParks(data.results);
        console.log(data);
      } else {
        console.error("No results found:", data);
      }
    } catch (error) {
      console.error("Error fetching data from Places API:", error);
    }
  };

  // Fetch parks on component mount
  useEffect(() => {
    fetchNationalParks();
  }, []);

  return (
    <div className="container mt-4">
      <h1>National Parks in California</h1>
      <LoadScriptNext googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={{ lat: 36.7783, lng: -119.4179 }}
          zoom={6}
        >
          {parks.map((park) => (
            <MarkerF
              key={park.place_id}
              position={{
                lat: park.geometry.location.lat,
                lng: park.geometry.location.lng,
              }}
              title={park.name}
            />
          ))}
        </GoogleMap>
      </LoadScriptNext>
      <div className="mt-4">
        <h2>List of Parks</h2>
        <ul>
          {parks.map((park) => (
            <li key={park.place_id}>
              <strong>{park.name}</strong> - {park.vicinity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Test;
