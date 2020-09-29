import React, { useState, useEffect } from "react";
import ssInfo from "../data/slideshow-info.json";
import { CSSTransition } from "react-transition-group";
import { Module, Component } from "@onenexus/lucid";
import Carousel from "react-bootstrap/Carousel";
import AnimateHeight from "react-animate-height";

import "../stylesheets/Slideshow.css";

const FADE_DURATION = 2000;

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

		this.setState({ fadeState: "fade_out", fadeTransition: timeout });
	}

	render() {
		let stage = this.state.stage;
		return (
			<div name="slideshow-container" className="slideshow-container">
				<div className="slideshow-content">
					<div
						className={`slideshow-header`}
						style={{ transitionDuration: `${FADE_DURATION}ms` }}
					>
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
					<div className="slideshow-quote">
						{ssInfo[stage].quote}
						<br /> {`- ${ssInfo[stage].author}`}
					</div>
				</div>
			</div>
		);
	}
}

export default SlideShow;
