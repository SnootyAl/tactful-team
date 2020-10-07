import React, { useState, useEffect } from "react";
import { Radar, Bar, HorizontalBar } from "react-chartjs-2";
import findIndex from "../javascripts/indexOf";
import Graph from "../javascripts/Graphs";
import findStdDeviation from "../javascripts/StdDev";
import averageData from "../data/Average-and-StdDist-JSON.json";
import teamText from "../TextFiles/team-text";
import DomainText from "../data/DomainText/index";
import RoleAssign from "../javascripts/RoleAssign";

class TeamDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			team: props.data,
			showInfo: true,
			roles: {
				Team: {
					Full: "Team Lead",
					val: "",
					index: 0,
					total: 0,
				},
				Rela: {
					Full: "Relations Lead",
					val: "",
					index: 1,
					total: 0,
				},
				Motv: {
					Full: "Motivation Lead",
					val: "",
					index: 2,
					total: 0,
				},
				Crtv: {
					Full: "Creative Lead",
					val: "",
					index: 3,
					total: 0,
				},
				Comm: {
					Full: "Communications Lead",
					val: "",
					index: 4,
					total: 0,
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
				//tempString += "person " + indicies[i + 1] + ", ";
				tempString += `${names[i]}, `;
			}
			// Messy at the moment - trying to counter 0-indexed arrays with human-readable team numers
			// i.e. The first person is labelled Person 1, but their index is array[0].
			//tempString += "person " + (indicies[indicies.length - 2] + 1) + " ";
			tempString += `${names[names.length - 2]} `;
			//tempString += "and person " + (indicies[indicies.length - 1] + 1);
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

		if (compString == "lowest") {
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
		let teamScores = "";
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
				<span
					id={`dots ${DL}`}
					style={{ display: this.state.more === `${DL}` ? "none" : "inline" }}
				>
					...
				</span>
				<div className={`more ${DL}`}>
					<span
						id={`more ${DL}`}
						style={{
							display: this.state.more === `${DL}` ? "inline" : "none",
						}}
					>
						<i dangerouslySetInnerHTML={{ __html: longDescription }} />
					</span>
				</div>
				<div className="btnSpanDiv">
					<a onClick={() => this.toggleSpan(DL)} className="btn ToggleSpan">
						{this.state.more === DL ? "Read less" : "Read more"}
					</a>
				</div>

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
		console.log("Hello");
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

	renderTeam() {
		const currentTeam = this.state.team;
		console.log(currentTeam);
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
		console.log(allGraphs);
		teamElements.push(
			this.printDetails("Conscientousness", arrayC, allGraphs[1])
		);
		teamElements.push(this.printDetails("Agreeableness", arrayA, allGraphs[2]));
		teamElements.push(this.printDetails("Neuroticism", arrayN, allGraphs[3]));
		teamElements.push(
			this.printDetails("Openness to experience", arrayO, allGraphs[4])
		);
		teamElements.push(this.printDetails("Extraversion", arrayE, allGraphs[5]));

		return (
			<div className="teamResults">
				<h1>Team Results:</h1>
				<Radar
					data={allGraphs[0]}
					options={{
						title: {
							display: true,
							text: "Team 1",
							fontSize: 15,
						},
						legend: {
							display: true,
							position: "right",
						},
						scale: {
							gridLines: {
								color: "#FFFFFF",
							},
							ticks: {
								max: 95,
								min: 35,
								stepSize: 5,
							},
						},
					}}
				/>
				{teamElements}
			</div>
		);
	}

	updateSetRole(roleName, event) {
		const values = { ...this.state.roles };
		values[roleName].val = event.target.value;
		for (const [key, value] of Object.entries(values)) {
			if (value.val === event.target.value && key != roleName) {
				values[key].val = "";
			}
		}
		this.setState({ roles: values });
	}

	handleRoleAssign = (e) => {
		console.log(this.state.roles);
		const team = this.state.team;
		const data = this.state.data;
		let formTeam = [];

		team.forEach((member) => {
			let tempScores = [];
			let memberScores = member.scores;
			for (let i = 0; i < memberScores.length; i++) {
				tempScores.push(memberScores[i][6]);
			}
			let temp = {
				name: member.name,
				scores: tempScores,
			};
			formTeam.push(temp);
		});
		const roles = this.state.roles;
		const calculatedRoles = RoleAssign(formTeam, roles, data);
		console.log(calculatedRoles);
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

	renderRoleAssign() {
		let roles = this.state.roles;
		let mytable = [];
		let temp;

		const teamOptions = this.formatTeamOptions();

		for (const [key, value] of Object.entries(roles)) {
			temp = (
				<tr>
					<td>{value.Full}</td>
					<td>
						<select
							className={`inp${key}`}
							name={key}
							value={this.state.roles[key].val}
							onChange={(event) => this.updateSetRole(key, event)}
						>
							{teamOptions}
						</select>
					</td>
				</tr>
			);
			mytable.push(temp);
		}
		// temp = roles.map((role, index) => {
		// 	<tr>
		// 		<td>{role.Full}</td>
		// 		<td>
		// 			<input
		// 				type="text"
		// 				className={`inp${role}`}
		// 				name={role}
		// 				value={this.state.roles[role].val}
		// 				onChange={(event) => this.updateSetRole(role, event)}
		// 			/>
		// 		</td>
		// 	</tr>;
		// });
		return (
			<div className="roleAssign">
				<h1>This is where the role assign Widget will be</h1>
				<div className="roleTable">
					<form className="frmRoleAssign" onSubmit={this.handleRoleAssign}>
						<table>
							<tbody>
								{mytable}
								<tr>
									<td></td>
									<td>
										<button
											type="submit"
											value="Calculate"
											className="btnRoleAssign"
											onClick={() => this.handleRoleAssign}
										>
											Calculate{" "}
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</form>
				</div>
			</div>
		);
	}

	render() {
		// Buttons to split between team info and role builder
		return (
			<div className="teamPage">
				<div className="teamNavButtons">
					<a className="btn showInfo" onClick={() => this.displayInfo(true)}>
						Team Info
					</a>
					<a
						className="btn showRoleAssign"
						onClick={() => this.displayInfo(false)}
					>
						Role Assignments
					</a>
				</div>
				{this.state.showInfo && this.renderTeam()}
				{!this.state.showInfo && this.renderRoleAssign()}
			</div>
		);
	}
}

export default TeamDisplay;
