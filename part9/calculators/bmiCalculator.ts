const calculateBmi = (height: number, weight: number): String => {
	const metreHeight = height / 100;
	const bmi = weight / (metreHeight * metreHeight);
	if (bmi > 18.5 && bmi < 25) return "Normal (healthy weight)";
	else if (bmi <= 18.5) return "Underweight";
	else return "Overweight";
}

console.log(calculateBmi(180, 74));

