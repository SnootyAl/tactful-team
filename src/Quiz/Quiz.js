import React, { useState, useEffect } from "react";
import "./Quiz.css";
import AnswerButton from "./AnswerButtons";
import Question from "./Question";
import cryptoJS from "crypto-js";

class Quiz extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			questionNumberState: 0,
			answer: "",
			questionsRemain: true,
			questions: props,
			name: "",
			hashPlain: "",
			hashString: "",
			stage: 0,
		};
	}

	buttonPressHandler = (data) => {
		let response = data.target.value;
		console.log(this.state.questionNumberState + 1);
		let currentQuestion = this.state.questions.questions[
			this.state.questionNumberState
		];
		console.log(
			currentQuestion.text,
			"\nValue is: ",
			currentQuestion.choices[response].text,
			"\nDomain is: ",
			currentQuestion.domain,
			"\nValue is: ",
			currentQuestion.choices[response].score
		);
		const localQuestionsRemain = 119 != this.state.questionNumberState;
		this.setState(
			{
				answer: this.state.answer + currentQuestion.choices[response].score,
				questionNumberState: this.state.questionNumberState + 1,
				questionsRemain: localQuestionsRemain,
				stage: localQuestionsRemain ? 0 : 1,
			},
			() => {
				console.log("answer");
			}
		);

		// This is super ugly but also it works soooo
		//setQuestionNumberState(questionNumberState + 1);
		// Now with less ugly!
	};

	renderQuizContent() {
		return (
			<div className="QuizQuestions">
				<Question
					className="question"
					question={
						this.state.questions.questions[this.state.questionNumberState].text
					}
				/>
				<AnswerButton
					className="answerButton"
					click={this.buttonPressHandler.bind()}
				/>
			</div>
		);
	}

	handleNameChange = (event) => {
		this.setState({ name: event.target.value });
	};

	handleNameSubmit = (event) => {
		const answer = this.state.answer;
		const name = this.state.name;
		const tempString = `CheckSum{-data-}${name}{-data-}${answer}{-data-}`;
		const tempHash = cryptoJS.AES.encrypt(tempString, "Super Secret Key");
		this.setState({
			hashPlain: tempString,
			hashString: tempHash.toString(),
			stage: 2,
		});
	};

	renderPostQuizContent = () => {
		let content = (
			<div className="QuizResults">
				<form className="quizNameForm" onSubmit={this.handleNameSubmit}>
					<input
						className="quizNameInput"
						type="text"
						placeholder="Insert name..."
						id="userInput"
						autoComplete="off"
						value={this.state.name}
						onChange={this.handleNameChange}
					/>
					<input type="submit" value="Submit" />
				</form>
			</div>
		);

		return content;
	};

	renderResultContent = () => {
		console.log(this.state.hashPlain);
		let content = (
			<div className="quizResult">
				<p>{this.state.hashString}</p>
			</div>
		);
		return content;
	};

	render() {
		//console.log(this.state.questions.questions[0]);
		let content;
		switch (this.state.stage) {
			case 0:
				content = this.renderQuizContent();
				break;
			case 1:
				content = this.renderPostQuizContent();
				break;
			case 2:
				content = this.renderResultContent();
		}
		return <div className="Quiz">{content}</div>;
	}
	// const [questionNumberState, setQuestionNumberState] = useState(0);
	// const [answer, addToAnswer] = useState("");
	// let questionsRemain = true;
}

export default Quiz;
