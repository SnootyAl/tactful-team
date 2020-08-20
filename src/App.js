// to install CSV to JSON: npm install csvtojson --save
//const CSVtoJSON = require("csvtojson");
const FileSystem = require("fs");
const averageData = require("./Data/Average-and-StdDist-JSON.json");
const getText = require("./PersonalityText/index.js");
const teamText = require("./TeamText/team-text.js");
const { parse } = require("path");
// create an array for people that have been assigned a team number
let teamarray = [];

// take csv file and convert it to JSON
function csvtojson() {
	CSVtoJSON()
		.fromFile("./Big-5-Data-Scaled-CSV.csv")
		.then((source) => {
			FileSystem.writeFileSync(
				"./Big-5-Data-Scaled-JSON.json",
				JSON.stringify(source)
			);
		});
}

// import json file and tag persons with a team ID
function createTeam() {
	let personDATA = require("./Data/Big-5-Data-Scaled-JSON.json");
	// outer for loop controls the teams, inner for loop controls the amount of people assigned to a team
	var d = new Date();
	console.log(d.toString());
	for (let i = 0; i < 2; i++) {
		teamarray.push([]);
		for (let j = 0; j < 4; j++) {
			// tagging system: will take a person from the JSON file push it to the array, insert JSON key and Value, and remove itself
			teamarray[i].push(Object.assign(personDATA.shift()));
		}
	}
}

// for testing purposes
function Teamloop() {
	for (let i = 0; i < teamarray.length; i++) {
		console.log("\n\nIn Team " + i + ", the members are: ");
		let temp_team = teamarray[i];

		// Display each team member's information
		temp_team.forEach(displayTeam);

		// Full team analysis, not just individual
		teamAnalysis(temp_team);
	}
}

function pullIndividualData(item) {
	let domains = ["C", "A", "N", "O", "E"];
	let resultText = "";
	let scores = {};
	// For each domain...
	domains.forEach((d) => {
		// resultText = low, neutral or high, depending on the individuals score,
		// the avarage score, and standard distribution of the curve
		resultText = findStdDeviation(
			item[`Total${d}`],
			averageData.E.Average,
			averageData.E.StdDist
		);
		// Add to the final scores object this new information about the individuals domain/score
		scores[d] = {
			score: item[`total${d}`],
			count: 1,
			result: resultText,
			facet: {
				"1": {
					score: 6,
					count: 2,
					result: "neutral",
				},
			},
		};
	});
	return scores;
}

function displayTeam(item, index) {
	let domain = "";
	console.log(
		"\nPerson " +
			item.ID +
			", with results (E: " +
			item.TotalE +
			" | N: " +
			item.TotalN +
			" | A: " +
			item.TotalA +
			" | C: " +
			item.TotalC +
			" | O: " +
			item.TotalO +
			")."
	);

	let scores = pullIndividualData(item);
	const result = getText({ scores: scores, lang: "en" });
	result.forEach((f) => console.log(f.title + ": " + f.scoreText));
}

function findStdDeviation(score, avg, StdDev) {
	let deviationsAway = 0;
	if (score <= avg) {
		// Find how many standard deviations below the average this score is
		for (let i = 0; i < 5; i++) {
			let temp = avg - i * StdDev;
			if (temp < score) {
				deviationsAway = -i;
				break;
			}
		}
	} else {
		// Find how many standard deviations above the average this score is
		for (let i = 0; i < 2; i++) {
			let temp = avg + i * StdDev;
			if (temp < score) {
				deviationsAway = i;
			}
		}
	}
	if (deviationsAway < 0) {
		return "low";
	} else if (deviationsAway > 0) {
		return "high";
	} else {
		return "neutral";
	}
}

function teamAnalysis(currentTeam) {
	let arrayE = [];
	let arrayN = [];
	let arrayA = [];
	let arrayC = [];
	let arrayO = [];

	// Push each individual person's domain scores into a shared team array for each domain
	currentTeam.forEach((member) => {
		arrayC.push(member.TotalC);
		arrayA.push(member.TotalA);
		arrayN.push(member.TotalN);
		arrayO.push(member.TotalO);
		arrayE.push(member.TotalE);
	});

	console.log("\n");
	// Run basic data comparison and print
	printDetails("Extraversion", arrayE);
	printDetails("Neuroticism", arrayN);
	printDetails("Agreeableness", arrayA);
	printDetails("Conscientousness", arrayC);
	printDetails("Openness to experience", arrayO);
}

function printDetails(domain, workingArray) {
	let smallestIndexArray = [];
	let largestIndexArray = [];
	let difference = 0;
	console.log("Team " + domain + " scores: " + workingArray);
	// Find which members of the team have the lowest score
	smallestIndexArray = indexOfSmallest(workingArray);
	smallestIndex = smallestIndexArray[0];
	// Print this information out in human readable form
	console.log(formatDomainString(smallestIndexArray, "lowest", domain));
	// Find which members of the team have the highest score
	largestIndexArray = indexOfLargest(workingArray);
	largestIndex = largestIndexArray[0];
	// Print this information out in human readable form
	console.log(formatDomainString(largestIndexArray, "highest", domain));
	difference = workingArray[largestIndex] - workingArray[smallestIndex];
	console.log(
		"The difference between the largest and smallest " +
			domain +
			" score is " +
			difference
	);
	console.log("\n");
}

function indexOfSmallest(a) {
	let lowest = 50;
	let indicies = [];

	for (let i = 0; i < a.length; i++) {
		if (parseInt(a[i]) < lowest) {
			lowest = parseInt(a[i]);
			indicies = [];
			indicies.push(i);
		} else if (parseInt(a[i]) == lowest) {
			indicies.push(i);
		}
	}
	return indicies;
}

function indexOfLargest(a) {
	let highest = 0;
	let indicies = [];

	for (let i = 0; i < a.length; i++) {
		if (parseInt(a[i]) > highest) {
			highest = parseInt(a[i]);
			indicies = [];
			indicies.push(i);
		} else if (parseInt(a[i]) == highest) {
			indicies.push(i);
		}
	}
	return indicies;
}

function formatDomainString(indicies, compString, domainString) {
	let result = "";
	let domLetter = domainString[0];
	if (indicies.length > 1) {
		let tempString = "";
		for (let i = 0; i < indicies.length - 2; i++) {
			tempString += "person " + indicies[i + 1] + ", ";
		}
		// Messy at the moment - trying to counter 0-indexed arrays with human-readable team numers
		// i.e. The first person is labelled Person 1, but their index is array[0].
		tempString += "person " + (indicies[indicies.length - 2] + 1) + " ";
		tempString += "and person " + (indicies[indicies.length - 1] + 1);
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
			" is person " +
			(indicies[0] + 1);
	}

	if (compString == "lowest") {
		result += teamText[`${domLetter}`][`low`] + "\n";
	} else {
		result += teamText[`${domLetter}`][`high`] + "\n";
	}
	return result;
}

function start() {
	// if Big-five-data.json is not in the folder comment out the last 2 functions and run, this will create the json file
	//csvtojson();
	createTeam();
	Teamloop();
}

start();
