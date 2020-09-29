import React, { useState, useEffect } from "react";

class QuizHelp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="QuizOverlayContent">
				<h3>Welcome to the Tactful Personality Quiz!</h3>
				<p>
					- This page contains 120 questions for you to answer as truthfully as
					you can.
				</p>
				<p>
					- Each question will appear below the page title, and above the row of
					5 circles.
				</p>
				<p>
					- Each circle relates to how accurately the question describes you as
					a person.
				</p>
				<p>
					- For example: If the question is "Worry about Things", and you tend
					to worry about things a lot, you might click the "Somewhat Accurate"
					or "Very Accurate" circle to answer.
				</p>
				<p>
					- The questions will automatically change as you click each answer, so
					don't fret!
				</p>
				<p>
					- At the end of the questions, you will be prompted to enter your name
					- this is to help the system recognize you at a later date.
				</p>
			</div>
		);
	}
}

export default QuizHelp;
