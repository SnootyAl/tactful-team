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
			fullTeamHash: "",
			value: { name: "", hash: "" },
			members: [
				{
					name: "Jonathan",
					hash: "U2FsdGVkX1+2kzLG5835HP0pEfJ16rGDFuOuK652PboDtHTBO+F3Bpvtw6cy5/vcMuHpj6dXT8K/jXzUKN7TMsIUslI6kxy+Px06j959GogrOjWnGqyNfoXZ/p3bctBOo0YSE/+intzHUP23bBLusnA30vGhin9uUf3kqkjcwUQ=",
					plain: "",
					colour: ["104", "87", "161"],
				},
				{
					name: "Alex",
					hash: "U2FsdGVkX1/IBZFhpqImk9TrjOteBYE/rMN5WCS8/MRM9rgUsWS553aNMIfAwSue2935zgNOZ2lJT8LXFnxZcGynFd5jXph1Q6ud0w0vhUo9QNj8ixY+KW7pi/EiGReGCobN3Nl+9CjjZUUPlwgIGvd+tAr2HB2K1W1Jj4UeM4A=",
					plain: "",
					colour: ["127", "48", "59"],
				},
				{
					name: "Calum",
					hash: "U2FsdGVkX18TSSKe6OyHQsHe08CnZxiVCTcOa1SOtDKszChewM5JVHyY0ZqP/6fq2/oisERxzavkkv3ZlyWlMRiLHumEfucW3vmxk3vsMx4u9Gj+QVN5adCot0sO/5JLQZyqkjzfazZ9jy0OB/XiFIriACbjeFIlk/fOBqvbFo8=",
					plain: "",
					colour: ["127", "48", "59"],
				},
				{
					name: "Jordan",
					hash: "U2FsdGVkX1/brics3V5/DDI1aEkgIKVOlnEv3FMxAyNlVVBKamZa/YhalNIBi7yJMStmtJN+35tZBlsNtGsOWaKShzdOG/KRQCXJi9ffFMXhS0/BCqARIAbRvCv8lTn+MF31+66c2co1TmErhwSRn5wWVu2tg8trGYE3XSu5/rM=",
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
		let fullTeamInput = this.renderFullTeamInput();
		content = (
			<div className="inputTeam">
				<h1 className="inputTeamTitle">Welcome to your Team!</h1>
				{table}
				{this.state.entryError && 
				(<p>Input error - please check all fields have a valid entry</p>)}
				{fullTeamInput}
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

	renderFullTeamInput() {
		return (
			<div className="inputFullTeam">
				<form className="fullTeamInputForm">
					<input type="text" name="teamHash" placeholder="Team Code: " className="fullTeamInput" value={this.state.fullTeamHash} onChange={(event => this.handleChangeTeamInput(event))} />
					<button className="btn btnFullTeamSubmit" type="submit" onClick={this.handleFullTeamSubmit}>Submit Pre-made Team</button>
			</form>
			</div>
		)
	}

	handleFullTeamSubmit = (e) => {
		let fullTeamHash = this.state.fullTeamHash;

		const decryptedBytes = AES.decrypt(fullTeamHash, "Super Secret Key");
		const plaintext = decryptedBytes.toString(cryptoJS.enc.Utf8);
		var data = [];

		const errCheck = plaintext.slice(0, 8);
		console.log(plaintext);
		const result = plaintext.slice(8);
		if (errCheck === "CheckSum") {
			data = result.split("{-data-}");
			console.log(data);
		}
		let newTeam = [];

		for (let i = 1; i < data.length; i++) {
			newTeam.push(JSON.parse(data[i]));
		}
		console.log(newTeam);
		e.preventDefault();
		this.setState({members: newTeam, hasData: true})
	}

	handleChangeTeamInput(event) {
		let localUpdate = event.target.value;
		this.setState({fullTeamHash: localUpdate})
	}

	render() {
		const doesHaveData = this.state.hasData;
		let content = doesHaveData
			? this.renderTeamDisplay()
			: this.renderTeamInputs();
		
		return (
			<div className="showTeam">
				{content}
				
			</div>);
	}
}

export default TeamData;
