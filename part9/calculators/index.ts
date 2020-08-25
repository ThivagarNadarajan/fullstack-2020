/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { calculateBmi } from './bmiCalculator';
import { ExerciseValues, calculateExercise } from './exerciseCalculator';

import express from 'express';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
	res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
	const height = Number(req.query.height);
	const weight = Number(req.query.weight);

	if (!isNaN(height) && !isNaN(weight)) {
		res.json({ height, weight, bmi: calculateBmi(height, weight) });
	} else {
		res.json({ error: 'Malformatted parameters!' });
	}
});

app.post('/exercises', (req, res) => {
	const body: ExerciseValues = req.body;

	const dailyHours: Array<number> = body.dailyHours;
	const targetHours: number = body.targetHours;
	if (!(dailyHours && targetHours)) res.json({ error: "Parameters missing" });

	if (isNaN(Number(targetHours))) res.json({ error: "Malformatted parameters" });
	if (Array.isArray(dailyHours)) {
		dailyHours.forEach(hours => {
			if (isNaN(Number(hours))) res.json({ error: "Malformatted parameters" });
		});
	} else {
		res.json({ error: "Malformatted parameters" });
	}

	res.json(calculateExercise(dailyHours, targetHours));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));