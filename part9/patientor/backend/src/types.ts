export enum Gender {
	Male = 'male',
	Female = 'female',
	Other = 'other'
}

export enum HealthCheckRating {
	"Healthy" = 0,
	"LowRisk" = 1,
	"HighRisk" = 2,
	"CriticalRisk" = 3
}

export interface Discharge {
	date: string;
	criteria: string;
}

export interface SickLeave {
	startDate: string;
	endDate: string;
}

export interface BaseEntry {
	id: string;
	description: string;
	date: string;
	specialist: string;
	diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum EntryType {
	Health = "HealthCheck",
	Hospital = "Hospital",
	Occupational = "OccupationalHealthcare"
}

export interface HealthCheckEntry extends BaseEntry {
	type: "HealthCheck";
	healthCheckRating: HealthCheckRating;
}
export type NewHealthCheckEntry = Omit<HealthCheckEntry, 'id'>;

export interface HospitalEntry extends BaseEntry {
	type: "Hospital";
	discharge: Discharge;
}
export type NewHospitalEntry = Omit<HospitalEntry, 'id'>;

export interface OccupationalEntry extends BaseEntry {
	type: "OccupationalHealthcare";
	employerName: string;
	sickLeave?: SickLeave;
}
export type NewOccupationalEntry = Omit<OccupationalEntry, 'id'>;

export type Entry = HealthCheckEntry | HospitalEntry | OccupationalEntry;
export type NewEntry = NewHealthCheckEntry | NewHospitalEntry | NewOccupationalEntry;
export type NewBaseEntry = Omit<BaseEntry, 'id'>;


export interface Diagnosis {
	code: string,
	name: string,
	latin?: string
}

export interface Patient {
	id: string,
	name: string,
	dateOfBirth: string,
	ssn: string,
	gender: Gender,
	occupation: string,
	entries: Entry[]
}

export type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;
export type SecurePatient = Omit<Patient, 'ssn'>;
export type NewPatient = Omit<Patient, 'id'>;