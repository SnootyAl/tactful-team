import React, { useState, useEffect } from "react";
import ssInfo from "../data/slideshow-info.json";
import AnimateHeight from "react-animate-height";

import "../stylesheets/Slideshow.css";

// Set time (in ms) taken to change bar height
const FADE_DURATION = 2000;

// Component class that handles the slideshow section of the home page
class SlideShow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stage: 0,
			fadeState: "fade-in",
			fadeTransition: null,
		};
	}

	componentDidMount() {
		this.timerID = setInterval(() => this.tick(), 9000);
	}

	/**
	 * Controls the animation of the domain slideshow bar
	 */
	tick() {
		let tempStage = this.state.stage;
		let newStage = (tempStage + 1) % 5;
		const timeout = setTimeout(() => {
			this.setState({
				stage: newStage,
				fadeTransition: null,
				fadeState: "fade-in",
			});
		}, FADE_DURATION);
		clearTimeout(this.state.fadeTransition);
	}

	render() {
		let stage = this.state.stage;
		return (
			<div name="slideshow-container" className="slideshow-container">
				<div className={`slideshow-header`}>
					<h1>{ssInfo[stage].title}</h1>
					<p>{ssInfo[stage].info}</p>
				</div>
				<div className="slideshow-bar">
					<AnimateHeight
						id="panel0"
						className="slideshow-blue"
						duration={1000}
						height={0 === this.state.stage ? 30 : 10}
					/>

					<AnimateHeight
						id="panel1"
						className="slideshow-green"
						duration={1000}
						height={1 === this.state.stage ? 30 : 10}
					/>
					<AnimateHeight
						id="panel2"
						className="slideshow-yellow"
						duration={1000}
						height={2 === this.state.stage ? 30 : 10}
					/>

					<AnimateHeight
						id="panel3"
						className="slideshow-red"
						duration={1000}
						height={3 === this.state.stage ? 30 : 10}
					/>
					<AnimateHeight
						id="panel4"
						className="slideshow-purple"
						duration={1000}
						height={4 === this.state.stage ? 30 : 10}
					/>
				</div>
				<div className="slideshow-quote-container">
					<div className="slideshow-quote">
						<h2>{ssInfo[stage].quote}</h2>
						<br />
						{`- ${ssInfo[stage].author}`}
					</div>
				</div>
			</div>
		);
	}
}

export default SlideShow;
