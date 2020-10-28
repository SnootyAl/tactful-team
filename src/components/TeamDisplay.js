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

import WBelow from "../Design Assets/VisAvg/wellBelow_graphic.png"
import Below from "../Design Assets/VisAvg/below_graphic.png"
import Average from "../Design Assets/VisAvg/average_graphic.png"
import Above from "../Design Assets/VisAvg/above_graphic.png"
import WAbove from "../Design Assets/VisAvg/wellAbove_graphic.png"

/**
 * Component class that renders the team information page
 */
class TeamDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showing: "",
			team: props.data,
			teamHash: "",
			copied: false,
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

	/**
	 * Run this when the component loads for the first time. Calculates team text once, and stores this in state.
	 */
	componentDidMount() {
		const currentTeam = this.state.team;
		let teamElements = [];
		let arrayC = [];
		let arrayA = [];
		let arrayN = [];
		let arrayO = [];
		let arrayE = [];

		// Store member total scores in a more compact form
		currentTeam.forEach((member) => {
			arrayC.push(member.scores[0][6]);
			arrayA.push(member.scores[1][6]);
			arrayN.push(member.scores[2][6]);
			arrayO.push(member.scores[3][6]);
			arrayE.push(member.scores[4][6]);
		});

		// Create the JSX elements for each domain
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


		// Format team and calculate the roles automatically
		let formTeam = this.formatTeam();
		let roles = this.state.roles;
		const calculatedRoles = this.AssignRoles(formTeam, roles);

		// Create the member objects that will be turned into a hash
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

		// Create a hash that the user can use to review this exact team at a later date.
		const tempHash = cryptoJS.AES.encrypt(teamString, "Super Secret Key");
		console.log(tempHash.toString());

		// Update the state with this data
		this.setState({calculatedTeamElements: teamElements, roles: calculatedRoles, teamHash: tempHash})
	}

	/**
	 * Formats the highest/lowest comparison strings for each domain
	 * @param {number[]} indicies - The team indicies with the highest/lowest score
	 * @param {string} compString - Comparison string - highest or lowest
	 * @param {string} domainString - The domain to be compared
	 */
	formatDomainString(indicies, compString, domainString) {
		let result = "";
		let names = [];
		let domLetter = domainString[0];
		let myTeam = this.state.team;

		// Push the names of each respective member into a local array
		indicies.forEach((index) => {
			names.push(myTeam[index].name);
		});

		// Variable string construction - multiple people means a plural string
		if (indicies.length > 1) {
			let tempString = "";
			for (let i = 0; i < indicies.length - 2; i++) {
				tempString += `${names[i]}, `;
			}
			tempString += `${names[names.length - 2]} `;
			tempString += `and ${names[names.length - 1]}`;
			result =
				"The members with the " +
				compString +
				" scores in " +
				domainString +
				" are: " +
				tempString +", meaning: \n";
		} else {
			result =
				"The member with the " +
				compString +
				" score in " +
				domainString +
				" is " +
				names[0] + ", meaning: \n \n";
		}

		// Format the text results
		let tempStrings = "";
		if (compString === "lowest") {
			tempStrings = teamText[`${domLetter}`][`low`]
		} else {
			 tempStrings = teamText[`${domLetter}`][`high`];
		}

		result += tempStrings;

		// Return the formatted JSX
		return (
			<div className={`new-line domainInfo${compString}`}>
				{result}
			</div>
		)
	}

	/**
	 * Creates the JSX that will render the team's information for each domain
	 * @param {string} domain - The domain to print the details for
	 * @param {number[]} workingArray - The array of team scores related to the domain
	 * @param {object} graph - The ChartJS graph details
	 */
	printDetails(domain, workingArray, graph) {
		// Initialise variables
		let smallestIndexArray = [];
		let largestIndexArray = [];
		let totalScore = 0;
		let teamAvg = 0;
		let teamAverageCompare = "";

		// Helper function to sum the total score of this domain
		function myFunc(total, num) {
			return total + num;
		}
		// Retrieve the Domain Letter from the first letter of the domain parameter
		const DL = domain[0];

		// Retrieve the short description of this domain from the local file
		const shortDescription = DomainText[DL].shortDescription;

		// Find which members of the team have the lowest score
		smallestIndexArray = findIndex.smallest({ array: workingArray });

		// Print this information out in human readable form
		let lowestMember = this.formatDomainString(
			smallestIndexArray,
			"lowest",
			domain
		);

		// Find which members of the team have the highest score
		largestIndexArray = findIndex.largest({ array: workingArray });

		// Print this information out in human readable form
		let largestMember = this.formatDomainString(
			largestIndexArray,
			"highest",
			domain
		);

		// Calculate combined team's average
		totalScore = workingArray.reduce(myFunc);
		teamAvg = Math.round(totalScore / workingArray.length);
		teamAverageCompare = findStdDeviation(
			teamAvg,
			averageData[domain[0]].Average,
			averageData[domain[0]].StdDist
		);
		
		// Find the correct Visual Average graphic
		let domainCompare = WBelow
		switch (teamAverageCompare) {
			case "very low":
				domainCompare = WBelow;
				break;
			case "low":
				domainCompare = Below;
				break;
			case "neutral":
				domainCompare = Average;
				break;
			case "high":
				domainCompare = Above;
				break;
			case "very high":
				domainCompare = WAbove;
				break;
			default:
				break;
		}

		// Return the formatted JSX
		return (
			<div className="teamDomain" key={`${DL}`}>
				<h1>{domain}</h1>
				{shortDescription}
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
											fontSize: 18,
											max: 95,
											min: 35,
											stepSize: 5,
										},
									},
								],
								yAxes: [{
									ticks: {
										fontSize: 30
									}
								}]
							},
						}}
					/>
				</div>
				<img className="imgVisualAverage" src={domainCompare} />
				<br />
				----------
				{lowestMember}		
				<br />
				----------	
				{largestMember}
			</div>
		);
	}

	/**
	 * Creates the Radar and Bar graphs for the team
	 * @param {[number[]]} allDomains - Array of score arrays
	 */
	createGraphs(allDomains) {
		const team = this.state.team;
		let allGraphs = [];

		// Use local library to create Radar graph
		let teamRadarGraph = Graph.Radar(allDomains, team);
		allGraphs.push(teamRadarGraph);

		// Use local library to procedurally generate Bar graphs
		allDomains.forEach((domain) => {
			let tempGraph = Graph.Bar(domain, team);
			allGraphs.push(tempGraph);
		});

		return allGraphs;
	}

	/**
	 * Updates the specified role with the user-defined team member name
	 * @param {string} roleName 
	 * @param {event} event 
	 */
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

	/**
	 * Handles the assignment of team roles
	 * @param {event} e 
	 */
	handleRoleAssign = (e) => {
		// Formats the team array
		let formTeam = this.formatTeam();	
		
		// Store roles locally, overwrite the set values of this object.
		const roles = this.state.roles;
		for (const [key, value] of Object.entries(roles)) {
			value.set = "- Not Set -";
		}

		// Calculate the roles, and update the state
		const calculatedRoles = this.AssignRoles(formTeam, roles);
		this.setState({ roles: calculatedRoles });
		e.preventDefault();
	};
	
	/**
	 * Takes the team data stored in the state and returns an array of member objects that can be
	 * used to assign roles.
	 */
	formatTeam() {
		const team = this.state.team;
		let tempTeam = [];

		// Each member's total domain scores are stored in an array, and a new object is created and pushed to an array
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

	/**
	 * 
	 * @param {*} Team 
	 * @param {*} SetRoles 
	 */
	AssignRoles = (Team, SetRoles) => {
		// Assign local variables
		let localRoles = Object.assign({}, this.state.roles);
		let localRoleAssignment = [];
		let localTeam = [];
		let refinedLocalTeam = [];

		let setRoles = [];

		// Create memory-unique copies of each member and their score variables
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
			// If the user has set a team member for this particular role
			if (localRoles[role].val !== "") {
				// Store the information of the member name and the index
				let tempName = localRoles[role].val;
				let tempIndex = localRoles[role].index
				let tempValue = 0;

				// Search the team until the member is found
				localTeam.forEach((member) => {
					// Store that member's score into a temporary value
					if (member.name === tempName){
						tempValue = member.scores[tempIndex].value;
					}
				})

				// Create a memory-unique new object that contains  the role name and the name of the member
				// that was assigned to it
				let temp = Object.assign({}, {title: role, name: tempName});
				// Push this temporary object to an array, and set the set check to true
				setNames.push(temp);
				isSet = true;

				// Make set object, push to array
				let tempMember = {member: tempName, index: tempIndex, value: tempValue}
				setRoles.push(tempMember);
			}	

			// Push the index of the role, as well as whether or not it has been set, to an array.
			localRoleAssignment.push({index: localRoles[role].index, isSet: isSet})
		}

		// Remove any pre-set members from the team-to-be-assigned array.
		localTeam.forEach(function(member, index, object) {
			let alreadySet = false;
			// Check this member's name against the entirety of the setNames array.
			for (let i = 0; i < setNames.length; i++){
				// If the name is found, we set the boolean check to true.
				if (setNames[i].name === member.name){
					alreadySet = true;
				}	
			}
			// If the member wasn't found, we can add them to the refined team-to-be-assigned array
			if (!alreadySet) {
				refinedLocalTeam.push(member);
			}
		});

		// Remove the scores (that relate to any already-assigned roles) from the remaining team members
		refinedLocalTeam.forEach(function(member, index, object) {
			let tempScores = [];
			member.scores.forEach((entry) => {
				let entryIndex = entry.index;
				if (localRoleAssignment[entryIndex].isSet !== true) {
					tempScores.push(entry);
				}
			});
			member.scores = tempScores;
		});

		// Find the best role allocation
		let finalArray = this.findBestRoles(refinedLocalTeam, setRoles);
		
		// Update the "set" values of any roles that have been set
		finalArray.forEach((entry, index, object) => {
			for (const role in localRoles) {
				if (localRoles[role].index === entry.index) {
					localRoles[role].set = entry.member;
				}
			}
		})
		
		// Return this updated role object, now including any new "set" values
		return localRoles;
	};

	/**
	 * 
	 * @param {object[]} combined - The formatted, compressed team score details
	 * @param {object} preSet - The roles object, containing any pre-set roles
	 */
	findBestRoles(combined, preSet) {
		// Initialise local variables
		var betterResult = [];
		var workingArray = [];
		var rolesToBeAllocated = 5 - preSet.length;

		// Recursive helper function that finds every possible combination of the given arrays.
		// Doesn't repeat row or column, and takes into account any roles previously set
		function recHelper(remainingMembers, workingArray) {
			let tempMembers = [];
			// Make a local, non-memory-shared copy of the members yet to be assigned a role
			for (let i = 0; i < remainingMembers.length; i++){
				tempMembers.push(remainingMembers[i]);
			}

			// Take the first member of this array
			var currentMember = tempMembers[0];
			// Allocate them to every remaining role
			currentMember.scores.forEach((memElement) => {
				// Make a copy of the current role draft
				var memTemp = workingArray.slice(0);
				var indexTaken = false;
				// If the index of this member's score has already been taken, make a note of that
				memTemp.forEach((assignedMember) => {
					if (memElement.index === assignedMember.index) {
						indexTaken = true;
					}
				});
				
				// If the index of this member's score hasn't already been taken by any other member
				if (!indexTaken) {
					// Add this member's details to the copied role assignment draft
					memTemp.push({member: currentMember.name, index: memElement.index, value: memElement.value});
					// If the draft array has reached the number of roles it needed to allocate, or the number of members
					// in the team, the role assignment is complete and we can add this array to the external array
					if (memTemp.length === Math.min(rolesToBeAllocated, combined.length)) {
						betterResult.push(memTemp)
						return;
					} else {
						// Otherwise, we create a new copy of the role assignment draft and recursively call the helper
						// function with our updated arrays.
						let newReturn = memTemp.slice(0);
						recHelper(tempMembers.slice(1), newReturn)
					}
				}	
			})
		}

		// Call the helper function with the original list of members, and empty array of taken indicies,
		// and an empty external array to store any completed role assignments.
		recHelper(combined, [], workingArray);

		// Work out which of the completed arrays is objectively (based on the sum of all domain totals assigned) best.
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

		// Return the best role assignment combination.
		return bestCombo;
	}

	/**
	 * Format the dropdown box for each role
	 */
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

	/**
	 * Changes which role information should be displayed below the role assign widget
	 * @param {string} role 
	 */
	changeDisplay(role) {
		let currentRole = this.state.showing;
		let newRole = role === currentRole ? "" : role;
		this.setState({showing: newRole});
	}

	handleCopy = (e) => {
		navigator.clipboard.writeText(this.state.teamHash);
		this.setState({ copied: true}, () => {
			setTimeout(() => {
				this.setState({ copied: false });
			}, 10500);
		});
	}

	/**
	 * Renders the role assign section of the page
	 */
	renderRoleAssign() {
		let roles = this.state.roles;
		let temp;
		let tableNames = [];
		let tableInputs = [];

		const teamOptions = this.formatTeamOptions();

		// For each sub-object in the roles object
		for (const [key, value] of Object.entries(roles)) {
			// Create the text areas that display which member has been set to which role
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

		// For each sub-object in the roles object
		for (const [key, value] of Object.entries(roles)) {
			// Create the dropdown boxes that allow the user to select specific roles
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

		// Render the JSX
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
	
	/**
	 * Renders the bottom of the page, where the user can save their team hash
	 */
	renderTeamHash() {
		return (
			<div className="divTeamHash">
				<p>Every team is unique, so if you want to view this team again sometime down the road,
					click the button below to copy your team's unique code. Save it somewhere safe, and
					when you come back, simply paste the code into the "Review a previously generated team"
					section of the Team Creation page.
				</p>
				<a className="btn btnTeamHash" onClick={this.handleCopy}>
					Copy Team Hash
				</a>
				<div className="divTeamCopySuccess">
					{this.state.copied && (
						<p>Team code copied successfully - put that somewhere safe!</p>
					)}
				</div>
			</div>
		)
	}

	/**
	 * Render the page
	 */
	render() {
		let detailedContent;
		let teamHashSection = this.renderTeamHash();
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
				{teamHashSection}
			</div>
		);
	}
}

export default TeamDisplay;
