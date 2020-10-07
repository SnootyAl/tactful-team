import React, { useState, useEffect } from "react";
import NameForm from "./NameForm";
import AES from "crypto-js/aes";
import cryptoJS from "crypto-js";
import questionData from "../data/items-en-trimmed.json";
import scoreObject from "../data/templates/ScoreObject.json";
import TeamDisplay from "./TeamDisplay";

import "../stylesheets/Team.css";

/**
 * Component class that handles data input
 */
class TeamData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			value: { name: "", hash: "" },
			members: [
				{
					name: "Jordan",
					hash:
						"U2FsdGVkX1+Q7I4Opd3oxfnO8Rubb+G07zS2N+PZozs2FBl7arW+fLu8eRw1RmRD9u5PGIicINPgPKSfVcCa4c2i6XMO5SxaeyO+I3iqBaYVyh6y6+/zgTtshHfhURenn9vtvQF+5MySCqDpN0gdRR1EWuqV20iXTds/aXlhm3g=",
					plain: "",
					colour: ["104", "87", "161"],
				},
				{
					name: "Alex",
					hash:
						"U2FsdGVkX19N2fiewMCO+i9hOzojHRHxlZomL0oEbWhxiQAg0aHI/VNugfh4YMKkYxkxgH+C9LaWWIEThWuDFF1Q8+sTpbq+LA6jPFCrOvBOO6MUXgMMXoLAbr8VO4nx3ocl6+GRnVppJg9Vj/L+0ErTX017MTWV2vvNbrlozvU=",
					plain: "",
					colour: ["127", "48", "59"],
				},
				{
					name: "Jono",
					hash:
						"U2FsdGVkX1///YzIw3Ia+tH1sX9w8wHjAGQk5tWcmBVrvX0X/GuzeAzMPf2kAspVFIAJ+fBahY1QIPUBEgpB6LCWSn178dKZftohZoy1rO53iBl1P3B3I07KdKX5N/wHTQyn5xyBoqBPPDoAys2ppUIl9LCui+gTOLwOBHp3i3U=",
					plain: "",
					colour: ["127", "94", "37"],
				},
				{
					name: "Calum",
					hash:
						"U2FsdGVkX1+atMWiquQcAXQtfJgJnXjDnIbYgRF4aC7OFdnsRQcwTrqUtjO7tgb+N/pm16YcGvAlbPL5iedbD26diDq7w5n6ryNSqCMsU2uPbcIJ5NlThnZgFeURXltA+xNpxcnuyQ9gO96U6xDTgJLuQR9QvnZZnDdSeUPYVfA=",
					plain: "",
					colour: ["40", "115", "82"],
				},
			],
			hasData: false,
			data: [],
			userName: "",
			colours: {
				available: [
					["127", "48", "59"],
					["127", "94", "37"],
					["40", "115", "82"],
					["30", "80", "126"],
					["168", "151", "225"],
					["254", "136", "152"],
					["254", "205", "119"],
					["123", "237", "187"],
					["109", "184", "253"],
				],
			},
		};
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
		let scores = [];

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
		this.unHashTeam();
		this.setState({ hasData: true });
	};
	renderTable() {
		let myMembers = this.state.members;
		let content, temp;
		temp = myMembers.map((member, index) => (
			<div className="inputRow" key={index}>
				<span
					className={`inputRowColour ${member.colour}`}
					style={{
						backgroundColor: `rgb(${member.colour[0]},${member.colour[1]},${member.colour[2]})`,
					}}
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
					value="Add Member"
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
		return <div className="inputTable">{content}</div>;
	}

	render() {
		const doesHaveData = this.state.hasData;
		let content = doesHaveData
			? this.renderTeamData()
			: this.renderTeamInputs();
		return <div className="showTeam">{content}</div>;
	}
}

export default TeamData;
