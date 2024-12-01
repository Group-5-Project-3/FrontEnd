import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Alert, Card } from 'react-bootstrap';
import { getAllBadges } from '../components/APICalls/BadgeController';
import { getBadgesByUserId } from '../components/APICalls/UserBadgeController';
import { getMilestonesByUserId } from '../components/APICalls/MilestoneController';
import { AuthContext } from '../AuthContext';
import { sortBadges } from '../components/utils';
import './Milestone.css';

const Milestone = () => {
  const [filter, setFilter] = useState('All Badges');
  const [badges, setBadges] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [milestones, setMilestones] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const badgeData = await getAllBadges();
        const userBadgeData = await getBadgesByUserId(user.id);
        const milestoneData = await getMilestonesByUserId(user.id);
        setBadges(sortBadges(badgeData));
        setUserBadges(userBadgeData);
        setMilestones(milestoneData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, [user]);

  const isBadgeInUserBadges = (badge) =>
    userBadges.some((userBadge) => userBadge.badgeId === badge.badgeId);

  const groupedBadges = badges.reduce((groups, badge) => {
    const { type } = badge;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(badge);
    return groups;
  }, {});

  const filteredBadges =
    filter === 'All Badges'
      ? badges
      : badges.filter((badge) => badge.type === filter);

  return (
    <Container fluid className="milestone-scrollable-container">
      <h2 className="mt-4 text-center">Milestones</h2>

      {error && (
        <Alert variant="danger" className="my-3">
          {error}
        </Alert>
      )}

      {milestones && (
        <div className="milestones-section my-4">
          <div className="milestone-cards">
            <div className="milestone-card">
              <div className="milestone-icon">🥾</div>
              <div className="milestone-label">Total Hikes</div>
              <div className="milestone-value">{milestones.totalHikes}</div>
            </div>
            <div className="milestone-card">
              <div className="milestone-icon">📏</div>
              <div className="milestone-label">Total Distance</div>
              <div className="milestone-value">{milestones.totalDistance.toFixed(2)} kilometers</div>
            </div>
            <div className="milestone-card">
              <div className="milestone-icon">⛰️</div>
              <div className="milestone-label">Total Elevation Gain</div>
              <div className="milestone-value">{milestones.totalElevationGain.toFixed(2)} meters</div>
            </div>
            <div className="milestone-card">
              <div className="milestone-icon">🏞️</div>
              <div className="milestone-label">National Parks Visited</div>
              <div className="milestone-value">{milestones.nationalParksVisited}</div>
            </div>
          </div>
        </div>
      )}

      <Form.Group controlId="filterSelect" className="my-4">
        <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All Badges">All Badges</option>
          <option value="DISTANCE">Distance</option>
          <option value="ELEVATION">Elevation</option>
          <option value="NATIONAL_PARKS">National Parks</option>
          <option value="TOTAL_HIKES">Total Hikes</option>
        </Form.Select>
      </Form.Group>

      <div className="badge-container">
        {filter === 'All Badges'
          ? Object.keys(groupedBadges).map((type) => (
              <div key={type} className="badge-group">
                <h3 className="badge-group-title">{type.replace(/_/g, ' ')}</h3>
                <Row className="g-3">
                  {groupedBadges[type].map((badge) => (
                    <Col key={badge.badgeId} xs={12} sm={6} md={4} lg={3}>
                      <Card className="badge-card">
                        <div className="card-horizontal-layout">
                          <div className="card-horizontal-image-container">
                            <img
                              src={badge.badgeUrl}
                              alt={badge.name}
                              className={`card-horizontal-image ${
                                isBadgeInUserBadges(badge) ? '' : 'grayscale'
                              }`}
                            />
                          </div>
                          <div className="card-horizontal-details">
                            <Card.Title className="badge-title">{badge.name}</Card.Title>
                            <Card.Text
                              className={`badge-status ${
                                isBadgeInUserBadges(badge) ? 'completed' : 'incomplete'
                              }`}
                            >
                              {isBadgeInUserBadges(badge) ? 'Completed' : 'Incomplete'}
                            </Card.Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))
          : (
            <Row className="g-3">
              {filteredBadges.map((badge) => (
                <Col key={badge.badgeId} xs={12} sm={6} md={4} lg={3}>
                  <Card className="badge-card">
                    <div className="card-horizontal-layout">
                      <div className="card-horizontal-image-container">
                        <img
                          src={badge.badgeUrl}
                          alt={badge.name}
                          className={`card-horizontal-image ${
                            isBadgeInUserBadges(badge) ? '' : 'grayscale'
                          }`}
                        />
                      </div>
                      <div className="card-horizontal-details">
                        <Card.Title className="badge-title">{badge.name}</Card.Title>
                        <Card.Text
                          className={`badge-status ${
                            isBadgeInUserBadges(badge) ? 'completed' : 'incomplete'
                          }`}
                        >
                          {isBadgeInUserBadges(badge) ? 'Completed' : 'Incomplete'}
                        </Card.Text>
                      </div>
                    </div>
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
