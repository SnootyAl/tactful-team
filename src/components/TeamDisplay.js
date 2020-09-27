import React, { useState, useEffect } from "react";
import findIndex from "../javascripts/indexOf";
import teamText from "../TextFiles/team-text";
import findStdDeviation from "../javascripts/StdDev";
import averageData from "../data/Average-and-StdDist-JSON.json";

class TeamDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			team: props.data,
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
		console.log(names);
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

	printDetails(domain, workingArray) {
		let smallestIndexArray = [];
		let largestIndexArray = [];
		let difference = 0;
		let totalScore = 0;
		let teamAvg = 0;
		let teamAverageCompare = "";
		let teamScores = "";

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
			<div className="teamDomain">
				<h1>{domain}</h1>
				<p>Team scores: {teamScores}</p>
				<p>{lowestMember}</p>
				<p>{largestMember}</p>
				<p>{strDifference}</p>
				<p>{teamAverageText}</p>
			</div>
		);
	}

	myFunc(total, num) {
		return total + num;
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

		teamElements.push(this.printDetails("Conscientousness", arrayC));
		teamElements.push(this.printDetails("Agreeableness", arrayA));
		teamElements.push(this.printDetails("Neuroticism", arrayN));
		teamElements.push(this.printDetails("Openness to experience", arrayO));
		teamElements.push(this.printDetails("Extraversion", arrayE));

		return (
			<div className="teamResults">
				<h1>Team Results:</h1>
				{teamElements}
			</div>
		);
	}

	render() {
		return this.renderTeam();
	}
}

export default TeamDisplay;
