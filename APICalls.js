import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJWT } from "./Mobile Screens/components/utils/utils";

// Login function
export const login = async (username, password) => {
  try {
    const response = await axios.post(
      "https://cst438project3-6ec60cdacb89.herokuapp.com/api/auth/login",
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Save the token to AsyncStorage
    const token = response.data.token;
    console.log("Token from login function:, " + token + "\n");
    if (token) {
      await AsyncStorage.setItem("authToken", token);
    }
    return token;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const addFavoriteTrail = async (userId, trailId) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from async

    const response = await axios.post(
      "https://cst438project3-6ec60cdacb89.herokuapp.com/api/favorites",
      null,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
        params: {
          // Pass query parameters here
          userId,
          trailId,
        },
      }
    );
    return response.data;
  } catch {
    alert("You Already Favorited This Trail");
    //throw error;
  }
};

// DELETE favorite trail by userId and trailId
export const deleteFavoriteTrail = async (userId, trailId) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token");

    const response = await axios.delete(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/favorites`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          userId,
          trailId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting favorite trail:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// GET favorite trails by user ID
export const getFavoriteTrailsByUserId = async (userId) => {
  try {
    console.log("in getFavoriteTrailsByUserId");
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.get(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/favorites/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    console.log("res data: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite trails by user ID:", error);
    throw error;
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await axios.post(
      "https://cst438project3-6ec60cdacb89.herokuapp.com/api/auth/register",
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("User registered successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Find User ID by username function
export const findUserByUserId = async (id) => {
  try {
    // Retrieve the token from AsyncStorage
    console.log("in findUserByUserId");
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    console.log("calling /api/users/${id} with id: ", id);
    const response = await axios.get(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/users/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use token if the endpoint requires authentication
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("User not found");
    } else {
      console.error("Error fetching user ID:", error);
    }
    throw error;
  }
};

export const getNearbyParks = async (
  latitude,
  longitude,
  radius = 5000,
  type = "park",
  keyword = "trail"
) => {
  const url = `https://cst438project3-6ec60cdacb89.herokuapp.com/places?latitude=${latitude}&longitude=${longitude}&radius=${radius}&type=${type}&keyword=${keyword}`;

  try {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem("@auth_token");

    if (!token) {
      throw new Error("No token found");
    }

    // Make the API call with the token in the headers
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token as a bearer token
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

export const updateUser = async (
  id,
  { username, email, firstName, lastName, password }
) => {
  const body = {};
  if (username !== undefined) body.username = username;
  if (email !== undefined) body.email = email;
  if (firstName !== undefined) body.firstName = firstName;
  if (lastName !== undefined) body.lastName = lastName;
  if (password !== undefined) body.password = password;

  if (Object.keys(body).length === 0) {
    throw new Error("At least one field must be provided to update.");
  }

  try {
    const token = await AsyncStorage.getItem("@auth_token");

    const response = await axios.put(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/users/${id}`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user");
  }
};

// GET check-ins by user ID
export const getCheckInsByUserId = async (userId) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.get(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/checkins/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching check-ins by user ID:", error);
    throw error;
  }
};

// GET check-ins by trail ID
export const getCheckInsByTrailId = async (trailId) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.get(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/checkins/trail/${trailId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching check-ins by trail ID:", error);
    throw error;
  }
};

// POST create a new check-in
export const createCheckIn = async (checkInData) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.post(
      "https://cst438project3-6ec60cdacb89.herokuapp.com/api/checkins",
      checkInData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating check-in:", error);
    throw error;
  }
};

// DELETE a check-in by ID
export const deleteCheckIn = async (id) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.delete(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/checkins/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    return response.data; // Modify based on the API's delete response
  } catch (error) {
    console.error("Error deleting check-in:", error);
    throw error;
  }
};

export const getTrailByPlacesId = async (placesId) => {
  console.log("in getTrailByPlacesId...");
  console.log("passed in placesId: ", placesId);
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage
    console.log("token in getTrailByPlacesId: ", token);

    const response = await axios.get(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/trails/places/${placesId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    console.log("no error: returning res data...");
    return response.data;
  } catch (error) {
    // console.error(`Error fetching trail with places ID ${placesId}:`, error);
    // throw error;
    console.log("error: returning null...");
    return null;
  }
};

export const getTrailReviews = async (trailId) => {
  try {
    console.log("in getTrailReviews");
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.get(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews/trail/${trailId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    console.log("success...");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching trail reviews:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch reviews for a specific user by userId
export const getUserReviews = async (userId) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.get(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user reviews:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create a new review
export const createReview = async (review) => {
  // console("inside API createReview");
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage
    console.log("inside API createReview");
    console.log("token data: ", token);
    const decodedToken = decodeJWT(token);
    console.log("Decoded token payload:", decodedToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    console.log("Is token expired:", currentTimestamp > decodedToken.exp);
    console.log("review object: ", review);

    //https://cst438project3-6ec60cdacb89.herokuapp.com{POST [/api/reviews]}

    const response = await axios.post(
      "https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews",
      review,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    console.log("review uploaded to db");
    return response.data;
  } catch (error) {
    console.error(
      "Error creating review:",
      error.response?.data || error.message
    );
    console.error("Error creating review:");
    console.error("Response status:", error.response?.status);
    console.error("Response headers:", error.response?.headers);
    console.error("Response data:", error.response?.data);
    console.error("Error message:", error.message);
    throw error;
  }
};

// Update an existing review by id
export const updateReview = async (id, review) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage
    const decodedToken = decodeJWT(token);
    console.log("Decoded token payload:", decodedToken);

    const response = await axios.put(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews/${id}`,
      review,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating review:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Delete a review by id
export const deleteReview = async (id) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.delete(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/reviews/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    if (response.status === 204) {
      return true; // Successfully deleted
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error("Review not found:", error.response.data || error.message);
    } else {
      console.error(
        "Error deleting review:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

export const createTrail = async (trail) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.post(
      "https://cst438project3-6ec60cdacb89.herokuapp.com/api/trails",
      trail,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating trail:", error);
    throw error;
  }
};

// GET milestones by user ID
export const getMilestonesByUserId = async (userId) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token");

    const response = await axios.get(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/milestones/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("getMilestonesByUserId returned res data: ", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching milestones by user ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getFavoriteTrailsWithImages = async (userId) => {
  try {
    const token = await AsyncStorage.getItem("@auth_token"); // Retrieve token from localStorage

    const response = await axios.get(
      `https://cst438project3-6ec60cdacb89.herokuapp.com/api/favorites/${userId}/with-images`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add the token as a bearer token
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite trails by user ID:", error);
    throw error;
  }
};
