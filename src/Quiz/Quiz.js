import React from "react";
import "../stylesheets/Quiz.css";
import AnswerButton from "./AnswerButtons";
import Question from "./Question";
import questionData from "../data/items-en-trimmed.json";
import cryptoJS from "crypto-js";
import TemplateJSON from "../data/templates/ScoreObject.json";
import QuizHelp from "../components/QuizHelp";

import ProgressBar from "react-bootstrap/ProgressBar";

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
			overlayWidth: "100%",
			copied: false,
			hasCopied: false,
			skippable: false,
		};
	}

	buttonPressHandler = (data) => {
		let response = data.target.value;
		let currentQuestion = this.state.questions.questions[
			this.state.questionNumberState
		];
		const localQuestionsRemain = 119 !== this.state.questionNumberState;
		const localSkippable = 9 <= this.state.questionNumberState;
		this.setState({
			answer: this.state.answer + currentQuestion.choices[response].score,
			questionNumberState: this.state.questionNumberState + 1,
			questionsRemain: localQuestionsRemain,
			stage: localQuestionsRemain ? 0 : 1,
			skippable: localSkippable,
		});
	};

	previousQuestion = (e) => {
		let questionNumber = this.state.questionNumberState;
		if (questionNumber > 0) {
			this.setState({ questionNumberState: questionNumber - 1 });
		}
	};

	showHelp = (e) => {
		this.setState({ overlayWidth: "100%" });
	};
	hideHelp = (e) => {
		this.setState({ overlayWidth: "0%" });
	};

	skipRemaining = (e) => {
		let localQuestionsRemaining = 120 - this.state.questionNumberState;
		let localAnswer = this.state.answer;
		let tempNum, tempString;
		for (let i = 0; i < localQuestionsRemaining; i++) {
			tempNum = Math.ceil(Math.random() * 5);
			tempString = tempNum.toString();
			localAnswer += tempNum;
		}
		this.setState({
			answer: localAnswer,
			questionNumberState: 119,
			questionsRemain: false,
			stage: 1,
			skippable: false,
		});
	};

	handleNameChange = (event) => {
		this.setState({ name: event.target.value });
	};

	handleNameSubmit = (event) => {
		const answer = this.state.answer;
		const name = this.state.name;
		console.log(answer);
		let myJson = TemplateJSON;
		for (let i = 0; i < answer.length; i++) {
			let currentScore = parseInt(answer.slice(i, i + 1));
			let currentQuestion = questionData[i];

			let added =
				currentQuestion.keyed === "plus" ? currentScore : 6 - currentScore;
			myJson[`total${currentQuestion.domain}`][
				`f${currentQuestion.facet}`
			].val += added;
			myJson[`total${currentQuestion.domain}`].total.val += added;
			console.log(myJson[`total${currentQuestion.domain}`].total.val);
		}
		console.log(myJson);
		let finalAnswer = "";
		for (var topKey of Object.keys(myJson)) {
			for (var lowKey of Object.keys(myJson[topKey])) {
				if (lowKey !== "domain") {
					if (myJson[topKey][lowKey].val < 10) {
						finalAnswer += "0";
					}
					finalAnswer += myJson[topKey][lowKey].val;
				}
			}
		}

		const tempString = `CheckSum{-data-}${name}{-data-}${finalAnswer}{-data-}`;
		console.log(tempString);
		const tempHash = cryptoJS.AES.encrypt(tempString, "Super Secret Key");
		// Iterate over myJson, add each element to the "finalAnswer" strig
		this.setState({
			hashPlain: tempString,
			hashString: tempHash.toString(),
			stage: 2,
		});
	};

	handleCopy = (e) => {
		//document.execCommand("copy", false, this.state.hashString);
		navigator.clipboard.writeText(this.state.hashString);
		this.setState({ copied: true, hasCopied: true }, () => {
			setTimeout(() => {
				this.setState({ copied: false });
			}, 2500);
		});
	};

	retakeQuiz = (e) => {
		let questions = this.state.questions;
		this.setState({
			questionNumberState: 0,
			answer: "",
			questionsRemain: true,
			questions: questions,
			name: "",
			hashPlain: "",
			hashString: "",
			stage: 0,
			overlayWidth: "100%",
			copied: false,
		});
		e.preventDefault();
	};

	reviewPersonality = (event) => {
		this.props.onReviewPersonality(event);
	};

	compareTeam = (event) => {
		this.props.onCompareTeam(event);
	};

	renderQuizContent() {
		return (
			<div className="QuizWhole">
				<div className="QuizOverlay" style={{ width: this.state.overlayWidth }}>
					<QuizHelp />
					<div className="divQuizHelpHide">
						<a className="btnQuizHelpHide" onClick={this.hideHelp}>
							&times; Hide
						</a>
					</div>
				</div>
				<div className="QuizQuestions">
					<Question
						className="question"
						question={
							this.state.questions.questions[this.state.questionNumberState]
								.text
						}
					/>
					<AnswerButton
						className="answerButton"
						click={this.buttonPressHandler.bind()}
					/>
					<div className="divQuizProgress">
						<ProgressBar
							animated
							variant="success"
							now={this.state.questionNumberState}
							label={`${this.state.questionNumberState + 1}/120`}
							max={120}
						/>
					</div>
					<div className="divQuizBack">
						<a className="btn QuizBack" onClick={this.previousQuestion}>
							Previous Question
						</a>
					</div>
				</div>
				<div className="QuizHelp">
					<a className="btn QuizHelpShow" onClick={this.showHelp}>
						Help
					</a>
				</div>
				{this.state.skippable && (
					<div className="QuizSkip">
						<a className="btn QuizSkip" onClick={this.skipRemaining}>
							Skip Quiz
						</a>
					</div>
				)}
			</div>
		);
	}

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
		let content = (
			<div className="quizResult">
				<div className="divCopyHash">
					<a className="btn CopyHash" onClick={this.handleCopy}>
						Copy your personality code
					</a>
				</div>
				<div className="copySuccess">
					{this.state.copied && (
						<p>
							Personality code copied successfully! Save that somewhere for next
							time.
						</p>
					)}
				</div>
				<div className="divPostQuizButtons">
					<div className="relativeDiv">
						<div className="divRetakeQuiz">
							<a className="btn RetakeQuiz" onClick={this.retakeQuiz}>
								Retake Quiz
							</a>
						</div>

						<div className="divReviewPersonality">
							<a
								className="btn reviewPersonality"
								onClick={this.reviewPersonality}
							>
								Review Personality
							</a>
						</div>
						<div className="divCompareTeam">
							<a className="btn compareTeam" onClick={this.compareTeam}>
								Compare with Team
							</a>
						</div>
					</div>
				</div>
			</div>
		);
		return content;
	};

	render() {
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
}

export default Quiz;
