import React, { useState, useEffect } from "react";
import "./Quiz.css";
import AnswerButton from "./AnswerButtons";
import Question from "./Question";

const Quiz = (props) => {
  let questions = props.questions;
  const [questionState, setQuestionState] = useState({
    question: props.questions[0],
  });
  //TODO: Why are you starting at 1 you nong
  const [questionNumberState, setQuestionNumberState] = useState({
    questionNumber: 1,
  });

  const buttonPressHandler = (data) => {
    //Do something with response also
    console.log(data.currentTarget.value);

    //This is super ugly but also it works soooo
    //TODO: Fix this nonsense
    setQuestionNumberState({
      questionNumber: questionNumberState.questionNumber + 1,
    });
    console.log(questionNumberState.questionNumber);
    setQuestionState({
      question: props.questions[questionNumberState.questionNumber],
    });
  };

  return (
    <div className="Quiz">
      <Question className="question" question={questionState.question} />
      <AnswerButton
        className="answerButton"
        click={buttonPressHandler.bind()}
      />
    </div>
  );
};

export default Quiz;
