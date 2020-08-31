import React from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { useStateValue } from "./state";
import { Patient, Diagnosis } from "./types";

import { setPatientList, setDiagnosisList } from './state/reducer';

import PatientList from "./PatientListPage";


const App: React.FC = () => {
	const [, dispatch] = useStateValue();

	React.useEffect(() => {
		axios.get<void>(`${apiBaseUrl}/ping`);

		const fetchPatientList = async () => {
			try {
				const { data: patientList } = await axios.get<Patient[]>(
					`${apiBaseUrl}/patients`
				);
				dispatch(setPatientList(patientList));
			} catch (e) {
				console.error(e);
			}
		};

		const fetchDiagnosisList = async () => {
			try {
				const { data: diagnosisList } = await axios.get<Diagnosis[]>(
					`${apiBaseUrl}/diagnoses`
				);
				dispatch(setDiagnosisList(diagnosisList));
			} catch (e) {
				console.error(e);
			}
		};

		fetchPatientList();
		fetchDiagnosisList();
	}, [dispatch]);

	return (
		<div className="App">
			<Router>
				<Container>
					<Header as="h1">Patientor</Header>
					<Button as={Link} to="/" primary>
						Home
          </Button>
					<Divider hidden />
					<Switch>
						<Route path="/" render={() => <PatientList />} />
					</Switch>
				</Container>
			</Router>
		</div>
	);
};

export default App;
