import React from 'react';
import { Modal, Text, Button } from 'native-base';

const PlaceModal = ({ isOpen, onClose, place }) => {
    if (!place) return null; // Return null if no place is selected

    console.log(place);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>{place.name || 'Trail Information'}</Modal.Header>
                <Modal.Body>
                    <Text>
                        {place.description || 'No description available.'}
                    </Text>
                    {/* Add more fields or features for the modal here */}
                </Modal.Body>
                <Modal.Footer>
                    <Button>Check In</Button>
                    <Button>Favorite</Button>
                    <Button>Review</Button>
                    <Button onPress={onClose}>Close</Button>
                </Modal.Footer>
            </Modal.Content>
        </Modal>
    );
};

export default PlaceModal;
