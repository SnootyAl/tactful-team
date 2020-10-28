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

	/**
	 * Takes the user's answer and stores it in state.
	 * Updates state to show next question
	 * @param {event} event 
	 */
	buttonPressHandler = (event) => {
		let response = event.target.value;
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

	/**
	 * Steps the question back once
	 * @param {event} e 
	 */
	previousQuestion = (e) => {
		let questionNumber = this.state.questionNumberState;
		if (questionNumber > 0) {
			this.setState({ questionNumberState: questionNumber - 1 });
		}
	};

	/**
	 * Displays the help overlay
	 * @param {event} e 
	 */
	showHelp = (e) => {
		this.setState({ overlayWidth: "100%" });
	};
	
	/**
	 * Hides the help overlay
	 * @param {event} e 
	 */
	hideHelp = (e) => {
		this.setState({ overlayWidth: "0%" });
	};

	/**
	 * Skips the remaining questions in the quiz, regardless of how many questions have been answered already
	 * @param {event} e 
	 */
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

	/**
	 * Updates state with any user changes to the name input section
	 * @param {event} event 
	 */
	handleNameChange = (event) => {
		this.setState({ name: event.target.value });
	};

	/**
	 * Formats the user's answers and hashes the result
	 * @param {event} event 
	 */
	handleNameSubmit = (event) => {
		const answer = this.state.answer;
		const name = this.state.name;
		let myJson = this.generateNewTemplate();
		for (let i = 0; i < answer.length; i++) {
			let currentScore = parseInt(answer.slice(i, i + 1));
			let currentQuestion = questionData[i];
			let added =
				currentQuestion.keyed === "plus" ? currentScore : 6 - currentScore;
			myJson[`total${currentQuestion.domain}`][
				`f${currentQuestion.facet}`
			].val += added;
			myJson[`total${currentQuestion.domain}`].total.val += added;
		}
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
		const tempHash = cryptoJS.AES.encrypt(tempString, "Super Secret Key");
		// Iterate over myJson, add each element to the "finalAnswer" strig
		this.setState({
			hashPlain: tempString,
			hashString: tempHash.toString(),
			stage: 2,
		});
	};

	/**
	 * Copies the user's hash to their clipboard
	 * @param {event} e 
	 */
	handleCopy = (e) => {
		navigator.clipboard.writeText(this.state.hashString);
		this.setState({ copied: true, hasCopied: true }, () => {
			setTimeout(() => {
				this.setState({ copied: false });
			}, 4500);
		});
	};

	/**
	 * Resets the state and allows the user to retake the quiz
	 * @param {event} e 
	 */
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
			hasCopied: false,
		});
		e.preventDefault();
	};

	/**
	 * Navigates the user to the review personality page
	 * @param {event} event 
	 */
	reviewPersonality = (event) => {
		this.props.onReviewPersonality(event);
	};

	/**
	 * Navigates the user to the team creation page
	 * @param {event} event 
	 */
	compareTeam = (event) => {
		this.props.onCompareTeam(event);
	};

	/**
	 * Renders the quiz content
	 */
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
							className="objProgressBar"
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

	/**
	 * Renders the name input content
	 */
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
					<button
					className="btn btnNameInput"
					type="submit"
					value="Submit"
					> 
						Submit 
					</button>
				</form>
			</div>
		);

		return content;
	};

	/**
	 * Renders the copy hash button + navigation buttons
	 */
	renderResultContent = () => {
		if (!this.state.hasCopied) {
			this.handleCopy();
		}
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
							Personality code copied successfully! You can use that code for any
							future teams you join, so save it somewhere safe.
						</p>
					)}
				</div>
				{this.state.hasCopied && (			
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
				)}
			</div>
		);
		return content;
	};

	/**
	 * Renders the page
	 */
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

	/**
	 * Generates a new blank result template
	 */
	generateNewTemplate() {
		return {
			totalC: {
				f1: {
					title: "Self-Efficacy",
					val: 0,
				},
				f2: {
					title: "Orderliness",
					val: 0,
				},
				f3: {
					title: "Dutifulness",
					val: 0,
				},
				f4: {
					title: "Achievement-Striving",
					val: 0,
				},
				f5: {
					title: "Self-Discipline",
					val: 0,
				},
				f6: {
					title: "Cautiousness",
					val: 0,
				},
				total: {
					val: 0,
				},
				domain: "Conscientiousness",
			},
			totalA: {
				f1: {
					title: "Trust",
					val: 0,
				},
				f2: {
					title: "Morality",
					val: 0,
				},
				f3: {
					title: "Altruism",
					val: 0,
				},
				f4: {
					title: "Cooperation",
					val: 0,
				},
				f5: {
					title: "Modesty",
					val: 0,
				},
				f6: {
					title: "Sympathy",
					val: 0,
				},
				total: {
					val: 0,
				},
				domain: "Agreeableness",
			},
			totalN: {
				f1: {
					title: "Anxiety",
					val: 0,
				},
				f2: {
					title: "Anger",
					val: 0,
				},
				f3: {
					title: "Depression",
					val: 0,
				},
				f4: {
					title: "Self-Consciousness",
					val: 0,
				},
				f5: {
					title: "Immoderation",
					val: 0,
				},
				f6: {
					title: "Vulnerability",
					val: 0,
				},
				total: {
					val: 0,
				},
				domain: "Neuroticism",
			},
			totalO: {
				f1: {
					title: "Imagination",
					val: 0,
				},
				f2: {
					title: "Artistic Interests",
					val: 0,
				},
				f3: {
					title: "Emotionality",
					val: 0,
				},
				f4: {
					title: "Adventurousness",
					val: 0,
				},
				f5: {
					title: "Intellect",
					val: 0,
				},
				f6: {
					title: "Liberalism",
					val: 0,
				},
				total: {
					val: 0,
				},
				domain: "Openness To Experience",
			},
			totalE: {
				f1: {
					title: "Friendliness",
					val: 0,
				},
				f2: {
					title: "Gregariousness",
					val: 0,
				},
				f3: {
					title: "Assertiveness",
					val: 0,
				},
				f4: {
					title: "Activity Level",
					val: 0,
				},
				f5: {
					title: "Excitement-Seeking",
					val: 0,
				},
				f6: {
					title: "Cheerfulness",
					val: 0,
				},
				total: {
					val: 0,
				},
				domain: "Extraversion",
			},
		};
	}
}

export default Quiz;
