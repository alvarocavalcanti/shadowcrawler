import React from "react";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBluesky } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobeAfrica } from "@fortawesome/free-solid-svg-icons";

const About: React.FC<{ version: string }> = ({ version }) => {
  return (
    <>
      <Container className="mt-3 text-center">
        <a
          href="https://shadowcrawler.vercel.app"
          target="_blank"
          className="m-1"
        >
          <FontAwesomeIcon icon={faGlobeAfrica} /> shadowcrawler.vercel.app
        </a>
      </Container>
      <Container className="mt-3 text-center">
        <a
          href="https://github.com/alvarocavalcanti/shadowcrawler"
          target="_blank"
          className="m-1"
        >
          <FontAwesomeIcon icon={faGithub} /> alvarocavalcanti/shadowcrawler
        </a>
      </Container>
      <Container className="mt-3 text-center">
        <a
          href="https://bsky.app/profile/alvarocavalcanti.bsky.social"
          target="_blank"
          className="m-1"
        >
          <FontAwesomeIcon icon={faBluesky} /> alvarocavalcanti.bsky.social
        </a>
      </Container>
      <Container className="mt-3 text-center">
        <a
          href="https://twitter.com/alvarocavalcant"
          target="_blank"
          className="m-1"
        >
          <FontAwesomeIcon icon={faTwitter} /> alvarocavalcant
        </a>
      </Container>
      <Container className="p-3 text-center">
        <a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style={{ height: "60px", width: "217px" }}
          />
        </a>
      </Container>
      <Container className="p-3 text-center">
        <a href="https://ko-fi.com/O4O1WSP5B" target="_blank" rel="noreferrer">
          <img
            height="36"
            style={{ border: 0, height: "36px" }}
            src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </Container>
      <em className="text-secondary mb-3">Version: {version}</em>
    </>
  );
};

export default About;
