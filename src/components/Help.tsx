import React from "react";
import { Container } from "react-bootstrap";

const Help: React.FC<{ version: string }> = ({ version }) => {
  return (
    <>
      <Container className="mt-3 text-center">
        <a
          href="https://twitter.com/alvarocavalcant"
          target="_blank"
          className="m-1"
        >
          <img
            src="https://img.shields.io/twitter/follow/alvarocavalcant?style=social"
            alt="Follow @alvarocavalcant on Twitter"
          />
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
      <em className="text-secondary mb-3">Version: {version}</em>
    </>
  );
};

export default Help;
