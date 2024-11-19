import React, { useState } from 'react';
import { Button, Form, Image, Modal, Row, Col } from 'react-bootstrap';
import useSettingsActions from './SettingsActions';

const AccountSettings = ({ user }) => {
  const { editName, editUsername, editEmail, editUserAvatar, changePassword, deleteAccount } = useSettingsActions();

  const [isEditingName, setIsEditingName] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(user?.firstName || '');
  const [lastNameInput, setLastNameInput] = useState(user?.lastName || '');

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user?.username || '');

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user?.email || '');

  const handleSaveName = () => {
    editName(firstNameInput, lastNameInput);
    setIsEditingName(false);
  };

  const handleCancelEditName = () => {
    setFirstNameInput(user?.firstName || '');
    setLastNameInput(user?.lastName || '');
    setIsEditingName(false);
  };

  const handleSaveUsername = () => {
    editUsername(usernameInput);
    setIsEditingUsername(false);
  };

  const handleCancelEditUsername = () => {
    setUsernameInput(user?.username || '');
    setIsEditingUsername(false);
  };

  const handleSaveEmail = () => {
    editEmail(emailInput);
    setIsEditingEmail(false);
  };

  const handleCancelEditEmail = () => {
    setEmailInput(user?.email || '');
    setIsEditingEmail(false);
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div className="container my-4">
      {/* User Avatar and Info */}
      <Row className="align-items-center mb-4">
        <Col md="auto">
          <Image
            src="https://example.com/avatar.jpg"
            roundedCircle
            width={100}
            height={100}
            alt="User Avatar"
          />
        </Col>
        <Col>
          <h4>
            {user.firstName} {user.lastName}
          </h4>
          <p>@{user.username}</p>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={editUserAvatar}>
            Edit User Image
          </Button>
        </Col>
      </Row>

      {/* Editable Fields */}
      <Row className="mb-3">
        <Col>
          <h6>Full Name</h6>
          {isEditingName ? (
            <>
              <Form.Control
                type="text"
                placeholder="First Name"
                value={firstNameInput}
                onChange={(e) => setFirstNameInput(e.target.value)}
                className="mb-2"
              />
              <Form.Control
                type="text"
                placeholder="Last Name"
                value={lastNameInput}
                onChange={(e) => setLastNameInput(e.target.value)}
              />
              <div className="mt-2">
                <Button variant="success" onClick={handleSaveName} className="me-2">
                  Save
                </Button>
                <Button variant="secondary" onClick={handleCancelEditName}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div>
              <p>{firstNameInput} {lastNameInput}</p>
              <Button variant="secondary" onClick={() => setIsEditingName(true)}>
                Edit
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <h6>Username</h6>
          {isEditingUsername ? (
            <>
              <Form.Control
                type="text"
                placeholder="Username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
              />
              <div className="mt-2">
                <Button variant="success" onClick={handleSaveUsername} className="me-2">
                  Save
                </Button>
                <Button variant="secondary" onClick={handleCancelEditUsername}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div>
              <p>{usernameInput}</p>
              <Button variant="secondary" onClick={() => setIsEditingUsername(true)}>
                Edit
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <h6>Email</h6>
          {isEditingEmail ? (
            <>
              <Form.Control
                type="email"
                placeholder="Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <div className="mt-2">
                <Button variant="success" onClick={handleSaveEmail} className="me-2">
                  Save
                </Button>
                <Button variant="secondary" onClick={handleCancelEditEmail}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div>
              <p>{emailInput}</p>
              <Button variant="secondary" onClick={() => setIsEditingEmail(true)}>
                Edit
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Actions */}
      <Row>
        <Col>
          <Button variant="warning" className="me-2" onClick={changePassword}>
            Change Password
          </Button>
          <Button variant="danger" onClick={deleteAccount}>
            Delete Account
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AccountSettings;
