import React, { useState, useEffect } from "react";
import NameForm from "./NameForm";
import AES from "crypto-js/aes";
import cryptoJS from "crypto-js";
import questionData from "../data/items-en-trimmed.json";
import scoreObject from "../data/templates/ScoreObject.json";
import TeamDisplay from "./TeamDisplay";

import "../stylesheets/Team.css";

class IndividualData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			value: { name: "", hash: "" },
			members: [
				{
					name: "",
					hash: "",
					plain: "",
					colour: "#463A6B",
				},
			],
			hasData: false,
			data: [],
			userName: "",
			colours: {
				available: [
					"#7F303B",
					"#7F5E25",
					"#287352",
					"#1E507E",
					"#A897E1",
					"#FE8898",
					"#FECD77",
					"#7BEDBB",
					"#6DB8FD",
				],
			},
		};

		// HASH VALUE TO TEST DATA:
		// Hash:
		// U2FsdGVkX1+atMWiquQcAXQtfJgJnXjDnIbYgRF4aC7OFdnsRQcwTrqUtjO7tgb+N/pm16YcGvAlbPL5iedbD26diDq7w5n6ryNSqCMsU2uPbcIJ5NlThnZgFeURXltA+xNpxcnuyQ9gO96U6xDTgJLuQR9QvnZZnDdSeUPYVfA=
		// Plain: The result was CheckSum{-data-}Tester{-data-}1610150912177914111710091879101511131110700615181111117210181412110873{-data-}
		// I generated this with a local program I wrote, basically an AES encryption with secret key "Super Secret Key".
		// Uses CryptoJS (npm install crypto-js).
	}

	// Given an array of member objects, unhash each input and store the plaintext + score object
	// in the state.
	unHashTeam() {
		const teamData = this.state.members.slice();
		const updatedTeamData = teamData.map((member) => {
			let decryptedBytes = AES.decrypt(member.hash, "Super Secret Key");
			let plaintext = decryptedBytes.toString(cryptoJS.enc.Utf8);
			let isValid = this.checkValue(plaintext);
			if (isValid != false) {
				console.log(isValid);
				member.plain = plaintext;
				member.scores = isValid;
			}
			return member;
		});

		this.setState({ members: updatedTeamData }, () => {
			//console.log(this.state.members);
		});
	}

	// Given a plaintext string, check that it meets the criteria of a correctly decrpyted hash
	checkValue(value) {
		const errCheck = value.slice(0, 8);
		console.log(value);
		const result = value.slice(8);
		if (errCheck === "CheckSum") {
			const data = result.split("{-data-}");
			const name = data[1];
			const rawResults = data[2];
			if (rawResults.length == 70) {
				console.log(rawResults);
				let formattedScores = this.pullScores(rawResults);
				return formattedScores;
			} else {
				return false;
			}
		} else {
			alert("False");
			return false;
		}
	}

	// Given a string of 70 characters, pull each 2 digit substring and place in its
	// respective score object position.
	pullScores(strScores) {
		let template = scoreObject;
		let scores = [];
		const domainNames = [
			"Compassion",
			"Agreeableness",
			"Neuroticism",
			"Openness to Experience",
			"Extraversion",
		];

		for (let i = 0; i < 5; i++) {
			let domArray = [];
			for (let a = i * 14; a < i * 14 + 14; a += 2) {
				let currentScore = parseInt(strScores.slice(a, a + 2));
				domArray.push(currentScore);
			}
			scores.push(domArray);
		}
		return scores;
	}

	renderTeamData() {
		const teamData = this.state.members;
		return <TeamDisplay data={teamData} />;
		//return <p>Data</p>;
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
		const values = [...this.state.members];
		values[index][event.target.name] = event.target.value;
		this.setState({ members: values });
	}

	handleAddField() {
		let availableColours = this.state.colours.available;
		this.setState(
			{
				members: [
					...this.state.members,
					{ name: "", hash: "", plain: "", colour: availableColours.shift() },
				],
				colours: {
					available: availableColours,
				},
			},
			() => {
				console.log(this.state.members);
			}
		);
	}

	handleRemoveField(index) {
		const localmembers = this.state.members;
		const removedUser = localmembers.splice(index, 1);
		const removedColour = removedUser[0].colour;
		console.log(removedColour);
		let localColours = this.state.colours.available;
		localColours.push(removedColour);
		this.setState(
			{
				members: localmembers,
				colours: { available: localColours },
			},
			() => {
				console.log(this.state.colours.available);
			}
		);
	}

	handleSubmit = (e) => {
		e.preventDefault();
		let myMembers = this.state.members;
		this.unHashTeam();
		this.setState({ hasData: true });
	};
	//style={{ transitionDuration: `${FADE_DURATION}ms` }}
	renderTable() {
		let myMembers = this.state.members;
		let content, temp;
		temp = myMembers.map((member, index) => (
			<div className="inputRow" key={index}>
				<span
					className={`inputRowColour ${member.colour}`}
					style={{ "background-color": `${member.colour}` }}
				/>
				<input
					type="text"
					name="name"
					placeholder="Member's name"
					className="teamInput inputName"
					value={this.state.members[index].name}
					onChange={(event) => this.handleChangeInput(index, event)}
				/>
				<input
					type="text"
					name="hash"
					placeholder="Member's hash"
					className="teamInput inputHash"
					value={this.state.members[index].hash}
					onChange={(event) => this.handleChangeInput(index, event)}
				/>
				<input
					type="button"
					value="Remove"
					className="teamInput"
					onClick={() => this.handleRemoveField(index)}
				/>
			</div>
		));
		content = (
			<form className="teamInputForm" onSubmit={this.handleSubmit}>
				{temp}
				<input
					className="btnTeamAdd"
					type="button"
					value="Add"
					onClick={() => this.handleAddField()}
				/>
				<button
					className="btnTeamSubmit"
					type="submit"
					onClick={this.handleSubmit}
				>
					Submit Team
				</button>
			</form>
		);
		//content = <form className="teamInputForm" onSubmit={this.handleSubmit}></form>

		return <div className="inputTable">{content}</div>;
	}

	render() {
		const doesHaveData = this.state.hasData;
		let content = doesHaveData
			? this.renderTeamData()
			: this.renderTeamInputs();
		return (
			<div className="showHome">
				<h1 className="teamTitle">Create Team</h1>
				{content}
			</div>
		);
	}
}

export default IndividualData;
