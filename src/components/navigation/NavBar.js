import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-4">
      <Navbar.Brand as={Link} to="/WebScreen">
        TrailBlazer
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/WebScreen">Home</Nav.Link>
          <Nav.Link as={Link} to="/Trails">Trails</Nav.Link>
          <Nav.Link as={Link} to="/Favorite">Favorite</Nav.Link>
          <Nav.Link as={Link} to="/Milestone">Milestone</Nav.Link>
          <Nav.Link as={Link} to="/Settings">Settings</Nav.Link>
          <Nav.Link as={Link} to="/Test">Test</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
