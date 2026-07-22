import React, { useEffect, useState } from "react";

const PlayerView: React.FC = () => {
  const gifs = [
    "https://media.giphy.com/media/Ri8IaAbBNULxVTYzWw/giphy.gif?cid=790b7611moh0bd3xhuosnketp0y49q8dq5ak1irs0uct4fku&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/eIV8AvO3EC3xhscTIW/giphy.gif?cid=790b7611moh0bd3xhuosnketp0y49q8dq5ak1irs0uct4fku&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW9oMGJkM3hodW9zbmtldHAweTQ5cThkcTVhazFpcnMwdWN0NGZrdSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/a93jwI0wkWTQs/giphy.gif",
    "https://media.giphy.com/media/Ri8IaAbBNULxVTYzWw/giphy.gif?cid=790b7611moh0bd3xhuosnketp0y49q8dq5ak1irs0uct4fku&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/w89ak63KNl0nJl80ig/giphy.gif?cid=790b7611moh0bd3xhuosnketp0y49q8dq5ak1irs0uct4fku&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/xFpT7lMV5Mkqq0E6YM/giphy.gif?cid=790b7611moh0bd3xhuosnketp0y49q8dq5ak1irs0uct4fku&ep=v1_gifs_search&rid=giphy.gif&ct=g",
    "https://media.giphy.com/media/3o7TKVYGDRzuyxfo1a/giphy.gif?cid=ecf05e4724h30hzclb2v9mxsaprw252urqy6cy1z8rzcvgbv&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  ];

  const [gif, setGif] = useState<string>("");

  useEffect(() => {
    setGif(gifs[Math.floor(Math.random() * gifs.length)]);
  }, []);

  return (
    <div className="p-4">
      <div className="bg-theme-card rounded-lg border border-theme overflow-hidden mb-4">
        <img src={gif} alt="Nothing to see here" className="w-full" />
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2 text-theme">Nothing to See Here</h2>
          <p className="text-theme-secondary">
            This tool is intended for GMs to manage their games. Players will
            not see anything here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerView;
