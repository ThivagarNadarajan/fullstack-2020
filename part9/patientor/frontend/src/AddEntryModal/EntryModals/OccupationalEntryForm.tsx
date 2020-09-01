import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { useStateValue } from "../../state";
import { TextField, DiagnosisSelection } from "../FormField";
import { NewOccupationalEntry } from "../../types";

interface Props {
	onSubmit: (values: NewOccupationalEntry) => void;
	onCancel: () => void;
}

export const OccupationalEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
	const [{ diagnoses, }] = useStateValue();

	return (
		<Formik
			initialValues={{
				type: "OccupationalHealthcare",
				specialist: "",
				date: "",
				description: "",
				employerName: "",
				sickLeave: { startDate: "", endDate: "" }
			}}
			onSubmit={onSubmit}
			validate={values => {
				const requiredError = "Field is required";
				const errors: { [field: string]: string } = {};

				if (!values.specialist) {
					errors.specialist = requiredError;
				}
				if (!values.description) {
					errors.description = requiredError;
				}
				if (!values.date) {
					errors.date = requiredError;
				}
				if (!values.employerName) {
					errors.employerName = requiredError;
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
						<Field
							label="Employer Name"
							placeholder="Employer Name"
							name="employerName"
							component={TextField}
						/>
						<Field
							label="Sick Leave Start Date"
							placeholder="YYYY-MM-DD"
							name="sickLeave.startDate"
							component={TextField}
						/>
						<Field
							label="Sick Leave End Date"
							placeholder="YYYY-MM-DD"
							name="sickLeave.endDate"
							component={TextField}
						/>
						<DiagnosisSelection
							setFieldValue={setFieldValue}
							setFieldTouched={setFieldTouched}
							diagnoses={Object.values(diagnoses)}
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

export default OccupationalEntryForm;
