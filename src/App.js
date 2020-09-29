import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "./components/useDarkMode";
import { GlobalStyles } from "./components/globalStyles";
import { lightTheme, darkTheme } from "./components/Themes";
import Toggle from "./components/Toggler";
import Quiz from "./Quiz/Quiz";
import data from "./data/items-en.json";
import darkBanner from "./Design Assets/Dark-Banner.png";
import SlideShow from "./components/SlideShow";

import IndividualData from "./components/IndividualData";
import TeamData from "./components/TeamData";
//import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
//import ToggleButton from "react-bootstrap/ToggleButton";
// <Toggle theme={theme} toggleTheme={themeToggler} />
import "./stylesheets/App.css";

const App = () => {
	const [theme, themeToggler] = useDarkMode();
	const [showing, setShowing] = useState("Home");
	const themeMode = theme === "light" ? lightTheme : darkTheme;

	return (
		<ThemeProvider theme={themeMode}>
			<>
				<GlobalStyles />
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
								Show Team
							</a>
						</div>
					</div>
					<div className="bodyPanel">{renderContent()}</div>
				</div>
			</>
		</ThemeProvider>
	);

	function handleHomeClick(e) {
		e.preventDefault();
		setShowing("Home");
	}

	function handleTestClick(e) {
		e.preventDefault();
		console.log(`Test was clicked, with state ${showing}`);
		setShowing("Test");
	}

	function handlePersonalClick(e) {
		e.preventDefault();
		console.log(`Personal was clicked, with state ${showing}`);
		setShowing("Personal");
	}

	function handleTeamClick(e) {
		e.preventDefault();
		console.log(`Team was clicked, with state ${showing}`);
		setShowing("Team");
	}

	function renderContent() {
		switch (showing) {
			case "Test":
				return (
					<div className="showTest">
						<h1 className="test">Big 5 Personality Test</h1>
						<Quiz questions={data} />
					</div>
				);
			case "Personal":
				return <IndividualData title="Personal" />;
			case "Team":
				return <TeamData title="Team" />;
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
							<a className="bannerButton" onClick={handleTestClick}>
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
