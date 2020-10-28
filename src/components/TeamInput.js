import React from "react";
import AES from "crypto-js/aes";
import cryptoJS from "crypto-js";
import TeamDisplay from "./TeamDisplay";
import minIcon from "../Design Assets/minus_icon.png";
import plsIcon from "../Design Assets/plus_icon.png";

import "../stylesheets/Team.css";
import { findAllByPlaceholderText } from "@testing-library/react";

/**
 * Component class that handles data input
 */
class TeamData extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.title,
			fullTeamHash: "",
			entryErrorTeam: false,
			value: { name: "", hash: "" },
			members: [
				{
					name: "",
					hash: "",
					plain: "",
					colour: ["104", "87", "161"],
				},
				{
					name: "",
					hash: "",
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

	/**
	 * Given an array of member objects, unhash each input and store the plaintext + score object
	 * in the state.
	 */
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

	/**
	 * Given a plaintext string, check that it meets the criteria of a correctly decrpyted hash
	 * @param {string} value - The plaintext string to be checked
	 */
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

	/**
	 * Given a string of 70 characters, pull each 2 digit substring and place in its
	 * respective score object position.
	 * @param {string} strScores - String of score characters
	 */
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

	/** 
	 * Takes the team data from state and returns a custom TeamDisplay component
	 */
	renderTeamDisplay() {
		const teamData = this.state.members;
		return <TeamDisplay data={teamData} />;
	}

	/**
	 * Renders the team member input table
	 */
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

	/**
	 * Updates the state with the user's changes to the team member input table
	 * @param {number} index - The row that the user has modified
	 * @param {event} event - The text-box whose value the user has modified
	 */
	handleChangeInput(index, event) {
		const values = [...this.state.members];
		values[index][event.target.name] = event.target.value;
		this.setState({ members: values });
	}

	/**
	 * Adds a new row to the team member input table
	 */
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

	/**
	 * Removes a row from the team member input table
	 * @param {number} index - The index of the row to be removed
	 */
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

	/**
	 * Handles the submission of the team member input table
	 * @param {event} e - Event object
	 */
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

	/**
	 * Renders the team input table
	 */
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
					autoComplete="off"
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
					autoComplete="off"
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
					autoComplete="off"
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
					autoComplete="off"
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
				<h4>Enter each member individually</h4>
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
					Create New Team
				</button>
			</form>
		);
		return <div className="inputTable">{content}</div>;
	}

	/**
	 * Renders the section of the page that allows the user to input a previous team's hash
	 */
	renderFullTeamInput() {
		return (
			<div className="inputFullTeam">
				<h4>Review a preiously generated team</h4>
				<form className="fullTeamInputForm">
					<input type="text" name="teamHash" placeholder="Team Code: " className="fullTeamInput" value={this.state.fullTeamHash} onChange={(event => this.handleChangeTeamInput(event))} autoComplete="off" />
					<button className="btn btnFullTeamSubmit" type="submit" onClick={this.handleFullTeamSubmit}>Review Existing Team</button>
				</form>
				{this.state.entryErrorTeam && (
					<p>Error with team hash - try copy pasting again.</p>
				)}
			</div>
		)
	}

	/**
	 * Handles the submission of the full team input form
	 * @param {event} e 
	 */
	handleFullTeamSubmit = (e) => {
		let fullTeamHash = this.state.fullTeamHash;

		const decryptedBytes = AES.decrypt(fullTeamHash, "Super Secret Key");
		const plaintext = decryptedBytes.toString(cryptoJS.enc.Utf8);
		var data = [];

		const errCheck = plaintext.slice(0, 12);
		const result = plaintext.slice(8);
		var validInput = true;
		if (errCheck === "CheckSumTeam") {
			data = result.split("{-data-}");	
		} else {
			validInput = false;
		}
		let newTeam = [];
		console.log(plaintext);
		
		for (let i = 1; i < data.length; i++) {
			newTeam.push(JSON.parse(data[i]));
		}
		e.preventDefault();
		if (validInput) {
			console.log(newTeam);
			this.setState({members: newTeam, hasData: true})
		} else {
			console.log(data);
			this.setState({hasData: false, fullTeamHash: "", entryErrorTeam: true})
		}		
	}

	/**
	 * Updates the state with the user's change to the full team input form
	 * @param {event} event 
	 */
	handleChangeTeamInput(event) {
		let localUpdate = event.target.value;
		this.setState({fullTeamHash: localUpdate, entryErrorTeam: false})
	}

	/**
	 * Renders the page
	 */
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
