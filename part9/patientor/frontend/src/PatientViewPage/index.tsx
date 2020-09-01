import React from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

import { Button, Divider } from "semantic-ui-react";
import EntryView from './Entry';
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Icon, Header } from "semantic-ui-react";
import { Entry } from '../types';

import { updatePatient, addEntry } from '../state/reducer';

import EntryModal from "../AddEntryModal";
import { EntryFormValues } from "../types";

const HealthCheckEntryModal = EntryModal.HealthCheckEntryModal;
const OccupationalEntryModal = EntryModal.OccupationalEntryModal;
const HospitalEntryModal = EntryModal.HospitalEntryModal;

const PatientView: React.FC = () => {
	const [{ patients, }, dispatch] = useStateValue();
	const { patientId } = useParams<{ patientId: string }>();

	const [healthCheckModalOpen, setHealthCheckModalOpen] = React.useState<boolean>(false);
	const [occupationalModalOpen, setOccupationalModalOpen] = React.useState<boolean>(false);
	const [hospitalModalOpen, setHospitalModalOpen] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | undefined>();

	const openHealthCheckModal = (): void => setHealthCheckModalOpen(true);
	const closeHealthCheckModal = (): void => {
		setHealthCheckModalOpen(false);
		setError(undefined);
	};

	const openOccupationalModal = (): void => setOccupationalModalOpen(true);
	const closeOccupationalModal = (): void => {
		setOccupationalModalOpen(false);
		setError(undefined);
	};

	const openHospitalModal = (): void => setHospitalModalOpen(true);
	const closeHospitalModal = (): void => {
		setHospitalModalOpen(false);
		setError(undefined);
	};

	const findPatient = async () => {
		try {
			const { data: patient } = await axios.get(
				`${apiBaseUrl}/patients/${patientId}`
			);
			dispatch(updatePatient(patient));
		} catch (e) {
			console.error(e.response.data);
			setError(e.response.data.error);
		}
	};

	const submitNewEntry = async (values: EntryFormValues) => {
		try {
			const { data: newEntry } = await axios.post<Entry>(
				`${apiBaseUrl}/patients/${patientId}/entries`,
				values
			);
			dispatch(addEntry({ id: patientId, entry: newEntry }));
			closeHealthCheckModal();
			closeOccupationalModal();
			closeHospitalModal();
		} catch (e) {
			console.error(e.response.data);
			setError(e.response.data.error);
		}
	};

	const handleEntry = (entry: Entry) => {
		const style = {
			border: "1px solid",
			padding: "1rem"
		}
		return (
			<div key={entry.id} style={style}>
				<EntryView entry={entry} />
			</div>
		);
	}

	if (patients[patientId]) {
		if (patients[patientId].ssn === undefined) findPatient();
		let patient = patients[patientId];

		let entries: Entry[] = [];
		if (patient.entries !== undefined) entries = patient.entries;

		let gender: "mars" | "venus" | "neuter";
		if (patient.gender === "male") gender = "mars";
		else if (patient.gender === "female") gender = "venus";
		else gender = "neuter"

		return (
			<div>
				<Header as="h2">
					{patient.name}
					<Icon name={gender}></Icon>
				</Header>

				{`SSN: ${patient.ssn}`}
				<br />
				{`Date of Birth: ${patient.dateOfBirth}`}
				<br />
				{`Occupation: ${patient.occupation}`}
				<br />
				<Header as="h2">Entries</Header>
				<Button onClick={() => openHealthCheckModal()}>Add Health Check Entry</Button>
				<Button onClick={() => openOccupationalModal()}>Add Occupational Entry</Button>
				<Button onClick={() => openHospitalModal()}>Add Hospital Entry</Button>
				<Divider hidden />
				<HealthCheckEntryModal
					modalOpen={healthCheckModalOpen}
					onSubmit={submitNewEntry}
					error={error}
					onClose={closeHealthCheckModal}
				/>
				<OccupationalEntryModal
					modalOpen={occupationalModalOpen}
					onSubmit={submitNewEntry}
					error={error}
					onClose={closeOccupationalModal}
				/>
				<HospitalEntryModal
					modalOpen={hospitalModalOpen}
					onSubmit={submitNewEntry}
					error={error}
					onClose={closeHospitalModal}
				/>
				{entries.map(entry => handleEntry(entry))}
			</div>
		);
	}

	return <div>...Loading</div>
};

export default PatientView;
