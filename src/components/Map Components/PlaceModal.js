import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { createCheckIn } from '../APICalls/CheckInController';
import { addFavoriteTrail } from '../APICalls/FavoriteController';
import { calculateDistance, checkIfTrailExist } from '../utils';
import { AuthContext } from '../../AuthContext';
import { createReview } from '../APICalls/ReviewController';
import ReviewModal from './ReviewModal';
import { getImagesByTrailId } from '../APICalls/TrailImageController';

const PlaceModal = ({ isOpen, onClose, place, currentLocation }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [trailId, setTrailId] = useState("");
  const [trailImage, setTrailImage] = useState("");
  const { user } = useContext(AuthContext);

  // Fetch trailId when modal opens
  useEffect(() => {
    const fetchTrailId = async () => {
      if (isOpen && place) {
        try {
          const trailInfo = await checkIfTrailExist(place.place_id, place);
          setTrailId(trailInfo.trailId);
          const trailImages = await getImagesByTrailId(trailInfo.trailId);
          if (trailImages == 0) {
            setTrailImage("");
          } else {
            setTrailImage(trailImages[0].imageUrl);
            console.log(trailImages[0].imageUrl);
          }
        } catch (error) {
          console.error('Error fetching trail info:', error);
        }
      }
    };

    fetchTrailId();
  }, [isOpen, place]);

  if (!place) return null; // Return null if no place is selected

  const handleReview = () => setIsReviewModalOpen(true);

  const handleReviewSubmit = async (reviewData) => {
    try {
      // Call API to submit review
      await createReview(reviewData);
      alert("Review submitted successfully!");
      setIsReviewModalOpen(false);
      onClose(); // Optionally close the main modal
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };


  const handleFavorite = async () => {
    try {
      await addFavoriteTrail(user.id, trailId);
      alert(`${place.name} added to favorites!`);
      onClose();
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.id) {
      console.error("User ID is not set in AuthContext.");
      alert("You need to be logged in to check in.");
      return;
    }
    try {

      if (!user?.id) {
        alert("User ID is missing. Please log in.");
        return;
      }

      if (place.geometry?.location) {
        const { lat, lng } = place.geometry.location;
        const distance = calculateDistance(currentLocation.lat, currentLocation.lng, lat, lng);
        const threshold = 5000;

        if (distance <= threshold) {
          const checkins = {
            trailId: trailId,
            name: place.name,
            userId: user.id
          };


          const response = await createCheckIn(checkins);
          alert("Check-in successful!");
        } else {
          alert(`You are too far from ${place.name}. Move closer to check in!`);
        }
      } else {
        alert("Unable to determine trail location.");
      }
    } catch (error) {
      console.error("Error in handleCheckIn:", error.response?.data || error.message);
      alert("Failed to check in. Please try again.");
    }
  };

  return (
    <>
      {/* Main Place Modal */}
      <Modal show={isOpen && !isReviewModalOpen} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{place.name || 'Trail Information'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {trailImage ? (
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <img
                src={trailImage}
                alt={`${place.name} Trail`}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                }}
              />
            </div>
          ) : (
            <p>No image available for this trail.</p>
          )}
          <p>Location: {place.vicinity || 'No location attached'}</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <Button variant="success" onClick={handleCheckIn}>
              Check In
            </Button>
            <Button variant="info" onClick={handleFavorite}>
              Add to Favorites
            </Button>
            <Button variant="primary" onClick={handleReview}>
              Review
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        trailId={trailId}
        placeName={place.name}
        user={user} // Pass the user object
        onSubmit={(reviewData) =>
          handleReviewSubmit({
            ...reviewData,
            trailId: trailId,
            userId: user.id,
          })
        }
      />
    </>
  );
};

export default PlaceModal;
