import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { updateUser } from '../APICalls/UserController';
import { verifyPassword } from '../APICalls/UserController';

export const ChangePasswordModal = ({ show, onClose, user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    try {
      console.log(user);
      const correct = verifyPassword(user.id, currentPassword);
      
      
      onClose();
    } catch (err) {
      setError('Error changing password: ' + err.message);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group>
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleChangePassword}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
