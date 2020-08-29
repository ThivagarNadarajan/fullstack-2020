import React from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Icon, Header } from "semantic-ui-react";
import { Entry } from '../types';

import { updatePatient } from '../state/reducer';

const PatientView: React.FC = () => {
	const [{ patients, diagnoses }, dispatch] = useStateValue();
	const { patientId } = useParams<{ patientId: string }>();

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

	const handleEntry = (entry: Entry) => {
		return (
			<div key={entry.id}>
				{entry.date} <i>{entry.description}</i>
				<ul>
					{entry.diagnosisCodes?.map(code => {
						const diagnosis = diagnoses[code];
						if (diagnosis) {
							return (<li key={code}>
								{diagnosis.code}: {diagnosis.name}
							</li>);
						}
					})}
				</ul>
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
				<Header as="h3">Entries</Header>
				{entries.map(entry => handleEntry(entry))}
			</div>
		);
	}

	return <div>...Loading</div>
};

export default PatientView;
