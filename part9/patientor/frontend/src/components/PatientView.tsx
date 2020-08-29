import React from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Icon, Header } from "semantic-ui-react";

import { updatePatient } from '../state/reducer';

const PatientView: React.FC = () => {
	const [{ patients }, dispatch] = useStateValue();
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

	if (patients[patientId]) {
		if (patients[patientId].ssn === undefined) findPatient();
		let patient = patients[patientId];
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
				{`Occupation: ${patient.occupation}`}
			</div>
		);
	}

	return <div>...Loading</div>
};

export default PatientView;
