interface BmiValues {
	height: number,
	weight: number
}

export const calculateBmi = (height: number, weight: number): string => {
	const metreHeight = height / 100;
	const bmi = weight / (metreHeight * metreHeight);
	if (bmi > 18.5 && bmi < 25) return "Normal (healthy weight)";
	else if (bmi <= 18.5) return "Underweight";
	else return "Overweight";
};

const parseBmiArgs = (args: Array<string>): BmiValues => {
	if (args.length !== 4) throw new Error('Usage: npm run bmiCalculator <height> <weight>');
	if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
		return {
			height: Number(args[2]),
			weight: Number(args[3])
		};
	} else {
		throw new Error('Provided values were not numbers!');
	}
};

const runBmiCalculator = (): void => {
	try {
		const { height, weight } = parseBmiArgs(process.argv);
		console.log(calculateBmi(height, weight));
	} catch (e) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		console.log("Error:", e.message);
	}
};

export default runBmiCalculator;


