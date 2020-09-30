import React, { useState, useEffect } from "react";
import "./Quiz.css";
import AnswerButton from "./AnswerButtons";
import Question from "./Question";

const Quiz = (props) => {
	const [questionNumberState, setQuestionNumberState] = useState(0);
	const [answer, addToAnswer] = useState("");
	let questionsRemain = true;
	const buttonPressHandler = (data) => {
		//Do something with response also
		let response = data.target.value;
		let currentQuestion = props.questions[questionNumberState];
		console.log(
			currentQuestion.text,
			"\nValue is: ",
			currentQuestion.choices[response].text,
			"\nDomain is: ",
			currentQuestion.domain,
			"\nValue is: ",
			currentQuestion.choices[response].score
		);
		addToAnswer(answer + currentQuestion.choices[response].score);
		console.log(answer);
		if (questionNumberState == 119) {
			alert("I have clicked 120 times");
			questionsRemain = false;
		}

		if (questionsRemain) {
		}
		// This is super ugly but also it works soooo
		setQuestionNumberState(questionNumberState + 1);
		// Now with less ugly!
	};

	return (
		<div className="Quiz">
			<Question
				className="question"
				question={props.questions[questionNumberState].text}
			/>
			<AnswerButton
				className="answerButton"
				click={buttonPressHandler.bind()}
			/>
		</div>
	);
};

export default Quiz;