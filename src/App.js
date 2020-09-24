// to install CSV to JSON: npm install csvtojson --save
import React from 'react';
import {Radar, Bar, HorizontalBar} from 'react-chartjs-2';
import { Domain } from 'domain';
import ReactDOM from 'react-dom';
//const CSVtoJSON = require("csvtojson");
const FileSystem = require("fs");
const averageData = require("./Data/Average-and-StdDist-JSON.json");
const getText = require("./PersonalityText/index.js");
const teamText = require("./TeamText/team-text.js");
const findStdDeviation = require("./StdDev.js");
const findIndex = require("./indexOf.js");
const { parse } = require("path");
// create an array for people that have been assigned a team number
let teamarray = [];
let x = getText.getInfo;
// take csv file and convert it to JSON 
//function csvtojson() {
	//CSVtoJSON()
		//.fromFile("./Big-5-Data-Scaled-CSV.csv")
		//.then((source) => {
			//FileSystem.writeFileSync(
				//"./Big-5-Data-Scaled-JSON.json",
				//JSON.stringify(source)
		//	);
		//});
//}

var teamNumber;
// import json file and tag persons with a team ID
function createTeam() {
	let personDATA = require("./Data/Big-5-Data-Scaled-JSON.json");
	// outer for loop controls the teams, inner for loop controls the amount of people assigned to a team
	var d = new Date();
	console.log(d.toString());
	for (let i = 0; i < 1; i++) {
		teamarray.push([]);
		for (let j = 0; j < 4; j++) {
			// tagging system: will take a person from the JSON file push it to the array, insert JSON key and Value, and remove itself
			teamarray[i].push(Object.assign(personDATA.shift()));
		}
		teamNumber = i;
	}
}

var output = [];

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
		resultText = findStdDeviation({
			score: item[`Total${d}`],
			avg: averageData[`${d}`].Average,
			StdDev: averageData[`${d}`].StdDist,
		});
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

var teammemberscores = [];

function displayTeam(item, index) {
	let domain = "";
	console.log(
		"\nPerson " +
			item.ID +
			", with results (C: " +
			item.TotalC +
			" | A: " +
			item.TotalA +
			" | N: " +
			item.TotalN +
			" | O: " +
			item.TotalO +
			" | E: " +
			item.TotalE +
			")."
	);
	let scores = pullIndividualData(item);
	const result = getText({ scores: scores, lang: "en" });
	result.forEach((f) => console.log(f.title + ": " + f.scoreText));
	
	teammemberscores.push(`\nPerson 
	${item.ID} 
	, with results (C:  
	${item.TotalC}
	 | A:  
	${item.TotalA} 
	 | N:  
	${item.TotalN} 
	 | O:  
	${item.TotalO} 
	 | E:  
	${item.TotalE} 
	).`)
	
}

let teamRadarGraph;
let conGraph;
let AgreeGraph;
let NeuroGraph;
let OpenGraph;
let ExtraGraph;

