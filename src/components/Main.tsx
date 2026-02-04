import React, { useEffect, useState } from "react";
import { timerModes } from "./util/constants";
import OBR from "@owlbear-rodeo/sdk";
import PlayerView from "./PlayerView";
import { ID } from "../main";
import WhatsNew from "./WhatsNew";

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
    <button
      onClick={() => handleShowToPlayersChange()}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Shadow Crawler</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mt-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Torch Timer</h2>
          <div className="text-gray-700 dark:text-gray-300">
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
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Shadow Crawler</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        A toolset for running the Crawling Phase of the{" "}
        <a
          href="https://www.thearcanelibrary.com/pages/shadowdark"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Shadowdark RPG
        </a>
        .
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mt-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Torch Timer</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Timer Mode
          </label>
          <select
            value={mode}
            onChange={handleModeChange}
            className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value={timerModes.oneHour}>1 Hour</option>
            <option value={timerModes.tenTurns}>10 Turns</option>
          </select>
        </div>
        {mode === timerModes.oneHour ? (
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Time Remaining
              <br />
              <span className="text-2xl font-mono">
                {Math.floor(countdown / 60)}:
                {countdown === 3600 ? "00" : countdown % 60}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={toggleTimer}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              -
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded cursor-default"
            >
              {torchTurn < 10 ? "0" : ""}
              {torchTurn}
            </button>
            <button
              onClick={() => handleTorchTurn(1)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mr-2"
            >
              +
            </button>
            {renderShowToPlayersButton()}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mt-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Crawling Turns Counter</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleCrawlingTurnsChange(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            -
          </button>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded cursor-default"
          >
            {crawlingTurns < 10 ? "0" : ""}
            {crawlingTurns}
          </button>
          <button
            onClick={() => handleCrawlingTurnsChange(1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4 mt-4 mb-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Random Encounter Check</h2>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => rollRandomEncounter()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Roll 1d6
          </button>
          <button
            className={`px-4 py-2 rounded cursor-default ${
              randomEncounterRoll === 1
                ? "bg-red-600 text-white"
                : "bg-gray-500 text-white"
            }`}
            disabled
          >
            {randomEncounterRoll}
          </button>
        </div>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Last check's <strong>Turn</strong>: {randomEncounterTurn}
        </p>
      </div>
    </div>
  );
};

export default Main;
