interface Result {
	periodLength: number,
	trainingDays: number,
	success: boolean,
	rating: number,
	description: String,
	target: number,
	average: number
}


const exerciseCalculator = (dailyHours: Array<number>, targetHours: number): Result => {
	const periodLength = dailyHours.length;
	let trainingDays = 0;
	let totalHours = 0;
	dailyHours.forEach(hours => {
		totalHours += hours;
		hours > 0 ? trainingDays++ : null;
	});

	const average = totalHours / periodLength;

	let success = false;
	let rating = 1;
	let description = "Unsatisfactory: Far from meeting target";

	if (average >= targetHours) {
		success = true;
		rating = 3;
		description = "Perfect: Met the target";
	}
	else if (average >= targetHours / 2) {
		rating = 2;
		description = "Average: Close to meeting target";
	}

	return {
		periodLength,
		trainingDays,
		success,
		rating,
		description,
		target: targetHours,
		average
	};
}

console.log(exerciseCalculator([3, 0, 2, 4.5, 0, 3, 1], 2));