var carraystringtest = [];
function teamAnalysis(currentTeam) {
	let arrayE = [];
	let arrayN = [];
	let arrayA = [];
	let arrayC = [];
	let arrayO = [];

	// Push each individual person's domain scores into a shared team array for each domain
	currentTeam.forEach((member) => {
		arrayC.push(parseInt(member.TotalC));
		arrayA.push(parseInt(member.TotalA));
		arrayN.push(parseInt(member.TotalN));
		arrayO.push(parseInt(member.TotalO));
		arrayE.push(parseInt(member.TotalE));
	});
	
	// main radar graph
	teamRadarGraph = {
		labels: ['Conscientousness', 'Agreeableness', 'Neuroticism',
					'Openness to experience', 'Extraversion'],
		datasets: [
			{
				label: "Team Member 1",
				backgroundColor: 'rgba(251,200,23,0.5)',
				borderColor: 'rgba(251,200,23,0.75)',
				borderWidth: 2,
				data: [arrayC[0], arrayA[0], arrayN[0], arrayO[0], arrayE[0]]
			},
			{
				label: "Team Member 2",
				backgroundColor: 'rgba(164,210,21,0.5)',
				borderColor: 'rgba(164,210,21,0.75)',
				borderWidth: 2,
				data: [arrayC[1], arrayA[1], arrayN[1], arrayO[1], arrayE[1]]
			},
			{
				label: "Team Member 3",
				backgroundColor: 'rgba(139,46,144,0.5)',
				borderColor: 'rgba(139,46,144,0.75)',
				borderWidth: 2,
				data: [arrayC[2], arrayA[2], arrayN[2], arrayO[2], arrayE[2]]
			},
			{
				label: "Team Member 4",
				backgroundColor: 'rgba(20,10,100,0.27)',
				borderColor: 'rgba(20,10,100,0.75)',
				borderWidth: 2,
				data: [arrayC[3], arrayA[3], arrayN[3], arrayO[3], arrayE[3]]
			}
		]
	}

	conGraph = {
		labels: [
			'Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4'
		],
		datasets: [
			{
				backgroundColor: ['rgba(251,200,23,0.5)' , 'rgba(164,210,21,0.5)', 'rgba(139,46,144,0.5)', 'rgba(20,10,100,0.27)'],
				borderColor: ['rgba(251,200,23,0.75)', 'rgba(164,210,21,0.75)', 'rgba(139,46,144,0.75)', 'rgba(20,10,100,0.75)'],
				borderWidth: 2,
				data: [arrayC[0], arrayC[1], arrayC[2], arrayC[3]]
			}
		]
	}

	AgreeGraph = {
		labels: [
			'Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4'
		],
		datasets: [
			{
				backgroundColor: ['rgba(251,200,23,0.5)' , 'rgba(164,210,21,0.5)', 'rgba(139,46,144,0.5)', 'rgba(20,10,100,0.27)'],
				borderColor: ['rgba(251,200,23,0.75)', 'rgba(164,210,21,0.75)', 'rgba(139,46,144,0.75)', 'rgba(20,10,100,0.75)'],
				borderWidth: 2,
				data: [arrayA[0], arrayA[1], arrayA[2], arrayA[3]]
			}
		]
	}

	NeuroGraph = {
		labels: [
			'Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4'
		],
		datasets: [
			{
				backgroundColor: ['rgba(251,200,23,0.5)' , 'rgba(164,210,21,0.5)', 'rgba(139,46,144,0.5)', 'rgba(20,10,100,0.27)'],
				borderColor: ['rgba(251,200,23,0.75)', 'rgba(164,210,21,0.75)', 'rgba(139,46,144,0.75)', 'rgba(20,10,100,0.75)'],
				borderWidth: 2,
				data: [arrayN[0], arrayN[1], arrayN[2], arrayN[3]]
			}
		]
	}

	OpenGraph = {
		labels: [
			'Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4'
		],
		datasets: [
			{
				backgroundColor: ['rgba(251,200,23,0.5)' , 'rgba(164,210,21,0.5)', 'rgba(139,46,144,0.5)', 'rgba(20,10,100,0.27)'],
				borderColor: ['rgba(251,200,23,0.75)', 'rgba(164,210,21,0.75)', 'rgba(139,46,144,0.75)', 'rgba(20,10,100,0.75)'],
				borderWidth: 2,
				data: [arrayO[0], arrayO[1], arrayO[2], arrayO[3]]
			}
		]
	}

	ExtraGraph = {
		labels: [
			'Team Member 1', 'Team Member 2', 'Team Member 3', 'Team Member 4'
		],
		datasets: [
			{
				backgroundColor: ['rgba(251,200,23,0.5)' , 'rgba(164,210,21,0.5)', 'rgba(139,46,144,0.5)', 'rgba(20,10,100,0.27)'],
				borderColor: ['rgba(251,200,23,0.75)', 'rgba(164,210,21,0.75)', 'rgba(139,46,144,0.75)', 'rgba(20,10,100,0.75)'],
				borderWidth: 2,
				data: [arrayE[0], arrayE[1], arrayE[2], arrayE[3]]
			}
		]
	}

	console.log("\n");
	// Run basic data comparison and print
	printDetails("Conscientousness", arrayC);
	printDetails("Agreeableness", arrayA);
	printDetails("Neuroticism", arrayN);
	printDetails("Openness to experience", arrayO);
	printDetails("Extraversion", arrayE);

}
var stringoutput = [];

function printDetails(domain, workingArray) {
	let smallestIndexArray = [];
	let largestIndexArray = [];
	let difference = 0;
	let totalScore = 0;
	let teamAvg = 0;
	let teamAverageText = "";
	console.log("Team " + domain + " scores: " + workingArray);
	// Find which members of the team have the lowest score
	smallestIndexArray = findIndex.smallest({ array: workingArray });
	let smallestIndex = smallestIndexArray[0];
	// Print this information out in human readable form
	console.log(formatDomainString(smallestIndexArray, "lowest", domain));
	// Find which members of the team have the highest score
	largestIndexArray = findIndex.largest({ array: workingArray });
	let largestIndex = largestIndexArray[0];
	// Print this information out in human readable form
	console.log(formatDomainString(largestIndexArray, "highest", domain));
	difference = workingArray[largestIndex] - workingArray[smallestIndex];
	console.log(
		"The difference between the largest and smallest " +
			domain +
			" score is " +
			difference
	);
	totalScore = workingArray.reduce(myFunc);
	teamAvg = Math.round(totalScore / workingArray.length);
	teamAverageText = findStdDeviation(
		teamAvg,
		averageData[domain[0]].Average,
		averageData[domain[0]].StdDist
	);
	console.log(
		`The team's average score for ${domain} is ${teamAvg}. \nCompared to the average score for ${domain}, this is ${teamAverageText}`
	);
	
	console.log(
		"\n-------------------------------------------------------------------------"
  );

  // format HTML output 
 stringoutput.push(`Team ${domain} scores: ${workingArray} ${formatDomainString(smallestIndexArray, "lowest", domain)} ${formatDomainString(largestIndexArray, "highest", domain)} 
		"The difference between the largest and smallest "
		${domain} 
		" score is " 
		${difference} The team's average score for ${domain} is ${teamAvg}. Compared to the average score for ${domain}, this is ${teamAverageText} 
 `)
    
}

