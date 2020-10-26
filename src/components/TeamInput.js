import React from "react";
import AES from "crypto-js/aes";
import cryptoJS from "crypto-js";
import TeamDisplay from "./TeamDisplay";
import minIcon from "../Design Assets/minus_icon.png";
import plsIcon from "../Design Assets/plus_icon.png";

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
					name: "Test1",
					hash: "U2FsdGVkX1+2kzLG5835HP0pEfJ16rGDFuOuK652PboDtHTBO+F3Bpvtw6cy5/vcMuHpj6dXT8K/jXzUKN7TMsIUslI6kxy+Px06j959GogrOjWnGqyNfoXZ/p3bctBOo0YSE/+intzHUP23bBLusnA30vGhin9uUf3kqkjcwUQ=",
					plain: "",
					colour: ["104", "87", "161"],
				},
				{
					name: "Test2",
					hash: "U2FsdGVkX1/IBZFhpqImk9TrjOteBYE/rMN5WCS8/MRM9rgUsWS553aNMIfAwSue2935zgNOZ2lJT8LXFnxZcGynFd5jXph1Q6ud0w0vhUo9QNj8ixY+KW7pi/EiGReGCobN3Nl+9CjjZUUPlwgIGvd+tAr2HB2K1W1Jj4UeM4A=",
					plain: "",
					colour: ["127", "48", "59"],
				},
			],
			hasData: false,
			data: [],
			userName: "",
			colours: {
				available: [				
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
			entryError: false,
			canAddMember: true,
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
			if (isValid !== false) {
				member.plain = plaintext;
				member.scores = isValid;
			}
			return member;
		});

		this.setState({ members: updatedTeamData }, () => {});
	}

	// Given a plaintext string, check that it meets the criteria of a correctly decrpyted hash
	checkValue(value) {
		const errCheck = value.slice(0, 8);
		const result = value.slice(8);
		if (errCheck === "CheckSum") {
			const data = result.split("{-data-}");
			const rawResults = data[2];
			if (rawResults.length === 70) {
				let formattedScores = this.pullScores(rawResults);
				return formattedScores;
			} else {
				return false;
			}
		} else {
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

	renderTeamDisplay() {
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
				{this.state.entryError && 
				(<p>Input error - please check all fields have a valid entry</p>)}
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
		this.setState({
			members: [
				...this.state.members,
				{ name: "", hash: "", plain: "", colour: availableColours.shift() },
			],
			colours: {
				available: availableColours,
			},
			canAddMember: availableColours.length > 0 ? true : false
		});
	}

	handleRemoveField(index) {
		const localmembers = this.state.members;
		const removedUser = localmembers.splice(index, 1);
		const removedColour = removedUser[0].colour;
		let localColours = this.state.colours.available;
		localColours.push(removedColour);
		this.setState({
			members: localmembers,
			colours: { available: localColours },
			canAddMember: true,
		});
	}

	handleSubmit = (e) => {
		let currentMembers = this.state.members;
		let validInput = true;

		currentMembers.forEach((member) => {
			if (member.name.trim() === "" || member.hash.trim() === ""){
				validInput = false;
			}

			let decryptedBytes = AES.decrypt(member.hash, "Super Secret Key");
			let plaintext = decryptedBytes.toString(cryptoJS.enc.Utf8);
			let isValid = this.checkValue(plaintext);
			validInput = isValid === false ? false : true

		})
		e.preventDefault();
		if (validInput) {
			this.unHashTeam();
			this.setState({ hasData: true, entryError: false });
		} else {
			this.setState({entryError: true})
		}
		
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


				{index === 0 && (					
					<input
					type="text"
					name="name"
					placeholder="Your name"
					className="teamInput inputName"
					value={this.state.members[index].name}
					onChange={(event) => this.handleChangeInput(index, event)}
					/>			
				)}
				{index === 0 && (
					<input
					type="text"
					name="hash"
					placeholder="Your code"
					className="teamInput inputHash"
					value={this.state.members[index].hash}
					onChange={(event) => this.handleChangeInput(index, event)}
					/>
				)}


				{index !== 0 && (
					<input
					type="text"
					name="name"
					placeholder="Member's name"
					className="teamInput inputName"
					value={this.state.members[index].name}
					onChange={(event) => this.handleChangeInput(index, event)}
					/>
				)}
				{index !== 0 && (
					<input
					type="text"
					name="hash"
					placeholder="Member's code"
					className="teamInput inputHash"
					value={this.state.members[index].hash}
					onChange={(event) => this.handleChangeInput(index, event)}
					/>
				)}
				
				<img
					src={minIcon}
					className="teamInput btnRemoveField"
					onClick={() => this.handleRemoveField(index)}
				/>
			</div>
		));
		content = (
			<form className="teamInputForm" onSubmit={this.handleSubmit}>
				{temp}
				{this.state.canAddMember && (<img
					src={plsIcon}
					className="btnTeamAdd"
					value="Add Member"
					onClick={() => this.handleAddField()}
				/>)}
				<button
					className="btn btnTeamSubmit"
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
			? this.renderTeamDisplay()
			: this.renderTeamInputs();
		return <div className="showTeam">{content}</div>;
	}
}

export default TeamData;
