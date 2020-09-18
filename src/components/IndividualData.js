import React, { useState, useEffect } from "react";
import NameForm from "./NameForm";
import AES from "crypto-js/aes";
import cryptoJS from "crypto-js";
import questionData from "../data/items-en-trimmed.json";

class IndividualData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inputValue: "",
			title: props.title,
		};

		// HASH VALUE TO TEST DATA:
		// Hash: U2FsdGVkX1+b309BPTC734hZPct9oOA9WIMzfne6ccNGfNM4rOFwDG4v44y6NNvco+FcuI7xbqzeqfl8ddWPNgCnA1jEJFQKaUy78SH+5L+PJS5JJROqHCiY0j9ATTU29iTjm1R/P07X5FVNJdYFdGNapDhMLuyN1QdCmOSL+HIKJU0NXIoFUdW3oHLYmMi8WcDsGhh/hyzakt2XCEbe0ZtHBjNyKFA3PYlFZeGQ9GmswL+kdy/WRiPU6LMUaTbo
		// Plain: The result was CheckSum{-data-}Jonathan{-data-}123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345123451234512345{-data-}
		// I generated this with a local program I wrote, basically an AES encryption with secret key "Super Secret Key".
		// Uses CryptoJS (npm install crypto-js).
	}
	unHash(value) {
		//alert(`Called with ${this.state.inputValue}`);
		const decryptedBytes = AES.decrypt(value, "Super Secret Key");
		const plaintext = decryptedBytes.toString(cryptoJS.enc.Utf8);
		this.checkValue(plaintext);
		console.log(plaintext);
	}

	checkValue(value) {
		const errCheck = value.slice(0, 8);
		const result = value.slice(8);
		// Check hash hasn't been malformed
		// Remove checksum
		// Remove name (need some identifier to split name from data)
		// {-data-};
		// "CheckSumJonathan{-Data-}"
		if (errCheck === "CheckSum") {
			const data = result.split("{-data-}");
			const name = data[1];
			const rawResults = data[2];
			// Get 5 domain numbers
			const arrResults = this.recSumData(rawResults);
			console.log(arrResults);
		} else {
			alert("False");
		}
	}

	// Recursive function to move down data string and use each element to sum its respective domain
	recSumData(data) {
		let myJson = {
			totalC: 0,
			totalA: 0,
			totalN: 0,
			totalO: 0,
			totalE: 0,
		};

		for (let i = 0; i < data.length; i++) {
			let currentScore = parseInt(data.slice(i, i + 1));
			console.log(currentScore);
			let currentQuestion = questionData[i];

			let added =
				currentQuestion.keyed == "plus" ? currentScore : 6 - currentScore;
			myJson[`total${currentQuestion.domain}`] += added;
			console.log(myJson[`total${currentQuestion.domain}`]);
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
			//alert(`Hello, ${this.state.inputValue}`);
		});
	};

	render() {
		return (
			<div className="showHome">
				<h1 className="Home">{this.title}</h1>
				<NameForm onInputHash={this.handleInput} />
			</div>
		);
	}
}

export default IndividualData;
