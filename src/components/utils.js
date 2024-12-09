import { getTrailByPlacesId, createTrail, updateTrailCoordinates } from "./APICalls/TrailController";
import axios from "axios";

export function decodeJWT(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export async function checkIfTrailExist(place_id, place) {
  console.log(`Checking if trail exists for place_id: ${place_id}`); // Log start of function
  try {
    const trail = await getTrailByPlacesId(place_id);
    console.log(`Trail found: ${JSON.stringify(trail)}`); // Log trail details

    if (!trail.coordinates) {
      console.log(
        `Trail with place_id: ${place_id} is missing coordinates. Updating coordinates.`
      );

      const latitude = place.geometry.location.lat;
      const longitude = place.geometry.location.lng;

      await updateTrailCoordinates(place_id, latitude, longitude);
      console.log(
        `Coordinates updated to: latitude ${latitude}, longitude ${longitude} for trail ID: ${place_id}`
      );
    }
    return trail;
  } catch (error) {
    console.error(`Error while checking trail for place_id: ${place_id}`, error);

    if (error.response && error.response.status === 403) {
      console.log(
        `Trail with place_id: ${place_id} not found. Creating a new trail.`
      );

      const coordinates = `${place.geometry.location.lat},${place.geometry.location.lng}`;
      const newTrail = {
        placesId: place_id,
        name: place.name,
        location: place.vicinity,
        description: "New review",
        coordinates,
      };

      try {
        const createdTrail = await createTrail(newTrail);
        console.log(`New trail created: ${JSON.stringify(createdTrail)}`);
        return createdTrail;
      } catch (creationError) {
        console.error(
          `Error creating trail for place_id: ${place_id}`,
          creationError
        );
        throw creationError;
      }
    }

    throw error;
  }
}

// Utility function to calculate distance in meters between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371000; // Radius of the Earth in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // Returns the distance in meters
};

export const sortBadges = (badges) => {
  // Helper function to sort based on numeric criteria
  const sortByCriteria = (array) => {
    return array.sort((a, b) => {
      const numA = parseInt(a.criteria?.match(/\d+/)?.[0] || "0", 10);
      const numB = parseInt(b.criteria?.match(/\d+/)?.[0] || "0", 10);
      return numA - numB;
    });
  };

  // Group and sort badges
  const NATIONAL_PARKS = badges.filter((item) => item.type === "NATIONAL_PARKS");
  const DISTANCE = sortByCriteria(badges.filter((item) => item.type === "DISTANCE"));
  const ELEVATION = sortByCriteria(badges.filter((item) => item.type === "ELEVATION"));
  const TOTAL_HIKES = sortByCriteria(badges.filter((item) => item.type === "TOTAL_HIKES"));
  const CHECKIN = sortByCriteria(badges.filter((item) => item.type === "CHECKIN"));

  // Combine all groups into one array
  const sortedBadges = [
    ...NATIONAL_PARKS,
    ...DISTANCE,
    ...ELEVATION,
    ...TOTAL_HIKES,
    ...CHECKIN, // Include the CHECKIN badges
  ];

  console.log("Sorted badges:", sortedBadges);

  return sortedBadges;
};


/**
 * Fetches the latitude and longitude of a given address.
 * @param {string} address - The address to geocode.
 * @returns {Promise<object>} - A promise that resolves to the coordinates { lat, lng }.
 * @throws {Error} - Throws an error if the API call fails or returns a status other than "OK".
 */
export const getCoordinates = async (address) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Google Maps API key is missing. Check your .env.local file."
    );
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.results[0].geometry.location;
    } else {
      throw new Error(`Geocoding API error: ${response.data.status}`);
    }
  } catch (error) {
    throw new Error(`Error fetching coordinates: ${error.message}`);
  }
};
