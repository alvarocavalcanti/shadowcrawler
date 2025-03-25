import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { timerModes } from "./util/constants";

const Main: React.FC = () => {
  const [mode, setMode] = useState<string>(timerModes.oneHour);
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
  const [turns, setTurns] = useState(Array(10).fill(false));
  const [crawlingTurns, setCrawlingTurns] = useState(0);
  const [showToPlayers, setShowToPlayers] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerRunning && mode === timerModes.oneHour && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerRunning, mode, countdown]);

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value;
    setMode(newMode);
    setTimerRunning(false);
    if (newMode === timerModes.oneHour) {
      setCountdown(3600);
    } else {
      setTurns(Array(10).fill(false));
    }
  };

  const handleTurnCheckboxChange = (index: number) => {
    setTurns((prevTurns) => {
      const newTurns = [...prevTurns];
      newTurns[index] = !newTurns[index];
      return newTurns;
    });
  };

  const handleCrawlingTurnsChange = (delta: number) => {
    setCrawlingTurns((prevCrawlingTurns) => prevCrawlingTurns + delta);
  };

  const toggleTimer = () => {
    setTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    if (mode === timerModes.oneHour) {
      setCountdown(3600);
    } else {
      setTurns(Array(10).fill(false));
    }
  };

  const renderShowToPlayersButton = () => (
    <Button
      onClick={() => setShowToPlayers((prev) => !prev)}
      variant="primary"
      title={showToPlayers ? "Hide from Players" : "Show to Players"}
    >
      {showToPlayers ? (
        <i className="bi bi-eye-slash-fill"></i>
      ) : (
        <i className="bi bi-eye-fill"></i>
      )}
    </Button>
  );

  return (
    <Container>
      <h1>Shadow Crawler</h1>A toolset for running the Crawling Phase of the{" "}
      <a
        href="https://www.thearcanelibrary.com/pages/shadowdark"
        target="_blank"
        rel="noreferrer"
      >
        Shadowdark RPG
      </a>
      .
      <Row>
        <Col>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Torch Timer</Card.Title>
              <Card.Text>
                <Form>
                  <Form.Group>
                    <Form.Label>Timer Mode</Form.Label>
                    <Form.Select value={mode} onChange={handleModeChange}>
                      <option value={timerModes.oneHour}>1 Hour</option>
                      <option value={timerModes.tenTurns}>10 Turns</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
                {mode === timerModes.oneHour ? (
                  <div>
                    <p className="mt-4">
                      Time Remaining
                      <br />
                      {Math.floor(countdown / 60)}:
                      {countdown === 3600 ? "00" : countdown % 60}
                    </p>
                    <Button
                      onClick={toggleTimer}
                      style={{ marginRight: "0.5rem" }}
                    >
                      {timerRunning ? (
                        <i className="bi bi-stop-fill"></i>
                      ) : (
                        <i className="bi bi-play-fill"></i>
                      )}
                    </Button>
                    <Button
                      onClick={resetTimer}
                      variant="secondary"
                      style={{ marginRight: "0.5rem" }}
                    >
                      <i className="bi bi-arrow-repeat"></i>
                    </Button>
                    {renderShowToPlayersButton()}
                  </div>
                ) : (
                  <div>
                    <Form.Group>
                      <Form.Label className="mt-4">Turns</Form.Label>
                      <div className="d-flex flex-wrap mb-2">
                        {turns.map((turn, index) => (
                          <Form.Check
                            key={index}
                            type="checkbox"
                            label={`${index < 9 ? "0" : ""}${index + 1}`}
                            checked={turn}
                            onChange={() => handleTurnCheckboxChange(index)}
                            style={{ marginRight: "0.5rem" }}
                          />
                        ))}
                      </div>
                    </Form.Group>
                    <Button
                      onClick={resetTimer}
                      variant="secondary"
                      style={{ marginRight: "0.5rem" }}
                    >
                      <i className="bi bi-arrow-repeat"></i>
                    </Button>
                    {renderShowToPlayersButton()}
                  </div>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Crawling Turns Counter</Card.Title>
              <Card.Text>
                <Button onClick={() => handleCrawlingTurnsChange(-1)}>-</Button>
                <span className="mx-2">{crawlingTurns}</span>
                <Button onClick={() => handleCrawlingTurnsChange(1)}>+</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Main;
