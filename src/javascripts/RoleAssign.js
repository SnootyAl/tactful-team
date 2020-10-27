module.exports = (Team, SetRoles, Data) => {
	let localTeam = Team;
	let takenIndicies = [];

	// Remove pre-set members from array
	for (const [key, value] of Object.entries(SetRoles)) {
		let currentName = value.val;
		for (let i = 0; i < localTeam.length; i++) {
			if (localTeam[i].name === currentName) {
				console.log(currentName);
				localTeam.splice(i, 1);
				let roleIndex = value.index;
				takenIndicies.push(roleIndex);
				SetRoles[key].set = currentName;
				console.log(SetRoles[key].set, roleIndex);
				console.log(SetRoles);
				break;
			}
		}
	}

	// Loop through SetRoles instead
	// Check that user[i]'s score is higher than previous, and that user[i] isn't already assigned a role?
	localTeam.forEach(function (member, index, object) {
		let foundSlot = false;
		let tempScore = 0;
		let tempIter = 0;
		for (let i = 0; i < member.scores.length; i++) {
			let currentScore = member.scores[i];
			//if (currentScore > tempScore && !takenIndicies.includes(i)) {
			if (currentScore > tempScore && !takenIndicies.includes(i)) {
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
				SetRoles[key].set = member.name;
				SetRoles[key].val = "";
				break;
			}
		}
	});

	let allCombinations = [];
	localTeam.forEach(function (member, index, object) {
		let tempMember = localTeam.splice(index, 1);
		tempMember.scores.forEach(function (score, scoreIndex, scoreObject) {
			
		})
	})
	// For each member in the remaining team
	// Pull member from remaining Team array
	// For each remaining domain
	// assign that to an object, containing domain index and member score
	// if either array is empty, we return





	return SetRoles;
};
