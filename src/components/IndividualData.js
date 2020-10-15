import React from "react";
import NameForm from "./NameForm";
import AES from "crypto-js/aes";
import cryptoJS from "crypto-js";
import scoreObject from "../data/templates/ScoreObject.json";

// Component to calculate user data from a hash, and display it on the page
class IndividualData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inputValue: "",
			title: props.title,
			hash:
				"U2FsdGVkX1+b309BPTC734hZPct9oOA9WIMzfne6ccNGfNM4rOFwDG4v44y6NNvco+FcuI7xbqzeqfl8ddWPNgCnA1jEJFQKaUy78SH+5L+PJS5JJROqHCiY0j9ATTU29iTjm1R/P07X5FVNJdYFdGNapDhMLuyN1QdCmOSL+HIKJU0NXIoFUdW3oHLYmMi8WcDsGhh/hyzakt2XCEbe0ZtHBjNyKFA3PYlFZeGQ9GmswL+kdy/WRiPU6LMUaTbo",
			hasData: false,
			data: [],
			userName: "",
		};
	}

	/**
	 * Decrypts a given string and performs validation & computation on the result
	 * @param {string} value A hash string to decrypt
	 */
	unHash(value) {
		// Use crypto-js functions to reverse the encryption process
		const decryptedBytes = AES.decrypt(value, "Super Secret Key");
		const plaintext = decryptedBytes.toString(cryptoJS.enc.Utf8);
		console.log(plaintext);
		// Pass unverified value to the validation function
		this.checkValue(plaintext);
	}

	/**
	 * Performs validation on a given decrypted string
	 * @param {string} value A decrypted string to be verified
	 */
	checkValue(value) {
		// Pull the check sum from the start of the string
		const errCheck = value.slice(0, 8);
		const result = value.slice(8);
		// Basic error check has succeeded
		if (errCheck === "CheckSum") {
			// Split the string into useable parts and store locally
			const data = result.split("{-data-}");
			const name = data[1];
			const rawResults = data[2];
			// Get formatted array of scores
			const arrResults = this.recSumData(rawResults);
			// Update the state with data
			this.setState({ hasData: true, data: arrResults, userName: name });
			// Basic error check has failed
		} else {
			alert("False");
		}
	}
	/**
	 * Recursive function to move down data string and use each element to sum its respective domain
	 * @param {string} data String of 60 2-digit numbers pulled from decrypted hash string
	 */
	recSumData(data) {
		// Create local copy of score template
		let myJson = scoreObject;
		console.log(data);
		const domainNames = [
			"Compassion",
			"Agreeableness",
			"Neuroticism",
			"Openness to Experience",
			"Extraversion",
		];
		let a = 0;
		let n = 0;
		// Iterate through each domain
		for (var topKey of Object.keys(myJson)) {
			// Iterate through each facet
			for (var lowKey of Object.keys(myJson[topKey])) {
				// Pull score from next part of string
				let currentScore = parseInt(data.slice(a, a + 2));
				// Sort it into correct object
				if (lowKey === "domain") {
					myJson[topKey].domain = domainNames[n];
				} else {
					myJson[topKey][lowKey].val = currentScore;
					a += 2;
				}
			}
			n++;
		}
		// Pass back updated objects
		return [
			myJson.totalC,
			myJson.totalA,
			myJson.totalN,
			myJson.totalO,
			myJson.totalE,
		];
	}

	/**
	 * Takes the user input from the child NameForm component and stores it locally
	 * @param {string} tempInputValue The hash to be stored and decrypted
	 */
	handleInput = (tempInputValue) => {
		this.setState({ inputValue: tempInputValue }, () => {
			this.unHash(this.state.inputValue);
		});
	};

	/**
	 * Takes data from state and formats the required JSX
	 */
	renderUserData() {
		const userData = this.state.data;
		let domainElements = [];
		// Iterate over each domain
		for (let i = 0; i < 5; i++) {
			// Store current domain locally
			let cD = userData[i];
			// Create JSX object for each specific domain
			let elements = (
				<div className="domain" key={cD.domain}>
					<div className="domainHeader">
						<h1>Domain: {cD.domain}</h1>
						<p>Total: {cD.total.val}</p>
					</div>
					<div className="domainFacet">
						<p>
							{cD.f1.title}: {cD.f1.val} | {cD.f2.title}: {cD.f2.val} |{" "}
							{cD.f3.title}: {cD.f3.val} | {cD.f4.title}: {cD.f4.val} |{" "}
							{cD.f5.title}: {cD.f5.val} | {cD.f6.title}: {cD.f6.val}
						</p>
					</div>
				</div>
			);
			domainElements.push(elements);
		}

		// Return formatted JSX
		return (
			<div className="domainResults">
				<h1>User: {this.state.userName}</h1>
				{domainElements}
			</div>
		);
	}

	takeTest = (event) => {
		this.props.onHandleTest(event);
	};

	render() {
		const doesHaveData = this.state.hasData;
		let content;
		// Check if the user has submitted data yet
		if (doesHaveData) {
			// Render results
			content = this.renderUserData();
		} else {
			content = (
				<div className="divPersonalIntro">
					<p>Want to know more about your personality?</p>
					<p>
						First take the Big Five personality test, then copy the result into
						the text box above!
					</p>
					<a className="btn TestRedirect" onClick={this.takeTest}>
						Take Test
					</a>
				</div>
			);
		}

		// Formatted JSX to be rendered
		return (
			<div className="showHome">
				<h1 className="Home">{this.state.title}</h1>
				<div className="divInputForm">
					<NameForm onInputHash={this.handleInput} />
				</div>

				{content}
			</div>
		);
	}
}

export default IndividualData;
