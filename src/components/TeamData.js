import React, { useState, useEffect } from "react";
import NameForm from "./NameForm";
import AES from "crypto-js/aes";
import cryptoJS from "crypto-js";
import questionData from "../data/items-en-trimmed.json";

class IndividualData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			value: { name: "", hash: "" },
			entries: [
				{
					name: "",
					hash: "",
					plain: "",
				},
			],
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
			this.setState({ hasData: true, data: arrResults, userName: name });
		} else {
			alert("False");
		}
	}

	createJsonTemplate() {
		let result = {
			totalC: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Compassion",
			},
			totalA: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Agreeableness",
			},
			totalN: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Neuroticism",
			},
			totalO: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Openness To Experience",
			},
			totalE: {
				f1: 0,
				f2: 0,
				f3: 0,
				f4: 0,
				f5: 0,
				f6: 0,
				total: 0,
				domain: "Extraversion",
			},
		};
		return result;
	}

	// Recursive function to move down data string and use each element to sum its respective domain
	recSumData(data) {
		let myJson = this.createJsonTemplate();

		for (let i = 0; i < data.length; i++) {
			let currentScore = parseInt(data.slice(i, i + 1));
			let currentQuestion = questionData[i];

			let added =
				currentQuestion.keyed == "plus" ? currentScore : 6 - currentScore;
			myJson[`total${currentQuestion.domain}`][
				`f${currentQuestion.facet}`
			] += added;
			myJson[`total${currentQuestion.domain}`].total += added;
			//console.log(myJson[`total${currentQuestion.domain}`]);
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
					<h1>Domain: {cD.domain}</h1>
					<p>Total: {cD.total}</p>
					<p>
						Facet 1: {cD.f1} | Facet 2: {cD.f2} | Facet 3: {cD.f4} | Facet 4:{" "}
						{cD.f4} | Facet 5: {cD.f5} | Facet 6: {cD.f6}
					</p>
				</div>
			);
			domainElements.push(elements);
		}
		return (
			<div className="domainResults">
				<h1>User: {this.state.userName}</h1>
				{/*need 5 className domain*/}

				{domainElements}
				<div className="domainHeader"></div>
				{/*need 6 className domainFacet*/}
				<div className="domainFacet"></div>
			</div>
		);
	}

	renderTeamInputs() {
		let content;
		let table = this.renderTable();
		content = (
			<div className="inputTeam">
				<p className="inputTeamTitle">Welcome to your Team!</p>
				{table}
			</div>
		);
		return content;
	}

	handleChangeInput(index, event) {
		const values = [...this.state.entries];
		values[index][event.target.name] = event.target.value;
		this.setState({ entries: values });
	}

	handleAddField() {
		this.setState({
			entries: [...this.state.entries, { name: "", hash: "", plain: "" }],
		});
	}

	handleRemoveField(index) {
		const localEntries = this.state.entries;
		localEntries.splice(index, 1);
		this.setState({ entries: localEntries });
	}

	handleSubmit = (e) => {
		e.preventDefault();
		let myEntries = this.state.entries;
		this.setState({ hasData: true });
		console.log("myEntries", myEntries);

		// Unhash each entry
		// Run checking algorithm on returned data
		// DIsplay meaningful results
	};

	renderTable() {
		let myEntries = this.state.entries;
		let content, temp;
		temp = myEntries.map((inputField, index) => (
			<div className="inputRow" key={index}>
				<input
					type="text"
					name="name"
					placeholder="Member's name"
					className="teamInput"
					value={this.state.entries[index].name}
					onChange={(event) => this.handleChangeInput(index, event)}
				/>
				<input
					type="text"
					name="hash"
					placeholder="Member's hash"
					className="teamInput"
					value={this.state.entries[index].hash}
					onChange={(event) => this.handleChangeInput(index, event)}
				/>
				<input
					type="button"
					value="Remove"
					className="teamInput"
					onClick={() => this.handleRemoveField(index)}
				/>
				{index == myEntries.length - 1 && (
					<input
						type="button"
						value="Add"
						onClick={() => this.handleAddField()}
					/>
				)}
			</div>
		));
		content = (
			<form className="teamInputForm" onSubmit={this.handleSubmit}>
				{temp}

				<button
					className="teamInputButton"
					type="submit"
					onClick={this.handleSubmit}
				>
					Submit
				</button>
			</form>
		);
		//content = <form className="teamInputForm" onSubmit={this.handleSubmit}></form>

		return <div className="inputTable">{content}</div>;
	}

	render() {
		const doesHaveData = this.state.hasData;
		let content = doesHaveData
			? this.renderUserData()
			: this.renderTeamInputs();
		// I have one row of entries, based on the state (state[].length = 1)
		// When there is text in both entries, I update state[1] to be [""", """]
		// The table now renders these 2 new boxes in the row

		return (
			<div className="showHome">
				<h1 className="Home">{this.state.title}</h1>
				{content}
			</div>
		);
	}
}

export default IndividualData;
