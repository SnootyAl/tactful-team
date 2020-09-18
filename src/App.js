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
						<button className="btnHome" onClick={handleHomeClick}>
							Home
						</button>
						<button className="btnTest1" onClick={handleTest1Click}>
							Test1
						</button>
					</div>
					<div className="rightPanel">{renderContent()}</div>
				</div>
			</>
		</ThemeProvider>
	);

	function handleHomeClick(e) {
		e.preventDefault();
		console.log(`Home was clicked, with state ${showing}`);
		setShowing("Home");
	}

	function handleTest1Click(e) {
		e.preventDefault();
		console.log(`Test1 was clicked, with state ${showing}`);
		setShowing("Test1");
	}

	function renderContent() {
		switch (showing) {
			case "Home":
				return <IndividualData />;
			case "Test1":
				return (
					<div className="showTest">
						<h1 className="test">Placeholder for Tactful Team</h1>
						<Quiz questions={data} />
					</div>
				);
			default:
				return null;
		}
	}
};
export default App;
