import React, { useState, useEffect } from "react";
import "./Quiz.css";
import AnswerButton from "./AnswerButtons";
import Question from "./Question";
import questionData from "../data/items-en-trimmed.json";
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

	createJsonTemplate() {
		let result = {
			totalC: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Compassion",
			},
			totalA: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Agreeableness",
			},
			totalN: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Neuroticism",
			},
			totalO: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Openness To Experience",
			},
			totalE: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Extraversion",
			},
		};
		return result;
	}

	handleNameSubmit = (event) => {
		const answer = this.state.answer;
		const name = this.state.name;

		let myJson = this.createJsonTemplate();
		for (let i = 0; i < answer.length; i++) {
			let currentScore = parseInt(answer.slice(i, i + 1));
			let currentQuestion = questionData[i];

			let added =
				currentQuestion.keyed == "plus" ? currentScore : 6 - currentScore;
			myJson[`total${currentQuestion.domain}`][
				`f${currentQuestion.facet}`
			] += added;
			myJson[`total${currentQuestion.domain}`].total += added;
		}
		let finalAnswer = "";
		let padding = false;
		for (var topKey of Object.keys(myJson)) {
			console.log(topKey + " -> " + myJson[topKey]);
			for (var lowKey of Object.keys(myJson[topKey])) {
				console.log(
					`Top key: ${topKey} | Low key: ${lowKey} | Value: ${myJson[topKey][lowKey]}`
				);
				if (lowKey != "domain") {
					if (myJson[topKey][lowKey] < 10) {
						finalAnswer += "0";
					}
					finalAnswer += myJson[topKey][lowKey];
				}
			}
		}

		const tempString = `CheckSum{-data-}${name}{-data-}${finalAnswer}{-data-}`;
		const tempHash = cryptoJS.AES.encrypt(tempString, "Super Secret Key");
		console.log(finalAnswer);
		// Iterate over myJson, add each element to the "finalAnswer" strig
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
