import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { timerModes } from "./util/constants";
import OBR from "@owlbear-rodeo/sdk";
import PlayerView from "./PlayerView";
import { ID } from "../main";

const Main: React.FC<{ player: boolean }> = ({ player }) => {
  const [mode, setMode] = useState<string>(timerModes.oneHour);
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
  const [turns, setTurns] = useState(Array(10).fill(false));
  const [crawlingTurns, setCrawlingTurns] = useState(0);
  const [showToPlayers, setShowToPlayers] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [randomEncounterRoll, setRandomEncounterRoll] = useState<
    string | number
  >("-");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerRunning && mode === timerModes.oneHour && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }
    if (showToPlayers) {
      OBR.broadcast.sendMessage(`${ID}-countdown`, countdown);
    }
    return () => clearInterval(timer);
  }, [timerRunning, mode, countdown]);

  useEffect(
    () =>
      OBR.broadcast.onMessage(`${ID}-show-to-players`, (event) => {
        setShowToPlayers(event.data === true);
      }),
    [showToPlayers]
  );

  useEffect(
    () =>
      OBR.broadcast.onMessage(`${ID}-countdown`, (event) => {
        setCountdown(event.data as number);
      }),
    [countdown]
  );

  useEffect(
    () =>
      OBR.broadcast.onMessage(`${ID}-mode`, (event) => {
        setMode(event.data as string);
      }),
    [mode]
  );

  useEffect(
    () =>
      OBR.broadcast.onMessage(`${ID}-turns`, (event) => {
        setTurns(event.data as boolean[]);
      }),
    [mode]
  );

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value;
    setMode(newMode);
    OBR.broadcast.sendMessage(`${ID}-mode`, newMode);
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
    OBR.broadcast.sendMessage(`${ID}-turns`, turns);
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

  const handleShowToPlayersChange = () => {
    setShowToPlayers((prev) => !prev);
  };

  const renderShowToPlayersButton = () => (
    <Button
      onClick={() => handleShowToPlayersChange()}
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

  const rollRandomEncounter = async () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setRandomEncounterRoll("-");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 300ms
    setRandomEncounterRoll(roll);
  };

  const saveStateToLocalStorage = () => {
    const state = {
      mode,
      countdown,
      turns,
      crawlingTurns,
      showToPlayers,
      randomEncounterRoll,
    };
    localStorage.setItem("shadowcrawlerState", JSON.stringify(state));
    OBR.notification.show("Current state saved!");
  };

  const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem("shadowcrawlerState");
    if (savedState) {
      const state = JSON.parse(savedState);
      setMode(state.mode);
      setCountdown(state.countdown);
      setTurns(state.turns);
      setCrawlingTurns(state.crawlingTurns);
      setShowToPlayers(state.showToPlayers);
      setRandomEncounterRoll(state.randomEncounterRoll);
      OBR.notification.show("Previous state saved!");
    } else {
      OBR.notification.show("No previous state found!");
    }
  };

  useEffect(() => {
    OBR.broadcast.sendMessage(`${ID}-show-to-players`, showToPlayers);
  }, [showToPlayers]);

  return player ? (
    showToPlayers ? (
      <Container>
        <h1>Shadow Crawler</h1>
        <Row>
          <Col>
            <Card className="mt-4">
              <Card.Body>
                <Card.Title>Torch Timer</Card.Title>
                <Card.Text>
                  {mode === timerModes.oneHour ? (
                    <div>
                      <p className="mt-4">
                        Time Remaining
                        <br />
                        {Math.floor(countdown / 60)}:
                        {countdown === 3600 ? "00" : countdown % 60}
                      </p>
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap mb-2">
                      <p className="mt-4">Turns</p>
                      <p className="mt-4">
                        Current Turn: {turns.filter((turn) => turn).length}
                      </p>
                    </div>
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    ) : (
      <PlayerView />
    )
  ) : (
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
                <Button
                  onClick={() => handleCrawlingTurnsChange(-1)}
                  style={{ marginRight: "0.5rem" }}
                >
                  -
                </Button>
                <Button
                  onClick={() => {}}
                  style={{ marginRight: "0.5rem" }}
                  variant="secondary"
                >
                  {crawlingTurns < 10 ? "0" : ""}
                  {crawlingTurns}
                </Button>
                <Button onClick={() => handleCrawlingTurnsChange(1)}>+</Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Random Encounter</Card.Title>
              <Card.Text>
                <Button
                  onClick={() => {
                    rollRandomEncounter();
                  }}
                  style={{ marginRight: "0.5rem" }}
                >
                  Roll 1d6
                </Button>
                <Button
                  variant={randomEncounterRoll === 1 ? "danger" : "secondary"}
                >
                  {randomEncounterRoll}
                </Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4 mb-4">
        <Col>
          <Button
            onClick={saveStateToLocalStorage}
            variant="success"
            style={{ marginRight: "0.5rem" }}
          >
            Save
          </Button>
          <Button onClick={loadStateFromLocalStorage} variant="info">
            Load
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Main;
