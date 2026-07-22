import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { isDevMode } from "../utils";
import { paths } from "./util/constants";
import WhatsNew from "./WhatsNew";

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMainPage = location.pathname === "/";
  const isAboutPage = location.pathname === paths.about;

  const [version, setVersion] = useState("unknown");
  useEffect(() => {
    fetch("/manifest.json")
      .then((b) => b.json())
      .then((j) => j.version)
      .then(setVersion);
  }, []);

  return (
    <div>
      <WhatsNew currentVersion={version} storageKey="shadowcrawler-last-seen-version" />

      {isDevMode() ? (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 p-3 text-yellow-800 dark:text-yellow-200">
          Development Mode
        </div>
      ) : null}
      <nav className="px-4 pt-3">
        <div className="flex border-b border-theme">
          <Link
            to="/"
            className={`px-4 py-2 font-medium text-sm ${
              isMainPage
                ? "border-b-2 border-theme-primary text-theme-primary"
                : "text-theme-secondary hover:text-theme"
            }`}
          >
            Main
          </Link>
          <Link
            to={paths.about}
            className={`px-4 py-2 font-medium text-sm ${
              isAboutPage
                ? "border-b-2 border-theme-primary text-theme-primary"
                : "text-theme-secondary hover:text-theme"
            }`}
          >
            About
          </Link>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navbar;
