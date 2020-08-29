import React from "react";
import { CoursePart } from '../types';

const Part: React.FC<{ part: CoursePart }> = ({ part }) => {
	switch (part.name) {
		case "Using props to pass data":
			return <p>
				{part.name} <br />
				Exercises: {part.exerciseCount}
			</p>
		case "Deeper type usage":
			if (part.description) {
				return <p>
					{part.name}: {part.description}
					<br />
					Exercises: {part.exerciseCount}
					<br />
					<a href={part.exerciseSubmissionLink}>Submit</a>
				</p>
			} else {
				return <p>
					{part.name}
					<br />
					Exercises: {part.exerciseCount}
					<a href={part.exerciseSubmissionLink}>Submit</a>
				</p>
			}
		default:
			if (part.description) {
				return <p>
					{part.name}: {part.description}
					<br />
					Exercises: {part.exerciseCount}
				</p>
			} else {
				return <p>
					{part.name} <br />
					Exercises: {part.exerciseCount}
				</p>
			}
	}
}

export default Part