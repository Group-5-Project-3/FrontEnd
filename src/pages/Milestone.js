import React, { useState, useEffect } from 'react';
import { getAllBadges } from '../components/APICalls/BadgeController';

const Milestone = () => {
  const [filter, setFilter] = useState('All Badges');
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch badges on component mount
    const fetchBadges = async () => {
      try {
        const data = await getAllBadges();
        setBadges(data); // Update state with the badges data
        console.log(data);
      } catch (err) {
        setError(err.message); // Set error if something goes wrong
      }
    };

    fetchBadges();
  }, []); // Empty dependency array ensures this runs once on mount

  if (error) {
    return <div>Error: {error}</div>;
  }


  const badgeData = [
    {
      category: 'Distance',
      badges: [
        { name: '5 Miles', image: '/images/5-miles.png', unlocked: true, progress: 5, target: 5 },
        { name: '10 Miles', image: '/images/10-miles.png', unlocked: false, progress: 7, target: 10 },
      ],
    },
    {
      category: 'Elevation',
      badges: [
        { name: '500 ft', image: '/images/500ft.png', unlocked: true, progress: 500, target: 500 },
        { name: '1000 ft', image: '/images/1000ft.png', unlocked: false, progress: 600, target: 1000 },
      ],
    },
    {
      category: 'National Parks',
      badges: [
        { name: '1 Park', image: '/images/1-park.png', unlocked: true, progress: 1, target: 1 },
        { name: '5 Parks', image: '/images/5-parks.png', unlocked: false, progress: 3, target: 5 },
      ],
    },
    {
      category: 'Total Hikes',
      badges: [
        { name: '1 Hike', image: '/images/1-hike.png', unlocked: true, progress: 1, target: 1 },
        { name: '10 Hikes', image: '/images/10-hikes.png', unlocked: false, progress: 4, target: 10 },
      ],
    },
  ];

  const categories = ['All Badges', 'Distance', 'Elevation', 'National Parks', 'Total Hikes'];

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredData =
    filter === 'All Badges'
      ? badgeData
      : badgeData.filter((categoryData) => categoryData.category === filter);

  return (
    <div className="container mt-4">
      <h2>Milestone</h2>

      {/* Dropdown for Filter */}
      <div className="mb-4">
        <label htmlFor="categoryFilter" className="form-label">
          Filter by Category:
        </label>
        <select
          id="categoryFilter"
          className="form-select"
          value={filter}
          onChange={handleFilterChange}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Render Badges Based on Filter */}
      {filteredData.map((categoryData, index) => (
        <div key={index} className="mb-4">
          <h4>{categoryData.category}</h4>
          <div className="d-flex flex-wrap">
            {categoryData.badges.map((badge, idx) => (
              <div
                key={idx}
                className={`badge-container m-2 p-2 ${badge.unlocked ? 'unlocked' : 'locked'}`}
                style={{
                  textAlign: 'center',
                  width: '120px',
                  border: '1px solid',
                  borderColor: badge.unlocked ? 'green' : 'gray',
                  borderRadius: '8px',
                }}
              >
                <img
                  src={badge.image}
                  alt={badge.name}
                  style={{ width: '60px', height: '60px', opacity: badge.unlocked ? 1 : 0.5 }}
                />
                <p>{badge.name}</p>
                <div className="progress" style={{ height: '8px', marginTop: '10px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${(badge.progress / badge.target) * 100}%`,
                      backgroundColor: badge.unlocked ? 'green' : 'gray',
                    }}
                    aria-valuenow={badge.progress}
                    aria-valuemin="0"
                    aria-valuemax={badge.target}
                  ></div>
                </div>
                <p style={{ fontSize: '12px' }}>
                  {badge.progress}/{badge.target}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Milestone;
