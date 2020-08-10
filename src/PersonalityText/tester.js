const getText = require("./index");

// Functione, by Raymonde. Used to determine whether a score is "low", "neutral" or "high"
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

// Dummy scores from the npm github
const scores = {
	N: {
		score: 6,
		count: 2,
		result: "neutral",
		facet: {
			"1": {
				score: 3,
				count: 1,
				result: "neutral",
			},
			"2": {
				score: 3,
				count: 1,
				result: "neutral",
			},
		},
	},
	A: {
		score: 6,
		count: 2,
		result: "neutral",
		facet: {
			"1": {
				score: 6,
				count: 2,
				result: "neutral",
			},
		},
	},
	C: {
		score: 6,
		count: 2,
		result: "neutral",
		facet: {
			"1": {
				score: 6,
				count: 2,
				result: "neutral",
			},
		},
	},
	O: {
		score: 6,
		count: 2,
		result: "neutral",
		facet: {
			"1": {
				score: 6,
				count: 2,
				result: "neutral",
			},
		},
	},
};

// Statistics object data was taken directly from excel spreadsheet
const statistics = {
	E: {
		average: 30,
		StdDist: 8,
	},
	N: {
		average: 30,
		StdDist: 8,
	},
	A: {
		average: 36,
		StdDist: 7,
	},
	C: {
		average: 33,
		StdDist: 7,
	},
	O: {
		average: 38,
		StdDist: 6,
	},
};

// Example way of using variables to populate the scores JSON object
const Extra = "E";
const myResult = findStdDeviation(
	currentScore,
	statistics.E.average,
	statistics.E.StdDist
);
console.log(myResult);
scores[Extra] = {
	// Score will be inserted from the excel Spreadsheet
	score: 6,
	count: 2,
	result: myResult,
	facet: {
		"1": {
			score: 6,
			count: 2,
			result: "neutral",
		},
	},
};

// Use the scores JSON object to return text and details
const result = getText({ scores: scores, lang: "en" });
console.log(JSON.stringify(result, null, 2));