function myFunc(total, num) {
	return total + num;
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


export default class App extends React.Component {
 render() {
  return (
   <div>
      <Radar
         data={teamRadarGraph}
         options={{
            title:{
            display:true,
            text:'Team ' + teamNumber,
            fontSize:15
            },
    	    legend:{
            display:true,
            position:'right'
           }
        }}
      />
	  <br></br>
	  <h2>Team Members Scores</h2>
	  <div className="outcomes">
		  {teammemberscores.map((score, index) =>{
			  const values = carraystringtest[index]
			  return(
				  <div>
					<div className="Score">
						<a>{score}</a>
					</div>
				  </div>
			  )
		  })}
	  </div>
	  <h1>Conscientousness</h1>
	  <p><i>Conscientiousness is a fundamental personality trait—one of the Big Five—that reflects the tendency to be responsible, organized, hard-working, goal-directed, and to adhere to norms and rules.
		  Like the other core personality factors, it has multiple facets; conscientiousness comprises self-control, industriousness, responsibility, and reliability. <br></br>  <br></br>
		  
		  A conscientious person is good at self-regulation and impulse control. this trait influences whether you will set and keep long-range goals,
		  delibertate over choices, behave cautiously or implusively, and take obligations seriously. Conscientousness is generally a key ingredient for success.

		  </i></p>
	  <HorizontalBar
		  data={conGraph}
		  options={{
            title:{
            display:true,
            text: "Team Conscientousness Scores",
            fontSize:15
            },
    	    legend:{
            display:false,
            position:'right'
           }
        }}
	  />
		<br></br>
		<br></br>
		<p>{stringoutput[0]}</p>
		<br></br>
		<br></br>
		<br></br>
		<h1>Agreeableness</h1>
		<p><i>Is a personality trait that can be described as cooperative, polite, kind and friendly. People high in Agreeableness are more trusting, affectionate, altruistic, and generally displaying
			more prosocial behaviours than others. People high in this prosocial trait are particularly empathethic, showing great concern for the welfare of others, they are the first to help those in need</i></p>
	 <HorizontalBar
		  data={AgreeGraph}
		  options={{
            title:{
            display:true,
            text: "Agreeableness",
            fontSize:15
            },
    	    legend:{
            display:false,
            position:'right'
           }
        }}
	  />
	  	<br></br>
		<br></br>
		<p>{stringoutput[1]}</p>
		<br></br>
		<br></br>
		<br></br>
		<h1>Neuroticism</h1>
		<p><i>Is typically defined as a tendincy towards anxiety, depression, self-doubt, and other negative feelings. All personality traits including neuroticism, exist on a specturm - some poeple are just more neurotic than others.
			In the context of the Big 5, neuroticism is sometimes described as low emotional stability or negative emotionality</i></p>
	 <HorizontalBar
		  data={NeuroGraph}
		  options={{
            title:{
            display:true,
            text: "Neuroticism",
            fontSize:15
            },
    	    legend:{
            display:false,
            position:'right'
           }
        }}
	  />
	  	<br></br>
		<br></br>
		<p>{stringoutput[2]}</p>
		<br></br>
		<br></br>
		<br></br>
		<h1>Openness</h1>
		<p><i>Openness to experience, or simply openness, is a basic personality trait denoting receptivity to new ideas and new experiences. People with high levels of openness are more likely to seek out a variety of experineces,
			be comfortable with the unfamilar, and pay attention to their inner feelings more than those who are less open to novelty. 
			they tend to exhibit high levels of curiousity and often enjoy being surprised. People with low levels of openness prefer familiar routines, people, and ideas; they can be perceived as closed-minded</i></p>
	 <HorizontalBar
		  data={OpenGraph}
		  options={{
            title:{
            display:true,
            text: "Openness",
            fontSize:15
            },
    	    legend:{
            display:false,
            position:'right'
           }
        }}
	  />
	  	<br></br>
		<br></br>
		<p>{stringoutput[3]}</p>
		<br></br>
		<br></br>
		<br></br>
		<h1>Extraversion</h1>
		<p><i>Extraversion is a personality trait typically characterised by outgoingness, high energy, and/or talkativeness.
			In general, the terms refers to a state of being where someone "recharges", or draws energy, from being with others people;
			the opposite - Drawing energy from being alone - is known as intoversion</i></p>
		<div>
	 	<HorizontalBar
		  data={ExtraGraph}
		  width={"30%"}
		  height={"150%"}
		  options={{
            title:{
            display:true,
            text: "Extraversion",
            fontSize:15
            },
    	    legend:{
            display:false,
            position:'right'
		   },
		   maintainAspectRatio: false
        }}
	  />
	  </div>
	  	<br></br>
		<br></br>
		<p>{stringoutput[4]}</p>
		<br></br>
		<br></br>
		<br></br>
	</div>
    );
 }
}