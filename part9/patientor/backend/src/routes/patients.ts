import express from 'express';
import { getPatients, getPublicPatients, addPatient, addEntry }
	from '../services/patientService';
import validateNewPatient from '../utils/patientUtils';
import validateNewEntry from '../utils/entryUtils';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(getPublicPatients());
});

router.get('/:id', (req, res) => {
	const patients = getPatients();
	const patient = patients.find(p => p.id === req.params.id);
	res.json(patient);
});

router.post('/', (req, res) => {
	try {
		const newPatient = validateNewPatient(req.body);
		const result = addPatient(newPatient);
		res.json(result);
	} catch (e) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		res.status(400).send(e.message);
	}

});

router.post('/:id/entries', (req, res) => {
	try {
		const newEntry = validateNewEntry(req.body);
		const result = addEntry(req.params.id, newEntry);
		res.json(result);
	} catch (e) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		res.status(400).send(e.message);
	}

});

export default router;
