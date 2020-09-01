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

import AddEntryModal from "../AddEntryModal";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";

const PatientView: React.FC = () => {
	const [{ patients, }, dispatch] = useStateValue();
	const { patientId } = useParams<{ patientId: string }>();

	const [modalOpen, setModalOpen] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | undefined>();

	const openModal = (): void => setModalOpen(true);
	const closeModal = (): void => {
		setModalOpen(false);
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
		}
	};

	const submitNewEntry = async (values: EntryFormValues) => {
		try {
			const { data: newEntry } = await axios.post<Entry>(
				`${apiBaseUrl}/patients/${patientId}/entries`,
				values
			);
			dispatch(addEntry({ id: patientId, entry: newEntry }));
			closeModal();
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
				<Button onClick={() => openModal()}>Add New Entry</Button>
				<Divider hidden />
				<AddEntryModal
					modalOpen={modalOpen}
					onSubmit={submitNewEntry}
					error={error}
					onClose={closeModal}
				/>
				{entries.map(entry => handleEntry(entry))}
			</div>
		);
	}

	return <div>...Loading</div>
};

export default PatientView;
