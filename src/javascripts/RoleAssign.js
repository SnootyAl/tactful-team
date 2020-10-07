module.exports = (Team, SetRoles, Data) => {
	let localTeam = Team;
	let takenIndicies = [];

	// Remove pre-set members from array
	for (const [key, value] of Object.entries(SetRoles)) {
		let currentName = value.val;
		for (let i = 0; i < localTeam.length; i++) {
			if (localTeam[i].name === currentName) {
				localTeam.splice(i, 1);
				let roleIndex = value.index;
				takenIndicies.push(roleIndex);
				SetRoles[key].set = currentName;
				break;
			}
		}
	}

	localTeam.forEach(function (member, index, object) {
		let foundSlot = false;
		let tempScore = 0;
		let tempIter = 0;
		for (let i = 0; i < member.scores.length; i++) {
			let currentScore = member.scores[i];
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

	return SetRoles;
};
