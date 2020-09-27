import React, { useState, useEffect } from "react";
import NameForm from "./NameForm";
import AES from "crypto-js/aes";
import cryptoJS from "crypto-js";
import questionData from "../data/items-en-trimmed.json";
import scoreObject from "../data/templates/ScoreObject.json";

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

		// HASH VALUE TO TEST DATA:
		// Hash:
		// U2FsdGVkX1+b309BPTC734hZPct9oOA9WIMzfne6ccNGfNM4rOFwDG4v44y6NNvco+FcuI7xbqzeqfl8ddWPNgCnA1jEJFQKaUy78SH+5L+PJS5JJROqHCiY0j9ATTU29iTjm1R/P07X5FVNJdYFdGNapDhMLuyN1QdCmOSL+HIKJU0NXIoFUdW3oHLYmMi8WcDsGhh/hyzakt2XCEbe0ZtHBjNyKFA3PYlFZeGQ9GmswL+kdy/WRiPU6LMUaTbo
		// Plain: The result was CheckSum{-data-}Jonathan{-data-}123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345{-data-}
		// I generated this with a local program I wrote, basically an AES encryption with secret key "Super Secret Key".
		// Uses CryptoJS (npm install crypto-js).
	}
	unHash(value) {
		//alert(`Called with ${this.state.inputValue}`);
		const decryptedBytes = AES.decrypt(value, "Super Secret Key");
		const plaintext = decryptedBytes.toString(cryptoJS.enc.Utf8);
		console.log(value);
		this.checkValue(plaintext);
		//console.log(plaintext);
	}

	checkValue(value) {
		const errCheck = value.slice(0, 8);
		console.log(errCheck);
		const result = value.slice(8);
		if (errCheck === "CheckSum") {
			const data = result.split("{-data-}");
			const name = data[1];
			const rawResults = data[2];
			// Get 5 domain numbers
			const arrResults = this.recSumData(rawResults);
			this.setState({ hasData: true, data: arrResults, userName: name }, () => {
				console.log(this.state.data);
			});
		} else {
			alert("False");
		}
	}

	// Recursive function to move down data string and use each element to sum its respective domain
	recSumData(data) {
		let myJson = scoreObject;
		const domainNames = [
			"Compassion",
			"Agreeableness",
			"Neuroticism",
			"Openness to Experience",
			"Extraversion",
		];
		let a = 0;
		let n = 0;
		for (var topKey of Object.keys(myJson)) {
			for (var lowKey of Object.keys(myJson[topKey])) {
				let currentScore = parseInt(data.slice(a, a + 2));
				if (lowKey == "domain") {
					myJson[topKey].domain = domainNames[n];
				} else {
					myJson[topKey][lowKey] = currentScore;
					a += 2;
				}
			}
			console.log(myJson[topKey]);
			n++;
		}
		return [
			myJson.totalC,
			myJson.totalA,
			myJson.totalN,
			myJson.totalO,
			myJson.totalE,
		];
	}

	handleInput = (tempInputValue) => {
		this.setState({ inputValue: tempInputValue }, () => {
			this.unHash(this.state.inputValue);
		});
	};

	renderUserData() {
		const userData = this.state.data;
		const userName = this.state.userName;
		let domainElements = [];
		for (let i = 0; i < 5; i++) {
			let cD = userData[i];
			let elements = (
				<div className="domain" key={cD.domain}>
					<div className="domainHeader">
						<h1>Domain: {cD.domain}</h1>
						<p>Total: {cD.total}</p>
					</div>
					<div className="domainFacet">
						<p>
							Facet 1: {cD.f1} | Facet 2: {cD.f2} | Facet 3: {cD.f3} | Facet 4:{" "}
							{cD.f4} | Facet 5: {cD.f5} | Facet 6: {cD.f6}
						</p>
					</div>
				</div>
			);
			domainElements.push(elements);
		}
		return (
			<div className="domainResults">
				<h1>User: {this.state.userName}</h1>

				{domainElements}
			</div>
		);
	}

	render() {
		const doesHaveData = this.state.hasData;
		let content;
		if (doesHaveData) {
			content = this.renderUserData();
		} else {
			content = <p>No Content :(</p>;
		}

		return (
			<div className="showHome">
				<h1 className="Home">{this.state.title}</h1>
				<NameForm onInputHash={this.handleInput} />
				{content}
			</div>
		);
	}
}

export default IndividualData;
