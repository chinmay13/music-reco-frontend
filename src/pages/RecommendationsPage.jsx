import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import NavigationBar from "../components/NavigationBar";

const RecommendationPage = () => {
  const location = useLocation();
  const { recommendations = [] } = location.state || {};

  const midpoint = Math.ceil(recommendations.length / 2);
  const leftRecs = recommendations.slice(0, midpoint);
  const rightRecs = recommendations.slice(midpoint);

  const renderRecommendations = (list) =>
    list.map((rec, index) => (
      <div key={index} className="text-secondary">
        <Row className="mb-1">
          <Col xs="auto"><strong>Name:</strong></Col>
          <Col>{rec.name || rec.name_detail}</Col>
        </Row>
        <Row className="mb-1">
          <Col xs="auto"><strong>Artist:</strong></Col>
          <Col>{rec.artist || "N/A"}</Col>
        </Row>
        <Row className="mb-1">
          <Col xs="auto"><strong>Year:</strong></Col>
          <Col>{rec.year || rec.year_detail || "Unknown"}</Col>
        </Row>
        {index !== list.length - 1 && <hr className="my-3" />}
      </div>
    ));

  return (
    <div className="bg-light min-vh-100">
      {/* <NavigationBar /> */}
      <Container className="py-5">
        <h2 className="text-center mb-5">🎧 Your Top 10 Music Recommendations</h2>
        <Row className="justify-content-center g-4">
          <Col md={6}>
            <Card className="p-4 bg-white">
              {renderRecommendations(leftRecs)}
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-4 bg-white">
              {renderRecommendations(rightRecs)}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RecommendationPage;
