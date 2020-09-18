import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "./components/useDarkMode";
import { GlobalStyles } from "./components/globalStyles";
import { lightTheme, darkTheme } from "./components/Themes";
import Toggle from "./components/Toggler";
import Quiz from "./Quiz/Quiz";
import data from "./data/items-en.json";

import IndividualData from "./components/IndividualData";
//import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
//import ToggleButton from "react-bootstrap/ToggleButton";

import "./App.css";

const App = () => {
	const [theme, themeToggler] = useDarkMode();
	const [showing, setShowing] = useState("Home");
	const themeMode = theme === "light" ? lightTheme : darkTheme;

	const someValues = [
		"First Question",
		"Second Question",
		"Third Question",
		"Fourth Question",
		"Fifth Question",
		"Sixth Question",
	];

	return (
		<ThemeProvider theme={themeMode}>
			<>
				<GlobalStyles />
				<div className="App">
					<div className="leftPanel">
						<Toggle theme={theme} toggleTheme={themeToggler} />
						<button className="btnTest" onClick={handleTestClick}>
							Take Test
						</button>
						<button className="btnPersonal" onClick={handlePersonalClick}>
							Personal Results
						</button>
						<button className="btnTeam" onClick={handleTeamClick}>
							Show Team
						</button>
					</div>
					<div className="rightPanel">{renderContent()}</div>
				</div>
			</>
		</ThemeProvider>
	);

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
						<h1 className="test">Placeholder for Test</h1>
						<Quiz questions={data} />
					</div>
				);
			case "Personal":
				return <IndividualData title="Personal" />;
			case "Team":
				return <IndividualData title="Team" />;
			default:
				return null;
		}
	}
};
export default App;
