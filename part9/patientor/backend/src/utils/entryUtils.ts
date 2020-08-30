/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
	NewEntry, EntryType, NewBaseEntry,
	SickLeave, Discharge, HealthCheckRating
}
	from '../types';


const validateNewEntry = (object: any): NewEntry => {
	console.log(object);
	const baseEntry = {
		description: parse(object.description),
		date: parse(object.date),
		specialist: parse(object.specialist),
		diagnosisCodes: parseCodes(object.diagnosisCodes),
	};

	const entryType = parseEntryType(object.type);

	switch (entryType) {
		case EntryType.Health:
			return parseHealthCheckEntry(baseEntry, object);
		case EntryType.Hospital:
			return parseHospitalEntry(baseEntry, object);
		case EntryType.Occupational:
			return parseOccupationalEntry(baseEntry, object);
		default:
			throw new Error("Invalid/missing type");
	}
};

/* All base entry parsing utilities */
const parseCodes = (codes: any[]): string[] => {
	if (!codes || !isStringArray(codes)) {
		throw new Error("Invalid/missing diagnosis codes");
	}
	return codes;
};

const parseEntryType = (type: any): EntryType => {
	if (!type || !isString(type) || !isEntryType(type)) {
		throw new Error("Invalid/missing entry type");
	}
	return type;
};

const isStringArray = (arr: any[]): arr is string[] => {
	return arr.length === 0 || isString(arr[0]);
};

const isEntryType = (type: any): type is EntryType => {
	return Object.values(EntryType).includes(type);
};

/* HealthCheckEntry parsing */
const parseHealthCheckEntry = (baseEntry: NewBaseEntry, object: any): NewEntry => {
	return {
		type: "HealthCheck",
		...baseEntry,
		healthCheckRating: parseHealthCheckRating(object.rating)
	};
};

const parseHealthCheckRating = (rating: any): HealthCheckRating => {
	if (!rating || !isHealthCheckRating(rating) || isNaN(rating)) {
		throw new Error("Invalid/missing rating");
	}
	return rating;
};

const isHealthCheckRating = (rating: any): rating is HealthCheckRating => {
	return Object.values(HealthCheckRating).includes(rating);
};

/* All OccupationalEntry parsing */
const parseOccupationalEntry = (baseEntry: NewBaseEntry, object: any): NewEntry => {
	let sickLeave;
	if (object.sickLeave) {
		sickLeave = parseSickLeave(object.sickLeave);
	}

	return {
		type: "OccupationalHealthcare",
		...baseEntry,
		employerName: parse(object.employerName),
		sickLeave
	};
};

const parseSickLeave = (object: any): SickLeave => {
	return {
		startDate: parse(object.startDate),
		endDate: parse(object.endDate),
	};
};

/* All HospitalEntry parsing */
const parseHospitalEntry = (baseEntry: NewBaseEntry, object: any): NewEntry => {
	return {
		type: "Hospital",
		...baseEntry,
		discharge: parseDischarge(object.discharge)
	};
};

const parseDischarge = (object: any): Discharge => {
	if (!object || !object.date || !object.criteria) {
		throw new Error("Invalid/missing discharge field(s)");
	}

	return {
		date: parse(object.date),
		criteria: parse(object.criteria),
	};
};

/* All common parsing utilities */
const parse = (str: any): string => {
	if (!str || !isString(str)) {
		throw new Error("Invalid/missing field");
	}
	return str;
};

const isString = (str: any): str is string => {
	return typeof str === 'string' || str instanceof String;
};


export default validateNewEntry;
