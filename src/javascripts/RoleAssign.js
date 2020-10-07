// import * as R from "ramda";
//const R = require("ramda");

module.exports = (Team, SetRoles, Data) => {
	let localTeam = Team;
	let takenIndicies = [];
	// When do I finish? Team is 0
	// Assign each member to their highest remaining domain, starting with the lowest
	// Call function again with updated team/roles
	let arrayC = [];
	let arrayA = [];
	let arrayN = [];
	let arrayO = [];
	let arrayE = [];

	let exportedRoles = SetRoles;
	// What gaps still exist?

	// Remove pre-set members from array
	for (const [key, value] of Object.entries(SetRoles)) {
		let currentName = value.val;
		for (let i = 0; i < localTeam.length; i++) {
			if (localTeam[i].name === currentName) {
				localTeam.splice(i, 1);
				let roleIndex = value.index;
				takenIndicies.push(roleIndex);
				// for (let a = 0; a < localTeam.length; a++) {
				// 	let currentMember = localTeam[a];
				// 	currentMember.scores.splice(roleIndex, 1);
				// }
				break;
			}
		}
	}

	console.log(takenIndicies);
	// localTeam.forEach((member) => {
	// 	arrayC.push({ name: member.name, value: member.scores[0] });
	// 	arrayA.push({ name: member.name, value: member.scores[1] });
	// 	arrayN.push({ name: member.name, value: member.scores[2] });
	// 	arrayO.push({ name: member.name, value: member.scores[3] });
	// 	arrayE.push({ name: member.name, value: member.scores[4] });
	// });

	let bestPossible = recAssignRoles(localTeam, SetRoles, takenIndicies);
	console.log(bestPossible);
	return { Team, SetRoles };
};

function recAssignRoles(remainingTeam, SetRoles, takenIndicies) {
	// let cpyTakenIndicies = deepCopyFunction(takenIndicies);
	// let cpySetRoles = deepCopyFunction(SetRoles);
	// console.log(remainingTeam);
	// console.log(cpyTakenIndicies);
	// // console.log(cpySetRoles);

	remainingTeam.forEach(function (member, index, object) {
		let foundSlot = false;
		let tempScore = 0;
		let tempIter = 0;
		for (let i = 0; i < member.scores.length; i++) {
			let currentScore = member.scores[i];
			if (currentScore > tempScore && !takenIndicies.includes(i)) {
				console.log(member);
				tempScore = currentScore;
				tempIter = i;
				foundSlot = true;
			}
		}
		if (foundSlot) {
			takenIndicies.push(tempIter);
		}
		for (const [key, value] of Object.entries(SetRoles)) {
			if (value.index === tempIter) {
				SetRoles[key].val = member.name;
				SetRoles[key].total = tempScore;
				break;
			}
		}
	});

	console.log(SetRoles);
	// Which roles are still available?
	// What are each person's best remaining slot?
}

const deepCopyFunction = (inObject) => {
	let outObject, value, key;

	if (typeof inObject !== "object" || inObject === null) {
		return inObject; // Return the value if inObject is not an object
	}

	// Create an array or object to hold the values
	outObject = Array.isArray(inObject) ? [] : {};

	for (key in inObject) {
		value = inObject[key];

		// Recursively (deep) copy for nested objects, including arrays
		outObject[key] = deepCopyFunction(value);
	}

	return outObject;
};
