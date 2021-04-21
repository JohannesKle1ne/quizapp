import React, { useState, useEffect } from "react";
import Axios from "axios";
import { decode } from "html-entities";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

function Quiz(props) {
  let [player, setPlayer] = useState({});
  let [question, setQuestion] = useState({});
  let [loaded, setLoaded] = useState(false);

  //init the states
  useEffect(() => {
    initPlayers();
    initQuestion();
  }, []);

  //Random function
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const initQuestion = () => {
    setLoaded(false);
    Axios.get(
      "https://opentdb.com/api.php?amount=1&category=9&difficulty=easy&type=multiple"
    ).then((response) => {
      let questionObject = response.data.results[0];

      //put correct answer on random position
      let index = randomIntFromInterval(0, 3);
      let newAnswers = [
        questionObject.incorrect_answers[0],
        questionObject.incorrect_answers[1],
        questionObject.incorrect_answers[2],
      ];
      newAnswers.splice(index, 0, questionObject.correct_answer);
      console.log(questionObject.correct_answer);

      setQuestion({
        category: questionObject.category,
        question: questionObject.question,
        answers: newAnswers,
        correct_answer: index,
      });
      setLoaded(true);
    });
  };

  //init players and clothes
  const initPlayers = () => {
    const otherClothes = ["Hose", "Unterhose", "Socke", "Beide Socken"];
    const jClothes = ["Pulli", "T-Shirt"];
    const tClothes = ["Pulli", "T-Shirt", "BH"];

    var rand = randomIntFromInterval(0, 1);
    jClothes.splice(rand, 0, otherClothes[0]);
    rand = randomIntFromInterval(0, 1);
    tClothes.splice(rand, 0, otherClothes[0]);

    rand = randomIntFromInterval(2, 3);
    jClothes.splice(rand, 0, otherClothes[1]);
    rand = randomIntFromInterval(2, 4);
    tClothes.splice(rand, 0, otherClothes[1]);

    rand = randomIntFromInterval(0, 4);
    jClothes.splice(rand, 0, otherClothes[2]);
    rand = randomIntFromInterval(0, 5);
    tClothes.splice(rand, 0, otherClothes[3]);

    rand = randomIntFromInterval(0, 5);
    jClothes.splice(rand, 0, otherClothes[2]);

    rand = randomIntFromInterval(0, 1);

    setPlayer({
      thorid: tClothes,
      johannes: jClothes,
      turn: rand,
      result: 0,
    });
  };

  //setting the result
  const answerSelected = (index) => {
    let newPlayer = { ...player };
    if (index === question.correct_answer) {
      newPlayer.result = 1;
      setPlayer(newPlayer);
    } else {
      newPlayer.result = 2;
      setPlayer(newPlayer);
    }
  };

  //updates the game status and deletes clothes
  const newQuestion = () => {
    let newPlayerState = { ...player };
    newPlayerState.turn = 1 - player.turn;
    newPlayerState.result = 0;
    if (player.result === 2) {
      if (player.turn === 0) {
        newPlayerState.thorid.shift();
      } else {
        newPlayerState.johannes.shift();
      }
    }
    if (newPlayerState.thorid.length === 0) {
      newPlayerState.turn = 1;
    }
    if (newPlayerState.johannes.length === 0) {
      newPlayerState.turn = 0;
    }
    if (
      newPlayerState.johannes.length === 0 &&
      newPlayerState.thorid.length === 0
    ) {
      newPlayerState.result = 3;
    }
    setPlayer(newPlayerState);
    initQuestion();
  };

  var name;
  if (player.turn === 0) {
    name = "Thorid";
  } else {
    name = "Johannes";
  }

  //render function
  if (loaded) {
    if (player.result >= 1) {
      return (
        <div className="main-text-page">
          <div className="name">{player.result < 3 ? <p>{name}</p> : null}</div>
          <div className="text-page">
            <Result
              tPiece={player.thorid[0]}
              jPiece={player.johannes[0]}
              turn={player.turn}
              result={player.result}
              correctAnswer={question.answers[question.correct_answer]}
            ></Result>
            {player.result < 3 ? (
              <button className="quiz-button" onClick={newQuestion}>
                Weiter
              </button>
            ) : null}
          </div>
        </div>
      );
    } else {
      return (
        <div className="main-text-page">
          <div className="name">
            <p>{name}</p>
          </div>
          <div className="text-page">
            <Question
              question={question.question}
              category={question.category}
              turn={player.turn}
            ></Question>

            {question.answers.map((answer, index) => (
              <Answer
                key={index}
                index={index}
                answer={answer}
                answerSelected={answerSelected}
              ></Answer>
            ))}
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className="main-text-page">
        <Loader
          type="TailSpin"
          color="#4A6C6F"
          height={100}
          width={100}
          timeout={10000} //3 secs
        />
      </div>
    );
  }
}

function Question({ turn, category, question }) {
  return (
    <div className="question-div">
      <div className="question">
        <p>{decode(question)}</p>
      </div>
    </div>
  );
}

function Answer({ index, answer, answerSelected }) {
  const clicked = () => {
    answerSelected(index);
  };
  return (
    <button className="quiz-button" onClick={clicked}>
      {decode(answer)}
    </button>
  );
}

function Result({ tPiece, jPiece, turn, result, correctAnswer }) {
  var answer = "Richtig!";
  var answerStyle = "answer-right";
  var pieceText = "Du darst brav alles anlassen.";
  var piece = tPiece;
  var newCorrectAnswer = correctAnswer;
  if (turn === 1) {
    piece = jPiece;
  }
  if (result === 2) {
    answer = "Falsch!";
    pieceText = "Oh Oh... " + piece + " ausziehen";
    answerStyle = "answer-false";
  }
  if (result === 3) {
    answer = "Enjoy!";
    pieceText = "";
    newCorrectAnswer = "";
  }
  return (
    <div className="question-div">
      <div className="question">
        <p>{decode(newCorrectAnswer)}</p>
      </div>
      <div className={answerStyle}>
        <p>{answer}</p>
      </div>
      <div className="question">
        <p>{pieceText}</p>
      </div>
    </div>
  );
}

export default Quiz;
