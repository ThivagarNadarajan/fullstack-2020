import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField, SelectField, HealthCheckOptions } from "./FormField";
import { HealthCheckRating, Entry, NewEntry } from "../types";

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
	return (
		<Formik
			initialValues={{
				type: "HealthCheck",
				specialist: "",
				date: "",
				description: "",
				healthCheckRating: HealthCheckRating.Healthy
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
			{({ isValid, dirty }) => {
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
						<SelectField
							label="Health Check Rating"
							name="healthCheckRating"
							options={healthCheckOptions}
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
