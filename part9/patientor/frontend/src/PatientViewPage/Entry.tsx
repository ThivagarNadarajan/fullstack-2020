import React from "react";

import { useStateValue } from "../state";
import { Icon, Header } from "semantic-ui-react";
import { Entry } from '../types';

const EntryView: React.FC<{ entry: Entry }> = ({ entry }) => {
	const [{ diagnoses },] = useStateValue();
	let icon: "user" | "doctor" | "hospital" | "user times" = "user times";
	switch (entry.type) {
		case "OccupationalHealthcare":
			icon = "user";
			break;
		case "HealthCheck":
			icon = "doctor";
			break;
		case "Hospital":
			icon = "hospital";
			break;
		default:
			break;
	}

	return (
		<>
			<Header as="h3">
				<Icon name={icon}></Icon>
				{entry.date}
			</Header>
			<i>{entry.description}</i>
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
		</>
	);
}

export default EntryView;
