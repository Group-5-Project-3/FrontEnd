import React, { useState, useEffect, useContext } from 'react';
import { Modal, Accordion, Button, Carousel, Card } from 'react-bootstrap';
import { createCheckIn } from '../APICalls/CheckInController';
import { addFavoriteTrail } from '../APICalls/FavoriteController';
import { calculateDistance, checkIfTrailExist } from '../utils';
import { AuthContext } from '../../AuthContext';
import { createReview, getTrailReviews } from '../APICalls/ReviewController';
import { getImagesByTrailId } from '../APICalls/TrailImageController';
import { findUserByUserId } from '../APICalls/UserController';
import ReviewModal from './ReviewModal';
import './PlaceModal.css';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{ color: i <= rating ? '#FFD700' : '#D3D3D3' }}
      >
        &#9733;
      </span>
    );
  }
  return <div>{stars}</div>;
};

const formatSentiments = (sentiments) => {
  if (!sentiments) return "No sentiments available.";

  const sentimentItems = sentiments
    .split(/\d+\.\s/) // Split by numbered items like "1. ", "2. "
    .filter((item) => item.trim() !== ""); // Remove empty strings

  return (
    <ul>
      {sentimentItems.map((item, index) => {
        const cleanedItem = item.replace(/\*\*/g, ""); // Remove markdown bold (**)
        const [boldPart, ...rest] = cleanedItem.split(":"); // Split by colon for bolding
        return (
          <li key={index}>
            <strong>{boldPart.trim()}</strong>
            {rest.length > 0 ? `: ${rest.join(":").trim()}` : ""}
          </li>
        );
      })}
    </ul>
  );
};


const PlaceModal = ({ isOpen, onClose, place = {}, currentLocation }) => {
  const [trailId, setTrailId] = useState('');
  const [trailImages, setTrailImages] = useState([]);
  const [trailDescription, setTrailDescription] = useState('');
  const [trailSentiments, setTrailSentiments] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [averageDifficulty, setAverageDifficulty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTrailData = async () => {
      if (!isOpen || !place?.place_id) return;

      try {
        const trailInfo = await checkIfTrailExist(place.place_id, place);
        setTrailId(trailInfo.trailId);
        console.log('Trail ID: ', trailInfo.trailId)
        setTrailDescription(trailInfo.description || 'No description available.');
        setTrailSentiments(trailInfo.sentiments || 'No sentiments available.');
        setAverageRating(trailInfo.avgRating || null);
        setAverageDifficulty(trailInfo.avgDifficulty || null);
        console.log('avgRating: {}', trailInfo.avgDifficulty);
        console.log('avgDifficulty: {}', trailInfo.avgRating);
        const images = await getImagesByTrailId(trailInfo.trailId);
        setTrailImages(images.map((img) => img.imageUrl));

        const fetchedReviews = await getTrailReviews(trailInfo.trailId);
        const reviewsWithUsernames = await Promise.all(
          fetchedReviews.map(async (review) => {
            try {
              const userInfo = await findUserByUserId(review.userId);
              return { ...review, userName: userInfo.username };
            } catch {
              return { ...review, userName: 'Unknown User' };
            }
          })
        );
        setReviews(reviewsWithUsernames);
      } catch (error) {
        console.error('Error fetching trail data:', error);
      }
    };

    fetchTrailData();
  }, [isOpen, place]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await createReview(reviewData);
      alert('Review submitted successfully!');
      setIsReviewModalOpen(false);
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleFavorite = async () => {
    try {
      await addFavoriteTrail(user.id, trailId);
      alert(`${place?.name || 'Trail'} added to favorites!`);
      onClose();
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!user?.id) {
      alert('You need to be logged in to check in.');
      return;
    }
    try {
      const { lat, lng } = place.geometry.location;
      const distance = calculateDistance(currentLocation.lat, currentLocation.lng, lat, lng);
      const threshold = 5000;

      if (distance <= threshold) {
        const checkins = {
          trailId,
          name: place?.name || 'Trail',
          userId: user.id,
        };
        await createCheckIn(checkins);
        alert('Check-in successful!');
      } else {
        alert(`You are too far from ${place?.name || 'the trail'}. Move closer to check in!`);
      }
    } catch (error) {
      console.error('Error in handleCheckIn:', error);
      alert('Failed to check in. Please try again.');
    }
  };

  return (
    <>
      <Modal
        className="place-modal"
        show={isOpen && !isReviewModalOpen}
        onHide={onClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{place?.name || 'Trail Information'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="trail-images-carousel">
            {trailImages.length > 0 ? (
              <Carousel>
                {trailImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="d-block w-100"
                      style={{ borderRadius: '8px', maxHeight: '300px' }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <p>No images available for this trail.</p>
            )}
          </div>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Description</Accordion.Header>
              <Accordion.Body>{trailDescription}</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
            <Accordion.Header>Sentiments</Accordion.Header>
            <Accordion.Body>{formatSentiments(trailSentiments)}</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Reviews</Accordion.Header>
              <Accordion.Body>
              {averageRating && averageDifficulty ? (
                <>
                  <p>
                    <strong>Average Rating:</strong> {averageRating} / 5
                  </p>
                  <StarRating rating={averageRating} />
                  <p>
                    <strong>Average Difficulty:</strong> {averageDifficulty} / 5
                  </p>
                  <StarRating rating={averageDifficulty} />
                </>
              ) : (
                <p>This trail has not been reviewed yet.</p>
              )}
              <div style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <Card key={index} className="mb-3" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      <Card.Body>
                        <Card.Title>{review.userName}</Card.Title>
                        <Card.Text>
                          <strong>Comment:</strong> {review.comment}
                        </Card.Text>
                        <Card.Text>
                          <strong>Rating:</strong> {review.rating} / 5
                          <StarRating rating={review.rating} />
                        </Card.Text>
                        <Card.Text>
                          <strong>Difficulty:</strong> {review.difficultyRating} / 5
                          <StarRating rating={review.difficultyRating} />
                        </Card.Text>
                        <Card.Text>
                          <strong>Date:</strong> {formatTimestamp(review.timestamp)}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p>No reviews available for this trail.</p>
                )}
              </div>
            </Accordion.Body>

            </Accordion.Item>
          </Accordion>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center gap-3">
        <Button className="custom-button" onClick={handleCheckIn}>
          Check In
        </Button>
        <Button className="custom-button" onClick={handleFavorite}>
          Add to Favorites
        </Button>
        <Button className="custom-button" onClick={() => setIsReviewModalOpen(true)}>
          Write a Review
        </Button>
      </Modal.Footer>
      </Modal>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        trailId={trailId}
        placeName={place?.name || 'Trail'}
        user={user}
        onSubmit={(reviewData) =>
          handleReviewSubmit({
            ...reviewData,
            trailId,
            userId: user.id,
          })
        }
      />
    </>
  );
};

export default PlaceModal;
