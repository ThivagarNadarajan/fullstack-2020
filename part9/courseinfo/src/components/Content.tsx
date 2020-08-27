import React from "react";
import { CoursePart } from '../types';

const Content: React.FC<{ content: Array<CoursePart> }> = ({ content }) => (
	<>
		{
			content.map(c => <p key={c.name}> {c.name} {c.exerciseCount}</p>)
		}
	</>
)


export default Content