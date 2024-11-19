import React, { useState, useContext } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../../AuthContext';
import { login } from '../APICalls/UserController';

export default function LoginForm({ setSelectedForm }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null); // State for error message
  const { loginUser } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    setIsLoading(true);
    setError(null); // Clear any previous error messages
    try {
      const token = await login(username, password);

      if (token) {
        await loginUser(token);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form className="w-100 w-md-50 mx-auto mt-5">
      <h3 className="text-center">Login</h3>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      <Form.Group controlId="username" className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-label="Username"
        />
      </Form.Group>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />
        <Form.Check
          type="checkbox"
          label="Show Password"
          onChange={() => setShowPassword(!showPassword)}
          className="mt-2"
        />
      </Form.Group>
      <Button variant="success" onClick={handleLogin} className="me-2" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>
      <Button variant="link" onClick={() => setSelectedForm(null)}>
        Back
      </Button>
    </Form>
  );
}
