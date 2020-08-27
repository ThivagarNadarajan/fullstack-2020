import React from "react";
import { CoursePart } from '../types';

const Total: React.FC<{ content: Array<CoursePart> }> = ({ content }) => (
	<>
		Number of exercises{" "}
		{content.reduce((carry, part) => carry + part.exerciseCount, 0)}
	</>
);

export default Total