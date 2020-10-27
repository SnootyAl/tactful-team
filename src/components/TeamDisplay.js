import React from "react";
import { Radar, HorizontalBar } from "react-chartjs-2";
import findIndex from "../javascripts/indexOf";
import Graph from "../javascripts/Graphs";
import findStdDeviation from "../javascripts/StdDev";
import averageData from "../data/Average-and-StdDist-JSON.json";
import teamText from "../TextFiles/team-text";
import DomainText from "../data/DomainText/index";
import cryptoJS from "crypto-js";
import AES from "crypto-js/aes";
//import * as VisAvg from "../Design Assets/VisAvg"

import TeamL from "../Design Assets/roles/TeamLead.png";
import CommsL from "../Design Assets/roles/CommsLead.png";
import CreatL from "../Design Assets/roles/CreativeLead.png";
import MotivL from "../Design Assets/roles/MotivationLead.png";
import RelatL from "../Design Assets/roles/RelationLead.png";

class TeamDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showing: "",
			team: props.data,
			calculatedTeamElements: [],
			showInfo: true,
			roles: {
				Team: {
					Full: "Team Lead",
					val: "",
					set: "- Not Set -",
					index: 0,
				},
				Rela: {
					Full: "Relations Lead",
					val: "",
					set: "- Not Set -",
					index: 1,
				},
				Motv: {
					Full: "Motivation Lead",
					val: "",
					set: "- Not Set -",
					index: 2,
				},
				Crtv: {
					Full: "Creative Lead",
					val: "",
					set: "- Not Set -",
					index: 3,
				},
				Comm: {
					Full: "Communications Lead",
					val: "",
					set: "- Not Set -",
					index: 4,
				},		
			},
			data: {
				arrayC: [],
				arrayA: [],
				arrayN: [],
				arrayO: [],
				arrayE: [],
			},
			display: {
				C: {
					dots: "inline",
					more: "none",
				},
				A: {
					dots: "inline",
					more: "none",
				},
				N: {
					dots: "inline",
					more: "none",
				},
				O: {
					dots: "inline",
					more: "none",
				},
				E: {
					dots: "inline",
					more: "none",
				},
			},
			more: "",
		};
	}

	componentDidMount() {
		const currentTeam = this.state.team;
		let teamElements = [];
		let arrayC = [];
		let arrayA = [];
		let arrayN = [];
		let arrayO = [];
		let arrayE = [];

		currentTeam.forEach((member) => {
			arrayC.push(member.scores[0][6]);
			arrayA.push(member.scores[1][6]);
			arrayN.push(member.scores[2][6]);
			arrayO.push(member.scores[3][6]);
			arrayE.push(member.scores[4][6]);
		});

		const allDomains = [arrayC, arrayA, arrayN, arrayO, arrayE];
		const allGraphs = this.createGraphs(allDomains);
		teamElements.push(
			this.printDetails("Conscientousness", arrayC, allGraphs[1])
		);
		teamElements.push(this.printDetails("Agreeableness", arrayA, allGraphs[2]));
		teamElements.push(this.printDetails("Neuroticism", arrayN, allGraphs[3]));
		teamElements.push(
			this.printDetails("Openness to experience", arrayO, allGraphs[4])
		);
		teamElements.push(this.printDetails("Extraversion", arrayE, allGraphs[5]));

		let formTeam = this.formatTeam();
		let roles = this.state.roles;
		const calculatedRoles = this.AssignRoles(formTeam, roles);

		let teamString = "CheckSum";
		currentTeam.forEach((member) => {
			let newObject = {
				name: member.name,
				hash: member.hash,
				colour: member.colour,
				scores: member.scores
			}
			let tempString = JSON.stringify(newObject);
			teamString += `{-data-}${tempString}`;
		});


		const tempHash = cryptoJS.AES.encrypt(teamString, "Super Secret Key");
		console.log(tempHash.toString());
		const decryptedBytes = AES.decrypt(tempHash, "Super Secret Key");
		const plaintext = decryptedBytes.toString(cryptoJS.enc.Utf8);
		const data = plaintext.split("{-data-}");

		let newTeam = [];

		for (let i = 1; i < data.length; i++) {
			newTeam.push(JSON.parse(data[i]));
		}

		this.setState({calculatedTeamElements: teamElements, roles: calculatedRoles})
	}

	formatDomainString(indicies, compString, domainString) {
		let result = "";
		let names = [];
		let domLetter = domainString[0];
		let myTeam = this.state.team;
		indicies.forEach((index) => {
			names.push(myTeam[index].name);
		});
		if (indicies.length > 1) {
			let tempString = "";
			for (let i = 0; i < indicies.length - 2; i++) {
				tempString += `${names[i]}, `;
			}
			tempString += `${names[names.length - 2]} `;
			tempString += `and ${names[names.length - 1]}`;
			result =
				"The members of the team with the " +
				compString +
				" scores in " +
				domainString +
				" are: " +
				tempString;
		} else {
			result =
				"The member of the team with the " +
				compString +
				" score in " +
				domainString +
				" is " +
				names[0];
		}

		if (compString === "lowest") {
			result += teamText[`${domLetter}`][`low`] + "\n";
		} else {
			result += teamText[`${domLetter}`][`high`] + "\n";
		}
		return result;
	}

	printDetails(domain, workingArray, graph) {
		let smallestIndexArray = [];
		let largestIndexArray = [];
		let difference = 0;
		let totalScore = 0;
		let teamAvg = 0;
		let teamAverageCompare = "";
		let teamScores;
		const DL = domain[0];
		const shortDescription = DomainText[DL].shortDescription;
		const longDescription = DomainText[DL].description;
		teamScores += "| ";
		for (let i = 0; i < workingArray.length; i++) {
			teamScores += workingArray[i];
			teamScores += " | ";
		}
		// Find which members of the team have the lowest score
		smallestIndexArray = findIndex.smallest({ array: workingArray });
		let smallestIndex = smallestIndexArray[0];
		// Print this information out in human readable form
		let lowestMember = this.formatDomainString(
			smallestIndexArray,
			"lowest",
			domain
		);

		// Find which members of the team have the highest score
		largestIndexArray = findIndex.largest({ array: workingArray });
		let largestIndex = largestIndexArray[0];
		// Print this information out in human readable form
		let largestMember = this.formatDomainString(
			largestIndexArray,
			"highest",
			domain
		);

		// Calculate difference between highest and lowest value
		difference = workingArray[largestIndex] - workingArray[smallestIndex];
		let strDifference =
			"The difference between the largest and smallest " +
			domain +
			" score is " +
			difference;

		// Calculate combined team's average
		totalScore = workingArray.reduce(this.myFunc);
		teamAvg = Math.round(totalScore / workingArray.length);
		teamAverageCompare = findStdDeviation(
			teamAvg,
			averageData[domain[0]].Average,
			averageData[domain[0]].StdDist
		);
		let teamAverageText = `The team's average score for ${domain} is ${teamAvg}. \nCompared to the average score for ${domain}, this is ${teamAverageCompare}`;

		return (
			<div className="teamDomain" key={`${DL}`}>
				<h1>{domain}</h1>
				<i>{shortDescription}</i>
				<br />
				<div className="barGraph">
					<HorizontalBar
						className="barGraph"
						data={graph}
						options={{
							responsive: true,

							title: {
								display: true,
								fontSize: 15,
							},
							legend: {
								display: false,
								position: "right",
							},

							scales: {
								xAxes: [
									{
										ticks: {
											max: 95,
											min: 35,
											stepSize: 5,
										},
									},
								],
							},
						}}
					/>
				</div>
				<p>{lowestMember}</p>
				<p>{largestMember}</p>
				<p>{strDifference}</p>
				<p>{teamAverageText}</p>
			</div>
		);
	}

	toggleSpan(DLetter) {
		alert(this.state.more)
		let tempDL = DLetter;
		let currentMore = this.state.more;
		this.setState({
			more: currentMore === tempDL ? "" : tempDL,
		});
	}

	myFunc(total, num) {
		return total + num;
	}

	createGraphs(allDomains) {
		const team = this.state.team;

		let allGraphs = [];
		let teamRadarGraph = Graph.Radar(allDomains, team);
		allGraphs.push(teamRadarGraph);

		allDomains.forEach((domain) => {
			let tempGraph = Graph.Bar(domain, team);
			allGraphs.push(tempGraph);
		});

		return allGraphs;
	}

	displayInfo(shouldDisplayInfo) {
		this.setState({ showInfo: shouldDisplayInfo });
	}


	updateSetRole(roleName, event) {
		const values = { ...this.state.roles };
		values[roleName].val = event.target.value;
		for (const [key, value] of Object.entries(values)) {
			if (value.val === event.target.value && key !== roleName) {
				values[key].val = "";
			}
		}
		this.setState({ roles: values });
	}

	findBestRoles(combined, preSet) {
		var betterResult = [];
		var workingArray = [];
		var rolesToBeAllocated = 5 - preSet.length;
		function recHelper(remainingMembers, workingArray) {
			let tempMembers = [];
			for (let i = 0; i < remainingMembers.length; i++){
				tempMembers.push(remainingMembers[i]);
			}
			var currentMember = tempMembers[0];
	
			currentMember.scores.forEach((memElement) => {
				var memTemp = workingArray.slice(0);
				var indexTaken = false;
				memTemp.forEach((assignedMember) => {
					if (memElement.index === assignedMember.index) {
						indexTaken = true;
					}
				});
	
				if (!indexTaken) {
					memTemp.push({member: currentMember.name, index: memElement.index, value: memElement.value});
					if (memTemp.length === Math.min(rolesToBeAllocated, combined.length)) {
						betterResult.push(memTemp)
						return;
					} else {
						let newReturn = memTemp.slice(0);
						recHelper(tempMembers.slice(1), newReturn)
					}
				}
	
				
			})
		}
		recHelper(combined, [], workingArray);
		var bestSum = 0;
		var bestCombo = [];
		betterResult.forEach((result) => {
			let tempSum = 0;
			let tempCombo = [];
			result.forEach((entry, index, object) => {
				tempSum += entry.value;
				
				let tempEntry = Object.assign({}, entry);
				tempCombo.push(tempEntry);
			})
			if (tempSum > bestSum) {
				bestSum = tempSum;
				bestCombo = tempCombo.slice(0);
				
			}
		})
		preSet.forEach((member) => {
			bestCombo.push(member);
		})
		return bestCombo;
	}

	AssignRoles = (Team, SetRoles) => {
		let localRoles = Object.assign({}, this.state.roles);
		let localRoleAssignment = [];
		let localTeam = [];
		let refinedLocalTeam = [];

		let setRoles = [];
		Team.forEach((member) => {
			let scores = [];
			member.scores.forEach((score) => {
				let tempScore = Object.assign({}, score);
				scores.push(tempScore);
			})
			let temp = Object.assign({}, {name: member.name, scores: scores});
			localTeam.push(temp);
		})
		let setNames = [];
		// Check already allocated roles
		for (const role in localRoles) {
			let isSet = false;
			if (localRoles[role].val !== "") {
				console.log(localRoles[role].val);
				let tempName = localRoles[role].val;
				let tempIndex = localRoles[role].index
				let tempValue = 0;

				localTeam.forEach((member) => {
					if (member.name === tempName){
						tempValue = member.scores[tempIndex].value;
					}
				})
				let temp = Object.assign({}, {title: role, name: tempName});
				setNames.push(temp);
				isSet = true;

				// Make set object, push to array
				let tempMember = {member: tempName, index: tempIndex, value: tempValue}
				setRoles.push(tempMember);
			}	
			localRoleAssignment.push({index: localRoles[role].index, isSet: isSet})
		}

		var checkSetNames = []; 

		setNames.forEach((value) => {
			checkSetNames.push(value);
		})

		// Remove those people from the team array
		localTeam.forEach(function(member, index, object) {
			let alreadySet = false;
			for (let i = 0; i < setNames.length; i++){
				console.log(setNames[i].name);
				if (setNames[i].name === member.name){
					alreadySet = true;
				}	
			}
			if (!alreadySet) {
				refinedLocalTeam.push(member);
			}
		});

		// Remove relative score indicies from remaining team
		// Removing the wrong 2nd index
		refinedLocalTeam.forEach(function(member, index, object) {
			let tempScores = [];
			member.scores.forEach((entry) => {
				let entryIndex = entry.index;
				if (localRoleAssignment[entryIndex].isSet !== true) {
					//refinedLocalTeam[index].scores.splice(entryIndex, 1);
					tempScores.push(entry);
				}
			});
			member.scores = tempScores;
		});
		// Function

		let finalArray = this.findBestRoles(refinedLocalTeam, setRoles);
		
		
		finalArray.forEach((entry, index, object) => {
			for (const role in localRoles) {
				if (localRoles[role].index === entry.index) {
					localRoles[role].set = entry.member;
				}
			}
		})
		return localRoles;
	};

	formatTeam() {
		const team = this.state.team;
		let tempTeam = [];
		team.forEach((member) => {
			let tempScores = [];
			let memberScores = member.scores;
			for (let i = 0; i < memberScores.length; i++) {
				tempScores.push({index: i, value: memberScores[i][6]});
			}
			let temp = {
				name: member.name,
				scores: tempScores,
			};
			tempTeam.push(temp);
		});

		return tempTeam;
	}

	handleRoleAssign = (e) => {
		
		let formTeam = this.formatTeam();		
		const roles = this.state.roles;
		//console.log(roles);
		for (const [key, value] of Object.entries(roles)) {
			value.set = "- Not Set -";
		}
		const calculatedRoles = this.AssignRoles(formTeam, roles);
		this.setState({ roles: calculatedRoles });
		// console.log(calculatedRoles);
		e.preventDefault();
	};

	formatTeamOptions() {
		const team = this.state.team;
		let optionsObject = [];

		optionsObject.push(<option value="">- Not Set -</option>);
		for (let i = 0; i < team.length; i++) {
			let member = team[i];
			optionsObject.push(<option value={member.name}>{member.name}</option>);
		}
		return optionsObject;
	}

	changeDisplay(role) {
		let currentRole = this.state.showing;
		let newRole = role === currentRole ? "" : role;
		this.setState({showing: newRole});
	}

	renderRoleAssign() {
		let roles = this.state.roles;
		let temp;
		let tableNames = [];
		let tableInputs = [];

		const teamOptions = this.formatTeamOptions();

		for (const [key, value] of Object.entries(roles)) {
			temp = (
				<td
					key={`txt${key}`}
					value={this.state.roles[key].set}
					className="txtRoleName"
				>
					{this.state.roles[key].set}
				</td>
			);
			tableNames.push(temp);
		}

		for (const [key, value] of Object.entries(roles)) {
			temp = (
				<td>
					<select
						className={`inp inpTeam inp${key}`}
						name={key}
						value={this.state.roles[key].val}
						onChange={(event) => this.updateSetRole(key, event)}
					>
						{teamOptions}
					</select>
				</td>
			);
			tableInputs.push(temp);
		}
		return (
				<div className="roleContents">
					<form className="frmRoleAssign" onSubmit={this.handleRoleAssign}>
						<img src={TeamL} alt="talking heads" className={this.state.showing === "Team" ? "imgSelectedRoleImage" : "imgRoleImage"} onClick={() => this.changeDisplay("Team")}/>
						<img src={RelatL} alt="talking heads" className={this.state.showing === "Relat" ? "imgSelectedRoleImage" : "imgRoleImage"} onClick={() => this.changeDisplay("Relat")}/>
						<img src={MotivL} alt="talking heads" className={this.state.showing === "Motiv" ? "imgSelectedRoleImage" : "imgRoleImage"} onClick={() => this.changeDisplay("Motiv")}/>
						<img src={CreatL} alt="talking heads" className={this.state.showing === "Creat" ? "imgSelectedRoleImage" : "imgRoleImage"} onClick={() => this.changeDisplay("Creat")}/>
						<img src={CommsL} alt="talking heads" className={this.state.showing === "Comms" ? "imgSelectedRoleImage" : "imgRoleImage"} onClick={() => this.changeDisplay("Comms")}/>
						<div className="divRoleTitles">
							<table className="tblRoleTitles">
								<tbody>
								<tr>
									<td className="txtRoleTitle">Team Lead</td>
									<td className="txtRoleTitle">Relations Lead</td>
									<td className="txtRoleTitle">Motivation Lead</td>
									<td className="txtRoleTitle">Creative Lead</td>
									<td className="txtRoleTitle">Communications Lead</td>		
								</tr>
								</tbody>		
							</table>
						</div>
						<div className="divRoleTable">
							<table className="tblRoleTable">
								<tbody>
									<tr className="trRoleNames">{tableNames}</tr>
								</tbody>
							</table>
							<div className="divRoleInputs">
								<table className="tblRoleInputTable">
									<tbody>
										<tr>{tableInputs}</tr>
									</tbody>
								</table>
								<div className="divRoleSubmit">
									<a
										className="btn btnRoleSubmit"
										onClick={this.handleRoleAssign}
									>
										Calculate
									</a>
								</div>
							</div>
						</div>
					</form>
				</div>
		);
	}
	
	render() {
		let detailedContent;
		switch(this.state.showing) {
			case "Team":
				detailedContent = this.state.calculatedTeamElements[0];
				break;
			case "Comms":
				detailedContent = this.state.calculatedTeamElements[4];
				break;
			case "Motiv": 
				detailedContent = this.state.calculatedTeamElements[2];
				break;
			case "Relat":
				detailedContent = this.state.calculatedTeamElements[1];
				break;
			case "Creat":
				detailedContent = this.state.calculatedTeamElements[3];
				break;
			default:
				break;
		}
		// Buttons to split between team info and role builder
		return (
			<div className="teamPage">
				{this.renderRoleAssign()}
				{detailedContent}
			</div>
		);
	}
}

export default TeamDisplay;
