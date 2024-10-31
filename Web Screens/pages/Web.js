import React from 'react';
import { View, Text } from 'react-native';
import MapComponent from './MapComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

export default function WebScreen() {
  return (
    <Container fluid style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Row>
        <Col>
          <h1 className="text-center py-3">My React Google Map</h1>
        </Col>
      </Row>
      <Row style={{ flex: 1 }}>
        <Col>
          <MapComponent />
        </Col>
      </Row>
    </Container>
  );
}