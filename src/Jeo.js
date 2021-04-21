import React, { useRef, useState } from "react";
import { useGesture } from "react-use-gesture";
import { merge, bounceInUp, wobble } from "react-animations";
import Radium, { StyleRoot } from "radium";

const mixedAnimation = merge(bounceInUp, wobble);

const styles = {
  wobble: {
    animation: "x 7s",
    animationName: Radium.keyframes(wobble, "wobble"),
  },
  mixedAnimation: {
    animation: "x 5s",
    animationName: Radium.keyframes(mixedAnimation, "mixedAnimation"),
  },
};

function Jeo(props) {
  let imageRef = useRef();
  let [scale, setScale] = useState(0);
  let [direction, setDirection] = useState({ right: true, left: true });
  let [hairCounter, setHairCounter] = useState(0);
  let [heartCounter, setHeartCounter] = useState(0);
  let [second, setSecond] = useState(false);
  let [hearts, setHearts] = useState({
    heart1: false,
    heart2: false,
    heart3: false,
  });

  useGesture(
    {
      onDrag: ({ offset: [x, y] }) => {
        if (x > scale && direction.left) {
          setDirection({ right: true, left: false });
          updateCounter();
        }
        if (x < scale && direction.right) {
          setDirection({ right: false, left: true });
          updateCounter();
        }
        console.log(hairCounter);
        setScale(x);
      },
    },
    {
      domTarget: imageRef,
      eventOptions: { passive: false },
    }
  );

  const updateCounter = () => {
    setHairCounter(hairCounter + 1);
    if (hairCounter === 45 || hairCounter === 48 || hairCounter === 50) {
      renderHeart();
    }
    if (hairCounter >= 50) {
      setSecond(true);
    }
  };

  const renderHeart = () => {
    console.log("Hearts" + hearts);
    var newHearts = { ...hearts };
    if (hearts.heart1 === false) {
      newHearts.heart1 = true;
      console.log("loop 1 " + hearts.heart1 === false);
    } else {
      if (hearts.heart2 === false) {
        newHearts.heart2 = true;
        console.log("loop 2");
      } else {
        if (hearts.heart3 === false) {
          newHearts.heart3 = true;
          console.log(" loop 3");
        }
      }
    }
    setHearts(newHearts);
  };

  const heartCount = () => {
    console.log("heartCount 1");
    let newHeartCouter = heartCounter + 1;
    if (newHeartCouter >= 10) {
      props.nextScreen();
      console.log("heartCount 2");
    }
    console.log(newHeartCouter);
    setHeartCounter(newHeartCouter);
  };

  return (
    <div className="image-page">
      <div className={second ? "second-image" : "image"}>
        <div
          className="touchbox"
          ref={imageRef}
          style={{ touchAction: "none" }}
        ></div>
        {hearts.heart1 ? (
          <StyleRoot>
            <div className="heart-div1" style={styles.mixedAnimation}>
              <p></p>
            </div>
          </StyleRoot>
        ) : null}
        {hearts.heart2 ? (
          <StyleRoot>
            <div className="heart-div2" style={styles.mixedAnimation}>
              <p></p>
            </div>
          </StyleRoot>
        ) : null}
        {hearts.heart3 ? (
          <StyleRoot>
            <div
              onClick={heartCount}
              className="heart-div3"
              style={styles.mixedAnimation}
            >
              <p></p>
            </div>
          </StyleRoot>
        ) : null}
      </div>
    </div>
  );
}

export default Jeo;
