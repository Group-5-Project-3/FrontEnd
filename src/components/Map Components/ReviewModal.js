import React, { useState, useEffect } from 'react';
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

    // Reset state when the modal is opened
    useEffect(() => {
        if (isOpen) {
            setReviewText('');
            setOverallRating(0);
            setDifficultyRating(0);
            setSelectedImage(null);
        }
    }, [isOpen]);

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
        <Modal show={isOpen} onHide={onClose} centered>
            <Modal.Header closeButton className="review-modal-header">
                <Modal.Title>
                    <strong>Submit a Review for {placeName}</strong>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="review-group">
                        <Form.Label>Write your review</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your thoughts about this trail..."
                            className="review-textarea"
                        />
                    </Form.Group>

                    <Form.Group className="review-group">
                        <Form.Label>Rate this Trail</Form.Label>
                        <div className="review-rating">
                            <StarRatings
                                rating={overallRating}
                                starRatedColor="gold"
                                changeRating={setOverallRating}
                                numberOfStars={5}
                                name="overallRating"
                                starDimension="30px"
                                starSpacing="5px"
                            />
                            <span className="rating-text">
                                {overallRating > 0 ? `${overallRating} / 5` : 'No rating'}
                            </span>
                        </div>
                    </Form.Group>

                    <Form.Group className="review-group">
                        <Form.Label>Rate the Difficulty</Form.Label>
                        <div className="review-rating">
                            <StarRatings
                                rating={difficultyRating}
                                starRatedColor="gold"
                                changeRating={setDifficultyRating}
                                numberOfStars={5}
                                name="difficultyRating"
                                starDimension="30px"
                                starSpacing="5px"
                            />
                            <span className="rating-text">
                                {difficultyRating > 0 ? `${difficultyRating} / 5` : 'No rating'}
                            </span>
                        </div>
                    </Form.Group>

                    <Form.Group className="review-group">
                        <Form.Label>Upload an Image (Optional)</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="review-file-input"
                        />
                        {selectedImage && (
                            <small className="selected-file">
                                Selected File: {selectedImage.name}
                            </small>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="review-modal-footer">
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="review-submit-button"
                >
                    {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit Review'}
                </Button>
                <Button
                    variant="secondary"
                    onClick={onClose}
                    className="review-cancel-button"
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReviewModal;

