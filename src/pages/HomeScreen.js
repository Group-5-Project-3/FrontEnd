import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import LoginForm from '../components/startScreen/LoginForm';
import GoogleLoginForm from '../components/startScreen/GoogleLoginForm';
import CreateAccountForm from '../components/startScreen/CreateAccountForm';

const HomeScreen = () => {
    const [selectedForm, setSelectedForm] = useState(null);

    return (
        <Container fluid className="vh-100">
            <Row className="h-100">
                {/* Left Side */}
                <Col
                    xs={12}
                    md={6}
                    className="d-flex flex-column justify-content-center align-items-center bg-primary position-relative"
                    style={{ overflow: 'hidden' }}
                >
                    <img
                        src="/images/Forest.png" // Access from public folder
                        alt="Background"
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', position: 'absolute' }}
                    />
                    <div className="position-relative text-center">
                        <img
                            src="/images/TrailBlazerTransparent.png" // Access from public folder
                            alt="Logo"
                            style={{ maxWidth: '80%', height: 'auto' }}
                        />
                    </div>
                </Col>

                {/* Right Side */}
                <Col
                    xs={12}
                    md={6}
                    className="d-flex flex-column justify-content-center align-items-center bg-dark text-white"
                >
                    <div className="text-center p-4">
                        <h2 className="mb-4">Welcome</h2>
                        {selectedForm === 'login' && <LoginForm setSelectedForm={setSelectedForm} />}
                        {selectedForm === 'createAccount' && <CreateAccountForm setSelectedForm={setSelectedForm} />}
                        {selectedForm === 'google' && <GoogleLoginForm setSelectedForm={setSelectedForm} />}
                        {!selectedForm && (
                            <div className="d-flex flex-column gap-3">
                                <Button variant="success" onClick={() => setSelectedForm('login')}>
                                    Log In
                                </Button>
                                <Button variant="success" onClick={() => setSelectedForm('createAccount')}>
                                    Create Account
                                </Button>
                                <Button variant="success" onClick={() => setSelectedForm('google')}>
                                    Use Google
                                </Button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default HomeScreen;
