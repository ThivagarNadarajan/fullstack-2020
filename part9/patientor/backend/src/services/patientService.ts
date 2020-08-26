import patients from '../data/patients';
import { Patient, SecurePatient, NewPatient } from '../types';


export const getPatients = (): Array<Patient> => {
	return patients;
};

export const getSecurePatients = (): SecurePatient[] => {
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
	const patient = { id: "999", ...newPatient };
	patients.push(patient);
	return patient;
};