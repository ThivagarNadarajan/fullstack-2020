import express from 'express';
import { getSecurePatients, addPatient } from '../services/patientService';
import validateNewPatient from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(getSecurePatients());
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

export default router;
