import React, { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import OBR, { Player } from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "../contextMenu";
import Help from "./Help";
import Navbar from "./Navbar";
import PlayerView from "./PlayerView";
import { paths } from "./util/constants";
import Main from "./Main";

export default function SPA() {
  const [role, setRole] = React.useState<"GM" | "PLAYER">("GM");

  const setTheme = (theme: string): void => {
    document.getElementById("html_root")?.setAttribute("data-bs-theme", theme);
  };

  const handlePlayerChange = (player: Player) => {
    setRole(player.role);
  };

  const [version, setVersion] = useState("unknown");
  useEffect(() => {
    fetch("/manifest.json")
      .then((b) => b.json())
      .then((j) => j.version)
      .then(setVersion);
  }, []);

  useEffect(() => {
    OBR.onReady(() => {
      setupContextMenu();
      OBR.theme.getTheme().then((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      OBR.theme.onChange((theme) => {
        setTheme(theme.mode.toLowerCase());
      });
      OBR.player.onChange(handlePlayerChange);
      OBR.player.getRole().then(setRole);
    });
  }, []);

  return role === "GM" ? (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main />} />
        <Route path={paths.help} element={<Help version={version} />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  ) : (
    <Routes>
      <Route path="/" element={<Navigate to={paths.playerView} />} />
      <Route path={paths.playerView} element={<PlayerView />} />
    </Routes>
  );
}

function Layout() {
  return <Navbar />;
}

function NoMatch() {
  return (
    <div className="p-3">
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
