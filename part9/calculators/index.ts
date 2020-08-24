import { calculateBmi } from './bmiCalculator';

import express from 'express';
const app = express();

app.get('/hello', (_req, res) => {
	res.send('Hello Full Stack');
})

app.get('/bmi', (req, res) => {
	const height = Number(req.query.height);
	const weight = Number(req.query.weight);

	if (!isNaN(height) && !isNaN(weight)) {
		res.json({ height, weight, bmi: calculateBmi(height, weight) });
	} else {
		res.json({ error: 'Malformatted parameters!' });
	}
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));