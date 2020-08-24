interface ExerciseValues {
	dailyHours: Array<number>,
	targetHours: number
}

interface Result {
	periodLength: number,
	trainingDays: number,
	success: boolean,
	rating: number,
	description: String,
	target: number,
	average: number
}

const calculateExercise = (dailyHours: Array<number>, targetHours: number): Result => {
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

const parseExerciseArgs = (args: Array<string>): ExerciseValues => {
	if (args.length < 2) {
		throw new Error('Usage: npm run exerciseCalculator <target> <day1> [day2] [day3]...');
	}

	let dailyHours: Array<number> = [];
	let targetHours: number = Number(args[2]);
	for (let i = 2; i < args.length; i++) {
		if (!isNaN(Number(args[i]))) {
			if (i === 2) continue;
			else dailyHours = dailyHours.concat(Number(args[i]));
		} else {
			throw new Error('Provided values were not numbers!');
		}
	}

	return {
		dailyHours,
		targetHours
	}
}

const runExerciseCalculator = () => {
	try {
		const { dailyHours, targetHours } = parseExerciseArgs(process.argv);
		console.log(calculateExercise(dailyHours, targetHours));
	} catch (e) {
		console.log("Error:", e.message);
	}
}

export default runExerciseCalculator;
