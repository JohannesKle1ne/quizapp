import React, { useState, useEffect } from "react";

function Welcome(props) {
  const strings = [
    "Liebe Thorid,\nda du ja so einen Freund hast, der Informatik studiert, bekommst du natürlich auch eine digitale Geburtstagskarte ;)",
    "Also wünsche ich dir hiermit noch einmal alles alles Gute zu deinem 21. Geburtstag!",
    "Und ich hoffe natürlich, dass das Armband dir gefällt. Glaub es passt ganz gut zu deinen Halsketten :)",
    "Und jetzt dachte ich mir, falls du dein Praktikum im Sommer ganz weit weg von hier machst...",
    "...brauchst du ja auch einen virtuellen Johannes, den du einfach in deine Tasche stecken kannst.",
    "Also bekommst du einen! ...und wenn du meinen Kopf massierst, freue ich mich natürlich",
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
      <div className="happy-birthday"></div>
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
