import React, { useState, useEffect } from "react";

function Welcome(props) {
  const strings = [
    "Glückwunsch! Du hast den geheimen Bereich entdeckt!",
    "Hier geht es darum zufällige Fragen zu beantworten...",
    "...und so eine falsch beantwortete Frage hat natürlich Konsequenzen...",
    "Viel Spaß ;)",
  ];
  let [counter, setCoutner] = useState(0);
  let [text, setText] = useState("");

  const next = () => {
    var next = counter + 1;
    if (next >= strings.length) {
      props.nextScreen();
    } else {
      setCoutner(next);
      setText(strings[next]);
    }
  };

  useEffect(() => {
    setText(strings[counter]);
  }, []);

  return (
    <div className="main-text-page">
      <div className="text-div">
        <div className="text">
          <p>{text}</p>
        </div>
      </div>
      <div className="arrow" onClick={next}></div>
    </div>
  );
}

export default Welcome;
