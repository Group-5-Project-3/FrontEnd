import React, { useState, useRef } from "react";
import {
  Button,
  Form,
  Card,
  Image,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import useSettingsActions from "./SettingsActions";
import { ChangePasswordModal } from "./ChangePasswordModal";

const AccountSettings = ({ user }) => {
  const {
    editName,
    editUsername,
    editEmail,
    editUserAvatar,
    changePassword,
    deleteAccount,
  } = useSettingsActions();

  const [isEditingName, setIsEditingName] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState(user?.firstName || "");
  const [lastNameInput, setLastNameInput] = useState(user?.lastName || "");

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user?.username || "");

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(user?.email || "");

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const fileInputRef = useRef();

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      editUserAvatar(user.id, file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSaveName = () => {
    editName(firstNameInput, lastNameInput);
    setIsEditingName(false);
  };

  const handleCancelEditName = () => {
    setFirstNameInput(user?.firstName || "");
    setLastNameInput(user?.lastName || "");
    setIsEditingName(false);
  };

  const handleSaveUsername = () => {
    editUsername(usernameInput);
    setIsEditingUsername(false);
  };

  const handleCancelEditUsername = () => {
    setUsernameInput(user?.username || "");
    setIsEditingUsername(false);
  };

  const handleSaveEmail = () => {
    editEmail(emailInput);
    setIsEditingEmail(false);
  };

  const handleCancelEditEmail = () => {
    setEmailInput(user?.email || "");
    setIsEditingEmail(false);
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <Container
      style={{
        backgroundColor: "#1b4332", // Forest green background
        minHeight: "100vh",
        padding: "20px",
      }}
      fluid
    >
      {/* User Avatar Section */}
      <Card
        className="mb-4 shadow-sm"
        style={{
          backgroundColor: "#2d6a4f", // Darker green for cards
          color: "#ffffff",
          border: "none",
        }}
      >
        <Card.Body>
          <Row className="align-items-center">
            <Col md="auto">
              <Image
                src={user.profilePictureUrl}
                roundedCircle
                width={100}
                height={100}
                alt="User Avatar"
              />
            </Col>
            <Col>
              <h4 className="mb-1">
                {user.firstName} {user.lastName}
              </h4>
              <p className="text-light">@{user.username}</p>
            </Col>
            <Col md="auto">
              <Button
                variant="light"
                onClick={triggerFileInput}
                style={{
                  color: "#1b4332",
                  backgroundColor: "#a8dadc",
                }}
              >
                Edit Avatar
              </Button>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Editable Fields */}
      <Card
        className="mb-4 shadow-sm"
        style={{
          backgroundColor: "#2d6a4f", // Matching card color
          color: "#ffffff",
          border: "none",
        }}
      >
        <Card.Body>
          <EditableField
            label="Full Name"
            isEditing={isEditingName}
            value={`${firstNameInput} ${lastNameInput}`}
            onEdit={() => setIsEditingName(true)}
            onCancel={handleCancelEditName}
            onSave={handleSaveName}
            fields={[
              {
                type: "text",
                placeholder: "First Name",
                value: firstNameInput,
                onChange: setFirstNameInput,
              },
              {
                type: "text",
                placeholder: "Last Name",
                value: lastNameInput,
                onChange: setLastNameInput,
              },
            ]}
          />

          <EditableField
            label="Username"
            isEditing={isEditingUsername}
            value={usernameInput}
            onEdit={() => setIsEditingUsername(true)}
            onCancel={handleCancelEditUsername}
            onSave={handleSaveUsername}
            fields={[
              {
                type: "text",
                placeholder: "Username",
                value: usernameInput,
                onChange: setUsernameInput,
              },
            ]}
          />

          <EditableField
            label="Email"
            isEditing={isEditingEmail}
            value={emailInput}
            onEdit={() => setIsEditingEmail(true)}
            onCancel={handleCancelEditEmail}
            onSave={handleSaveEmail}
            fields={[
              {
                type: "email",
                placeholder: "Email",
                value: emailInput,
                onChange: setEmailInput,
              },
            ]}
          />
        </Card.Body>
      </Card>

      {/* Actions */}
      <Card
        className="shadow-sm"
        style={{
          backgroundColor: "#2d6a4f", // Matching card color
          color: "#ffffff",
          border: "none",
        }}
      >
        <Card.Body>
          <Row>
            <Col md={6}>
              <Button
                variant="light"
                className="w-100 mb-2"
                onClick={() => setShowChangePasswordModal(true)}
                style={{
                  color: "#1b4332", // Forest green text
                  backgroundColor: "#a8dadc", // Button color for contrast
                }}
              >
                Change Password
              </Button>

              <ChangePasswordModal
                show={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
              />
            </Col>
            <Col md={6}>
              <Button
                variant="danger"
                className="w-100"
                onClick={deleteAccount}
                style={{
                  backgroundColor: "#d00000", // Red for delete button
                  color: "#ffffff",
                }}
              >
                Delete Account
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

const EditableField = ({
  label,
  isEditing,
  value,
  onEdit,
  onCancel,
  onSave,
  fields,
}) => (
  <div className="mb-4">
    <h6 className="text-light">{label}</h6>
    {isEditing ? (
      <>
        {fields.map((field, index) => (
          <Form.Control
            key={index}
            type={field.type}
            placeholder={field.placeholder}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className="mb-2"
          />
        ))}
        <div className="mt-2">
          <Button variant="success" onClick={onSave} className="me-2">
            Save
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </>
    ) : (
      <div>
        <p>{value}</p>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      </div>
    )}
  </div>
);

export default AccountSettings;
