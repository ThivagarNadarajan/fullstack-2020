import diagnoses from '../data/diagnoses';
import { Diagnosis } from '../types';

export const getDiagnoses = (): Array<Diagnosis> => {
	return diagnoses;
};