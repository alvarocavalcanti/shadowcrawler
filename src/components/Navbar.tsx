import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

import { isDevMode } from "../utils";
import { paths } from "./util/constants";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      {isDevMode() ? (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-700 p-3 text-yellow-800 dark:text-yellow-200">
          Development Mode
        </div>
      ) : null}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        <div className="px-4 py-3">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Menu ▼
            </button>
            {isMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  Main
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700"></div>
                <Link
                  to={paths.about}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                >
                  About
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

export default Navbar;
