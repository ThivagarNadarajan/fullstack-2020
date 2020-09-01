import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { useStateValue } from "../state";
import {
	TextField, NumberField, SelectField, HealthCheckOptions, DiagnosisSelection
}
	from "./FormField";
import { HealthCheckRating, NewEntry } from "../types";

export type EntryFormValues = NewEntry;

interface Props {
	onSubmit: (values: EntryFormValues) => void;
	onCancel: () => void;
}

const healthCheckOptions: HealthCheckOptions[] = [
	{ value: HealthCheckRating.Healthy, label: "Healthy" },
	{ value: HealthCheckRating.LowRisk, label: "Low Risk" },
	{ value: HealthCheckRating.HighRisk, label: "High Risk" },
	{ value: HealthCheckRating.CriticalRisk, label: "Critical Risk" }
];

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
	const [{ diagnoses, }] = useStateValue();

	return (
		<Formik
			initialValues={{
				type: "HealthCheck",
				specialist: "",
				date: "",
				description: "",
				diagnosisCodes: [],
				healthCheckRating: 0
			}}
			onSubmit={onSubmit}
			validate={values => {
				const requiredError = "Field is required";
				const errors: { [field: string]: string } = {};
				if (!values.specialist) {
					errors.name = requiredError;
				}
				if (!values.description) {
					errors.ssn = requiredError;
				}
				if (!values.date) {
					errors.dateOfBirth = requiredError;
				}
				return errors;
			}}
		>
			{({ isValid, dirty, setFieldValue, setFieldTouched }) => {
				return (
					<Form className="form ui">
						<Field
							label="Specialist"
							placeholder="Specialist"
							name="specialist"
							component={TextField}
						/>
						<Field
							label="Date"
							placeholder="YYYY-MM-DD"
							name="date"
							component={TextField}
						/>
						<Field
							label="Description"
							placeholder="Description"
							name="description"
							component={TextField}
						/>
						<DiagnosisSelection
							setFieldValue={setFieldValue}
							setFieldTouched={setFieldTouched}
							diagnoses={Object.values(diagnoses)}
						/>
						<Field
							label="Health Check Rating"
							name="healthCheckRating"
							component={NumberField}
							min={0}
							max={3}
						/>
						<Grid>
							<Grid.Column floated="left" width={5}>
								<Button type="button" onClick={onCancel} color="red">
									Cancel
                				</Button>
							</Grid.Column>
							<Grid.Column floated="right" width={5}>
								<Button
									type="submit"
									floated="right"
									color="green"
									disabled={!dirty || !isValid}>
									Add
                				</Button>
							</Grid.Column>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
};

export default AddEntryForm;
