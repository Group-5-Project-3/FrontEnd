import React, { useState, useEffect, useContext } from 'react';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import { getAllBadges } from '../components/APICalls/BadgeController';
import { getBadgesByUserId } from '../components/APICalls/UserBadgeController';
import { AuthContext } from '../AuthContext';
import { sortBadges } from '../components/utils';

const Milestone = () => {
  const [filter, setFilter] = useState('All Badges');
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await getAllBadges();
        const info = await getBadgesByUserId(user.id);
        // console.log(data);
        setBadges(sortBadges(data));
        setUserBadges(info);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBadges();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Check if a badge is in userBadges
  const isBadgeInUserBadges = (badge) =>
    userBadges.some((userBadge) => userBadge.badgeId === badge.badgeId);

  // Function to log image dimensions
  const handleImageLoad = (event, badgeName) => {
    const { naturalWidth, naturalHeight } = event.target;
    console.log(`Badge: ${badgeName}, Width: ${naturalWidth}px, Height: ${naturalHeight}px`);
  };

  // Group badges by type
  const groupedBadges = badges.reduce((groups, badge) => {
    const { type } = badge;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(badge);
    return groups;
  }, {});

  // Filter badges based on selected filter
  const filteredBadges =
    filter === 'All Badges'
      ? badges
      : badges.filter((badge) => badge.type === filter);

  return (
    <Container fluid style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h2 className="mt-4">Milestone</h2>

      {/* Dropdown for filtering badges */}
      <Form.Group controlId="filterSelect" className="my-3">
        <Form.Label>Filter Badges</Form.Label>
        <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All Badges">All Badges</option>
          <option value="DISTANCE">Distance</option>
          <option value="ELEVATION">Elevation</option>
          <option value="NATIONAL_PARKS">National Parks</option>
          <option value="TOTAL_HIKES">Total Hikes</option>
        </Form.Select>
      </Form.Group>

      {/* Scrollable container for badges */}
      <div
        style={{
          maxHeight: '725px', // Adjust height as needed
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        {filter === 'All Badges'
          ? Object.keys(groupedBadges).map((type) => (
            <div key={type} className="mb-4">
              <h3>{type}</h3>
              <Row>
                {groupedBadges[type].map((badge) => (
                  <Col key={badge.name} xs={12} sm={6} md={4} lg={3} className="mb-3">
                    <Card className="text-center" style={{ width: '200px' }}>
                      <Card.Img
                        variant="top"
                        src={badge.badgeUrl}
                        alt={badge.name}
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          width: '100%',
                          filter: isBadgeInUserBadges(badge) ? 'none' : 'grayscale(100%)',
                        }}
                      />
                      <Card.Body>
                        <Card.Title>{badge.name}</Card.Title>
                        <Card.Text style={{ color: isBadgeInUserBadges(badge) ? 'green' : 'red' }}>
                          {isBadgeInUserBadges(badge) ? 'Completed' : 'Incomplete'}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ))
          : (
            <Row>
              {filteredBadges.map((badge) => (
                <Col key={badge.name} xs={12} sm={6} md={4} lg={3} className="mb-3">
                  <Card className="text-center" style={{ width: '200px' }}>
                    <Card.Img
                      variant="top"
                      src={badge.badgeUrl}
                      alt={badge.name}
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                        width: '100%',
                        filter: isBadgeInUserBadges(badge) ? 'none' : 'grayscale(100%)',
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{badge.name}</Card.Title>
                      <Card.Text style={{ color: isBadgeInUserBadges(badge) ? 'green' : 'red' }}>
                        {isBadgeInUserBadges(badge) ? 'Completed' : 'Incomplete'}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
      </div>
    </Container>
  );
};

export default Milestone;
