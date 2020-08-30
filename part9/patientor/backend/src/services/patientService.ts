import patients from '../data/patients';
import { Patient, PublicPatient, NewPatient, Entry, NewEntry } from '../types';

export const getPatients = (): Array<Patient> => {
	return patients;
};

export const getPublicPatients = (): PublicPatient[] => {
	return patients.map(patient => {
		return {
			id: patient.id,
			name: patient.name,
			dateOfBirth: patient.dateOfBirth,
			gender: patient.gender,
			occupation: patient.occupation
		};
	});
};

export const addPatient = (newPatient: NewPatient): Patient => {
	// Hardcoded ID, not randomly generated
	const patient = { id: "999", ...newPatient };

	patients.push(patient);
	return patient;
};

export const addEntry = (id: string, newEntry: NewEntry): Entry => {
	// Hardcoded ID, not randomly generated
	const entry = { id: "999", ...newEntry };

	const patient = patients.find(patient => patient.id === id);
	patient?.entries.push(entry);
	return entry;
};

