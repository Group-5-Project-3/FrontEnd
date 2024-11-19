import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import AccountSettings from '../components/settings/AccountSetting';

const Setting = () => {
  const [selectedCategory, setSelectedCategory] = useState('Account');
  const { user, loading, logout } = useContext(AuthContext);

  const categories = ['Account', 'Notifications', 'About', 'Log Out'];

  const handleLogout = () => {
    logout();
  };

  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'Account':
        return user ? <AccountSettings user={user} /> : <p>Loading user data...</p>;
      case 'Notifications':
        return <h2>Notification Settings</h2>;
      case 'About':
        return <h2>About</h2>;
      case 'Log Out':
        return (
          <div>
            <h2>Are you sure you want to log out?</h2>
            <button onClick={handleLogout} className="btn btn-danger">Log Out</button>
          </div>
        );
      default:
        return <p>Select a category</p>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <span>Loading Settings...</span>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-4" style={{ width: '20%' }}>
        <h3>Settings</h3>
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`p-2 ${selectedCategory === category ? 'bg-secondary' : ''}`}
          >
            {category}
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="p-4" style={{ flex: 1 }}>
        {renderCategoryContent()}
      </div>
    </div>
  );
};

export default Setting;
