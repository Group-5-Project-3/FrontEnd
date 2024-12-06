import React, { useState, useEffect } from "react";
import {
  Container,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import MapComponent from "../components/Map Components/MapComponent";
import { getNearbyParks } from "../components/APICalls";
import { getCoordinates } from "../components/utils";

export default function WebScreen() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isSearchLocation = searchLocation !== null; // Determine if it's a search location

  useEffect(() => {
    const fetchUserLocationAndPlaces = async () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          try {
            const data = await getNearbyParks(latitude, longitude);
            setPlaces(data.results || []);
          } catch (err) {
            console.error("Failed to fetch nearby places:", err); // Log API errors
            setError("Failed to fetch nearby places.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error); // Log geolocation errors
          setError("Failed to retrieve location. Defaulting to NYC.");
          setCurrentLocation({ lat: 40.7128, lng: -74.006 });
          setLoading(false);
        }
      );
    };

    fetchUserLocationAndPlaces();
  }, []);

  const handleSearch = async () => {
    // Implement search functionality, e.g., filter `places` based on `searchQuery`
    if (!searchQuery.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use getCoordinates to geocode the search query
      const coordinates = await getCoordinates(searchQuery);
      setSearchLocation(coordinates);

      // Fetch nearby parks for the searched location
      const data = await getNearbyParks(coordinates.lat, coordinates.lng);
      setPlaces(data?.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search for the location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100%" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100%" }}
      >
        <Alert variant="danger" className="text-center">
          <strong>Error:</strong> {error}
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              background: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className="position-relative"
      style={{ height: "100%", padding: 0 }}
    >
      {/* Search Bar */}
      <div
        className="position-absolute"
        style={{
          top: "10px",
          right: "10px",
          zIndex: 10,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "8px",
          padding: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search Location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </InputGroup>
      </div>

      {places.length === 0 ? (
        <Alert variant="info" className="text-center">
          No nearby parks found.
        </Alert>
      ) : (
        <MapComponent
          places={places}
          setPlaces={setPlaces}
          searchLocation={searchLocation}
          currentLocation={currentLocation}
          setSearchLocation={setSearchLocation}
          isSearchLocation={isSearchLocation} // Pass the flag to MapComponent
        />
      )}
    </Container>
  );
}
