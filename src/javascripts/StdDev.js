module.exports = (Score, Average, StdDist) => {
	let StdDev = StdDist;
	let score = Score;
	let avg = Average;
	let deviationsAway = 0;

	if (score <= avg) {
		// Find how many standard deviations below the average this score is
		for (let i = 0; i < 5; i++) {
			let temp = avg - i * StdDev;
			if (temp < score) {
				break;
			} else {
				deviationsAway = -i;
			}
		}
	} else {
		// Find how many standard deviations above the average this score is
		for (let i = 0; i < 5; i++) {
			let temp = avg + i * StdDev;
			if (temp > score) {
				break;
			} else {
				deviationsAway = i;
			}
		}
	}

	if (deviationsAway < 0) {
		return "low";
	} else if (deviationsAway > 0) {
		return "high";
	} else {
		return "neutral";
	}
};
