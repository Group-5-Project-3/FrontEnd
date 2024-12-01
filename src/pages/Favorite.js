import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { getFavoriteTrailsWithImages } from "../components/APICalls/FavoriteController";
import { Card, Row, Col, Container, Dropdown } from "react-bootstrap";
import { BiDotsVerticalRounded } from "react-icons/bi";

const Favorite = () => {
  const { user } = useContext(AuthContext); // Get the user from context
  const [favoriteTrails, setFavoriteTrails] = useState([]); // State to store favorite trails
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchFavoriteTrails = async () => {
      if (!user) return; // Ensure user is available

      try {
        setLoading(true);
        const trails = await getFavoriteTrailsWithImages(user.id); // Fetch trails by user ID
        setFavoriteTrails(trails);
        console.log(trails);
      } catch (err) {
        setError("Failed to fetch favorite trails.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteTrails();
  }, [user]); // Re-run if `user` changes

  const handleRemove = (trailId) => {
    // console.log(`Removing trail with ID: ${trailId}`);
    setFavoriteTrails((prev) => prev.filter((trail) => trail.id !== trailId));
  };

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ cursor: "pointer" }}
    >
      <BiDotsVerticalRounded size={24} />
    </div>
  ));

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
      <div
        style={{
          height: "80vh",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "20px",
        }}
      >
        {favoriteTrails.length > 0 ? (
          <Row xs={1} md={2} className="g-4">
            {favoriteTrails.map((trail) => (
              <Col key={trail.trail.trailId}>
                <Card className="h-100 position-relative">
                  {/* Dropdown Positioned Top-Right */}
                  <Dropdown className="position-absolute top-0 end-0 m-2">
                    <Dropdown.Toggle
                      as={CustomToggle}
                      id={`dropdown-${trail.trail.trailId}`}
                    />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handleRemove(trail.trail.trailId)}
                      >
                        Remove
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Row className="g-0 align-items-center">
                    <Col xs={4}>
                      <Card.Img
                        src={
                          trail.trailImages?.[0]?.imageUrl ||
                          "https://via.placeholder.com/150"
                        }
                        className="img-fluid"
                        style={{ objectFit: "cover", height: "100%" }}
                      />
                    </Col>
                    <Col xs={8}>
                      <Card.Body>
                        <Card.Title>{trail.trail.name}</Card.Title>
                        <Card.Text>
                          {trail.trail.description ||
                            "No description available."}
                        </Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No favorite trails found.</p>
        )}
      </div>
    </Container>
  );
};

export default Favorite;
