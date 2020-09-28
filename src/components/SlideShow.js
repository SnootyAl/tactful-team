import React, { useState, useEffect } from "react";
import ssInfo from "../data/slideshow-info.json";
import { CSSTransition } from "react-transition-group";

class SlideShow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stage: 0,
		};
	}

	componentDidMount() {
		this.timerID = setInterval(() => this.tick(), 5000);
	}

	tick() {
		let tempStage = this.state.stage;
		let newStage = (tempStage + 1) % 5;
		this.setState({ stage: newStage });
	}
	render() {
		let stage = this.state.stage;
		return (
			<div className="slideshow-container">
				<div className="slideshow-content">
					<div className="slideshow-header">
						<h1>{ssInfo[stage].title}</h1>
						<p>{ssInfo[stage].info}</p>
					</div>
					<div className="slideshow-bar">
						<div className="slideshow-blue" />
						<div className="slideshow-green" />
						<div className="slideshow-yellow" />
						<div className="slideshow-red" />
						<div className="slideshow-purple" />
					</div>
					<div className="slideshow-quote"></div>
				</div>
			</div>
		);
	}
}

export default SlideShow;
