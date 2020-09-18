import React from "react";
import "./AnswerButton.css";

const AnswerButton = (props) => {
	return (
		<div className="btn-group">
			<button className="veryInaccurate" onClick={props.click} value={0}>
				ALEX SUCKS
			</button>
			<button className="somewhatInaccurate" onClick={props.click} value={1}>
				Somewhat Inaccurate
			</button>
			<button className="neither" onClick={props.click} value={2}>
				Neither Accurate or Inaccurate
			</button>
			<button className="somewhatAccurate" onClick={props.click} value={3}>
				Somewhat Accurate
			</button>
			<button className="veryAccurate" onClick={props.click} value={4}>
				Very Accurate
			</button>
		</div>
	);
};

export default AnswerButton;
