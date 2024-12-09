import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import { uploadTrailImage } from '../APICalls/TrailImageController';
import './ReviewModal.css'; // Import the CSS file

const ReviewModal = ({ isOpen, onClose, trailId, placeName, user, onSubmit }) => {
    const [reviewText, setReviewText] = useState('');
    const [overallRating, setOverallRating] = useState(0);
    const [difficultyRating, setDifficultyRating] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!reviewText || overallRating === 0 || difficultyRating === 0) {
            alert('Please fill out all fields and provide ratings.');
            return;
        }

        const reviewData = {
            trailId,
            comment: reviewText,
            rating: overallRating,
            difficultyRating,
            userId: user.id,
        };

        if (selectedImage) {
            await uploadTrailImage(selectedImage, trailId, user.id, reviewText);
        }

        setIsLoading(true);
        try {
            await onSubmit(reviewData);
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose} className="review-modal">
            <Modal.Header closeButton>
                <Modal.Title className="modal-title">
                    Submit a Review for {placeName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Form.Group className="form-group">
                    <Form.Label>Write your review</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about this trail..."
                        className="review-textarea"
                    />
                </Form.Group>

                <div className="rating-container">
                    <Form.Label className="rating-label">Rate this Trail:</Form.Label>
                    <StarRatings
                        rating={overallRating}
                        starRatedColor="gold"
                        changeRating={setOverallRating}
                        numberOfStars={5}
                        name="overallRating"
                        starDimension="30px"
                        starSpacing="5px"
                    />
                </div>

                <div className="rating-container">
                    <Form.Label className="rating-label">Rate the Difficulty of the Trail:</Form.Label>
                    <StarRatings
                        rating={difficultyRating}
                        starRatedColor="gold"
                        changeRating={setDifficultyRating}
                        numberOfStars={5}
                        name="difficultyRating"
                        starDimension="30px"
                        starSpacing="5px"
                    />
                </div>

                <Form.Group className="form-group file-input-container">
                    <Form.Label>Upload an Image (Optional):</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="file-input"
                    />
                    {selectedImage && (
                        <p className="selected-file">
                            Selected File: {selectedImage.name}
                        </p>
                    )}
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="submit-button"
                >
                    {isLoading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        'Submit Review'
                    )}
                </Button>
                <Button variant="secondary" onClick={onClose} className="cancel-button">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReviewModal;


