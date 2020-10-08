module.exports.smallest = (data) => {
	let a = data.array;
	let lowest = 100;
	let indicies = [];

	for (let i = 0; i < a.length; i++) {
		if (parseInt(a[i]) < lowest) {
			lowest = parseInt(a[i]);
			indicies = [];
			indicies.push(i);
		} else if (parseInt(a[i]) === lowest) {
			indicies.push(i);
		}
	}
	return indicies;
};

module.exports.largest = (data) => {
	let a = data.array;
	let highest = 0;
	let indicies = [];

	for (let i = 0; i < a.length; i++) {
		if (parseInt(a[i]) > highest) {
			highest = parseInt(a[i]);
			indicies = [];
			indicies.push(i);
		} else if (parseInt(a[i]) === highest) {
			indicies.push(i);
		}
	}
	return indicies;
};
