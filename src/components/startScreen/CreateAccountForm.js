import React, { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { register } from '../APICalls/UserController';

export default function CreateAccountForm({ setSelectedForm }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    let validationErrors = {};

    if (!username) validationErrors.username = 'Username is required';
    if (!email) validationErrors.email = 'Email is required';
    if (!password) validationErrors.password = 'Password is required';
    if (password !== confirmPassword)
      validationErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const userData = { username, email, password, firstName, lastName };
      const response = await register(userData);

      if (response) {
        alert('Sign up successful');
        setSelectedForm(null);
      } else {
        alert('Sign up failed');
      }
    } catch (e) {
      console.error('Failed to save user data', e);
      alert('An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form className="w-100 w-md-50 mx-auto mt-5">
      <Form.Group controlId="firstName" className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          aria-label="First Name"
        />
      </Form.Group>
      <Form.Group controlId="lastName" className="mb-3">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          aria-label="Last Name"
        />
      </Form.Group>
      <Form.Group controlId="username" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          isInvalid={!!errors.username}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="confirmPassword" className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isInvalid={!!errors.confirmPassword}
        />
        <Form.Control.Feedback type="invalid">
          {errors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="success" onClick={handleSignup} className="me-2" disabled={isLoading}>
        {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
      </Button>
      <Button variant="link" onClick={() => setSelectedForm(null)}>
        Back
      </Button>
    </Form>
  );
}
