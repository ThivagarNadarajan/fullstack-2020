import express from 'express';
import { getSecurePatients } from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(getSecurePatients());
});

export default router;
