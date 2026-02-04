import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluesky } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";
import ThemeSelector from "./ThemeSelector";
import { ThemeId } from "../themes";
import DonationButtons from "./DonationButtons";

const About: React.FC<{ version: string; currentTheme: ThemeId; onThemeChange: (theme: ThemeId) => void }> = ({ version, currentTheme, onThemeChange }) => {
  return (
    <div className="p-4">
      <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
      <div className="mt-3 text-center">
        <a
          href="https://shadowcrawler.vercel.app"
          target="_blank"
          className="m-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FontAwesomeIcon icon={faGlobeAfrica} /> shadowcrawler.vercel.app
        </a>
      </div>
      <div className="mt-3 text-center">
        <a
          href="https://github.com/alvarocavalcanti/shadowcrawler"
          target="_blank"
          className="m-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FontAwesomeIcon icon={faGithub} /> alvarocavalcanti/shadowcrawler
        </a>
      </div>
      <div className="mt-3 text-center">
        <a
          href="https://bsky.app/profile/alvarocavalcanti.bsky.social"
          target="_blank"
          className="m-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FontAwesomeIcon icon={faBluesky} /> alvarocavalcanti.bsky.social
        </a>
      </div>
      <div className="mt-3 text-center">
        <a
          href="https://twitter.com/alvarocavalcant"
          target="_blank"
          className="m-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FontAwesomeIcon icon={faTwitter} /> alvarocavalcant
        </a>
      </div>
      <DonationButtons />
      <div className="text-center">
        <em className="text-gray-500 dark:text-gray-400 text-sm">Version: {version}</em>
      </div>
    </div>
  );
};

export default About;
