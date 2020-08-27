import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "./components/useDarkMode";
import { GlobalStyles } from "./components/globalStyles";
import { lightTheme, darkTheme } from "./components/Themes";
import Toggle from "./components/Toggler";
import Quiz from "./Quiz/Quiz";
import "./App.css";
const App = () => {
  const [theme, themeToggler] = useDarkMode();

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
          <Toggle theme={theme} toggleTheme={themeToggler} />
          <h1 className="test">Placeholder for Tactful Team</h1>
          <Quiz questions={someValues} />
        </div>
      </>
    </ThemeProvider>
  );
};
export default App;
