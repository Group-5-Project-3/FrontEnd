import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { createCheckIn } from '../APICalls/CheckInController';
import { createTrail } from '../APICalls/TrailController';
import { getTrailByPlacesId } from '../APICalls/TrailController';
import { addFavoriteTrail } from '../APICalls/FavoriteController';
import { calculateDistance, checkIfTrailExist } from '../utils';
import { AuthContext } from '../../AuthContext';

const PlaceModal = ({ isOpen, onClose, place, currentLocation }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [overallRating, setOverallRating] = useState(0);
  const [difficultyRating, setDifficultyRating] = useState(0);
  const [trailId, setTrailId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch trailId when modal opens
  useEffect(() => {
    const fetchTrailId = async () => {
      if (isOpen && place) {
        try {
          const trailInfo = await checkIfTrailExist(place.place_id, place);
          setTrailId(trailInfo.trailId);
        } catch (error) {
          console.error('Error fetching trail info:', error);
        }
      }
    };

    fetchTrailId();
  }, [isOpen, place]);

  if (!place) return null; // Return null if no place is selected

  const handleReview = () => setIsReviewModalOpen(true);

  const handleReviewSubmit = async () => {
    const newTrailReview = {
      placesId: place.place_id,
      name: place.name,
      location: place.vicinity,
      description: reviewText,
      overallRating,
      difficultyRating,
    };

    try {
      setIsLoading(true);
      await createTrail(newTrailReview);
      alert('Review submitted successfully!');
      setIsReviewModalOpen(false);
      onClose(); // Optionally close the main modal
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsLoading(false);
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
    if (place.geometry?.location) {
      const { lat, lng } = place.geometry.location;
      const distance = calculateDistance(currentLocation.lat, currentLocation.lng, lat, lng);
      const threshold = 5000;

      if (distance <= threshold) {
        const checkins = { trailId, name: place.name, userId: user.id };
        await createCheckIn(checkins);
        alert('Check-in successful!');
      } else {
        alert(`You are too far from ${place.name}. Move closer to check in!`);
      }
    } else {
      alert("Unable to determine trail location.");
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
      <Modal show={isReviewModalOpen} onHide={() => setIsReviewModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit a Review for {place.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Write your review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts about this trail..."
            />
          </Form.Group>

          <Form.Label className="mt-3">Rate this Trail:</Form.Label>
          <StarRatings
            rating={overallRating}
            starRatedColor="gold"
            changeRating={(value) => setOverallRating(value)}
            numberOfStars={5}
            name="overallRating"
            starDimension="30px"
            starSpacing="5px"
            starHoverColor="gold" // Matches the rated color, effectively removing hover effect
          />

          <Form.Label className="mt-3">Rate the Difficulty of the Trail:</Form.Label>
          <StarRatings
            rating={difficultyRating}
            starRatedColor="gold"
            changeRating={(value) => setDifficultyRating(value)}
            numberOfStars={5}
            name="difficultyRating"
            starDimension="30px"
            starSpacing="5px"
            starHoverColor="gold" // Matches the rated color, effectively removing hover effect
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleReviewSubmit} disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit Review'}
          </Button>
          <Button variant="secondary" onClick={() => setIsReviewModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlaceModal;
