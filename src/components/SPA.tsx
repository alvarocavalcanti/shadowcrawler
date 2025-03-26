import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import OBR, { Player } from "@owlbear-rodeo/sdk";
import Help from "./Help";
import Main from "./Main";
import Navbar from "./Navbar";
import { paths } from "./util/constants";

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

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Main player={role === "PLAYER"} />} />
        <Route path={paths.help} element={<Help version={version} />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
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
