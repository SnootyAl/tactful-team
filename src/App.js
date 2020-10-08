import React, { useState } from "react";
import Quiz from "./Quiz/Quiz";
import data from "./data/items-en.json";
import darkBanner from "./Design Assets/Dark-Banner.png";
import SlideShow from "./components/SlideShow";

import IndividualData from "./components/IndividualData";
import TeamData from "./components/TeamData";
import Footer from "./components/Footer";
//import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
//import ToggleButton from "react-bootstrap/ToggleButton";
// <Toggle theme={theme} toggleTheme={themeToggler} />
import "./stylesheets/App.css";

const App = () => {
	const [showing, setShowing] = useState("Home");

	return (
		// <ThemeProvider theme={themeMode}>
		// 	<>
		// 		<GlobalStyles />
		<div className="App">
			<div className="headerPanel">
				<a className="btnHome" onClick={handleHomeClick}>
					Tactful Team
				</a>
				<div className="headerButtons">
					<a className="btnTest" onClick={handleTestClick}>
						Take Test
					</a>
					<a className="btnPersonal" onClick={handlePersonalClick}>
						Personal Results
					</a>
					<a className="btnTeam" onClick={handleTeamClick}>
						Team Results
					</a>
				</div>
			</div>
			<div className="bodyPanel">{renderContent()}</div>
			<div className="footerPanel">
				<Footer />
			</div>
		</div>
		// 	</>
		// </ThemeProvider>
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

	function handleTeamClick(e) {
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
						<Quiz questions={data} />
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
							<img className="darkBanner" src={darkBanner} alt="dark-banner" />
							<h1>Team Optimisation</h1>
							<p>
								Learn how to best work as a team according to each member of
								your team's personalities, through Big Five Personality test
								combined with our in-house research.
							</p>
							<a className="btn btnBanner" onClick={handleTestClick}>
								Take the Test!
							</a>
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
