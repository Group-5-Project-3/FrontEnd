import React, { useState } from 'react';
import { Modal, Text, Button } from 'native-base';
import { fetchPhotoUrl } from '../../../APICalls';
import { createCheckIn, addFavoriteTrail, createReview, createTrail } from '../../../APICalls';

const PlaceModal = ({ isOpen, onClose, place }) => {
    if (!place) return null; // Return null if no place is selected
    const [userId, setUserId] = useState("123"); // Example userId
    const [trailId, setTrailId] = useState("456"); // Example trailId
    const [checkIns, setCheckIns] = useState([]);
    const [favoriteTrails, setFavoriteTrails] = useState([]);
    

    // console.log(place.photos[0].html_attributions[0]);
    console.log(place);

    // const photoUrl =
    //     place.photos && place.photos.length > 0
    //         ? fetchPhotoUrl(place.photos[0].photo_reference, "AIzaSyDqZs2GcqLEwKD1rganE4GHJ5HHY85hRd0")
    //         : null; // Fetch photo URL if available

    // console.log(photoUrl);

    const handleCheckIn = async () => {
        console.log(`Checked in at ${place.name}`);
        // Implement check-in functionality here
        const newCheckIn = {
            userId: "123",
            trailId: "456"
        };
        try {
            // const createdCheckIn = await createCheckIn(newCheckIn);
            // setCheckIns([...checkIns, createdCheckIn]);
        } catch (error) {
            console.error(error);
        }

    };

    const handleFavorite = async () => {
        console.log(`${place.name} added to favorites`);
        // Implement favorite functionality here
        
        const userId = "123";
        const trailId = "456"
        
        try {
            // addFavoriteTrail(userId, trailId);
            // console.log("Favorte added");
        } catch (error) {
            console.error(error);
        }
    };

    const handleReview = () => {
        console.log(`Navigating to review screen for ${place.name}`);
        // Implement review functionality here
        const newCheckIn = {
            placesId: place.place_id,
            name: place.name,
            location: place.vicinity,
            description: "Nice Place",
            rating: 2.1,
        };

        createTrail(newCheckIn);
        // createReview(newCheckIn);
    };



    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>{place.name || 'Trail Information'}</Modal.Header>
                <Modal.Body>

                    <Text>
                        Location: {place.vicinity || "No location attached"}
                    </Text>
                    {/* Add more fields or features for the modal here */}
                </Modal.Body>
                <Modal.Footer>
                    <Button onPress={handleCheckIn}>Check In</Button>
                    <Button onPress={handleFavorite}>Favorite</Button>
                    <Button onPress={handleReview}>Review</Button>
                    <Button onPress={onClose}>Close</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

export default PlaceModal;
