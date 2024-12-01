import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../AuthContext';
import { getFavoriteTrailsWithImages, deleteFavoriteTrail } from '../components/APICalls/FavoriteController';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Favorite.css';

const Favorite = () => {
  const { user } = useContext(AuthContext);
  const [favoriteTrails, setFavoriteTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCardId, setActiveCardId] = useState(null);
  const contentRefs = useRef({}); 

  useEffect(() => {
    const fetchFavoriteTrails = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const trails = await getFavoriteTrailsWithImages(user.id);
        setFavoriteTrails(trails);
      } catch (err) {
        setError("Failed to fetch favorite trails.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteTrails();
  }, [user]);

  const handleFlip = (trailId) => {
    if (activeCardId && contentRefs.current[activeCardId]) {
      contentRefs.current[activeCardId].scrollTop = 0;
    }

    setActiveCardId((prevCardId) => (prevCardId === trailId ? null : trailId));
  };

  const handleRemove = async (userId, trailId) => {
    try {
      await deleteFavoriteTrail(userId, trailId);
      setFavoriteTrails((prevTrails) =>
        prevTrails.filter((trail) => trail.trail.trailId !== trailId)
      );
      alert('Trail removed from favorites!');
    } catch (error) {
      console.error('Error removing trail:', error);
      alert('Failed to remove the trail. Please try again.');
    }
  };


  const formatSentiments = (sentiments) => {
    if (!sentiments) return "No sentiments available.";

    const sentimentItems = sentiments
      .split(/\d+\.\s/)
      .filter((item) => item.trim() !== "");

    return (
      <ul>
        {sentimentItems.map((item, index) => {
          const cleanedItem = item.replace(/\*\*/g, "");
          const [boldPart, ...rest] = cleanedItem.split(":");
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


  if (loading) {
    return (
      <Container className="mt-4">
        <h2>Favorites</h2>
        <p>Loading favorite trails...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <h2>Favorites</h2>
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2>Favorites</h2>
      <div className="favorites-container">
        <Row xs={1} md={3} lg={4} className="g-3">
          {favoriteTrails.map((trail) => (
            <Col key={trail.trail.trailId}>
              <div
                className={`flip-card ${
                  activeCardId === trail.trail.trailId ? 'flipped' : ''
                }`}
                onClick={() => handleFlip(trail.trail.trailId)}
              >
                <div className="flip-card-inner">
                  {/* Front Side */}
                  <div className="flip-card-front">
                    <div className="card-content">
                      <img
                        src={trail.trailImages?.[0]?.imageUrl || 'https://via.placeholder.com/150'}
                        alt="Trail"
                        className="card-image"
                      />
                      <h5 className="card-title">{trail.trail.name || 'Unknown Trail'}</h5>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="flip-card-back">
                    <div
                      className="card-content"
                      ref={(el) => (contentRefs.current[trail.trail.trailId] = el)}
                    >
                      <h5 className="back-card-title">
                        {trail.trail.name || 'Unknown Trail'}
                      </h5>
                      <p className="card-description">
                        {trail.trail.description || 'No description available.'}
                      </p>
                      <p className="card-sentiments">
                        <strong>Sentiments:</strong>
                        {formatSentiments(trail.trail.sentiments)}
                      </p>
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(user.id, trail.trail.trailId);
                        }}
                        style={{ marginTop: '10px' }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
};

export default Favorite;


