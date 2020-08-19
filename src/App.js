// to install CSV to JSON: npm install csvtojson --save
//const CSVtoJSON = require("csvtojson");
const FileSystem = require("fs");
const averageData = require("./Average-and-StdDist-JSON.json");
const getText = require("./PersonalityText/index.js");
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
	let personDATA = require("./Big-5-Data-Scaled-JSON.json");
	// outer for loop controls the teams, inner for loop controls the amount of people assigned to a team
	for (let i = 0; i < 2; i++) {
		teamarray.push([]);
		for (let j = 0; j < 4; j++) {
			// tagging system: will take a person from the JSON file push it to the array, insert JSON key and Value, and remove itself
			teamarray[i].push(Object.assign(personDATA.shift()));
		}
	}
	//console.log(teamarray);
}

// for testing purposes
function Teamloop() {
	for (let i = 0; i < teamarray.length; i++) {
		console.log("\n\nIn Team " + i + ", the members are: ");
		let temp_team = teamarray[i];
		temp_team.forEach(displayTeam);
		teamAnalysis(temp_team);
		//console.log(temp_team);
	}
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
	let resultText;
	let scores = {};

	domain = "E";
	resultText = findStdDeviation(
		item.TotalE,
		averageData.E.Average,
		averageData.E.StdDist
	);

	scores[domain] = {
		score: item.totalE,
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
	domain = "N";
	resultText = findStdDeviation(
		item.TotalN,
		averageData.N.Average,
		averageData.N.StdDist
	);
	scores[domain] = {
		score: item.totalN,
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
	domain = "A";
	resultText = findStdDeviation(
		item.TotalA,
		averageData.A.Average,
		averageData.A.StdDist
	);
	scores[domain] = {
		score: item.totalA,
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
	domain = "C";
	resultText = findStdDeviation(
		item.TotalC,
		averageData.C.Average,
		averageData.C.StdDist
	);
	scores[domain] = {
		score: item.totalC,
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
	domain = "O";
	resultText = findStdDeviation(
		item.TotalO,
		averageData.O.Average,
		averageData.O.StdDist
	);
	scores[domain] = {
		score: item.totalO,
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
	const result = getText({ scores: scores, lang: "en" });
	//console.log(JSON.stringify(result, null, 2));
	let individualScores = [];
	//result.forEach((f) => individualScores.push(f.scoreText));
	//console.log(individualScores);
	result.forEach((f) => console.log(f.title + ": " + f.scoreText));
}

function findStdDeviation(score, avg, StdDev) {
	let deviationsAway = 0;
	if (score <= avg) {
		// Find how many standard deviations below the average this score is
		for (let i = 0; i < 5; i++) {
			//console.log("At step " + i + ", deviations away is " + deviationsAway);
			let temp = avg - i * StdDev;
			//console.log("At step " + i + ", temp is " + temp);
			if (temp < score) {
				//console.log(
				"At step " +
					i +
					", we enter the if statement, where temp is" +
					temp +
					",\nscore is " +
					score +
					" and deviationsAway is " +
					deviationsAway;
				//);
				deviationsAway = -i;
				//console.log("But now deviationsAway is " + deviationsAway);
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
	//console.log("Deviations away final: " + deviationsAway);
	//console.log(deviationsAway < 0);
	if (deviationsAway < 0) {
		//console.log("I make it in here");
		return "low";
	} else if (deviationsAway > 0) {
		//console.log("I make it in there");
		return "high";
	} else {
		//console.log("I make it in everywhere");
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
	currentTeam.forEach((e) => arrayE.push(e.TotalE));
	currentTeam.forEach((n) => arrayN.push(n.TotalN));
	currentTeam.forEach((a) => arrayA.push(a.TotalA));
	currentTeam.forEach((c) => arrayC.push(c.TotalC));
	currentTeam.forEach((o) => arrayO.push(o.TotalO));

	console.log("\n");
	// Run basic data comparison and print
	printDetails("extraversion", arrayE);
	printDetails("neuroticism", arrayN);
	printDetails("agreeableness", arrayA);
	printDetails("conscientousness", arrayC);
	printDetails("openness to experience", arrayO);
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
	return result;
}
function start() {
	// if Big-five-data.json is not in the folder comment out the last 2 functions and run, this will create the json file
	//csvtojson();
	createTeam();
	Teamloop();
}

start();
