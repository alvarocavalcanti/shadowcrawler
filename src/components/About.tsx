import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluesky } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";

const About: React.FC<{ version: string }> = ({ version }) => {
  return (
    <div className="p-4">
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
      <div className="p-3 text-center">
        <a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            className="h-[60px] w-[217px] inline-block"
          />
        </a>
      </div>
      <div className="p-3 text-center">
        <a href="https://ko-fi.com/O4O1WSP5B" target="_blank" rel="noreferrer">
          <img
            height="36"
            className="h-9 inline-block"
            src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </div>
      <div className="text-center">
        <em className="text-gray-500 dark:text-gray-400 text-sm">Version: {version}</em>
      </div>
    </div>
  );
};

export default About;
