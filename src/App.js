import React, { useState } from "react";
import Quiz from "./Quiz/Quiz";
import data from "./data/items-en.json";

import SlideShow from "./components/SlideShow";

import IndividualData from "./components/IndividualData";
import TeamData from "./components/TeamData";
import Header from "./components/Header";
import Footer from "./components/Footer";

import darkBanner from "./Design Assets/Dark-Banner.png";
import Timeline from "./Design Assets/timeline.png";
import Personalities5 from "./Design Assets/5personalities.png";
import TeamExample from "./Design Assets/TeamExample.png";

import "./stylesheets/App.css";



const App = () => {
	const [showing, setShowing] = useState("Home");

	return (
		<div className="App">
			<Header
				handleHomeClick={handleHomeClick}
				handleTestClick={handleTestClick}
				handlePersonalClick={handlePersonalClick}
				handleTeamClick={handleTeamClick}
			/>
			<div className="bodyPanel">{renderContent()}</div>
			<div className="footerPanel">
				<Footer />
			</div>
		</div>
	);

	// Functions to handle page navigation
	function handleHomeClick(e) {
		e.preventDefault();
		setShowing("null");
		setShowing("Home");
	}

	function handleTestClick(e) {
		e.preventDefault();
		setShowing("null");
		setShowing("Test");
	}

	function handleChangeTestClick(e) {
		e.preventDefault();
		setShowing("null");
		setShowing("Test");
	}

	function handlePersonalClick(e) {
		e.preventDefault();
		setShowing("null");
		setShowing("Personal");
	}

	function handleChangePersonalClick(e) {
		e.preventDefault();
		setShowing("null");
		setShowing("Personal");
	}

	function handleTeamClick(e) {
		e.preventDefault();
		setShowing("null");
		setShowing("Team");
	}

	function handleChangeTeamClick(e) {
		e.preventDefault();
		setShowing("null");
		setShowing("Team");
	}

	// Main helper function to determine what content is displayed.
	function renderContent() {
		switch (showing) {
			// Display the test page.
			case "Test":
				return (
					<div className="showTest">
						<h1 className="test">Big 5 Personality Test</h1>
						<Quiz
							questions={data}
							onReviewPersonality={handleChangePersonalClick}
							onCompareTeam={handleChangeTeamClick}
						/>
					</div>
				);

			// Display the personal results page.
			case "Personal":
				return (
					<IndividualData
						title="Personal Results"
						onHandleTest={handleChangeTestClick}
					/>
				);

			// Display the team creation page
			case "Team":
				return <TeamData title="Team" />;

			// Display the home page
			case "Home":
				return (
					<div className="homeDiv">
						<div className="banner">
							<div className="homeIntroTitle">
								<h1>Better teamwork starts here</h1>
							</div>
							<div className="homeIntroDetail">
							<p>
								Gain proficiency working in your team, according to your team's unique personalities.
							</p>
							</div>

							<div className="homeIntroNavButtons">
								<div className="homeIntroNavStart">
									<a className="btn btnBannerStart" onClick={handleTestClick}>
										Get Started
									</a>				
								</div>		
							</div>	


							<div className="homeIntroProcess">
								<div className="homeIntroProcessTitle">
									<h2>The Process</h2>
								</div>	
									<img src={Timeline} className="homeIntroProcessImage"/>
							</div>		


							<div className="homeIntroIdentify">
								<img src={Personalities5} className="homeIntroIdentifyImage"/>
								<div className="homeIntroIdentifyText">
									<div className="homeIntroIdentifyTextTitle">
										<h2>Identify the best team roles</h2>
									</div>
									<div className="homeIntroIdentifyTextBody">
										<p>Choose suitable roles within the team based on skillset, availability and personality</p>
									</div>
								</div>	
							</div>	


							<div className="homeIntroOptimise">
								
								<div className="homeIntroOptimiseText">
									<div className="homeIntroOptimiseTextTitle">
										<h2>Optimize Team Performance</h2>
									</div>
									<div className="homeIntroOptimiseTextBody">
										<p>Create an understanding around which team members are best at what, enabling a more cohesive working environment</p>
									</div>
								</div>
								<img src={TeamExample} className="homeIntroOptimiseImage"/>	
							</div>	
						</div>
						<SlideShow />
					</div>
				);
			default:
				return null;
		}
	}
};
export default App;
