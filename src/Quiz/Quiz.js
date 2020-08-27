import React, { useState, useEffect } from "react";
import "./Quiz.css";
import AnswerButton from "./AnswerButtons";
import Question from "./Question";

const Quiz = (props) => {
  const [questionNumberState, setQuestionNumberState] = useState({
    questionNumber: 0,
  });

  const buttonPressHandler = (data) => {
    //Do something with response also
    let response = data.target.value;
    let currentQuestion = props.questions[questionNumberState.questionNumber];
    console.log(
      currentQuestion.text,
      "\nValue is: ",
      currentQuestion.choices[response].text,
      "\nDomain is: ",
      currentQuestion.domain,
      "\nValue is: ",
      currentQuestion.choices[response].score
    );
    //This is super ugly but also it works soooo
    setQuestionNumberState({
      questionNumber: questionNumberState.questionNumber + 1,
    });
  };

  return (
    <div className="Quiz">
      <Question
        className="question"
        question={props.questions[questionNumberState.questionNumber].text}
      />
      <AnswerButton
        className="answerButton"
        click={buttonPressHandler.bind()}
      />
    </div>
  );
};

export default Quiz;
