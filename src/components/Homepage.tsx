import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { CodeBlock } from "react-code-blocks";

import Help from "./Help";

const Homepage: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isHomepage = urlParams.has("homepage");

  const [version, setVersion] = useState("unknown");
  useEffect(() => {
    fetch("/manifest.json")
      .then((b) => b.json())
      .then((j) => j.version)
      .then(setVersion);
  }, []);

  useEffect(() => {
    if (!isHomepage) {
      window.location.href = "/?homepage";
    }
  }, []);

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="3"></Col>
        <Col md="6">
          <img
            src="https://shadowcrawler.vercel.app/img/hero.png"
            alt="Shadow Crawler"
            className="mb-4"
            width="640"
          />
          <h1>Shadow Crawler</h1>
          <Container className="mb-4">
            <em>
              An{" "}
              <a href="https://owlbear.rodeo" target="_blank">
                Owlbear Rodeo
              </a>{" "}
              extension with tools for running the crawling phase of the
              Shadowdark RPG.
              <br />
              By{" "}
              <a href="http://memorablenaton.es" target="_blank">
                Alvaro Cavalcanti
              </a>
              <br />
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
              <a
                href="https://github.com/alvarocavalcanti"
                target="_blank"
                className="m-1"
              >
                <img
                  src="https://img.shields.io/badge/GitHub-alvarocavalcanti-blue?style=flat-square&logo=github"
                  alt="GitHub Profile"
                />
              </a>
            </em>
          </Container>
          <h2>Overview</h2>
          <Container className="mb-4">
            This extension provides a toolset to run the Crawling phase of the
            Shadowdark RPG. It includes a torch timer (both real-time
            and turn-based), a crawling turn counter, a random encounter dice
            roller, and the ability to save and load the extension state.
          </Container>
          <h2>Installation</h2>
          <Container className="mb-4">
            You can follow the instructions on{" "}
            <a href="https://extensions.owlbear.rodeo/guide">Owlbear Rodeo</a>{" "}
            to install the extension, and use the following URL:
            <br />
            <br />
            <CodeBlock text="https://shadowcrawler.vercel.app/manifest.json" />
          </Container>
          <h2>Features in Action</h2>
          <br />
          <h3>Torch Timer</h3>
          Keep track of the torch either using real-time or turn count.
          <img
            src="https://shadowcrawler.vercel.app/img/torch-timer-01-real-time.png"
            alt="Real-time Torch"
            className="mb-2"
          />
          <img
            src="https://shadowcrawler.vercel.app/img/torch-timer-01-turn-count.png"
            alt="Turn Count Torch"
            className="mb-2"
          />
          <h3 className="mt-4">Crawling Turns Counter</h3>
          Keep track of the current crawling turn.
          <img
            src="https://shadowcrawler.vercel.app/img/turn-counter.png"
            alt="Turn Counter"
            className="mb-2"
          />
          <h3 className="mt-4">Random Encounter Dice Roller</h3>
          Whenever you need to check for a random encounter, you can use this
          simple dice roller. The result box will become red on a 1.
          <img
            src="https://shadowcrawler.vercel.app/img/random-encounter-roller.png"
            alt="Dice Roller"
            className="mb-2"
          />
          <h3>Player View</h3>
          You can toggle the <strong>Torch Timer</strong> to be visible to the players.
          And they will see it as follows:
          <img
            src="https://shadowcrawler.vercel.app/img/torch-timer-02-real-time.png"
            alt="Real-time Torch"
            className="mb-2"
          />
          <img
            src="https://shadowcrawler.vercel.app/img/torch-timer-02-turn-count.png"
            alt="Turn Count Torch"
            className="mb-2"
          />
          <h3>Data Storage</h3>
          The extension stores all the data in the browser's local storage, and loads it at startup.
          <br />
          <h2>Feedback</h2>
          There are a few ways to provide feedback:
          <br />
          <ul>
            <li>
              <a
                href="https://discord.com/channels/795808973743194152/1242847926108028988"
                target="_blank"
              >
                Owlbear Rodeo Discord Thread
              </a>
            </li>
            <li>
              <a href="https://twitter.com/alvarocavalcant" target="_blank">
                Twitter/X
              </a>
            </li>
            <li>
              <a href="https://github.com/alvarocavalcanti" target="_blank">
                Github
              </a>
            </li>
          </ul>
          <h2>Help Topics</h2>
          <Help version={version} />
        </Col>
        <Col xs lg="3"></Col>
      </Row>
    </Container>
  );
};

export default Homepage;
