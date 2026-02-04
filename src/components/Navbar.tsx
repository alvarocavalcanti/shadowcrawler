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
        <div className="flex border-b border-gray-300 dark:border-gray-600">
          <Link
            to="/"
            className={`px-4 py-2 font-medium text-sm ${
              isMainPage
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-300"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            Main
          </Link>
          <Link
            to={paths.about}
            className={`px-4 py-2 font-medium text-sm ${
              isAboutPage
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-300"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
