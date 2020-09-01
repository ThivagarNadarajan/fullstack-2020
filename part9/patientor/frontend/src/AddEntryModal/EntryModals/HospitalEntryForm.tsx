import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { useStateValue } from "../../state";
import { TextField, DiagnosisSelection } from "../FormField";
import { NewHospitalEntry } from "../../types";

interface Props {
	onSubmit: (values: NewHospitalEntry) => void;
	onCancel: () => void;
}

export const HospitalEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
	const [{ diagnoses, }] = useStateValue();

	return (
		<Formik
			initialValues={{
				type: "Hospital",
				specialist: "",
				date: "",
				description: "",
				discharge: { date: "", criteria: "" }
			}}
			onSubmit={onSubmit}
			validate={values => {
				const requiredError = "Field is required";
				const errors: { [field: string]: string } = {};
				const dischargeError: { [field: string]: string } = {};

				if (!values.specialist) {
					errors.specialist = requiredError;
				}
				if (!values.description) {
					errors.description = requiredError;
				}
				if (!values.date) {
					errors.date = requiredError;
				}
				if (values.discharge.date && values.discharge.criteria) {
					return errors;
				} else {
					if (!values.discharge.date) {
						dischargeError.date = requiredError;
					}
					if (!values.discharge.criteria) {
						dischargeError.criteria = requiredError;
					}
					return { ...errors, discharge: dischargeError };
				}
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
							label="Discharge Date"
							placeholder="YYYY-MM-DD"
							name="discharge.date"
							component={TextField}
						/>
						<Field
							label="Discharge Criteria"
							placeholder="Criteria"
							name="discharge.criteria"
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

export default HospitalEntryForm;
