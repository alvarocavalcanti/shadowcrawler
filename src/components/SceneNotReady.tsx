import React from "react";
import { Card, CardBody, Container } from "react-bootstrap";

const SceneNotReady: React.FC = () => {
  return (
    <Container>
      <Card className="mb-4 mt-4">
        <CardBody>
          <Card.Title className="header">No Active Scene</Card.Title>
          <Card.Text>
            In order to use the Shadow Crawler toolset you must have an active
            Scene.
          </Card.Text>
        </CardBody>
      </Card>
    </Container>
  );
};

export default SceneNotReady;
