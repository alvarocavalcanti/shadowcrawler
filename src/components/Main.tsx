import React, { useEffect, useState } from "react";
import { timerModes } from "./util/constants";
import OBR from "@owlbear-rodeo/sdk";
import PlayerView from "./PlayerView";
import { ID } from "../main";
import { analytics } from "../utils";

const Main: React.FC<{ player: boolean }> = ({ player }) => {
  const [mode, setMode] = useState<string>(timerModes.oneHour);
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds
  const [customMinutes, setCustomMinutes] = useState(60);
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
    customMinutes,
  ]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const isCountdownMode = mode === timerModes.oneHour || mode === timerModes.custom;
    
    if (timerRunning && isCountdownMode && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            // Reached zero
            setTimerRunning(false);
            OBR.notification.show("Torch Timer reached zero!", "WARNING");
            OBR.broadcast.sendMessage(`${ID}-timer-zero`, true);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    }
    
    if (showToPlayers) {
      OBR.broadcast.sendMessage(`${ID}-countdown`, countdown);
    }
    return () => clearInterval(timer);
  }, [timerRunning, mode, countdown]);

  useEffect(() => {
    const unsubPlayers = OBR.broadcast.onMessage(`${ID}-show-to-players`, (event) => {
      setShowToPlayers(event.data === true);
    });
    const unsubCountdown = OBR.broadcast.onMessage(`${ID}-countdown`, (event) => {
      setCountdown(event.data as number);
    });
    const unsubMode = OBR.broadcast.onMessage(`${ID}-mode`, (event) => {
      setMode(event.data as string);
    });
    const unsubTorchTurn = OBR.broadcast.onMessage(`${ID}-torchTurn`, (event) => {
      setTorchTurn(event.data as number);
    });
    const unsubZero = OBR.broadcast.onMessage(`${ID}-timer-zero`, (event) => {
      if (event.data === true) {
        OBR.notification.show("Torch Timer reached zero!", "WARNING");
      }
    });

    return () => {
      unsubPlayers();
      unsubCountdown();
      unsubMode();
      unsubTorchTurn();
      unsubZero();
    };
  }, []);

  const handleModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = event.target.value;
    analytics.track("change_timer_mode", { mode: newMode });
    setMode(newMode);
    OBR.broadcast.sendMessage(`${ID}-mode`, newMode);
    setTimerRunning(false);
    if (newMode === timerModes.oneHour) {
      setCountdown(3600);
    } else if (newMode === timerModes.custom) {
      setCountdown(customMinutes * 60);
    } else {
      setTorchTurn(0);
    }
  };

  const handleCustomMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(event.target.value) || 0;
    setCustomMinutes(val);
    setCountdown(val * 60);
    setTimerRunning(false);
  };

  const handleTorchTurn = (delta: number) => {
    OBR.broadcast.sendMessage(`${ID}-torchTurn`, torchTurn + delta);
    setTorchTurn((prevTorchTurn) => prevTorchTurn + delta);
  };

  const handleCrawlingTurnsChange = (delta: number) => {
    setCrawlingTurns((prevCrawlingTurns) => prevCrawlingTurns + delta);
  };

  const toggleTimer = () => {
    analytics.track(timerRunning ? "pause_timer" : "start_timer");
    setTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    analytics.track("reset_timer");
    setTimerRunning(false);
    if (mode === timerModes.oneHour) {
      setCountdown(3600);
    } else if (mode === timerModes.custom) {
      setCountdown(customMinutes * 60);
    } else {
      setTorchTurn(0);
    }
  };

  const handleShowToPlayersChange = () => {
    analytics.track("toggle_show_to_players");
    setShowToPlayers((prev) => !prev);
  };

  const renderShowToPlayersButton = () => (
    <button
      onClick={() => handleShowToPlayersChange()}
      className="px-4 py-2 bg-theme-primary text-white rounded transition-colors"
      title={showToPlayers ? "Hide from Players" : "Show to Players"}
    >
      {showToPlayers ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="inline">
          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
          <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="inline">
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
        </svg>
      )}
    </button>
  );

  const rollRandomEncounter = async () => {
    analytics.track("roll_random_encounter");
    const roll = Math.floor(Math.random() * 6) + 1;
    setRandomEncounterRoll("-");
    await new Promise((resolve) => setTimeout(resolve, 500));
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
      customMinutes,
    };
    localStorage.setItem("shadowcrawlerState", JSON.stringify(state));
  };

  const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem("shadowcrawlerState");
    if (savedState) {
      const state = JSON.parse(savedState);
      setMode(state.mode || timerModes.oneHour);
      setCountdown(state.countdown ?? 3600);
      setTorchTurn(state.turns || 0);
      setCrawlingTurns(state.crawlingTurns || 0);
      setShowToPlayers(state.showToPlayers || false);
      setRandomEncounterRoll(state.randomEncounterRoll || "-");
      setRandomEncounterTurn(state.randomEncounterTurn || 0);
      setCustomMinutes(state.customMinutes || 60);
    }
  };

  useEffect(() => {
    OBR.broadcast.sendMessage(`${ID}-show-to-players`, showToPlayers);
  }, [showToPlayers]);

  const isCountdownMode = mode === timerModes.oneHour || mode === timerModes.custom;

  return player ? (
    showToPlayers ? (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-theme">Shadow Crawler</h1>
        <div className="bg-theme-card rounded-lg border border-theme p-4 mt-4">
          <h2 className="text-lg font-semibold mb-3 text-theme">Torch Timer</h2>
          <div className="text-theme-secondary">
            {isCountdownMode ? (
              <div>
                <p className="mt-4">
                  Time Remaining
                  <br />
                  <span className={`text-2xl font-mono ${countdown === 0 ? "text-theme-danger font-bold" : ""}`}>
                    {Math.floor(countdown / 60)}:
                    {(countdown % 60).toString().padStart(2, '0')}
                  </span>
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap mb-2">
                <p className="mt-4">Current Turn: {torchTurn}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <PlayerView />
    )
  ) : (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2 text-theme">Shadow Crawler</h1>
      <p className="mb-4 text-theme-secondary">
        A toolset for running the Crawling Phase of the{" "}
        <a
          href="https://www.thearcanelibrary.com/pages/shadowdark"
          target="_blank"
          rel="noreferrer"
          className="text-theme-primary hover:underline"
        >
          Shadowdark RPG
        </a>
        .
      </p>

      <div className="bg-theme-card rounded-lg border border-theme p-4 mt-4">
        <h2 className="text-lg font-semibold mb-3 text-theme">Torch Timer</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-theme-secondary">
            Timer Mode
          </label>
          <select
            value={mode}
            onChange={handleModeChange}
            className="w-full px-3 py-2 mb-2 border border-theme rounded bg-theme-card text-theme"
          >
            <option value={timerModes.oneHour}>1 Hour</option>
            <option value={timerModes.custom}>Custom Time</option>
            <option value={timerModes.tenTurns}>10 Turns</option>
          </select>
          {mode === timerModes.custom && (
            <div className="mt-2 flex items-center gap-2">
              <input 
                type="number" 
                min="1"
                value={customMinutes}
                onChange={handleCustomMinutesChange}
                className="w-24 px-3 py-2 border border-theme rounded bg-theme-card text-theme"
              />
              <span className="text-theme-secondary">minutes</span>
            </div>
          )}
        </div>
        {isCountdownMode ? (
          <div>
            <p className="text-theme-secondary mb-4">
              Time Remaining
              <br />
              <span className={`text-2xl font-mono ${countdown === 0 ? "text-theme-danger font-bold" : ""}`}>
                {Math.floor(countdown / 60)}:
                {(countdown % 60).toString().padStart(2, '0')}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={toggleTimer}
                disabled={countdown === 0}
                className={`px-4 py-2 text-white rounded transition-colors ${countdown === 0 ? "bg-theme-secondary opacity-50 cursor-not-allowed" : "bg-theme-primary"}`}
              >
                {timerRunning ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="inline">
                    <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="inline">
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
                  </svg>
                )}
              </button>
              <button
                onClick={resetTimer}
                className="px-4 py-2 bg-theme-secondary text-white rounded transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="inline">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                </svg>
              </button>
              {renderShowToPlayersButton()}
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleTorchTurn(-1)}
              className="px-4 py-2 bg-theme-primary text-white rounded transition-colors"
            >
              -
            </button>
            <button
              className="px-4 py-2 bg-theme-secondary text-white rounded cursor-default"
            >
              {torchTurn < 10 ? "0" : ""}
              {torchTurn}
            </button>
            <button
              onClick={() => handleTorchTurn(1)}
              className="px-4 py-2 bg-theme-primary text-white rounded transition-colors mr-2"
            >
              +
            </button>
            {renderShowToPlayersButton()}
          </div>
        )}
      </div>

      <div className="bg-theme-card rounded-lg border border-theme p-4 mt-4">
        <h2 className="text-lg font-semibold mb-3 text-theme">Crawling Turns Counter</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleCrawlingTurnsChange(-1)}
            className="px-4 py-2 bg-theme-primary text-white rounded transition-colors"
          >
            -
          </button>
          <button
            className="px-4 py-2 bg-theme-secondary text-white rounded cursor-default"
          >
            {crawlingTurns < 10 ? "0" : ""}
            {crawlingTurns}
          </button>
          <button
            onClick={() => handleCrawlingTurnsChange(1)}
            className="px-4 py-2 bg-theme-primary text-white rounded transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="bg-theme-card rounded-lg border border-theme p-4 mt-4 mb-4">
        <h2 className="text-lg font-semibold mb-3 text-theme">Random Encounter Check</h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => rollRandomEncounter()}
            className="px-4 py-2 bg-theme-primary text-white rounded transition-colors"
          >
            Roll 1d6
          </button>
          <button
            className={`px-4 py-2 rounded cursor-default ${
              randomEncounterRoll === 1
                ? "bg-theme-danger text-white"
                : "bg-theme-secondary text-white"
            }`}
            disabled
          >
            {randomEncounterRoll}
          </button>
        </div>
        <p className="mt-2 text-theme-secondary">
          Last check's <strong>Turn</strong>: {randomEncounterTurn}
        </p>
      </div>
    </div>
  );
};

export default Main;
