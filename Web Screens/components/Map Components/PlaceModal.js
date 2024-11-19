import React, { useState, useEffect, useContext } from 'react';
import { Modal, Text, Button, Input, Flex } from 'native-base';
import { createTrail, getTrailByPlacesId, createCheckIn, addFavoriteTrail } from '../../../APICalls';
import { AirbnbRating } from 'react-native-ratings';
import { checkIfTrailExist, calculateDistance } from '../utils';
import { AuthContext } from '../../AuthContext';

const PlaceModal = ({ isOpen, onClose, place, currentLocation }) => {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [overallRating, setOverallRating] = useState(0);
    const [difficultyRating, setDifficultyRating] = useState(0);
    const [trailId, setTrailId] = useState("");
    const { user } = useContext(AuthContext);

    // Fetch trailId when modal opens
    useEffect(() => {
        const fetchTrailId = async () => {
            if (isOpen && place) {
                try {
                    const trailInfo = await checkIfTrailExist(place.place_id, place);
                    console.log('Trail info fetched:', trailInfo);
                    setTrailId(trailInfo.trailId);
                } catch (error) {
                    console.error('Error fetching trail info:', error);
                }
            }
        };

        fetchTrailId();
    }, [isOpen, place]);

    if (!place) return null; // Return null if no place is selected


    const handleReview = async () => {
        try {
            
            console.log('Trail info fetched:', trailId);
    
            // Pass trailId directly without needing to rely on state
            setIsReviewModalOpen(true);
        } catch (error) {
            console.error('Error fetching trail info:', error);
        }
    };

    const handleOverallRating = (ratingValue) => {
        setOverallRating(ratingValue); // Update the rating value
        console.log('Selected Rating:', ratingValue); // Log the selected rating
    };

    const handleDifficultyRating = (ratingValue) => {
        setDifficultyRating(ratingValue); // Update the rating value
        console.log('Selected Rating:', ratingValue); // Log the selected rating
    };

    const handleReviewSubmit = async () => {
        const newTrailReview = {
            placesId: place.place_id,
            name: place.name,
            location: place.vicinity,
            description: reviewText,
            rating,
        };

        try {
            await createTrail(newTrailReview);
            console.log('Review submitted:', newTrailReview);
            setIsReviewModalOpen(false); // Close the review modal
            onClose(); // Optionally close the main modal
        } catch (error) {
            console.error('Failed to submit review:', error);
        }
    };

    const handleFavorite = async () => {
        try {
            console.log(await addFavoriteTrail(user.id, trailId));
            onClose(); // Optionally close the main modal
        } catch (error) {
            console.error('Failed to submit review:', error);
        }
    };

    const handleCheckIn = async () => {
        if (place && place.geometry && place.geometry.location) {
            const { lat, lng } = place.geometry.location;
    
            // Calculate the distance between user and the trail/park
            const distance = calculateDistance(
                currentLocation.lat, // User's current latitude
                currentLocation.lng, // User's current longitude
                lat, // Trail's latitude
                lng // Trail's longitude
            );

            
    
            const threshold = 5000; // Threshold in meters
    
            if (distance <= threshold) {
                console.log(`Within ${threshold} meters, proceeding to check in.`);
                console.log(distance);
                const checkins = {
                    trailId: trailId,
                    name: place.name,
                    userId: user.id
                }
                // console.log(checkins);
                console.log(await createCheckIn(checkins));

            } else {
                console.log(distance);
                alert(`You are too far from ${place.name}. Move closer to check in!`);
            }
        } else {
            console.error("Place location data is missing");
            alert("Unable to determine trail location.");
        }
    };

    return (
        <>
            {/* Main Place Modal */}
            <Modal isOpen={isOpen && !isReviewModalOpen} onClose={onClose}>
                <Modal.Content maxWidth="500px">
                    <Modal.CloseButton />
                    <Modal.Header>{place.name || 'Trail Information'}</Modal.Header>
                    <Modal.Body>
                        <Text>Location: {place.vicinity || 'No location attached'}</Text>

                    </Modal.Body>
                    <Modal.Footer>
                        <Flex direction="row" justifyContent="space-between" width="100%">
                            <Button flex={1} mr={2} onPress={handleCheckIn}>
                                Check In
                            </Button>
                            <Button flex={1} mx={2} onPress={handleFavorite}>
                                Add to Favorites
                            </Button>
                            <Button flex={1} mx={2} onPress={handleReview}>
                                Review
                            </Button>
                            <Button flex={1} ml={2} onPress={onClose}>
                                Close
                            </Button>
                        </Flex>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>

            {/* Review Modal */}
            <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Submit a Review for {place.name}</Modal.Header>
                    <Modal.Body>
                        <Input
                            placeholder="Write your review here"
                            value={reviewText}
                            onChangeText={setReviewText}
                            multiline={true} // Enable multiline input
                            textAlignVertical="top" // Align text to the top
                            h={100} // Set height for the textbox
                            borderWidth={1} // Add a border for clarity
                            borderColor="gray.300" // Border color
                            p={2} // Padding inside the textbox
                        />

                        <Text mt={4} mb={2}>Rate this Trail:</Text>
                        <AirbnbRating
                            count={5} // Number of stars
                            reviews={["Terrible", "Bad", "Okay", "Good", "Great"]} // Labels for ratings
                            defaultRating={overallRating} // Initial rating
                            size={30} // Size of the stars
                            onFinishRating={handleOverallRating} // Callback when rating is completed
                        />

                        <Text mt={4} mb={2}>Rate the difficulty of Trail:</Text>
                        <AirbnbRating
                            count={5} // Number of stars
                            reviews={["Terrible", "Bad", "Okay", "Good", "Great"]} // Labels for ratings
                            defaultRating={difficultyRating} // Initial rating
                            size={30} // Size of the stars
                            onFinishRating={handleDifficultyRating} // Callback when rating is completed
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onPress={handleReviewSubmit}>Submit Review</Button>
                        <Button onPress={() => setIsReviewModalOpen(false)}>Cancel</Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default PlaceModal;
