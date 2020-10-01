module.exports.Radar = (dataset, team) => {
	const arrayC = dataset[0];
	const arrayA = dataset[1];
	const arrayN = dataset[2];
	const arrayO = dataset[3];
	const arrayE = dataset[4];
	let tempDataSets = [];
	for (let i = 0; i < team.length; i++) {
		let tempDataSet = {
			label: team[i].name,
			backgroundColor: `rgba(${team[i].colour[0]},${team[i].colour[1]},${team[i].colour[2]}, 0.5`,
			borderColor: `rgba(${team[i].colour[0]},${team[i].colour[1]},${team[i].colour[2]}, 0.75`,
			borderWidth: 2,
			data: [arrayC[i], arrayA[i], arrayN[i], arrayO[i], arrayE[i]],
		};
		tempDataSets.push(tempDataSet);
	}

	return {
		labels: [
			"Conscientousness",
			"Agreeableness",
			"Neuroticism",
			"Openness to experience",
			"Extraversion",
		],
		datasets: tempDataSets,
	};
};

module.exports.Bar = (dataset, team) => {
	let tempLabels = [];
	let tempDataSets = [
		{
			backgroundColor: [],
			borderColor: [],
			borderWidth: 2,
			data: dataset,
			maxBarThickness: 30,
		},
	];
	for (let i = 0; i < team.length; i++) {
		tempLabels.push(team[i].name);
		tempDataSets[0].backgroundColor[
			i
		] = `rgba(${team[i].colour[0]},${team[i].colour[1]},${team[i].colour[2]}, 0.5`;
		tempDataSets[0].borderColor[
			i
		] = `rgba(${team[i].colour[0]},${team[i].colour[1]},${team[i].colour[2]}, 0.75`;
	}

	return {
		labels: tempLabels,
		datasets: tempDataSets,
	};
};
