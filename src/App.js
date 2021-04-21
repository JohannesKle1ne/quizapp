import React, { useState } from "react";
import Welcome from "./Welcome";
import Jeo from "./Jeo";
import Quiz from "./Quiz";
import Information from "./Information";

import "./App.css";

function App() {
  const [screen, setScreen] = useState(0);

  const nextScreen = () => {
    setScreen(screen + 1);
  };

  if (screen === 0) {
    return <Welcome nextScreen={nextScreen}></Welcome>;
  }
  if (screen === 1) {
    return <Jeo nextScreen={nextScreen}></Jeo>;
  }
  if (screen === 2) {
    return <Information nextScreen={nextScreen}></Information>;
  }
  if (screen === 3) {
    return <Quiz></Quiz>;
  } else {
    return <h1>no screen available for this number</h1>;
  }
}
export default App;
