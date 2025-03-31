import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";

const NavigationBar = ({ onLogout }) => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>MyApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-light" onClick={onLogout}>
            Logout
          </Button>
        </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
