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
    var rand = randomIntFromInterval(0, 1);

    setPlayer({
      scoreClara: 0,
      scoreJohannes: 0,
      turn: rand,
      result: 0,
    });
  };

  //setting the result
  const answerSelected = (index) => {
    let newPlayer = { ...player };
    if (index === question.correct_answer) {
      newPlayer.result = 1;
      if (player.turn === 0) {
        newPlayer.scoreClara = player.scoreClara + 1;
      } else {
        newPlayer.scoreJohannes = player.scoreJohannes + 1;
      }
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
    if (newPlayerState.scoreJohannes >= 10 || newPlayerState.scoreClara >= 10) {
      newPlayerState.result = 3;
    }
    setPlayer(newPlayerState);
    initQuestion();
  };

  var name;
  if (player.turn === 0) {
    name = "Clara";
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
              turn={player.turn}
              result={player.result}
              scoreClara={player.scoreClara}
              scoreJohannes={player.scoreJohannes}
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

function Result({ scoreClara, scoreJohannes, result, correctAnswer }) {
  var answer = "Richtig!";
  var answerStyle = "answer-right";
  var scoreText = scoreClara + " | " + scoreJohannes;
  var newCorrectAnswer = correctAnswer;
  var winner = "";
  var looser = "";
  if (scoreClara >= 10) {
    winner = "Clara";
    looser = "Johannes";
  } else {
    winner = "Johannes";
    looser = "Clara";
  }

  if (result === 2) {
    answer = "Falsch!";
    answerStyle = "answer-false";
  }
  if (result === 3) {
    answer = "Sieg!";
    newCorrectAnswer =
      winner + " hat gewonnen!\n" + looser + " muss heute Abend kochen!";
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
        <p>Punktestand: </p>
      </div>
      <div className="question">
        <p>{scoreText}</p>
      </div>
    </div>
  );
}

export default Quiz;
