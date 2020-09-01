import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import HealthCheckEntryForm from './EntryModals/HealthCheckEntryForm';
import OccupationalEntryForm from './EntryModals/OccupationalEntryForm';
import HospitalEntryForm from './EntryModals/HospitalEntryForm';
import { EntryFormValues } from '../types';

interface Props {
	modalOpen: boolean;
	onClose: () => void;
	onSubmit: (values: EntryFormValues) => void;
	error?: string;
}

const HealthCheckEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
	<Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
		<Modal.Header>Add a New Health Check Entry</Modal.Header>
		<Modal.Content>
			{error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
			<HealthCheckEntryForm onSubmit={onSubmit} onCancel={onClose} />
		</Modal.Content>
	</Modal>
);

const OccupationalEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
	<Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
		<Modal.Header>Add a New Occupational Healthcare Entry</Modal.Header>
		<Modal.Content>
			{error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
			<OccupationalEntryForm onSubmit={onSubmit} onCancel={onClose} />
		</Modal.Content>
	</Modal>
);

const HospitalEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => (
	<Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
		<Modal.Header>Add a New Hospital Entry</Modal.Header>
		<Modal.Content>
			{error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
			<HospitalEntryForm onSubmit={onSubmit} onCancel={onClose} />
		</Modal.Content>
	</Modal>
);

export default { HealthCheckEntryModal, OccupationalEntryModal, HospitalEntryModal };
