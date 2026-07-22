import React, { useEffect, useState } from "react";
import { CodeBlock } from "react-code-blocks";

import About from "./About";

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <img
          src="https://shadowcrawler.vercel.app/img/hero.png"
          alt="Shadow Crawler"
          className="mb-4 w-full max-w-full"
        />
        <h1 className="text-3xl font-bold mb-4 text-theme">Shadow Crawler</h1>
        <div className="mb-4 text-theme-secondary">
          <em>
            An{" "}
            <a href="https://owlbear.rodeo" target="_blank" className="text-theme-primary hover:underline">
              Owlbear Rodeo
            </a>{" "}
            extension with tools for running the crawling phase of the
            Shadowdark RPG.
            <br />
            By{" "}
            <a href="http://memorablenaton.es" target="_blank" className="text-theme-primary hover:underline">
              Alvaro Cavalcanti
            </a>
            <br />
            <a
              href="https://twitter.com/alvarocavalcant"
              target="_blank"
              className="m-1 inline-block"
            >
              <img
                src="https://img.shields.io/twitter/follow/alvarocavalcant?style=social"
                alt="Follow @alvarocavalcant on Twitter"
              />
            </a>
            <a
              href="https://github.com/alvarocavalcanti"
              target="_blank"
              className="m-1 inline-block"
            >
              <img
                src="https://img.shields.io/badge/GitHub-alvarocavalcanti-blue?style=flat-square&logo=github"
                alt="GitHub Profile"
              />
            </a>
          </em>
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-theme">Overview</h2>
        <div className="mb-4 text-theme-secondary">
          This extension provides a toolset to run the Crawling phase of the
          Shadowdark RPG. It includes a torch timer (both real-time and
          turn-based), a crawling turn counter, a random encounter dice
          roller, and the ability to save and load the extension state.
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-theme">Installation</h2>
        <div className="mb-4 text-theme-secondary">
          You can follow the instructions on{" "}
          <a href="https://extensions.owlbear.rodeo/guide" className="text-theme-primary hover:underline">Owlbear Rodeo</a>{" "}
          to install the extension, and use the following URL:
          <br />
          <br />
          <CodeBlock text="https://shadowcrawler.vercel.app/manifest.json" />
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-theme">Features in Action</h2>
        <br />
        <h3 className="text-xl font-semibold mb-2 text-theme">Torch Timer</h3>
        <p className="mb-2 text-theme-secondary">Keep track of the torch either using real-time or turn count.</p>
        <img
          src="https://shadowcrawler.vercel.app/img/torch-timer-01-real-time.png"
          alt="Real-time Torch"
          className="mb-2 w-full rounded border border-theme"
        />
        <img
          src="https://shadowcrawler.vercel.app/img/torch-timer-01-turn-count.png"
          alt="Turn Count Torch"
          className="mb-2 w-full rounded border border-theme"
        />
        <h3 className="text-xl font-semibold mb-2 mt-4 text-theme">Crawling Turns Counter</h3>
        <p className="mb-2 text-theme-secondary">Keep track of the current crawling turn.</p>
        <img
          src="https://shadowcrawler.vercel.app/img/turn-counter.png"
          alt="Turn Counter"
          className="mb-2 w-full rounded border border-theme"
        />
        <h3 className="text-xl font-semibold mb-2 mt-4 text-theme">Random Encounter Dice Roller</h3>
        <p className="mb-2 text-theme-secondary">
          Whenever you need to check for a random encounter, you can use this
          simple dice roller. The result box will become red on a 1.
        </p>
        <img
          src="https://shadowcrawler.vercel.app/img/random-encounter-roller.png"
          alt="Dice Roller"
          className="mb-2 w-full rounded border border-theme"
        />
        <h3 className="text-xl font-semibold mb-2 text-theme">Player View</h3>
        <p className="mb-2 text-theme-secondary">
          You can toggle the <strong>Torch Timer</strong> to be visible to the
          players. And they will see it as follows:
        </p>
        <img
          src="https://shadowcrawler.vercel.app/img/torch-timer-02-real-time.png"
          alt="Real-time Torch"
          className="mb-2 w-full rounded border border-theme"
        />
        <img
          src="https://shadowcrawler.vercel.app/img/torch-timer-02-turn-count.png"
          alt="Turn Count Torch"
          className="mb-2 w-full rounded border border-theme"
        />
        <h3 className="text-xl font-semibold mb-2 text-theme">Data Storage</h3>
        <p className="mb-2 text-theme-secondary">
          The extension stores all the data in the browser's local storage, and
          loads it at startup.
        </p>
        <h2 className="text-2xl font-semibold mb-3 mt-4 text-theme">Feedback</h2>
        <p className="mb-2 text-theme-secondary">There are a few ways to provide feedback:</p>
        <ul className="list-disc list-inside mb-4 text-theme-secondary">
          <li>
            <a
              href="https://discord.com/channels/795808973743194152/1242847926108028988"
              target="_blank"
              className="text-theme-primary hover:underline"
            >
              Owlbear Rodeo Discord Thread
            </a>
          </li>
          <li>
            <a href="https://twitter.com/alvarocavalcant" target="_blank" className="text-theme-primary hover:underline">
              Twitter/X
            </a>
          </li>
          <li>
            <a href="https://github.com/alvarocavalcanti" target="_blank" className="text-theme-primary hover:underline">
              Github
            </a>
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-3 text-theme">Help Topics</h2>
        <About version={version} currentTheme="dark-fantasy" onThemeChange={() => {}} />
      </div>
    </div>
  );
};

export default Homepage;
