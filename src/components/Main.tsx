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
  const [torchTurn, setTorchTurn] = useState(0);
  const [crawlingTurns, setCrawlingTurns] = useState(0);
  const [showToPlayers, setShowToPlayers] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [randomEncounterRoll, setRandomEncounterRoll] = useState<
    string | number
  >("-");
  const [randomEncounterTurn, setRandomEncounterTurn] = useState(0);

  useEffect(() => {
    loadStateFromLocalStorage();
  }, []);

  useEffect(() => {
    saveStateToLocalStorage();
  }, [
    mode,
    countdown,
    torchTurn,
    crawlingTurns,
    showToPlayers,
    randomEncounterRoll,
    randomEncounterTurn,
  ]);

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

  useEffect(() => {
    OBR.broadcast.onMessage(`${ID}-torchTurn`, (event) => {
      setTorchTurn(event.data as number);
    });
  }, [torchTurn]);

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value;
    setMode(newMode);
    OBR.broadcast.sendMessage(`${ID}-mode`, newMode);
    setTimerRunning(false);
    if (newMode === timerModes.oneHour) {
      setCountdown(3600);
    } else {
      setTorchTurn(0);
    }
  };

  const handleTorchTurn = (delta: number) => {
    OBR.broadcast.sendMessage(`${ID}-torchTurn`, torchTurn + delta);
    setTorchTurn((prevTorchTurn) => prevTorchTurn + delta);
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
      setTorchTurn(0);
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
    setRandomEncounterTurn(crawlingTurns)
  };

  const saveStateToLocalStorage = () => {
    const state = {
      mode,
      countdown,
      turns: torchTurn,
      crawlingTurns,
      showToPlayers,
      randomEncounterRoll,
      randomEncounterTurn,
    };
    localStorage.setItem("shadowcrawlerState", JSON.stringify(state));
  };

  const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem("shadowcrawlerState");
    if (savedState) {
      const state = JSON.parse(savedState);
      setMode(state.mode);
      setCountdown(state.countdown);
      setTorchTurn(state.turns);
      setCrawlingTurns(state.crawlingTurns);
      setShowToPlayers(state.showToPlayers);
      setRandomEncounterRoll(state.randomEncounterRoll);
      setRandomEncounterTurn(state.randomEncounterTurn);
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
                      <p className="mt-4">Current Turn: {torchTurn}</p>
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
                    <Form.Select
                      value={mode}
                      onChange={handleModeChange}
                      style={{ marginBottom: "0.5rem" }}
                    >
                      <option value={timerModes.oneHour}>1 Hour</option>
                      <option value={timerModes.tenTurns}>10 Turns</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
                {mode === timerModes.oneHour ? (
                  <div>
                    <p>
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
                  <>
                    <Button
                      onClick={() => handleTorchTurn(-1)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      -
                    </Button>
                    <Button
                      onClick={() => {}}
                      style={{ marginRight: "0.5rem" }}
                      variant="secondary"
                    >
                      {torchTurn < 10 ? "0" : ""}
                      {torchTurn}
                    </Button>
                    <Button
                      onClick={() => handleTorchTurn(1)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      +
                    </Button>
                    {renderShowToPlayersButton()}
                  </>
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
              <Card.Title>Random Encounter Check</Card.Title>
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
                  disabled
                >
                  {randomEncounterRoll}
                </Button>
                <p className="mt-2">
                  Last check's <b>Turn</b>: {randomEncounterTurn}
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4"></Row>
    </Container>
  );
};

export default Main;
