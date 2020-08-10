// to install CSV to JSON: npm install csvtojson --save
//const CSVtoJSON = require("csvtojson");
const FileSystem = require("fs");
const averageData = require("./Average-and-StdDist-JSON.json");
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
	var personDATA = require("./Big-5-Data-Scaled-JSON.json");
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
		console.log("In Team " + i + ", the members are: ");
		var temp_team = teamarray[i];
		temp_team.forEach(displayTeam);
		teamAnalysis(temp_team);
		//console.log(temp_team);
	}
}

function displayTeam(item, index) {
	console.log(
		"Person " +
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

	var resultText;

	resultText = findStdDeviation(
		item.TotalE,
		averageData.E.Average,
		averageData.E.StdDist
	);
	console.log("Their Extraversion score was " + resultText);

	resultText = findStdDeviation(
		item.TotalN,
		averageData.N.Average,
		averageData.N.StdDist
	);
	console.log("Their Neuroticism score was " + resultText);

	resultText = findStdDeviation(
		item.TotalA,
		averageData.A.Average,
		averageData.A.StdDist
	);
	console.log("Their Agreeableness score was " + resultText);

	resultText = findStdDeviation(
		item.TotalC,
		averageData.C.Average,
		averageData.C.StdDist
	);
	console.log("Their Conscientious score was " + resultText);

	resultText = findStdDeviation(
		item.TotalO,
		averageData.O.Average,
		averageData.O.StdDist
	);
	console.log("Their Openness to Experience score was " + resultText);
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
function teamAnalysis(currentTeam) {}
function start() {
	// if Big-five-data.json is not in the folder comment out the last 2 functions and run, this will create the json file
	//csvtojson();
	createTeam();
	Teamloop();
}

start();
