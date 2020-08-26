/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NewPatient, Gender } from './types';

const validateNewPatient = (object: any): NewPatient => {
	const newPatient = {
		name: parseName(object.name),
		dateOfBirth: parseDateOfBirth(object.dateOfBirth),
		ssn: parseSSN(object.ssn),
		gender: parseGender(object.gender),
		occupation: parseOccupation(object.occupation)
	};
	return newPatient;
};

const parseName = (name: any): string => {
	if (!name || !isString(name)) {
		throw new Error("Invalid/missing name field");
	}
	return name;
};

const parseDateOfBirth = (dob: any): string => {
	if (!dob || !isString(dob)) {
		throw new Error("Invalid/missing date of birth field");
	}
	return dob;
};

const parseSSN = (ssn: any): string => {
	if (!ssn || !isString(ssn)) {
		throw new Error("Invalid/missing SSN field");
	}
	return ssn;
};

const parseOccupation = (occupation: any): string => {
	if (!occupation || !isString(occupation)) {
		throw new Error("Invalid/missing occupation field");
	}
	return occupation;
};

const parseGender = (gender: any): string => {
	if (!gender || !isString(gender) || !isGender(gender)) {
		throw new Error("Invalid/missing gender field");
	}
	return gender;
};


const isString = (str: any): str is string => {
	return typeof str === 'string' || str instanceof String;
};

const isGender = (param: any): param is Gender => {
	return Object.values(Gender).includes(param);
};

export default validateNewPatient;
