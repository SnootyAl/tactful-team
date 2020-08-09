// to install CSV to JSON: npm install csvtojson --save
const CSVtoJSON = require("csvtojson")
const FileSystem = require("fs")

// create an array for people that have been assigned a team number 
let teamarray = []

// take csv file and convert it to JSON
function csvtojson(){
    CSVtoJSON().fromFile("./Big-5-Data.csv").then(source => {
    FileSystem.writeFileSync("./Big-5-data.json", JSON.stringify(source));
})}

// import json file and tag persons with a team ID
function createTeam(){
    var personDATA = require("./Big-5-data.json")
    // outer for loop controls the teams, inner for loop controls the amount of people assigned to a team
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 4; j++){
            // tagging system: will take a person from the JSON file push it to the array, insert JSON key and Value, and remove itself 
            teamarray.push(Object.assign(personDATA.shift(), {team: i}))
        }
    }
}

// for testing purposes
function Teamloop(){
    for(let i = 0; i < 8; i++){
        console.log(teamarray.shift())
    }
}

function start(){
    // if Big-five-data.json is not in the folder comment out the last 2 functions and run, this will create the json file
    csvtojson();
    createTeam();
    Teamloop(); 
}

start();

