export interface Diagnosis {
	code: string;
	name: string;
	latin?: string;
}

export enum Gender {
	Male = "male",
	Female = "female",
	Other = "other"
}

export enum HealthCheckRating {
	"Healthy" = 0,
	"LowRisk" = 1,
	"HighRisk" = 2,
	"CriticalRisk" = 3
}

interface Discharge {
	date: string;
	criteria: string;
}

export interface SickLeave {
	startDate: string;
	endDate: string;
}

interface BaseEntry {
	id: string;
	description: string;
	date: string;
	specialist: string;
	diagnosisCodes?: Array<Diagnosis['code']>;
}

interface HealthCheckEntry extends BaseEntry {
	type: "HealthCheck";
	healthCheckRating: HealthCheckRating;
}
export type NewHealthCheckEntry = Omit<HealthCheckEntry, 'id'>;

interface HospitalEntry extends BaseEntry {
	type: "Hospital";
	discharge: Discharge;
}
export type NewHospitalEntry = Omit<HospitalEntry, 'id'>;

interface OccupationalEntry extends BaseEntry {
	type: "OccupationalHealthcare";
	employerName: string;
	sickLeave?: SickLeave;
}
export type NewOccupationalEntry = Omit<OccupationalEntry, 'id'>;

export type Entry = HealthCheckEntry | HospitalEntry | OccupationalEntry;
export type EntryFormValues = NewHealthCheckEntry | NewHospitalEntry | NewOccupationalEntry;

export interface Patient {
	id: string;
	name: string;
	occupation: string;
	gender: Gender;
	ssn?: string;
	dateOfBirth?: string;
	entries: Entry[];
}
